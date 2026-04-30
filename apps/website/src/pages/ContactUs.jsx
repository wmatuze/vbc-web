import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import HeroSection from "../components/common/HeroSection";
import { getApiUrl } from "../services/api/core";

// ── Info panels ───────────────────────────────────────────────────────────────
const INFO = [
  {
    num: "01",
    Icon: MapPinIcon,
    label: "Address",
    value: "Off Chiwala Road CBU East Gate",
    sub: "Kitwe, Zambia",
  },
  {
    num: "02",
    Icon: PhoneIcon,
    label: "Phone",
    value: "+260 97 000 0000",
    sub: "Mon – Fri, 8 AM – 5 PM",
  },
  {
    num: "03",
    Icon: EnvelopeIcon,
    label: "Email",
    value: "info@victorybiblechurch.org",
    sub: "We reply within 24 hours",
  },
  {
    num: "04",
    Icon: ClockIcon,
    label: "Office Hours",
    value: "Mon – Fri",
    sub: "8:00 AM – 5:00 PM",
  },
];

// ── Services ─────────────────────────────────────────────────────────────────
const SERVICES = [
  { day: "Sunday",    time: "9:30 AM",   note: "Main Worship Service" },
  { day: "Wednesday", time: "6:00 PM",   note: "Midweek Service" },
  { day: "1st Sunday", time: "9:30 AM",  note: "Anointing Service" },
  { day: "3rd Sunday", time: "9:30 AM",  note: "Holy Communion" },
  { day: "Last Week",  time: "Various",  note: "Prayer & Fasting" },
];

// ── Social ────────────────────────────────────────────────────────────────────
const SOCIAL = [
  { platform: "Facebook",  handle: "@VictoryBibleChurchKitwe", href: "https://facebook.com/VictoryBibleChurchKitwe", color: "text-blue-400" },
  { platform: "Instagram", handle: "@victorybiblechurch",       href: "https://instagram.com/victorybiblechurch",    color: "text-pink-400" },
  { platform: "YouTube",   handle: "@BishopSimwanza",           href: "https://youtube.com/@BishopSimwanza",         color: "text-red-400"  },
  { platform: "WhatsApp",  handle: "Chat with us",              href: "#",                                           color: "text-green-400"},
];

// ── Flat input helper ─────────────────────────────────────────────────────────
const inputCls = (err) =>
  `w-full bg-transparent border-b-2 px-0 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-colors ${
    err ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-brand-red"
  }`;

const LabelRow = ({ label, required }) => (
  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 mb-2">
    {label}{required && <span className="text-brand-red ml-0.5">*</span>}
  </p>
);

// ─────────────────────────────────────────────────────────────────────────────

const ContactUs = () => {
  const [form,     setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [errors,   setErrors]   = useState({});
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);
  const [sendErr,  setSendErr]  = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSending(true);
    setSendErr("");

    try {
      const res = await fetch(`${getApiUrl()}/api/support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, priority: "medium" }),
      });
      if (!res.ok) throw new Error("Server error");
      setSent(true);
    } catch {
      setSendErr("Message could not be sent. Please try emailing us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white">
      <Helmet>
        <title>Contact — Victory Bible Church Kitwe</title>
        <meta name="description" content="Get in touch with Victory Bible Church Kitwe. Find our address, service times, and send us a message." />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <HeroSection
        subtitle="Contact"
        title="Let's Talk"
        description="We'd love to hear from you — questions, prayer requests, or just saying hello. We're here."
        backgroundImage="/assets/hero-bg.jpg"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Contact" }]}
      />

      {/* ── Info strip ────────────────────────────────────────────── */}
      <div className="bg-vbc-dark">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
          {INFO.map(({ num, Icon, label, value, sub }) => (
            <div key={num} className="bg-vbc-dark px-8 py-10 relative overflow-hidden group">
              {/* Ghost number */}
              <p
                className="absolute -top-4 -right-2 font-black text-white select-none leading-none pointer-events-none"
                style={{ fontSize: "clamp(5rem, 8vw, 7rem)", opacity: 0.04 }}
              >
                {num}
              </p>
              <div className="w-8 h-0.5 bg-brand-red mb-5 group-hover:w-12 transition-all duration-300" />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-red mb-3">{label}</p>
              <Icon className="h-5 w-5 text-white/30 mb-3" />
              <p className="text-white font-semibold text-sm leading-snug">{value}</p>
              <p className="text-white/40 text-xs mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Form + Map ────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-0">

          {/* Form */}
          <div className="pr-0 lg:pr-16 pb-16 lg:pb-0">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Send a message</p>
            <h2 className="text-4xl font-black text-gray-900 mb-10 leading-tight">
              We read every<br />message.
            </h2>

            {sent ? (
              <div className="flex flex-col items-start gap-4 py-12">
                <CheckCircleIcon className="h-10 w-10 text-brand-red" />
                <h3 className="text-2xl font-black text-gray-900">Message sent.</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                  We've received your message and will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="text-xs font-semibold uppercase tracking-wider text-brand-red hover:text-red-700 transition-colors mt-2"
                >
                  Send another →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
                  <div>
                    <LabelRow label="Your Name" required />
                    <input type="text" name="name" value={form.name} onChange={handleChange}
                      placeholder="John Banda" className={inputCls(errors.name)} />
                    {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                  </div>
                  <div>
                    <LabelRow label="Email Address" required />
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="john@example.com" className={inputCls(errors.email)} />
                    {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <LabelRow label="Subject" required />
                  <input type="text" name="subject" value={form.subject} onChange={handleChange}
                    placeholder="What's on your mind?" className={inputCls(errors.subject)} />
                  {errors.subject && <p className="mt-1.5 text-xs text-red-500">{errors.subject}</p>}
                </div>

                <div>
                  <LabelRow label="Message" required />
                  <textarea name="message" value={form.message} onChange={handleChange}
                    rows={5} placeholder="Tell us more…"
                    className={`${inputCls(errors.message)} resize-none`} />
                  {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>}
                </div>

                {sendErr && (
                  <p className="text-sm text-red-500 border-l-2 border-red-400 pl-3">{sendErr}</p>
                )}

                <button type="submit" disabled={sending}
                  className="inline-flex items-center gap-2 bg-brand-red text-white text-sm font-semibold px-8 py-4 hover:bg-red-700 disabled:opacity-50 transition-colors">
                  {sending ? <><ArrowPathIcon className="h-4 w-4 animate-spin" /> Sending…</> : <>Send Message <ArrowRightIcon className="h-4 w-4" /></>}
                </button>
              </form>
            )}
          </div>

          {/* Map */}
          <div className="h-[500px] lg:h-auto min-h-[400px] bg-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.559565493077!2d28.22997607453223!3d-12.807075856521612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x196ce7fb9948f75b%3A0xe20f6f1190003491!2sVictory%20Christian%20Center%20(Victory%20Bible%20Church)!5e0!3m2!1sen!2szm!4v1743212386447!5m2!1sen!2szm"
              className="w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Victory Bible Church Kitwe location"
            />
          </div>
        </div>
      </section>

      {/* ── Service times ─────────────────────────────────────────── */}
      <section className="bg-vbc-section py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Editorial statement */}
          <div className="lg:sticky lg:top-24">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">When we meet</p>
            <h2
              className="font-black text-white leading-[0.9] mb-6"
              style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)" }}
            >
              WE<br />GATHER.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-10">
              Every week, without fail. Come as you are — you are welcome at our table.
            </p>
            <Link to="/events"
              className="inline-flex items-center gap-2 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-white/5 transition-colors">
              View Events Calendar <ArrowRightIcon className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Services list */}
          <div className="divide-y divide-white/10">
            {SERVICES.map(({ day, time, note }) => (
              <div key={day} className="flex items-center justify-between gap-6 py-6 group">
                <div className="flex items-center gap-4">
                  <div className="w-0.5 h-10 bg-brand-red flex-shrink-0" />
                  <div>
                    <p className="text-white font-bold text-base leading-tight">{day}</p>
                    <p className="text-white/40 text-xs mt-0.5">{note}</p>
                  </div>
                </div>
                <p className="text-white/70 text-xl font-black tracking-tight flex-shrink-0">{time}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Social ────────────────────────────────────────────────── */}
      <section className="bg-vbc-dark py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Find us online</p>
          <h2 className="text-4xl font-black text-white mb-14">Stay connected.</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5">
            {SOCIAL.map(({ platform, handle, href, color }) => (
              <a
                key={platform}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-vbc-dark flex items-center justify-between gap-6 px-8 py-7 group hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-5">
                  <p className={`text-xs font-bold uppercase tracking-[0.2em] ${color}`}>{platform}</p>
                  <p className="text-white/40 text-sm">{handle}</p>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-white/20 group-hover:text-brand-red group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
