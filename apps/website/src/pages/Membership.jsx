import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronDown } from "lucide-react";
import HeroSection from "../components/common/HeroSection";

const faqItems = [
  {
    q: "Is membership mandatory to attend church?",
    a: "No — everyone is welcome at our services and most activities. Membership is required for leadership roles, voting in church matters, and certain ministry positions.",
  },
  {
    q: "How long does it take to become a member?",
    a: "Foundation Classes run over 4 weeks (one session per week). After completion you submit your application and attend a brief orientation. The full process takes about 5–6 weeks.",
  },
  {
    q: "Can I retake Foundation Classes?",
    a: "Yes. Classes run quarterly and you're welcome to attend again as a refresher or to make up sessions you may have missed.",
  },
  {
    q: "What are the benefits of membership renewal?",
    a: "Renewing keeps your voting rights, leadership eligibility, and access to member-only resources and event pricing active without interruption.",
  },
  {
    q: "When is the renewal deadline?",
    a: "Annual renewals should be completed before March 31st each year to maintain uninterrupted membership status.",
  },
];

const steps = [
  {
    num: "01",
    title: "Foundation Classes",
    body: "Complete 4 weekly sessions covering the essentials of faith, church, and Christian living.",
  },
  {
    num: "02",
    title: "Submit Application",
    body: "Fill in the membership application — takes about 5 minutes and no documents are required.",
  },
  {
    num: "03",
    title: "Orientation",
    body: "Attend a brief orientation where we introduce you to the VBC family and answer your questions.",
  },
  {
    num: "04",
    title: "Welcome",
    body: "You're officially part of the church family. We celebrate and support you from day one.",
  },
];

const benefits = [
  { num: "01", title: "Voting Rights", body: "Have your voice heard in church decisions that shape our community." },
  { num: "02", title: "Leadership Eligibility", body: "Qualify to serve in ministry leadership positions and committees." },
  { num: "03", title: "Pastoral Care", body: "Access dedicated support, counselling, and prayer from our pastoral team." },
  { num: "04", title: "Member Resources", body: "Gain access to study materials, events, and member-only programmes." },
  { num: "05", title: "Event Pricing", body: "Enjoy member rates for retreats, conferences, and church events." },
  { num: "06", title: "Ministry Access", body: "Serve across our ministries and help shape the direction of the church." },
];

const Membership = () => {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="bg-white">
      <Helmet>
        <title>Membership — Victory Bible Church Kitwe</title>
        <meta
          name="description"
          content="Join the Victory Bible Church family. Learn how to become a member through Foundation Classes and how to renew your annual membership."
        />
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <HeroSection
        subtitle="Membership"
        title="Be Part of the Family"
        description="Membership at VBC is a covenant — a commitment to community, growth, and purpose. It starts with four weeks and lasts a lifetime."
        backgroundImage="/assets/hero-bg.jpg"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Membership" },
        ]}
      />

      {/* ── Stats strip ──────────────────────────────────────────── */}
      <div className="bg-vbc-dark -mt-1">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10">
          {[
            { value: "4", label: "Weeks · Foundation Classes" },
            { value: "31", label: "March · Annual Renewal Deadline" },
            { value: "Free", label: "No Cost to Join" },
          ].map(({ value, label }) => (
            <div key={label} className="bg-vbc-dark px-8 py-6 text-center">
              <p className="text-4xl font-black text-white mb-1">{value}</p>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── What membership means ─────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">What it means</p>
            <h2 className="text-5xl font-black text-gray-900 leading-[1.05] mb-6">
              More than attendance.<br />
              <span className="text-gray-300">It's belonging.</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              At Victory Bible Church, membership is a covenant — a meaningful commitment to this community, its mission, and one another. It opens the door to deeper relationships, greater responsibility, and real purpose within the body of Christ.
            </p>
            <div className="mt-10 flex gap-4 flex-wrap">
              <Link
                to="/foundation-classes"
                className="inline-block bg-brand-red text-white text-sm font-semibold px-6 py-3 hover:bg-red-700 transition-colors"
              >
                Start Foundation Classes
              </Link>
              <Link
                to="/renew"
                className="inline-block border border-gray-300 text-gray-700 text-sm font-semibold px-6 py-3 hover:bg-gray-50 transition-colors"
              >
                Renew Membership
              </Link>
            </div>
          </div>

          {/* Benefits */}
          <div className="divide-y divide-gray-100">
            {benefits.map(({ num, title, body }) => (
              <div key={num} className="flex gap-5 py-5">
                <span className="text-2xl font-black text-gray-100 w-10 flex-shrink-0 pt-0.5">{num}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Journey steps ─────────────────────────────────────────── */}
      <section className="bg-vbc-section py-24">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">The path to membership</p>
          <h2 className="text-4xl font-black text-white mb-14">Four steps. One family.</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {steps.map(({ num, title, body }) => (
              <div key={num} className="bg-vbc-section p-8 group">
                <p
                  className="font-black text-white/5 mb-6 leading-none"
                  style={{ fontSize: "clamp(5rem, 10vw, 7rem)" }}
                >
                  {num}
                </p>
                <div className="w-8 h-0.5 bg-brand-red mb-5 group-hover:w-12 transition-all duration-300" />
                <p className="text-base font-bold text-white mb-2">{title}</p>
                <p className="text-sm text-white/50 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/foundation-classes"
              className="inline-block bg-brand-red text-white text-sm font-semibold px-8 py-4 hover:bg-red-700 transition-colors"
            >
              Register for Foundation Classes
            </Link>
          </div>
        </div>
      </section>

      {/* ── Renewal ───────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Annual renewal</p>
            <h2 className="text-5xl font-black text-gray-900 leading-[1.05] mb-6">
              Keep your membership active.
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              Membership renews annually before <strong>March 31st</strong>. The process takes about 5 minutes and keeps your voting rights, leadership eligibility, and member benefits uninterrupted.
            </p>
            <div className="divide-y divide-gray-100 mb-10">
              {[
                ["Renewal Deadline", "March 31st each year"],
                ["Process Time",     "~5 minutes online"],
                ["Documents Required", "None"],
                ["Cost", "Free"],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-4">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-semibold text-gray-900">{val}</span>
                </div>
              ))}
            </div>
            <Link
              to="/renew"
              className="inline-block bg-brand-red text-white text-sm font-semibold px-8 py-4 hover:bg-red-700 transition-colors"
            >
              Renew Now
            </Link>
          </div>

          {/* Quote block */}
          <div className="bg-vbc-dark p-10 lg:p-12">
            <div className="text-brand-red text-6xl font-black leading-none mb-6">"</div>
            <blockquote className="text-white text-xl font-light leading-relaxed mb-8 italic">
              Becoming a member connected me with a community that genuinely supports my spiritual growth. The Foundation Classes gave me a solid foundation, and I'm grateful to belong to this church family.
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-8 h-0.5 bg-brand-red" />
              <cite className="text-white/50 text-sm not-italic">Maria Mulenga, member since 2022</cite>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="bg-vbc-section py-24">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Common questions</p>
          <h2 className="text-4xl font-black text-white mb-14">Frequently asked</h2>

          <div className="divide-y divide-white/10">
            {faqItems.map((item, i) => (
              <div key={i}>
                <button
                  className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-base font-semibold text-white group-hover:text-brand-red transition-colors">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 flex-shrink-0 text-brand-red transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <p className="pb-6 text-white/60 text-sm leading-relaxed -mt-2">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <section className="bg-vbc-dark py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Ready?</p>
          <h2 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.05]">
            Your seat at the table is waiting.
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto mb-12">
            Take the first step — register for Foundation Classes and begin the journey to becoming part of the VBC family.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/foundation-classes"
              className="inline-block bg-brand-red text-white text-sm font-semibold px-8 py-4 hover:bg-red-700 transition-colors"
            >
              Register for Classes
            </Link>
            <Link
              to="/contact"
              className="inline-block border border-white/20 text-white text-sm font-semibold px-8 py-4 hover:border-white/50 hover:bg-white/5 transition-colors"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;
