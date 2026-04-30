import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CheckCircle, ChevronDown } from "lucide-react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import HeroSection from "../components/common/HeroSection";
import useFoundationClassSessions from "../hooks/useFoundationClassSessions";
import { isAuthenticated } from "../services/api/auth";

const classSessions = [
  {
    week: 1,
    title: "Understanding Salvation and Church Basics",
    description:
      "Explore the fundamentals of salvation, the significance of being born again, and the purpose of the local church in a believer's life.",
    topics: [
      "The plan of salvation",
      "What it means to be born again",
      "The purpose of the local church",
      "Introduction to our church's history",
    ],
  },
  {
    week: 2,
    title: "Bible Study Methods and Prayer Life",
    description:
      "Learn practical methods for effective Bible study and develop a consistent prayer life that deepens your relationship with God.",
    topics: [
      "How to study the Bible effectively",
      "Understanding different Bible translations",
      "Developing a consistent prayer life",
      "Types of prayer",
    ],
  },
  {
    week: 3,
    title: "Spiritual Gifts and Service",
    description:
      "Discover your unique spiritual gifts and learn how to use them effectively in serving within the church community.",
    topics: [
      "Understanding spiritual gifts",
      "Identifying your spiritual gifts",
      "Areas of service in the church",
      "The importance of volunteering",
    ],
  },
  {
    week: 4,
    title: "Church Mission and Membership Responsibilities",
    description:
      "Understand our church's mission and vision, and learn about the expectations and benefits of becoming an active member.",
    topics: [
      "Church mission and vision",
      "Membership responsibilities",
      "Financial stewardship",
      "Next steps after membership",
    ],
  },
];

const faqItems = [
  {
    question: "Do I need to attend all four classes?",
    answer:
      "Yes, attendance at all four classes is required to complete the Foundation Classes series. Each class builds on the previous one to provide a comprehensive foundation for your faith and church membership.",
  },
  {
    question: "What if I miss a class?",
    answer:
      "If you miss a class, you can make it up during the next Foundation Classes series. We understand that emergencies happen, and our team will work with you to ensure you can complete all four sessions.",
  },
  {
    question: "Is childcare provided during the classes?",
    answer:
      "Yes, childcare is provided for children ages 0–10 during the Sunday morning sessions. Please indicate on your registration form if you will need childcare services.",
  },
  {
    question: "Do I need to bring anything to the classes?",
    answer:
      "We recommend bringing a Bible, notebook, and pen. We will provide all other materials, including a Foundation Classes workbook.",
  },
  {
    question: "Is there a fee for the classes?",
    answer:
      "No, Foundation Classes are offered free of charge as part of our ministry to help people grow in their faith and become connected to our church family.",
  },
];

const FoundationClasses = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredSession: "",
    questions: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      setIsAdmin(isAuthenticated());
    } catch {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    if (formSubmitted) {
      document.getElementById("success-heading")?.focus();
    }
  }, [formSubmitted]);

  const {
    sessions: availableSessions,
    loading: loadingSessions,
    error: sessionError,
    usingMockData,
    refreshSessions,
    registerForSession,
  } = useFoundationClassSessions();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.preferredSession.trim())
      errors.preferredSession = "Please select a preferred session";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setSubmitting(true);
    const selectedSession = availableSessions.find(
      (s) => s.id === formData.preferredSession,
    );
    if (!selectedSession) {
      setFormErrors((prev) => ({
        ...prev,
        preferredSession: "Please select a valid session",
      }));
      setSubmitting(false);
      return;
    }
    try {
      await registerForSession(formData, formData.preferredSession);
      setFormSubmitted(true);
    } catch {
      alert("There was a problem submitting your form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr, opts) =>
    new Date(dateStr).toLocaleDateString("en-US", opts);

  return (
    <div className="bg-white">
      <Helmet>
        <title>Foundation Classes - Victory Bible Church</title>
        <meta
          name="description"
          content="Join our Foundation Classes to establish a strong biblical foundation and prepare for church membership at Victory Bible Church."
        />
      </Helmet>

      <HeroSection
        title="Foundation Classes"
        subtitle="Foundation Classes"
        description="A 4-week programme to establish a strong biblical foundation and prepare you for meaningful church membership."
        primaryAccentText="Foundation"
        scrollText="EXPLORE CLASSES"
        backgroundImage="/assets/hero-bg.jpg"
      />

      {/* ── OVERVIEW — dark split ──────────────────────────────────────── */}
      <section className="bg-vbc-section py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              The Programme
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-snug">
              What Are Foundation Classes?
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Foundation Classes are a 4-week journey designed to establish a
              strong biblical foundation and prepare you for meaningful church
              membership. Whether you're new to Christianity or looking to take
              your next step of commitment, these classes will equip you with
              essential knowledge and practical tools for your faith journey.
            </p>
          </div>

          {/* Key facts */}
          <div className="grid grid-cols-3 divide-x divide-white/10 border border-white/10">
            {[
              { value: "4", label: "Weeks" },
              { value: "1", label: "Pathway" },
              { value: "$0", label: "Cost" },
            ].map(({ value, label }) => (
              <div key={label} className="py-8 px-4 text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {value}
                </div>
                <div className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CURRICULUM — editorial stacked rows ───────────────────────── */}
      <section className="bg-white py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-14 items-end">
            <div className="md:col-span-2">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                Curriculum
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                4-Week Programme
              </h2>
            </div>
            <p className="md:col-span-3 text-gray-400 text-sm leading-relaxed">
              Each session builds on the previous one to give you a complete
              understanding of faith, church life, and your role within the
              community.
            </p>
          </div>

          <div className="border-t border-gray-100">
            {classSessions.map((session) => (
              <div
                key={session.week}
                className="grid md:grid-cols-5 gap-8 py-10 border-b border-gray-100"
              >
                {/* Week indicator */}
                <div className="md:col-span-1">
                  <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                    Week
                  </p>
                  <p className="text-5xl font-black text-gray-100 leading-none">
                    0{session.week}
                  </p>
                </div>

                {/* Content */}
                <div className="md:col-span-4">
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {session.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-5">
                    {session.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4">
                    {session.topics.map((topic, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="w-1 h-1 bg-brand-red flex-shrink-0" />
                        <span className="text-gray-400 text-xs">{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING SESSIONS — dark, flat panels ─────────────────────── */}
      <section className="bg-vbc-section py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-14 items-end">
            <div className="md:col-span-2">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                Schedule
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Upcoming Classes
              </h2>
            </div>
            <p className="md:col-span-3 text-gray-400 text-sm leading-relaxed">
              Classes run quarterly. Registration is required — space is limited.
              Select your preferred session when you register below.
            </p>
          </div>

          {isAdmin && usingMockData && (
            <div className="mb-8 border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
              <p className="text-yellow-400 text-xs font-semibold">
                Admin Notice: Using mock session data — changes won't persist to
                the server.
              </p>
            </div>
          )}

          {loadingSessions ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-vbc-section p-8 space-y-3">
                  <div className="h-3 bg-white/10 w-1/3" />
                  <div className="h-5 bg-white/10 w-2/3" />
                  <div className="h-3 bg-white/10 w-1/2" />
                </div>
              ))}
            </div>
          ) : sessionError ? (
            <div className="border border-red-500/20 p-10 text-center">
              <p className="text-red-400 text-sm mb-6">{sessionError}</p>
              <button
                onClick={refreshSessions}
                className="border border-white/20 text-white text-xs font-semibold uppercase tracking-widest px-6 py-3 hover:bg-white/5 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : availableSessions.length === 0 ? (
            <div className="border border-white/10 p-10 text-center">
              <p className="text-gray-400 text-sm">
                No upcoming sessions are currently scheduled. Please check back
                later or contact the church office.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
              {availableSessions.map((session) => (
                <div key={session.id} className="bg-vbc-section p-8 flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-1">
                        {session.day} Series
                      </p>
                      <p className="text-white font-bold">
                        {formatDate(session.startDate, {
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    {session.spotsLeft > 0 && session.spotsLeft <= 5 && (
                      <span className="text-brand-red text-xs font-semibold uppercase tracking-widest">
                        {session.spotsLeft} left
                      </span>
                    )}
                    {session.spotsLeft === 0 && (
                      <span className="text-white/25 text-xs uppercase tracking-widest">
                        Full
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-8 flex-grow">
                    {[
                      {
                        label: "Dates",
                        value: `${formatDate(session.startDate, { month: "short", day: "numeric" })} — ${formatDate(session.endDate, { month: "short", day: "numeric", year: "numeric" })}`,
                      },
                      { label: "Time", value: session.time },
                      { label: "Venue", value: session.location },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex gap-4">
                        <span className="text-white/25 text-xs uppercase tracking-widest w-12 flex-shrink-0 pt-0.5">
                          {label}
                        </span>
                        <span className="text-gray-400 text-xs leading-relaxed">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <a
                    href="#register"
                    onClick={(e) => {
                      if (session.spotsLeft === 0) {
                        e.preventDefault();
                        return;
                      }
                      setFormData((prev) => ({
                        ...prev,
                        preferredSession: session.id,
                      }));
                      setTimeout(
                        () =>
                          document
                            .getElementById("register")
                            ?.scrollIntoView({ behavior: "smooth" }),
                        100,
                      );
                    }}
                    className={`block text-center text-xs font-semibold uppercase tracking-widest py-3 transition-all ${
                      session.spotsLeft > 0
                        ? "border border-white/20 text-white hover:bg-white hover:text-black"
                        : "border border-white/10 text-white/20 pointer-events-none cursor-not-allowed"
                    }`}
                    aria-disabled={session.spotsLeft === 0}
                  >
                    {session.spotsLeft > 0 ? "Register Now" : "Class Full"}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FAQ — minimal accordion ────────────────────────────────────── */}
      <section className="bg-gray-50 py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-14 items-end">
            <div className="md:col-span-2">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                FAQ
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Common Questions
              </h2>
            </div>
            <p className="md:col-span-3 text-gray-400 text-sm leading-relaxed">
              Everything you need to know before signing up for Foundation Classes.
            </p>
          </div>

          <div className="border-t border-gray-200">
            {faqItems.map((item, index) => (
              <div key={index} className="border-b border-gray-200">
                <button
                  id={`faq-button-${index}`}
                  className="flex justify-between items-center w-full text-left py-5 gap-8"
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  aria-expanded={expandedFaq === index}
                  aria-controls={`faq-panel-${index}`}
                >
                  <span className="font-semibold text-gray-900 text-sm">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {expandedFaq === index && (
                  <div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-button-${index}`}
                    className="pb-5"
                  >
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGISTRATION FORM ──────────────────────────────────────────── */}
      <section id="register" className="bg-white py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12 items-end">
            <div className="md:col-span-2">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                Register
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Reserve Your Spot
              </h2>
            </div>
            <p className="md:col-span-3 text-gray-400 text-sm leading-relaxed">
              Complete the form below to secure your place in our next class
              series. A confirmation will be sent to your email address.
            </p>
          </div>

          {formSubmitted ? (
            <div className="border border-gray-200 p-12 text-center">
              <CheckCircle className="w-10 h-10 text-primary-600 mx-auto mb-6" />
              <h3
                id="success-heading"
                className="text-2xl font-bold text-gray-900 mb-3"
                tabIndex={-1}
              >
                Registration Complete
              </h3>
              <p className="text-gray-500 text-sm mb-2">
                Thank you for registering. A confirmation has been sent to{" "}
                <strong className="text-gray-700">{formData.email}</strong>.
              </p>
              <p className="text-gray-400 text-sm mb-10">
                If you have any questions before your first class, please
                contact our church office.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/membership"
                  className="border border-gray-900 text-gray-900 text-xs font-semibold uppercase tracking-widest px-8 py-3 hover:bg-gray-900 hover:text-white transition-all"
                >
                  Learn About Membership
                </Link>
                <Link
                  to="/"
                  className="border border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-widest px-8 py-3 hover:border-gray-900 hover:text-gray-900 transition-all"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="border-t border-gray-100 pt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  aria-invalid={!!formErrors.fullName}
                  aria-describedby={
                    formErrors.fullName ? "fullName-error" : undefined
                  }
                  className={`w-full px-4 py-3 border text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${
                    formErrors.fullName ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {formErrors.fullName && (
                  <p
                    id="fullName-error"
                    className="mt-1.5 text-red-500 text-xs"
                    role="alert"
                  >
                    {formErrors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  autoComplete="email"
                  aria-invalid={!!formErrors.email}
                  aria-describedby={
                    formErrors.email ? "email-error" : undefined
                  }
                  className={`w-full px-4 py-3 border text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${
                    formErrors.email ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {formErrors.email && (
                  <p
                    id="email-error"
                    className="mt-1.5 text-red-500 text-xs"
                    role="alert"
                  >
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  autoComplete="tel"
                  inputMode="tel"
                  aria-invalid={!!formErrors.phone}
                  aria-describedby={
                    formErrors.phone ? "phone-error" : undefined
                  }
                  className={`w-full px-4 py-3 border text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${
                    formErrors.phone ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {formErrors.phone && (
                  <p
                    id="phone-error"
                    className="mt-1.5 text-red-500 text-xs"
                    role="alert"
                  >
                    {formErrors.phone}
                  </p>
                )}
              </div>

              {/* Preferred Session */}
              <div>
                <label
                  htmlFor="preferredSession"
                  className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2"
                >
                  Preferred Session
                </label>
                {loadingSessions ? (
                  <div className="w-full h-12 bg-gray-100 animate-pulse" />
                ) : (
                  <select
                    id="preferredSession"
                    name="preferredSession"
                    value={formData.preferredSession}
                    onChange={handleChange}
                    aria-invalid={!!formErrors.preferredSession}
                    aria-describedby={
                      formErrors.preferredSession
                        ? "preferredSession-error"
                        : undefined
                    }
                    disabled={
                      submitting ||
                      availableSessions.filter((s) => s.spotsLeft > 0)
                        .length === 0
                    }
                    className={`w-full px-4 py-3 border text-gray-900 text-sm bg-white focus:outline-none focus:border-gray-900 transition-colors ${
                      formErrors.preferredSession
                        ? "border-red-400"
                        : "border-gray-200"
                    }`}
                  >
                    <option value="">Select a session</option>
                    {availableSessions
                      .filter((s) => s.spotsLeft > 0)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.day} ({s.time}) —{" "}
                          {formatDate(s.startDate, {
                            month: "long",
                            year: "numeric",
                          })}
                        </option>
                      ))}
                    {availableSessions.length > 0 &&
                      availableSessions.filter((s) => s.spotsLeft > 0)
                        .length === 0 && (
                        <option value="" disabled>
                          No available sessions at this time
                        </option>
                      )}
                  </select>
                )}
                {formErrors.preferredSession && (
                  <p
                    id="preferredSession-error"
                    className="mt-1.5 text-red-500 text-xs"
                    role="alert"
                  >
                    {formErrors.preferredSession}
                  </p>
                )}
                {!loadingSessions &&
                  !sessionError &&
                  availableSessions.length === 0 && (
                    <p className="mt-1.5 text-gray-400 text-xs">
                      No sessions currently available. Check back soon.
                    </p>
                  )}
              </div>

              {/* Questions */}
              <div className="md:col-span-2">
                <label
                  htmlFor="questions"
                  className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2"
                >
                  Questions or Special Requests{" "}
                  <span className="normal-case tracking-normal font-normal text-gray-400">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="questions"
                  name="questions"
                  value={formData.questions}
                  onChange={handleChange}
                  placeholder="Any questions or requests before your first class…"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full border border-gray-900 bg-gray-900 text-white text-xs font-bold uppercase tracking-widest py-4 hover:bg-white hover:text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    <>
                      Register for Foundation Classes
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── TESTIMONIAL / CTA — dark split ────────────────────────────── */}
      <section className="bg-vbc-section py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Pull quote */}
          <div>
            <p className="text-brand-red text-5xl font-black leading-none mb-4 select-none">
              "
            </p>
            <blockquote>
              <p className="text-white text-lg font-light italic leading-relaxed mb-6">
                The Foundation Classes gave me clarity about my faith and how to
                live it out daily. I met wonderful people who became friends, and
                I finally understand what it means to be part of a church family.
              </p>
              <footer>
                <cite className="text-gray-400 text-sm not-italic">
                  — Watu Matuze, Foundation Classes 2023
                </cite>
              </footer>
            </blockquote>
          </div>

          {/* CTA */}
          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              Begin Today
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
              Begin Your Journey Today
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Foundation Classes are your first step toward meaningful church
              membership and a stronger walk with God. Space is limited — reserve
              your spot now.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#register"
                className="border border-white text-white text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-white hover:text-black transition-all duration-300"
              >
                Reserve Your Spot
              </a>
              <Link
                to="/contact"
                className="border border-white/20 text-white/50 text-xs font-bold uppercase tracking-widest px-8 py-4 hover:border-white hover:text-white transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FoundationClasses;
