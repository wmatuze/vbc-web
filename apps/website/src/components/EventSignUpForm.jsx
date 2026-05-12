import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { submitEventSignupRequest } from "../services/api/requests";

// ── Field helpers ─────────────────────────────────────────────────────────────
const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
    {children}{required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const inputCls = (err) =>
  `w-full px-3 py-2.5 rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 ${
    err
      ? "border-red-400 focus:ring-red-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      : "border-gray-300 dark:border-gray-600 focus:ring-red-600/30 focus:border-red-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
  }`;

const Field = ({ label, error, required, children }) => (
  <div>
    <Label required={required}>{label}</Label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────

const EventSignUpForm = ({ event, onClose }) => {
  const eventId = event?.id || event?._id?.toString();
  const isBaptism      = event?.type === "baptism";
  const isBabyDedication = event?.type === "babyDedication";

  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", message: "",
    testimony: "", previousReligion: "",
    childName: "", childDateOfBirth: "", parentNames: "",
  });
  const [errors,      setErrors]      = useState({});
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [serverError, setServerError] = useState("");

  // Guard: if the event is missing entirely, show an error state
  const missingEvent = !event;

  const handle = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim())  e.fullName  = "Full name is required";
    if (!formData.email.trim())     e.email     = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = "Enter a valid email";
    if (!formData.phone.trim())     e.phone     = "Phone number is required";
    if (isBaptism && !formData.testimony.trim()) e.testimony = "Please share your testimony";
    if (isBabyDedication) {
      if (!formData.childName.trim())        e.childName        = "Child's name is required";
      if (!formData.childDateOfBirth.trim()) e.childDateOfBirth = "Date of birth is required";
      if (!formData.parentNames.trim())      e.parentNames      = "Parent names are required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    if (!eventId) {
      setServerError("Event information is incomplete — please close and try again.");
      return;
    }

    setSubmitting(true);
    setServerError("");

    try {
      const VALID_TYPES = new Set(["event", "general", "baptism", "babyDedication", "other"]);
      const payload = {
        eventId,
        eventType: VALID_TYPES.has(event.type) ? event.type : "event",
        fullName:  formData.fullName,
        email:     formData.email,
        phone:     formData.phone,
        message:   formData.message || "",
        submittedAt: new Date().toISOString(),
        status: "pending",
      };
      if (isBaptism) {
        payload.testimony        = formData.testimony;
        payload.previousReligion = formData.previousReligion || "";
      }
      if (isBabyDedication) {
        payload.childName        = formData.childName;
        payload.childDateOfBirth = formData.childDateOfBirth;
        payload.parentNames      = formData.parentNames;
      }

      await submitEventSignupRequest(payload);
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err?.message?.includes("404")
          ? "This event could not be found. Please refresh the page and try again."
          : "Something went wrong. Please try again or contact us directly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 8 }}
        animate={{ scale: 1,    opacity: 1, y: 0 }}
        exit={{    scale: 0.95, opacity: 0, y: 8 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="pr-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-600 mb-1">
              {isBaptism ? "Baptism Registration" : isBabyDedication ? "Baby Dedication" : "Event Sign-Up"}
            </p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              {event?.title || "Sign Up"}
            </h3>
            {(event?.date || event?.time) && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {[event.date, event.time].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">

          {/* Missing event error */}
          {missingEvent && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm mb-4">
              <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
              Event information is missing. Please close and try again.
            </div>
          )}

          {/* Success state */}
          {submitted ? (
            <div className="text-center py-6">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="h-9 w-9 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                You're signed up!
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-1">
                Your registration for <strong className="text-gray-700 dark:text-gray-200">{event?.title}</strong> has been received.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                We'll confirm your spot and be in touch with any details.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

              {serverError && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
                  <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  {serverError}
                </div>
              )}

              <Field label="Full Name" required error={errors.fullName}>
                <input
                  type="text" name="fullName" value={formData.fullName} onChange={handle}
                  placeholder="Your full name" className={inputCls(errors.fullName)} />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email" required error={errors.email}>
                  <input
                    type="email" name="email" value={formData.email} onChange={handle}
                    placeholder="you@example.com" className={inputCls(errors.email)} />
                </Field>
                <Field label="Phone" required error={errors.phone}>
                  <input
                    type="tel" name="phone" value={formData.phone} onChange={handle}
                    placeholder="+260 97 000 0000" className={inputCls(errors.phone)} />
                </Field>
              </div>

              {/* Baptism fields */}
              {isBaptism && (
                <>
                  <Field label="Your Testimony" required error={errors.testimony}>
                    <textarea
                      name="testimony" value={formData.testimony} onChange={handle} rows={3}
                      placeholder="Share your testimony and why you want to be baptized"
                      className={inputCls(errors.testimony)} />
                  </Field>
                  <Field label="Previous Religious Background" error={errors.previousReligion}>
                    <input
                      type="text" name="previousReligion" value={formData.previousReligion} onChange={handle}
                      placeholder="Optional" className={inputCls(false)} />
                  </Field>
                </>
              )}

              {/* Baby dedication fields */}
              {isBabyDedication && (
                <>
                  <Field label="Child's Full Name" required error={errors.childName}>
                    <input
                      type="text" name="childName" value={formData.childName} onChange={handle}
                      placeholder="Child's full name" className={inputCls(errors.childName)} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Child's Date of Birth" required error={errors.childDateOfBirth}>
                      <input
                        type="date" name="childDateOfBirth" value={formData.childDateOfBirth} onChange={handle}
                        className={inputCls(errors.childDateOfBirth)} />
                    </Field>
                    <Field label="Parents' Full Names" required error={errors.parentNames}>
                      <input
                        type="text" name="parentNames" value={formData.parentNames} onChange={handle}
                        placeholder="Father & Mother" className={inputCls(errors.parentNames)} />
                    </Field>
                  </div>
                </>
              )}

              <Field label="Additional Message" error={errors.message}>
                <textarea
                  name="message" value={formData.message} onChange={handle} rows={2}
                  placeholder="Anything else you'd like us to know (optional)"
                  className={inputCls(false)} />
              </Field>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button" onClick={onClose}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={submitting || missingEvent}
                  className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  {submitting && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  )}
                  {submitting ? "Submitting…" : "Submit Registration"}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default EventSignUpForm;
