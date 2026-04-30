import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";
import HeroSection from "../components/common/HeroSection";
import { getApiUrl } from "../services/api/core";

const inputCls = (error) =>
  `w-full bg-white border-b-2 px-0 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
    error ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-brand-red"
  }`;

const LabelRow = ({ label, required }) => (
  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">
    {label}{required && <span className="text-brand-red ml-0.5">*</span>}
  </p>
);

const FieldError = ({ msg }) =>
  msg ? <p className="mt-1.5 text-xs text-red-500">{msg}</p> : null;

const Spinner = () => (
  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const INITIAL = {
  fullName: "",
  email: "",
  phone: "",
  birthday: "",
  memberSince: "",
  ministryInvolvement: "",
  addressChange: false,
  newAddress: "",
  agreeToTerms: false,
};

const Renew = () => {
  const [formData, setFormData] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const e = {};
    if (!formData.fullName.trim())    e.fullName    = "Full name is required";
    if (!formData.email.trim())       e.email       = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) e.email = "Enter a valid email address";
    if (!formData.phone.trim())       e.phone       = "Phone number is required";
    if (!formData.birthday)           e.birthday    = "Birthday is required";
    if (!formData.memberSince.trim()) e.memberSince = "Please select the year you joined";
    if (formData.addressChange && !formData.newAddress.trim()) e.newAddress = "Please provide your new address";
    if (!formData.agreeToTerms)       e.agreeToTerms = "You must confirm to continue";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch(`${getApiUrl()}/api/membership/renew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const ct = res.headers.get("content-type");
        const msg = ct?.includes("application/json")
          ? (await res.json()).error || "Server error"
          : `Server error ${res.status}`;
        throw new Error(msg);
      }

      await res.json();
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white">
        <Helmet>
          <title>Renewal Submitted — Victory Bible Church</title>
        </Helmet>
        <HeroSection
          subtitle="Thank You"
          title="Renewal Received"
          backgroundImage="/assets/hero-bg.jpg"
          showScrollIndicator={false}
          breadcrumbs={[{ label: "Home", path: "/" }, { label: "Membership", path: "/membership" }, { label: "Renew" }]}
        />
        <section className="bg-vbc-section py-24">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <div className="w-16 h-16 bg-brand-red/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-brand-red" />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">You're all set.</h2>
            <p className="text-white/60 text-lg mb-3 leading-relaxed">
              Your membership renewal has been submitted successfully. We'll review it and send a confirmation to <strong className="text-white">{formData.email}</strong>.
            </p>
            <p className="text-white/40 text-sm mb-12">
              If you have questions, reach out to our office at info@victorybiblechurch.org
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/membership" className="bg-brand-red text-white text-sm font-semibold px-8 py-3 hover:bg-red-700 transition-colors">
                Back to Membership
              </Link>
              <Link to="/" className="border border-white/20 text-white text-sm font-semibold px-8 py-3 hover:border-white/50 hover:bg-white/5 transition-colors">
                Go to Homepage
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Helmet>
        <title>Renew Membership — Victory Bible Church Kitwe</title>
        <meta name="description" content="Renew your Victory Bible Church membership. Takes about 5 minutes." />
      </Helmet>

      <HeroSection
        subtitle="Member Services"
        title="Renew Your Membership"
        description="Annual renewal keeps your membership active and all your benefits uninterrupted. It takes about 5 minutes."
        backgroundImage="/assets/hero-bg.jpg"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Membership", path: "/membership" }, { label: "Renew" }]}
      />

      {/* Form section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">

          {/* ── Form ── */}
          <div className="lg:col-span-2">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Renewal form</p>
            <h2 className="text-3xl font-black text-gray-900 mb-10">Your details</h2>

            <form onSubmit={handleSubmit} className="space-y-8" noValidate>

              {/* Personal info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                <div>
                  <LabelRow label="Full Name" required />
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Banda" className={inputCls(errors.fullName)} />
                  <FieldError msg={errors.fullName} />
                </div>
                <div>
                  <LabelRow label="Email Address" required />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className={inputCls(errors.email)} />
                  <FieldError msg={errors.email} />
                </div>
                <div>
                  <LabelRow label="Phone Number" required />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+260 97 000 0000" className={inputCls(errors.phone)} />
                  <FieldError msg={errors.phone} />
                </div>
                <div>
                  <LabelRow label="Birthday" required />
                  <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} className={inputCls(errors.birthday)} />
                  <FieldError msg={errors.birthday} />
                </div>
                <div>
                  <LabelRow label="Member Since (Year)" required />
                  <select name="memberSince" value={formData.memberSince} onChange={handleChange} className={inputCls(errors.memberSince)}>
                    <option value="">Select year</option>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                  <FieldError msg={errors.memberSince} />
                </div>
              </div>

              {/* Ministry involvement */}
              <div>
                <LabelRow label="Ministry Involvement" />
                <textarea
                  name="ministryInvolvement"
                  value={formData.ministryInvolvement}
                  onChange={handleChange}
                  rows={3}
                  placeholder="List any ministries you're currently part of (optional)"
                  className="w-full bg-white border-b-2 border-gray-200 focus:border-brand-red px-0 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Address change */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="addressChange"
                    checked={formData.addressChange}
                    onChange={handleChange}
                    className="mt-0.5 w-4 h-4 accent-red-600 flex-shrink-0"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    My address has changed since my last renewal
                  </span>
                </label>

                {formData.addressChange && (
                  <div className="mt-5 ml-7">
                    <LabelRow label="New Address" required />
                    <textarea
                      name="newAddress"
                      value={formData.newAddress}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Enter your new address"
                      className={`w-full bg-white border-b-2 px-0 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors resize-none ${errors.newAddress ? "border-red-500 focus:border-red-600" : "border-gray-200 focus:border-brand-red"}`}
                    />
                    <FieldError msg={errors.newAddress} />
                  </div>
                )}
              </div>

              {/* Agreement */}
              <div className="border-t border-gray-100 pt-8">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-0.5 w-4 h-4 accent-red-600 flex-shrink-0"
                  />
                  <span className={`text-sm leading-relaxed transition-colors ${errors.agreeToTerms ? "text-red-600" : "text-gray-700 group-hover:text-gray-900"}`}>
                    I confirm that I continue to uphold the values and statement of faith of Victory Bible Church, and wish to renew my membership for the coming year.
                  </span>
                </label>
                <FieldError msg={errors.agreeToTerms} />
              </div>

              {/* Error banner */}
              {submitError && (
                <div className="flex items-start gap-3 bg-red-50 border-l-4 border-red-500 px-5 py-4">
                  <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-brand-red text-white text-sm font-semibold px-10 py-4 hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {submitting ? <><Spinner /> Processing…</> : <><RefreshCw className="h-4 w-4" /> Submit Renewal</>}
              </button>

            </form>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:sticky lg:top-24 space-y-0">
            <div className="bg-vbc-dark p-8">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Key dates</p>
              <div className="divide-y divide-white/10">
                {[
                  ["Renewal Deadline", "March 31st"],
                  ["Late Renewal",     "Additional processing"],
                  ["Process Time",     "~5 minutes"],
                  ["Documents",        "None required"],
                  ["Cost",             "Free"],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between py-4">
                    <span className="text-xs text-white/40 uppercase tracking-wider">{label}</span>
                    <span className="text-sm font-semibold text-white">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-vbc-section p-8 border-t border-white/5">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Why renew?</p>
              <div className="space-y-5">
                {[
                  ["Voting Rights", "Stay eligible to vote in church decisions."],
                  ["Leadership",    "Maintain your eligibility for ministry roles."],
                  ["Member Access", "Keep access to member-only resources and events."],
                ].map(([title, body]) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-1 bg-brand-red flex-shrink-0 mt-1 self-stretch" style={{ minHeight: 14 }} />
                    <div>
                      <p className="text-sm font-semibold text-white mb-0.5">{title}</p>
                      <p className="text-xs text-white/40 leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs text-white/40 leading-relaxed">
                  Need help? Contact us at{" "}
                  <a href="mailto:info@victorybiblechurch.org" className="text-white/60 hover:text-white underline underline-offset-2 transition-colors">
                    info@victorybiblechurch.org
                  </a>
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Renew;
