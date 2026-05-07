import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { getApiUrl } from "../services/api/core";

// ─── Data ────────────────────────────────────────────────────────────────────

const VALUES = [
  {
    num: "01",
    title: "The Kingdom of God",
    body: "We believe in the Kingdom of God as divine truth and fundamental doctrine that Jesus Christ preached. As an apostolic house, we subscribe to teaching and accurately propagating the Kingdom.",
  },
  {
    num: "02",
    title: "Family",
    body: "We firmly value the importance of the family unit. Strong and healthy families make up a strong and healthy nation — and a strong and healthy church.",
  },
  {
    num: "03",
    title: "Prayer",
    body: "Victory Bible Church was founded by, built by, and sustained by Intercessory Prayer. We believe prayer is the spiritual support to everything we do as a church.",
  },
  {
    num: "04",
    title: "Integrity",
    body: "We value integrity as a fundamental, non-negotiable principle. Ministry leaders are selected purely based on trust, gifts, and a proven character track record.",
  },
  {
    num: "05",
    title: "Excellence",
    body: "We strongly value Excellence as an expectation of God. Our God is a God of Excellence and Order — and we bring that standard to everything we do.",
  },
  {
    num: "06",
    title: "Prosperity",
    body: "We believe it is God's will for all men to prosper — spiritually, emotionally, and materially. Prosperity is God's intent for His church.",
  },
];

const OBJECTIVES = [
  "Leadership Development",
  "Intercessory Prayer",
  "Social Engagement",
  "Apostolic Government",
  "Fellowship & Discipleship",
  "Economic Empowerment",
  "Evangelism",
];

const WHAT_TO_EXPECT = [
  { num: "01", title: "Arrival",        body: "Arrive a few minutes before 9:30 AM. Our ushers will welcome you at the door, help you find a seat, and answer any questions." },
  { num: "02", title: "Worship",        body: "We begin with Spirit-led praise and worship — vibrant, authentic, and open to everyone. Come as you are." },
  { num: "03", title: "The Word",       body: "Our services feature Scripture-driven preaching from Bishop Cyrus or a member of the leadership team. Bring a Bible and notebook." },
  { num: "04", title: "Children",       body: "Children's Ministry runs alongside the adult service. Your children will be welcomed, safe, and learning at their own level." },
  { num: "05", title: "After Service",  body: "First-timers are invited to meet the team after the service. Look out for the First-Timers area near the front." },
];

// ─── Form input helper ────────────────────────────────────────────────────────

const inputCls = "w-full bg-transparent border-b-2 border-white/10 px-0 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-red transition-colors";
const selectCls = "w-full bg-vbc-dark border-b-2 border-white/10 px-0 py-3 text-sm text-white focus:outline-none focus:border-brand-red transition-colors appearance-none cursor-pointer";
const LabelRow = ({ label, required }) => (
  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40 mb-2">
    {label}{required && <span className="text-brand-red ml-0.5">*</span>}
  </p>
);

// ─── Connection Card form ─────────────────────────────────────────────────────

const ConnectionCard = () => {
  const [form, setForm] = useState({
    title: "", fullName: "", ageGroup: "", maritalStatus: "",
    phone: "", email: "", address: "", birthday: "",
    hasChildren: false, children: ["", "", ""],
    requestContact: false, acceptedJesus: "", wantToAccept: "",
  });
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const setChild = (i, val) => {
    const updated = [...form.children];
    updated[i] = val;
    setForm((prev) => ({ ...prev, children: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) { setError("Please enter your full name."); return; }
    setSending(true);
    setError("");
    try {
      const payload = {
        ...form,
        children: form.children.filter(Boolean),
        acceptedJesus: form.acceptedJesus === "yes" ? true : form.acceptedJesus === "no" ? false : null,
      };
      const res = await fetch(`${getApiUrl()}/api/visitors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Server error");
      setSent(true);
    } catch {
      setError("Could not submit your card. Please try again or speak to an usher on Sunday.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="py-16 text-center">
        <CheckCircleIcon className="h-12 w-12 text-brand-red mx-auto mb-6" />
        <h3 className="text-2xl font-black text-white mb-3">Card received.</h3>
        <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto mb-8">
          Thank you, {form.fullName.split(" ")[0]}. We are so glad you came.
          {form.email && " A confirmation has been sent to your email."}
          {form.requestContact && " Someone from our team will be in touch soon."}
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-white/5 transition-colors"
        >
          View upcoming events <ArrowRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10" noValidate>

      {/* Personal details */}
      <div>
        <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6 pb-3 border-b border-white/10">Personal Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">

          <div>
            <LabelRow label="Full Name" required />
            <div className="flex gap-3">
              <select value={form.title} onChange={(e) => set("title", e.target.value)} className={`${selectCls} w-24 flex-shrink-0`}>
                <option value="">—</option>
                <option>Mr</option>
                <option>Mrs</option>
                <option>Miss</option>
              </select>
              <input type="text" value={form.fullName} onChange={(e) => set("fullName", e.target.value)}
                placeholder="Your full name" className={`${inputCls} flex-1`} required />
            </div>
          </div>

          <div>
            <LabelRow label="Age Group" />
            <select value={form.ageGroup} onChange={(e) => set("ageGroup", e.target.value)} className={selectCls}>
              <option value="">Select…</option>
              {["13-17","18-25","26-35","36-45","46-55","56+"].map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <LabelRow label="Marital Status" />
            <select value={form.maritalStatus} onChange={(e) => set("maritalStatus", e.target.value)} className={selectCls}>
              <option value="">Select…</option>
              {["Single","Engaged","Married","Divorced"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <LabelRow label="Birthday" />
            <input type="text" value={form.birthday} onChange={(e) => set("birthday", e.target.value)}
              placeholder="e.g. 14 March" className={inputCls} />
          </div>

          <div>
            <LabelRow label="Cell Phone" />
            <input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)}
              placeholder="+260 97 000 0000" className={inputCls} />
          </div>

          <div>
            <LabelRow label="Email Address" />
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
              placeholder="you@example.com" className={inputCls} />
          </div>

          <div className="sm:col-span-2">
            <LabelRow label="Home Address" />
            <input type="text" value={form.address} onChange={(e) => set("address", e.target.value)}
              placeholder="Street / Area / Suburb" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Children */}
      <div>
        <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6 pb-3 border-b border-white/10">Children</p>
        <div className="mb-5">
          <LabelRow label="Do you have children?" />
          <div className="flex gap-6">
            {["Yes","No"].map((opt) => (
              <label key={opt} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="hasChildren"
                  checked={form.hasChildren === (opt === "Yes")}
                  onChange={() => set("hasChildren", opt === "Yes")}
                  className="accent-brand-red" />
                <span className="text-white/60 text-sm">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {form.hasChildren && (
          <div>
            <LabelRow label="Names of children (optional)" />
            <div className="space-y-4">
              {form.children.map((child, i) => (
                <input key={i} type="text" value={child} onChange={(e) => setChild(i, e.target.value)}
                  placeholder={`Child ${i + 1} name`} className={inputCls} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Faith */}
      <div>
        <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6 pb-3 border-b border-white/10">Faith</p>

        <div className="mb-6">
          <LabelRow label="Have you previously accepted Jesus as your personal Saviour?" />
          <div className="flex gap-6">
            {[{val:"yes",label:"Yes"},{val:"no",label:"No"}].map(({val,label}) => (
              <label key={val} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="acceptedJesus"
                  checked={form.acceptedJesus === val}
                  onChange={() => set("acceptedJesus", val)}
                  className="accent-brand-red" />
                <span className="text-white/60 text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {form.acceptedJesus === "no" && (
          <div className="mb-6">
            <LabelRow label="Would you like to make that decision today?" />
            <div className="flex gap-6">
              {[{val:"yes",label:"Yes"},{val:"not-today",label:"Not Today"}].map(({val,label}) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="wantToAccept"
                    checked={form.wantToAccept === val}
                    onChange={() => set("wantToAccept", val)}
                    className="accent-brand-red" />
                  <span className="text-white/60 text-sm">{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contact preference */}
      <div>
        <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6 pb-3 border-b border-white/10">Contact Preference</p>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input type="checkbox" checked={form.requestContact}
            onChange={(e) => set("requestContact", e.target.checked)}
            className="mt-0.5 flex-shrink-0 accent-brand-red" />
          <span className="text-white/50 text-sm leading-relaxed group-hover:text-white/70 transition-colors">
            I would like someone from Victory Bible Church to contact me.
          </span>
        </label>
      </div>

      {error && (
        <p className="text-xs text-red-400 border-l-2 border-red-500 pl-3 leading-relaxed">{error}</p>
      )}

      <button type="submit" disabled={sending}
        className="w-full py-4 bg-brand-red text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2">
        {sending
          ? <><ArrowPathIcon className="h-4 w-4 animate-spin" /> Submitting…</>
          : <>Submit Connection Card <ArrowRightIcon className="h-4 w-4" /></>}
      </button>

      <p className="text-white/20 text-xs leading-relaxed text-center">
        Your information is kept private and used only to connect you with the VBC family.
      </p>
    </form>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────

const FirstTimers = () => (
  <div className="bg-white">
    <Helmet>
      <title>First Timers — Victory Bible Church</title>
      <meta name="description" content="Visiting Victory Bible Church for the first time? Learn what to expect, meet our pastors, and fill in your connection card." />
    </Helmet>

    {/* ── Hero ──────────────────────────────────────────────────── */}
    <section className="relative bg-vbc-dark overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url(/assets/hero-bg.jpg)" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-vbc-dark/60 to-vbc-dark" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 md:py-44">
        <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">Victory Bible Church · Kitwe</p>
        <h1 className="font-black text-white leading-[0.88] mb-8"
          style={{ fontSize: "clamp(4rem, 10vw, 8rem)" }}>
          WELCOME<br />
          <span className="text-white/20">TO</span><br />
          VBC.
        </h1>
        <p className="text-white/50 text-sm leading-relaxed max-w-md mb-12">
          We are glad you are here. Whether this is your first Sunday or you are still deciding — there is a place for you at Victory Bible Church.
        </p>
        <p className="text-white/30 text-xs italic leading-relaxed max-w-sm">
          "Winning a Generation for Christ." — Bishop Cyrus & Pastor Getrude Simwanza
        </p>
      </div>
    </section>

    {/* ── Welcome from the Pastors ──────────────────────────────── */}
    <section className="bg-vbc-section py-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">A word from the pastors</p>
          <h2 className="font-black text-white leading-[0.9] mb-8"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            YOU ARE<br />NOT HERE<br />BY ACCIDENT.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm">
            God has a plan for your life — and we believe your visit to Victory Bible Church is part of that plan. Our prayer is that you encounter His presence, find your people, and discover your purpose here.
          </p>
        </div>
        <div className="border-l-2 border-brand-red pl-10">
          <div className="space-y-6">
            <p className="text-white text-xl font-light leading-relaxed italic">
              "We exist to win a generation for Christ — to build lives, impact nations, and establish the Kingdom with excellence."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-8 h-0.5 bg-brand-red" />
              <div>
                <p className="text-white text-sm font-black">Bishop Cyrus & Pastor Getrude Simwanza</p>
                <p className="text-white/40 text-xs mt-0.5">Senior Pastors, Victory Bible Church</p>
              </div>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-px bg-white/5">
            <div className="bg-vbc-section px-6 py-4">
              <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Vision</p>
              <p className="text-white text-sm font-semibold">"Winning a Generation for Christ."</p>
            </div>
            <div className="bg-vbc-section px-6 py-4">
              <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Mission</p>
              <p className="text-white text-sm font-semibold">"Building Lives, Impacting Nations, Establishing the Kingdom with Excellence."</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── What to expect ────────────────────────────────────────── */}
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Your first Sunday</p>
          <h2 className="text-4xl font-black text-gray-900 leading-tight">What to expect.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-gray-100">
          {WHAT_TO_EXPECT.map(({ num, title, body }) => (
            <div key={num} className="bg-white px-6 py-8 group relative overflow-hidden">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">{num}</p>
              <div className="w-6 h-0.5 bg-brand-red mb-4 group-hover:w-10 transition-all duration-300" />
              <h3 className="text-sm font-black text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Service details strip */}
        <div className="mt-px grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-100">
          {[
            { Icon: ClockIcon,   label: "Service Time", value: "Sunday · 9:30 AM" },
            { Icon: MapPinIcon,  label: "Location",     value: "Off Chiwala Road, CBU East Gate, Kitwe" },
            { Icon: PhoneIcon,   label: "Call Us",      value: "+260 969 406 640" },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="bg-white px-6 py-6 flex items-start gap-4">
              <Icon className="h-4 w-4 text-brand-red flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-gray-900 text-sm font-semibold">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Values ────────────────────────────────────────────────── */}
    <section className="bg-vbc-dark py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">What we stand for</p>
          <h2 className="text-4xl font-black text-white leading-tight">Our values.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {VALUES.map(({ num, title, body }) => (
            <div key={num} className="bg-vbc-dark p-8 group">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">{num}</p>
              <div className="w-8 h-0.5 bg-brand-red mb-5 group-hover:w-14 transition-all duration-300" />
              <h3 className="text-base font-black text-white mb-3">{title}</h3>
              <p className="text-white/40 text-xs leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Objectives ────────────────────────────────────────────── */}
    <section className="bg-vbc-section py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="lg:sticky lg:top-24 self-start">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">What drives us</p>
          <h2 className="font-black text-white leading-[0.9] mb-6"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            OUR<br />OBJECTIVES.
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            Seven areas of focus that shape everything we do as a church — from Sunday services to daily community life.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5">
          {OBJECTIVES.map((obj, i) => (
            <div key={obj} className="bg-vbc-section flex items-center gap-4 px-6 py-5 group hover:bg-white/5 transition-colors">
              <span className="text-brand-red text-xs font-black font-mono flex-shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">{obj}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Connection Card ───────────────────────────────────────── */}
    <section className="bg-vbc-dark py-24" id="connection-card">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* Left — intro */}
        <div className="lg:sticky lg:top-24 self-start">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Fill it in</p>
          <h2 className="font-black text-white leading-[0.9] mb-6"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
            CONNECTION<br />CARD.
          </h2>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-8">
            Please fill this in to the level you are comfortable with. This is the same card our ushers hand out on Sunday — now available online.
          </p>
          <div className="border border-white/10 p-6">
            <p className="text-white/30 text-xs uppercase tracking-wider mb-4">Why we ask</p>
            <div className="space-y-3">
              {[
                "So we can welcome you properly on your next visit",
                "So our team can follow up if you'd like us to",
                "So we can connect you with the right ministry",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-brand-red text-xs font-black font-mono flex-shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-white/40 text-xs leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div>
          <ConnectionCard />
        </div>
      </div>
    </section>

    {/* ── Find us ───────────────────────────────────────────────── */}
    <section className="bg-vbc-section py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <div>
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">We are here</p>
          <p className="text-white font-black text-lg mb-1">Off Chiwala Road, CBU East Gate</p>
          <p className="text-white/40 text-sm">Kitwe, Zambia · Sundays at 9:30 AM</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/contact"
            className="inline-block border border-white/20 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-white/5 transition-colors">
            Get Directions
          </Link>
          <Link to="/events"
            className="inline-block bg-brand-red text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-red-700 transition-colors">
            See What's On
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default FirstTimers;
