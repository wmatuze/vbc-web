import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import HeroSection from "../components/common/HeroSection";

const levelTiers = [
  {
    key: "beginner",
    num: "01",
    label: "Beginner",
    description: "Entry-level programmes for those new to structured discipleship.",
  },
  {
    key: "intermediate",
    num: "02",
    label: "Intermediate",
    description: "Deeper study for believers ready to go further in their walk.",
  },
  {
    key: "advanced",
    num: "03",
    label: "Advanced",
    description: "Leadership-focused programmes for those called to ministry.",
  },
];

const faqItems = [
  {
    question: "What's the difference between Foundation Classes and Discipleship Classes?",
    answer:
      "Foundation Classes cover basic Christian beliefs and church membership, while Discipleship Classes are deeper, longer programs focusing on spiritual growth, leadership development, and specific ministry areas.",
  },
  {
    question: "Do I need to complete Foundation Classes first?",
    answer:
      "While not always required, we highly recommend completing Foundation Classes first as they provide essential groundwork. Some advanced discipleship classes may have specific prerequisites.",
  },
  {
    question: "How long do discipleship classes run?",
    answer:
      "Discipleship classes vary in length from 6 weeks to 6 months, depending on the programme. Each class shows the specific duration and time commitment required.",
  },
  {
    question: "Can I join a class that's already started?",
    answer:
      "This depends on the specific class and how far it has progressed. Contact the class facilitator to discuss your options — sometimes makeup sessions or resources are available.",
  },
  {
    question: "Are there any costs for discipleship classes?",
    answer:
      "Most discipleship classes are free, though some may require purchasing books or materials. Any costs will be clearly stated when you register.",
  },
  {
    question: "What if I miss classes due to travel or illness?",
    answer:
      "We understand life happens! Most classes provide recorded sessions or makeup opportunities. Contact your facilitator to discuss how to stay on track.",
  },
];

const DiscipleshipClasses = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredSession: "",
    sessionId: "",
    classId: "",
    previousClasses: "",
    questions: "",
    emergencyContact: { name: "", phone: "", relationship: "" },
    motivationReason: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await fetch("/api/discipleship/classes");
        const data = await res.json();
        if (data.success) setClasses(data.data);
      } catch {
        // empty state handles this
      }
    };

    const fetchSessions = async () => {
      try {
        const res = await fetch("/api/discipleship/sessions?status=upcoming");
        const data = await res.json();
        if (data.success) setSessions(data.data);
      } catch {
        // empty state handles this
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
    fetchSessions();
  }, []);

  const getClassesForLevel = (level) =>
    classes.filter((c) => c.level?.toLowerCase() === level);

  const getSessionsForClass = (classId) =>
    sessions.filter((s) => s.classId?._id === classId);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errors.email = "Please enter a valid email address";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!formData.motivationReason.trim())
      errors.motivationReason = "Please explain your motivation for taking this class";
    if (!formData.emergencyContact.name.trim())
      errors.emergencyContactName = "Emergency contact name is required";
    if (!formData.emergencyContact.phone.trim())
      errors.emergencyContactPhone = "Emergency contact phone is required";
    if (!formData.emergencyContact.relationship.trim())
      errors.emergencyContactRelationship = "Relationship is required";
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
    try {
      const res = await fetch("/api/discipleship/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setFormSubmitted(true);
        setShowRegistrationForm(false);
      } else {
        setFormErrors({ submit: data.error || "Registration failed. Please try again." });
      }
    } catch {
      setFormErrors({ submit: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const openRegistrationForm = (classItem, session) => {
    setSelectedClass(classItem);
    setSelectedSession(session);
    setFormData((prev) => ({
      ...prev,
      preferredSession: session.cohortName,
      sessionId: session._id,
      classId: classItem._id,
    }));
    setShowRegistrationForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-vbc-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-xs uppercase tracking-widest">
            Loading classes…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Helmet>
        <title>Discipleship Classes - Victory Bible Church</title>
        <meta
          name="description"
          content="Deepen your faith, develop leadership skills, and grow through our structured discipleship programmes at Victory Bible Church."
        />
      </Helmet>

      {/* Success toast */}
      {formSubmitted && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-vbc-section border border-white/10 px-6 py-4 flex items-center gap-3 shadow-xl">
          <CheckCircleIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
          <p className="text-white text-sm">
            Registration submitted — we'll be in touch soon.
          </p>
          <button
            onClick={() => setFormSubmitted(false)}
            className="text-white/30 hover:text-white ml-2 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <HeroSection
        title="Discipleship Classes"
        subtitle="Grow Deeper"
        description="Structured programmes to deepen your faith, develop leadership, and equip you for ministry."
        primaryAccentText="Classes"
        scrollText="EXPLORE PROGRAMMES"
        backgroundImage="/assets/hero-bg.jpg"
      />

      {/* ── FOUNDATION → DISCIPLESHIP COMPARISON ──────────────────────── */}
      <section className="bg-vbc-section py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-12">
            The Journey
          </p>
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {/* Foundation — muted, "done this" */}
            <div className="pb-10 md:pb-0 md:pr-12">
              <p className="text-white/30 text-xs uppercase tracking-[0.2em] mb-4">
                Step 1 — Start Here
              </p>
              <h3 className="text-xl font-bold text-white/40 mb-5">
                Foundation Classes
              </h3>
              <ul className="space-y-3 mb-8">
                {[
                  "4-week programme",
                  "Biblical basics & church life",
                  "Pathway to membership",
                  "Free — no cost",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-white/15 flex-shrink-0" />
                    <span className="text-white/30 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/foundation-classes"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/25 hover:text-white/60 transition-colors group"
              >
                View Foundation Classes
                <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Discipleship — bright, "you are here" */}
            <div className="pt-10 md:pt-0 md:pl-12">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                Step 2 — Go Deeper
              </p>
              <h3 className="text-xl font-bold text-white mb-5">
                Discipleship Classes
              </h3>
              <ul className="space-y-3 mb-8">
                {[
                  "6 weeks – 6 months per programme",
                  "Deep-dive spiritual growth",
                  "Leadership & ministry equipping",
                  "Free (materials may vary)",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-1 h-1 bg-brand-red flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-white/30 text-xs uppercase tracking-widest">
                You are here ↓
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIERED PATHWAY ────────────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-16 items-end">
            <div className="md:col-span-2">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                Programmes
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
                Available Discipleship<br />Classes
              </h2>
            </div>
            <p className="md:col-span-3 text-gray-400 text-sm leading-relaxed">
              Our programmes are organised by level. Start where you are and grow
              progressively. Each class has its own sessions, schedule, and facilitator.
            </p>
          </div>

          <div className="space-y-16">
            {levelTiers.map((tier) => {
              const tierClasses = getClassesForLevel(tier.key);

              return (
                <div key={tier.key}>
                  {/* Tier header row */}
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-8 pb-4 border-b border-gray-100">
                    <span className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em]">
                      {tier.num}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">{tier.label}</h3>
                    <p className="text-gray-400 text-sm">{tier.description}</p>
                  </div>

                  {/* Empty tier */}
                  {tierClasses.length === 0 ? (
                    <div className="border border-dashed border-gray-200 py-12 text-center">
                      <p className="text-gray-400 text-sm mb-1">
                        No {tier.label.toLowerCase()} classes currently available.
                      </p>
                      <p className="text-gray-300 text-xs">
                        Check back soon or{" "}
                        <Link
                          to="/contact"
                          className="underline underline-offset-2 hover:text-gray-500 transition-colors"
                        >
                          contact us
                        </Link>{" "}
                        for upcoming programme information.
                      </p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
                      {tierClasses.map((classItem) => {
                        const classSessions = getSessionsForClass(classItem._id);
                        return (
                          <div key={classItem._id} className="bg-white p-6 flex flex-col">
                            {/* Class header */}
                            <div className="flex-grow mb-6">
                              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                                {tier.label}
                              </p>
                              <h4 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                                {classItem.title}
                              </h4>
                              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                                {classItem.description}
                              </p>

                              {/* Metadata */}
                              <div className="space-y-1.5 mb-5">
                                {[
                                  { label: "Duration", value: classItem.durationDisplay },
                                  { label: "Facilitator", value: classItem.instructor?.name },
                                  {
                                    label: "Sessions",
                                    value: classItem.curriculumLength
                                      ? `${classItem.curriculumLength} sessions`
                                      : null,
                                  },
                                ]
                                  .filter((m) => m.value)
                                  .map(({ label, value }) => (
                                    <div key={label} className="flex gap-3">
                                      <span className="text-gray-300 text-xs uppercase tracking-widest w-20 flex-shrink-0 pt-0.5">
                                        {label}
                                      </span>
                                      <span className="text-gray-500 text-xs">{value}</span>
                                    </div>
                                  ))}
                              </div>

                              {/* Prerequisites */}
                              {classItem.prerequisites?.length > 0 && (
                                <div>
                                  <p className="text-gray-300 text-xs uppercase tracking-widest mb-2">
                                    Prerequisites
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {classItem.prerequisites.map((prereq, i) => (
                                      <span
                                        key={i}
                                        className="border border-gray-200 text-gray-500 text-xs px-2 py-0.5"
                                      >
                                        {prereq}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Sessions */}
                            <div className="border-t border-gray-100 pt-5">
                              <p className="text-gray-300 text-xs uppercase tracking-widest mb-4">
                                Upcoming Sessions
                              </p>

                              {classSessions.length === 0 ? (
                                <p className="text-gray-300 text-xs italic">
                                  No sessions currently scheduled.
                                </p>
                              ) : (
                                <div className="space-y-5">
                                  {classSessions.map((session) => (
                                    <div
                                      key={session._id}
                                      className="border-l-2 border-gray-100 pl-4"
                                    >
                                      <p className="text-gray-900 text-xs font-semibold mb-2">
                                        {session.cohortName}
                                      </p>
                                      <div className="space-y-1 mb-3">
                                        {[
                                          { label: "Dates", value: session.dateRange },
                                          {
                                            label: "Day",
                                            value: session.schedule
                                              ? `${session.schedule.day}s at ${session.schedule.time}`
                                              : null,
                                          },
                                          { label: "Venue", value: session.location },
                                        ]
                                          .filter((m) => m.value)
                                          .map(({ label, value }) => (
                                            <div key={label} className="flex gap-2">
                                              <span className="text-gray-300 text-xs w-10 flex-shrink-0">
                                                {label}
                                              </span>
                                              <span className="text-gray-400 text-xs leading-tight">
                                                {value}
                                              </span>
                                            </div>
                                          ))}
                                        {session.spotsLeft !== undefined && (
                                          <p
                                            className={`text-xs font-semibold mt-1 ${
                                              session.spotsLeft === 0
                                                ? "text-gray-300"
                                                : session.spotsLeft <= 5
                                                ? "text-brand-red"
                                                : "text-gray-400"
                                            }`}
                                          >
                                            {session.spotsLeft === 0
                                              ? "Class full"
                                              : `${session.spotsLeft} spots left`}
                                          </p>
                                        )}
                                      </div>
                                      <button
                                        onClick={() =>
                                          openRegistrationForm(classItem, session)
                                        }
                                        disabled={!session.registrationOpen}
                                        className={`w-full text-xs font-semibold uppercase tracking-widest py-2.5 transition-all ${
                                          session.registrationOpen
                                            ? "border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                                            : "border border-gray-200 text-gray-300 cursor-not-allowed"
                                        }`}
                                      >
                                        {session.registrationOpen
                                          ? "Register Now"
                                          : "Registration Closed"}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="bg-vbc-section py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-14 items-end">
            <div className="md:col-span-2">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                FAQ
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Common Questions
              </h2>
            </div>
            <p className="md:col-span-3 text-gray-400 text-sm leading-relaxed">
              Everything you need to know before signing up for a discipleship programme.
            </p>
          </div>

          <div className="border-t border-white/10">
            {faqItems.map((faq, index) => (
              <div key={index} className="border-b border-white/10">
                <button
                  className="flex justify-between items-center w-full text-left py-5 gap-8"
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  aria-expanded={expandedFaq === index}
                >
                  <span className="font-semibold text-white text-sm">
                    {faq.question}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-white/30 flex-shrink-0 transition-transform duration-200 ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {expandedFaq === index && (
                  <div className="pb-5">
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGISTRATION MODAL ────────────────────────────────────────── */}
      {showRegistrationForm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) =>
            e.target === e.currentTarget && setShowRegistrationForm(false)
          }
        >
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Dark header strip — class + session context */}
            <div className="bg-vbc-section p-6 relative">
              <button
                onClick={() => setShowRegistrationForm(false)}
                className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
                aria-label="Close registration form"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                Registration
              </p>
              <h3 className="text-white font-bold text-lg leading-snug pr-8">
                {selectedClass?.title}
              </h3>
              {selectedSession && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                  {[
                    { label: "Cohort", value: selectedSession.cohortName },
                    { label: "Dates", value: selectedSession.dateRange },
                    {
                      label: "Schedule",
                      value: selectedSession.schedule
                        ? `${selectedSession.schedule.day}s at ${selectedSession.schedule.time}`
                        : null,
                    },
                    { label: "Venue", value: selectedSession.location },
                  ]
                    .filter((m) => m.value)
                    .map(({ label, value }) => (
                      <div key={label} className="flex gap-3">
                        <span className="text-white/25 text-xs w-16 flex-shrink-0">
                          {label}
                        </span>
                        <span className="text-gray-300 text-xs">{value}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Personal information */}
              <div>
                <p className="text-gray-900 text-xs font-semibold uppercase tracking-widest mb-5">
                  Personal Information
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2.5 border text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${
                        formErrors.fullName ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="mt-1 text-red-500 text-xs">
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2.5 border text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${
                        formErrors.email ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-red-500 text-xs">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2"
                    >
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2.5 border text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${
                        formErrors.phone ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-red-500 text-xs">{formErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="previousClasses"
                      className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2"
                    >
                      Previous Classes Completed
                    </label>
                    <input
                      id="previousClasses"
                      type="text"
                      name="previousClasses"
                      value={formData.previousClasses}
                      onChange={handleInputChange}
                      placeholder="e.g., Foundation Classes"
                      className="w-full px-3 py-2.5 border border-gray-200 text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency contact */}
              <div>
                <p className="text-gray-900 text-xs font-semibold uppercase tracking-widest mb-5">
                  Emergency Contact
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="ec-name"
                      className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2"
                    >
                      Name *
                    </label>
                    <input
                      id="ec-name"
                      type="text"
                      name="emergencyContact.name"
                      value={formData.emergencyContact.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2.5 border text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors ${
                        formErrors.emergencyContactName
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                    />
                    {formErrors.emergencyContactName && (
                      <p className="mt-1 text-red-500 text-xs">
                        {formErrors.emergencyContactName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="ec-phone"
                      className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2"
                    >
                      Phone *
                    </label>
                    <input
                      id="ec-phone"
                      type="tel"
                      name="emergencyContact.phone"
                      value={formData.emergencyContact.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2.5 border text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors ${
                        formErrors.emergencyContactPhone
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                    />
                    {formErrors.emergencyContactPhone && (
                      <p className="mt-1 text-red-500 text-xs">
                        {formErrors.emergencyContactPhone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="ec-relationship"
                      className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2"
                    >
                      Relationship *
                    </label>
                    <input
                      id="ec-relationship"
                      type="text"
                      name="emergencyContact.relationship"
                      value={formData.emergencyContact.relationship}
                      onChange={handleInputChange}
                      placeholder="e.g., Spouse, Parent"
                      className={`w-full px-3 py-2.5 border text-gray-900 text-sm placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors ${
                        formErrors.emergencyContactRelationship
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                    />
                    {formErrors.emergencyContactRelationship && (
                      <p className="mt-1 text-red-500 text-xs">
                        {formErrors.emergencyContactRelationship}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Motivation */}
              <div>
                <label
                  htmlFor="motivationReason"
                  className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2"
                >
                  Why do you want to take this class? *
                </label>
                <textarea
                  id="motivationReason"
                  name="motivationReason"
                  value={formData.motivationReason}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-3 py-2.5 border text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors resize-none ${
                    formErrors.motivationReason ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {formErrors.motivationReason && (
                  <p className="mt-1 text-red-500 text-xs">
                    {formErrors.motivationReason}
                  </p>
                )}
              </div>

              {/* Additional questions */}
              <div>
                <label
                  htmlFor="questions"
                  className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2"
                >
                  Additional Questions{" "}
                  <span className="normal-case tracking-normal font-normal text-gray-400">
                    (optional)
                  </span>
                </label>
                <textarea
                  id="questions"
                  name="questions"
                  value={formData.questions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-900 transition-colors resize-none"
                />
              </div>

              {formErrors.submit && (
                <p className="text-red-500 text-sm">{formErrors.submit}</p>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowRegistrationForm(false)}
                  className="flex-1 border border-gray-200 text-gray-500 text-xs font-semibold uppercase tracking-widest py-3 hover:border-gray-400 hover:text-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 border border-gray-900 bg-gray-900 text-white text-xs font-semibold uppercase tracking-widest py-3 hover:bg-white hover:text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Registration"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscipleshipClasses;
