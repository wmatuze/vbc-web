import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  BookOpenIcon,
  UsersIcon,
  HeartIcon,
  StarIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FlameIcon,
  HandshakeIcon,
} from "lucide-react";
import HeroSection from "../../components/common/HeroSection";
import { useEventsQuery } from "../../hooks/useEventsQuery";
import EventCard from "../../components/ChurchCalendar/EventsCard";

// ─── Data ────────────────────────────────────────────────────────────────────

// TODO: Replace with real schedule once confirmed with the ministry
const SCHEDULE = [
  { day: "Saturday",        time: "8:00 AM",  note: "Women's Bible Study" },
  { day: "1st Saturday",   time: "9:00 AM",  note: "Monthly Prayer Meeting" },
  { day: "Annual Retreat", time: "TBA",       note: "Weekend of Spiritual Renewal" },
];

// TODO: Replace with real activities once confirmed
const ACTIVITIES = [
  {
    num: "01",
    Icon: BookOpenIcon,
    title: "Bible Study",
    body: "Weekly deep-dives into Scripture — practical, honest, and rooted in faith. Every woman is welcome, wherever she is in her journey.",
  },
  {
    num: "02",
    Icon: HeartIcon,
    title: "Prayer & Intercession",
    body: "We believe in the power of unified prayer. Monthly gatherings dedicated to praying for our families, church, and nation.",
  },
  {
    num: "03",
    Icon: UsersIcon,
    title: "Fellowship & Community",
    body: "From shared meals to honest conversations, we create space for women to know and be known — building friendships that last.",
  },
  {
    num: "04",
    Icon: HandshakeIcon,
    title: "Outreach & Service",
    body: "Extending grace beyond our walls. We serve our local community, support families in need, and represent Christ with our hands.",
  },
  {
    num: "05",
    Icon: StarIcon,
    title: "Annual Women's Retreat",
    body: "A weekend set apart for rest, renewal, and encounter. Women come weary and leave restored — it is a highlight of our year.",
  },
  {
    num: "06",
    Icon: FlameIcon,
    title: "Mentorship",
    body: "Older women investing in younger women — sharing wisdom, walking through seasons of life, and building a legacy of faith.",
  },
];

const TESTIMONIALS = [
  {
    quote: "Coming to the Women's Ministry was the turning point in my walk with God. I found sisters who prayed with me, cried with me, and celebrated with me.",
    author: "Sarah M.",
    role: "Member since 2021",
  },
  {
    quote: "The annual retreat gave me space to hear from God in a way I hadn't in years. I came back to my family completely transformed.",
    author: "Grace N.",
    role: "Member since 2019",
  },
  {
    quote: "I was new to Kitwe and didn't know a single person. The Women's Ministry became my family. I will never forget that welcome.",
    author: "Chanda P.",
    role: "Member since 2023",
  },
  {
    quote: "Being mentored by a woman who had walked through what I was facing gave me the courage to keep going. That relationship changed my life.",
    author: "Mutinta K.",
    role: "Member since 2020",
  },
];

const FAQS = [
  {
    q: "Who can join the Women's Ministry?",
    a: "Every woman is welcome — married, single, young, or seasoned. You don't need to be a church member. If you are a woman and you walk through our doors, there is a place for you here.",
  },
  {
    q: "When does the Women's Ministry meet?",
    a: "Our primary gathering is on Saturdays at 8:00 AM for Bible Study, with a dedicated prayer meeting on the first Saturday of each month at 9:00 AM. Check our events calendar for the most up-to-date schedule.",
  },
  {
    q: "How can I get involved or volunteer?",
    a: "Reach out to our ministry leadership through the church office or speak to a Women's Ministry team member after service. There are many ways to serve — from hosting, to leading a small group, to supporting outreach efforts.",
  },
  {
    q: "What is the Women's Annual Retreat?",
    a: "It is a weekend set aside each year specifically for the women of VBC — worship, teaching, rest, and fellowship away from the busyness of everyday life. It is one of the most anticipated events of our church year.",
  },
];

// ─── FAQ Accordion Item ───────────────────────────────────────────────────────

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
      >
        <span className="text-white font-semibold text-sm leading-snug group-hover:text-brand-red transition-colors">
          {q}
        </span>
        {open
          ? <ChevronUpIcon className="h-4 w-4 text-brand-red flex-shrink-0" />
          : <ChevronDownIcon className="h-4 w-4 text-white/30 flex-shrink-0 group-hover:text-brand-red transition-colors" />}
      </button>
      {open && (
        <p className="text-white/50 text-sm leading-relaxed pb-6 pr-10">{a}</p>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const WomensMinistry = () => {
  const currentYear = new Date().getFullYear();
  const { data: allEvents = [] } = useEventsQuery({ year: currentYear });
  const womensEvents = allEvents.filter((e) => e?.ministry === "Women's Ministry");

  return (
    <div className="bg-white">
      <Helmet>
        <title>Women's Ministry — Victory Bible Church</title>
        <meta
          name="description"
          content="VBC Women's Ministry: Bible study, prayer, fellowship, mentorship, and annual retreat. A community for women at every stage of life."
        />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <HeroSection
        subtitle="Women's Ministry"
        title="Rooted. Restored. Rising."
        description="A community where women encounter God, build lasting friendships, and grow into all He has called them to be."
        backgroundImage="/assets/hero-bg.jpg"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Ministries", path: "/ministries" },
          { label: "Women's Ministry" },
        ]}
      />

      {/* ── Vision ────────────────────────────────────────────────── */}
      <section className="bg-vbc-section py-28">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — typographic statement */}
          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Our vision</p>
            <h2
              className="font-black text-white leading-[0.88] mb-8"
              style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
            >
              WOMEN<br />
              <span className="text-white/20">OF</span><br />
              STRENGTH.
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              We exist to see women rooted in the Word, restored by the Spirit, and rising into purpose. Whatever season of life you are in — you belong here.
            </p>
          </div>

          {/* Right — scripture */}
          <div className="border-l-2 border-brand-red pl-10">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">Proverbs 31:25</p>
            <div className="space-y-5">
              <p className="text-white text-xl font-light leading-relaxed italic">
                "She is clothed with strength and dignity,
              </p>
              <p className="text-brand-red text-xl font-semibold leading-relaxed">
                and she laughs without fear of the future."
              </p>
              <p className="text-white/50 text-sm leading-relaxed mt-4">
                This is who we are called to be. This is what we pursue together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Do ────────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">What we do</p>
            <h2 className="text-4xl font-black text-gray-900 leading-tight">How we grow together.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100">
            {ACTIVITIES.map(({ num, Icon, title, body }) => (
              <div key={num} className="bg-white px-8 py-10 group relative overflow-hidden">
                <Icon
                  className="absolute -bottom-3 -right-3 text-gray-900 pointer-events-none"
                  style={{ width: "6rem", height: "6rem", opacity: 0.04 }}
                  strokeWidth={1}
                />
                <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">{num}</p>
                <div className="w-8 h-0.5 bg-brand-red mb-5 group-hover:w-14 transition-all duration-300" />
                <h3 className="text-lg font-black text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Image Feature ─────────────────────────────────────────── */}
      <section className="bg-vbc-dark">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[420px] lg:min-h-[560px] overflow-hidden">
            <img
              src="/assets/events/womens-sunday.jpg"
              alt="Women's Ministry gathering"
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-vbc-dark/60 to-transparent" />
          </div>
          <div className="flex flex-col justify-center px-10 lg:px-16 py-16">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Every week</p>
            <h2
              className="font-black text-white leading-[0.9] mb-8"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              WE<br />GATHER.
            </h2>
            <div className="divide-y divide-white/10">
              {SCHEDULE.map(({ day, time, note }) => (
                <div key={day} className="flex items-center justify-between gap-6 py-5 group">
                  <div className="flex items-center gap-4">
                    <div className="w-0.5 h-8 bg-brand-red flex-shrink-0" />
                    <div>
                      <p className="text-white font-bold text-sm leading-tight">{day}</p>
                      <p className="text-white/40 text-xs mt-0.5">{note}</p>
                    </div>
                  </div>
                  <p className="text-white/70 text-lg font-black tracking-tight flex-shrink-0">{time}</p>
                </div>
              ))}
            </div>
            <div className="mt-10">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-white/5 transition-colors"
              >
                View all events <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section className="bg-vbc-section py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">In their words</p>
            <h2 className="text-4xl font-black text-white leading-tight">Stories of transformation.</h2>
          </div>

          {/* Featured */}
          <div className="border-l-4 border-brand-red pl-8 mb-14">
            <p className="text-white text-2xl md:text-3xl font-light italic leading-relaxed mb-6">
              "{TESTIMONIALS[0].quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-0.5 bg-brand-red" />
              <div>
                <p className="text-white text-sm font-semibold">{TESTIMONIALS[0].author}</p>
                <p className="text-white/40 text-xs">{TESTIMONIALS[0].role}</p>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {TESTIMONIALS.slice(1).map((t, i) => (
              <div key={i} className="bg-vbc-section p-8">
                <p className="text-brand-red text-4xl font-black leading-none mb-4 opacity-60">"</p>
                <p className="text-white/70 text-sm leading-relaxed italic mb-6">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-0.5 bg-brand-red" />
                  <div>
                    <p className="text-white text-xs font-semibold">{t.author}</p>
                    <p className="text-white/40 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="bg-vbc-dark py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="lg:sticky lg:top-24 self-start">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Questions</p>
            <h2
              className="font-black text-white leading-[0.9] mb-6"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
            >
              GOOD TO<br />KNOW.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Everything you need to know before you come. Still have questions? Reach us through the contact page.
            </p>
          </div>
          <div className="divide-y divide-white/10">
            {FAQS.map((faq, i) => <FaqItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ───────────────────────────────────────── */}
      {womensEvents.length > 0 && (
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-14">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">What's coming</p>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">Upcoming events.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {womensEvents.slice(0, 6).map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
            <div className="mt-10">
              <Link
                to="/events"
                className="inline-flex items-center gap-2 border border-gray-200 text-gray-900 text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-gray-50 transition-colors"
              >
                View all events <ArrowRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Leadership ────────────────────────────────────────────── */}
      <section className="bg-vbc-section py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Who leads us</p>
            <h2 className="text-4xl font-black text-white leading-tight">Ministry leadership.</h2>
          </div>

          {/* TODO: Replace placeholder names with real leaders */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {[
              { num: "01", role: "Ministry Leader",       name: "To be announced", note: "Overseeing the vision and direction of Women's Ministry" },
              { num: "02", role: "Deputy Leader",         name: "To be announced", note: "Supporting programmes and coordinating ministry teams" },
              { num: "03", role: "Prayer Coordinator",    name: "To be announced", note: "Leading monthly prayer gatherings and intercession teams" },
            ].map(({ num, role, name, note }) => (
              <div key={num} className="bg-vbc-section p-10 relative overflow-hidden group">
                <p
                  className="absolute -bottom-4 -right-2 font-black text-white select-none leading-none pointer-events-none"
                  style={{ fontSize: "clamp(5rem, 8vw, 7rem)", opacity: 0.04 }}
                >
                  {num}
                </p>
                <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">{role}</p>
                <div className="w-8 h-0.5 bg-brand-red mb-5 group-hover:w-14 transition-all duration-300" />
                <h3 className="text-lg font-black text-white mb-3">{name}</h3>
                <p className="text-white/40 text-xs leading-relaxed">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-vbc-dark py-28">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Scripture */}
          <div className="border-l-2 border-brand-red pl-10">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">Ruth 1:16</p>
            <p className="text-white text-2xl md:text-3xl font-light italic leading-relaxed">
              "Where you go I will go, and where you stay I will stay.{" "}
              <span className="text-brand-red font-semibold not-italic">
                Your people will be my people."
              </span>
            </p>
          </div>

          {/* Engagement */}
          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Come as you are</p>
            <h2 className="text-4xl font-black text-white mb-10 leading-tight">You are welcome here.</h2>

            <div className="divide-y divide-white/10">
              {[
                { num: "01", icon: <BookOpenIcon className="h-5 w-5" />, label: "Study",   body: "Join us for our weekly Bible study — no experience necessary, just an open heart." },
                { num: "02", icon: <HeartIcon    className="h-5 w-5" />, label: "Connect", body: "Find your people. Our fellowship is warm, honest, and full of grace." },
                { num: "03", icon: <UsersIcon    className="h-5 w-5" />, label: "Serve",   body: "Discover how your gifts can bless the community and the women around you." },
              ].map(({ num, icon, label, body }) => (
                <div key={num} className="flex items-start gap-5 py-6">
                  <div className="flex-shrink-0 text-brand-red mt-0.5">{icon}</div>
                  <div>
                    <p className="text-white font-bold mb-1">{label}</p>
                    <p className="text-white/40 text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                to="/contact"
                className="inline-block bg-brand-red text-white text-sm font-semibold px-8 py-4 hover:bg-red-700 transition-colors"
              >
                Get in Touch
              </Link>
              <Link
                to="/events"
                className="inline-block border border-white/20 text-white text-sm font-semibold px-8 py-4 hover:bg-white/5 hover:border-white/40 transition-colors"
              >
                View Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WomensMinistry;
