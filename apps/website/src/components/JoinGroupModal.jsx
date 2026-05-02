import { useState } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  MapPinIcon,
  CalendarDaysIcon,
  XMarkIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { submitCellGroupJoinRequest } from "../services/api/cell-groups";

// ── Flat input helper ─────────────────────────────────────────────────────────
const inputCls = (err) =>
  `w-full bg-transparent border-b-2 px-0 py-3 text-sm text-white placeholder-white/30 focus:outline-none transition-colors ${
    err ? "border-red-500 focus:border-red-400" : "border-white/10 focus:border-brand-red"
  }`;

const LabelRow = ({ label, required }) => (
  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 mb-2">
    {label}{required && <span className="text-brand-red ml-0.5">*</span>}
  </p>
);

// ─────────────────────────────────────────────────────────────────────────────

const JoinGroupModal = ({ group, onClose }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", whatsapp: "", message: "" });
  const [consent,  setConsent]  = useState(false);
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);
  const [error,    setError]    = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) return;
    setSending(true);
    setError("");
    try {
      await submitCellGroupJoinRequest({
        cellGroupId: group._id || group.id,
        ...form,
        whatsapp: form.whatsapp || form.phone,
      });
      setSent(true);
    } catch {
      setError("Could not send your request. Please try again or contact us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-vbc-dark border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-1">Cell Group</p>
            <h3 className="text-lg font-black text-white leading-tight">{group.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white transition-colors ml-4 mt-0.5 flex-shrink-0"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {sent ? (
          /* ── Success state ─────────────────────────────────────── */
          <div className="p-8 text-center">
            <CheckCircleIcon className="h-10 w-10 text-brand-red mx-auto mb-4" />
            <h4 className="text-xl font-black text-white mb-3">Request sent.</h4>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Your request to join <span className="text-white font-semibold">{group.name}</span> has been sent to {group.leader || "the cell leader"}. You should hear back within 48 hours.
            </p>
            <div className="border border-white/10 p-5 text-left mb-8">
              <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-3">What's next</p>
              <div className="space-y-2">
                {["Check your email for a confirmation.", `The cell leader will contact you soon.`, `Prepare to attend on ${group.meetingDay || "the meeting day"}.`].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-brand-red text-xs font-black font-mono flex-shrink-0 mt-0.5">{String(i+1).padStart(2,"0")}</span>
                    <p className="text-white/50 text-xs leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            {/* ── Group info strip ───────────────────────────────── */}
            <div className="px-6 py-4 border-b border-white/10 flex flex-wrap gap-5">
              {(group.meetingDay || group.meetingTime) && (
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <CalendarDaysIcon className="h-3.5 w-3.5 text-brand-red" />
                  {group.meetingDay}{group.meetingTime ? ` · ${group.meetingTime}` : ""}
                </div>
              )}
              {group.location && (
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <MapPinIcon className="h-3.5 w-3.5 text-brand-red" />
                  {group.location}
                </div>
              )}
            </div>

            {/* ── Form ───────────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="p-6 space-y-7">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
                <div>
                  <LabelRow label="Full Name" required />
                  <div className="relative">
                    <UserIcon className="absolute left-0 top-3.5 h-3.5 w-3.5 text-white/20 pointer-events-none" />
                    <input
                      type="text" name="name" required
                      value={form.name} onChange={handleChange}
                      placeholder="John Banda"
                      className={`${inputCls()} pl-6`}
                    />
                  </div>
                </div>
                <div>
                  <LabelRow label="Email Address" required />
                  <div className="relative">
                    <EnvelopeIcon className="absolute left-0 top-3.5 h-3.5 w-3.5 text-white/20 pointer-events-none" />
                    <input
                      type="email" name="email" required
                      value={form.email} onChange={handleChange}
                      placeholder="john@example.com"
                      className={`${inputCls()} pl-6`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7">
                <div>
                  <LabelRow label="Phone Number" required />
                  <div className="relative">
                    <PhoneIcon className="absolute left-0 top-3.5 h-3.5 w-3.5 text-white/20 pointer-events-none" />
                    <input
                      type="tel" name="phone" required
                      value={form.phone} onChange={handleChange}
                      placeholder="+260 97 000 0000"
                      className={`${inputCls()} pl-6`}
                    />
                  </div>
                </div>
                <div>
                  <LabelRow label="WhatsApp (optional)" />
                  <div className="relative">
                    <PhoneIcon className="absolute left-0 top-3.5 h-3.5 w-3.5 text-white/20 pointer-events-none" />
                    <input
                      type="tel" name="whatsapp"
                      value={form.whatsapp} onChange={handleChange}
                      placeholder="Leave blank to use phone"
                      className={`${inputCls()} pl-6`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <LabelRow label="Message (optional)" />
                <div className="relative">
                  <ChatBubbleLeftIcon className="absolute left-0 top-3.5 h-3.5 w-3.5 text-white/20 pointer-events-none" />
                  <textarea
                    name="message" rows={3}
                    value={form.message} onChange={handleChange}
                    placeholder="Anything you'd like the cell leader to know…"
                    className={`${inputCls()} pl-6 resize-none`}
                  />
                </div>
              </div>

              {/* Consent */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 flex-shrink-0 accent-brand-red"
                  required
                />
                <span className="text-xs text-white/30 leading-relaxed group-hover:text-white/50 transition-colors">
                  I consent to Victory Bible Church storing my contact information and using it to connect me with this cell group.
                </span>
              </label>

              {error && (
                <p className="text-xs text-red-400 border-l-2 border-red-500 pl-3 leading-relaxed">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={onClose}
                  className="flex-1 py-3 border border-white/10 text-white/50 text-xs font-semibold uppercase tracking-wider hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending || !consent}
                  className="flex-1 py-3 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
                >
                  {sending ? <><ArrowPathIcon className="h-3.5 w-3.5 animate-spin" /> Sending…</> : "Send Request"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default JoinGroupModal;
