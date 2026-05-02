import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  MicIcon,
  MusicIcon,
  MonitorIcon,
  HeartIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  UsersIcon,
  RadioIcon,
} from "lucide-react";
import HeroSection from "../../components/common/HeroSection";
import { useEventsQuery } from "../../hooks/useEventsQuery";
import EventCard from "../../components/ChurchCalendar/EventsCard";

// ─── Data ────────────────────────────────────────────────────────────────────

const TEAMS = [
  {
    num: "01",
    Icon: MicIcon,
    label: "Vocal Team",
    title: "The Voice",
    body: "Lead vocalists and backing singers who carry the congregation into worship. Tone, blend, and anointing — the words of the song made audible.",
    roles: ["Lead Vocalist", "Backing Vocalist", "Worship Leader"],
  },
  {
    num: "02",
    Icon: MusicIcon,
    label: "The Band",
    title: "The Sound",
    body: "Musicians who serve the song. Guitar, keys, bass, drums, and more — every instrument in its place, creating the sonic space where people meet God.",
    roles: ["Lead Guitar", "Keys / Piano", "Bass Guitar", "Drums", "Rhythm Guitar"],
  },
  {
    num: "03",
    Icon: MonitorIcon,
    label: "Production Team",
    title: "The Craft",
    body: "Sound engineers, projection operators, and visual coordinators. The most faithful servants in the building — no one notices them when they do their job right.",
    roles: ["Sound Engineer", "Monitor Mix", "Projection / Slides", "Lighting"],
  },
];

const RHYTHM = [
  { day: "Thursday",       time: "6:30 PM",  note: "Weekly Rehearsal — full team run-through" },
  { day: "Sunday",         time: "7:30 AM",  note: "Sound Check & Production Setup" },
  { day: "Sunday",         time: "8:30 AM",  note: "Worship Team Prayer & Final Run" },
  { day: "Sunday Service", time: "9:30 AM",  note: "Lead Worship — Main Service" },
];

const OPEN_ROLES = [
  "Lead Vocalist",
  "Backing Vocalist",
  "Worship Leader / Song Director",
  "Lead / Rhythm Guitar",
  "Keyboard / Piano",
  "Bass Guitar",
  "Drums / Percussion",
  "Sound Engineer",
  "Projection & Slides Operator",
  "Lighting Operator",
  "Monitor Mix Engineer",
];

const TESTIMONIALS = [
  {
    quote: "I came to this team as a guitarist. I left my first year as a worshipper. There is a difference. The team helped me understand that what we do on Sunday is not about playing well — it's about leading people somewhere.",
    author: "Mwansa K.",
    role: "Lead Guitarist",
  },
  {
    quote: "People don't see the sound desk but they feel everything that happens there. Being part of the production team showed me that worship has no small roles — only faithful ones.",
    author: "Chipasha M.",
    role: "Sound Engineer",
  },
  {
    quote: "Thursday rehearsals are honestly one of my favourite parts of the week. We pray, we push each other musically, and we laugh a lot. This team became family before I even realised it.",
    author: "Natasha B.",
    role: "Backing Vocalist",
  },
  {
    quote: "I was nervous about the audition. It turned out to be a conversation — they wanted to know my heart, not just hear my voice. That told me everything I needed to know about this team.",
    author: "Daniel P.",
    role: "Worship Leader",
  },
];

const FAQS = [
  {
    q: "Do I need to be an experienced musician to join?",
    a: "Musical skill matters, but it's not the only thing. We are looking for people with a genuine heart for worship and a willingness to grow. We develop talent here — beginners with the right character will find a home.",
  },
  {
    q: "What is the audition process like?",
    a: "It's an informal conversation and a short demonstration of your gift. We want to understand where you are musically and spiritually, and find the right place for you on the team. It is not a competition — it's a conversation.",
  },
  {
    q: "What is the weekly time commitment?",
    a: "Weekly Thursday rehearsal from 6:30 PM, plus Sunday morning from 7:30 AM for sound check and service. Team members are rostered so you won't always be leading every week, but the rehearsal is a commitment for everyone.",
  },
  {
    q: "I'm not a musician — can I still serve in the Praise Ministry?",
    a: "Absolutely. Our production team — sound engineers, projection operators, lighting — are vital to what happens on Sunday. If you have technical skills or are willing to learn, there is a place for you here.",
  },
  {
    q: "Is there training available for new team members?",
    a: "Yes. New members go through an orientation period, work alongside experienced team members, and receive mentorship. We invest in people — your development matters to us, not just your Sunday performance.",
  },
];

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

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

const PraiseMinistry = () => {
  const currentYear = new Date().getFullYear();
  const { data: allEvents = [] } = useEventsQuery({ year: currentYear });
  const praiseEvents = allEvents.filter((e) => e?.ministry === "Praise Ministry");

  return (
    <div className="bg-white">
      <Helmet>
        <title>Praise Ministry — Victory Bible Church</title>
        <meta
          name="description"
          content="VBC Praise Ministry: vocalists, musicians, and production team leading the church in worship every Sunday. Discover how to join."
        />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <HeroSection
        subtitle="Praise Ministry"
        title="Let Everything That Has Breath."
        description="Musicians, vocalists, and technicians — one team, one purpose. To create the space where every person in the room can encounter God."
        backgroundImage="/assets/hero-bg.jpg"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Ministries", path: "/ministries" },
          { label: "Praise Ministry" },
        ]}
      />

      {/* ── Vision ────────────────────────────────────────────────── */}
      <section className="bg-vbc-section py-28">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">What we believe</p>
            <h2
              className="font-black text-white leading-[0.88] mb-8"
              style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
            >
              NOT<br />
              <span className="text-white/20">PERFORM.</span><br />
              WORSHIP.
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              The moment the congregation forgets the team exists and simply worships freely — that is when we have done our job. We are not performers. We are servants with instruments, leading the church to the throne.
            </p>
          </div>

          {/* Psalm 150 — the ministry's own charter */}
          <div className="border-l-2 border-brand-red pl-10">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">Psalm 150</p>
            <div className="space-y-3">
              <p className="text-white/40 text-sm font-light leading-relaxed italic">
                "Praise him with trumpet sound;
              </p>
              <p className="text-white/60 text-sm font-light leading-relaxed italic">
                praise him with lute and harp!
              </p>
              <p className="text-white/40 text-sm font-light leading-relaxed italic">
                Praise him with tambourine and dance;
              </p>
              <p className="text-white/60 text-sm font-light leading-relaxed italic">
                praise him with strings and pipe!
              </p>
              <p className="text-white/40 text-sm font-light leading-relaxed italic">
                Praise him with sounding cymbals;
              </p>
              <p className="text-white/60 text-sm font-light leading-relaxed italic">
                praise him with loud clashing cymbals!
              </p>
              <p className="text-brand-red text-xl font-semibold leading-relaxed pt-3">
                Let everything that has breath praise the Lord."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three Teams ───────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">One ministry, three teams</p>
            <h2 className="text-4xl font-black text-gray-900 leading-tight">Every role matters.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
            {TEAMS.map(({ num, Icon, label, title, body, roles }) => (
              <div key={num} className="bg-white px-8 py-10 group relative overflow-hidden">
                <Icon
                  className="absolute -bottom-3 -right-3 text-gray-900 pointer-events-none"
                  style={{ width: "7rem", height: "7rem", opacity: 0.04 }}
                  strokeWidth={1}
                />
                <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-1">{label}</p>
                <div className="w-8 h-0.5 bg-brand-red mb-5 group-hover:w-14 transition-all duration-300" />
                <h3 className="text-2xl font-black text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{body}</p>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-300 mb-3">Positions</p>
                  <ul className="space-y-1.5">
                    {roles.map((r) => (
                      <li key={r} className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="text-brand-red">—</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Weekly Rhythm ─────────────────────────────────────────── */}
      <section className="bg-vbc-dark py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <div className="lg:sticky lg:top-24 self-start">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Behind the Sunday</p>
            <h2
              className="font-black text-white leading-[0.9] mb-6"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
            >
              THE<br />WEEKLY<br />RHYTHM.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              What looks effortless on Sunday morning is the product of a week's preparation. This is what the commitment looks like.
            </p>
          </div>

          <div className="divide-y divide-white/10">
            {RHYTHM.map(({ day, time, note }) => (
              <div key={`${day}-${time}`} className="flex items-center justify-between gap-6 py-6 group">
                <div className="flex items-center gap-4">
                  <div className="w-0.5 h-10 bg-brand-red flex-shrink-0" />
                  <div>
                    <p className="text-white font-bold text-sm leading-tight">{day}</p>
                    <p className="text-white/40 text-xs mt-0.5">{note}</p>
                  </div>
                </div>
                <p className="text-white/70 text-lg font-black tracking-tight flex-shrink-0">{time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Roles ────────────────────────────────────────────── */}
      <section className="bg-vbc-section py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <div className="lg:sticky lg:top-24 self-start">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">We need you</p>
            <h2
              className="font-black text-white leading-[0.9] mb-6"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
            >
              FIND<br />YOUR<br />INSTRUMENT.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Every position on this list is an act of worship. Not all of them involve a microphone — all of them require a surrendered heart.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5">
            {OPEN_ROLES.map((role, i) => (
              <div key={role} className="bg-vbc-section flex items-center gap-4 px-6 py-5 group hover:bg-white/5 transition-colors">
                <span className="text-brand-red text-xs font-black font-mono flex-shrink-0" style={{ minWidth: "1.8rem" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">From the team</p>
            <h2 className="text-4xl font-black text-gray-900 leading-tight">In their own words.</h2>
          </div>

          {/* Featured */}
          <div className="border-l-4 border-brand-red pl-8 mb-14">
            <p className="text-gray-900 text-2xl md:text-3xl font-light italic leading-relaxed mb-6">
              "{TESTIMONIALS[0].quote}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-0.5 bg-brand-red" />
              <div>
                <p className="text-gray-900 text-sm font-semibold">{TESTIMONIALS[0].author}</p>
                <p className="text-gray-400 text-xs">{TESTIMONIALS[0].role}</p>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
            {TESTIMONIALS.slice(1).map((t, i) => (
              <div key={i} className="bg-white p-8">
                <p className="text-brand-red text-4xl font-black leading-none mb-4 opacity-40">"</p>
                <p className="text-gray-600 text-sm leading-relaxed italic mb-6">{t.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-0.5 bg-brand-red" />
                  <div>
                    <p className="text-gray-900 text-xs font-semibold">{t.author}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
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
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Before you join</p>
            <h2
              className="font-black text-white leading-[0.9] mb-6"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
            >
              GOOD TO<br />KNOW.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Everything to expect before your first Thursday rehearsal. Still have questions? Speak to a team member any Sunday.
            </p>
          </div>
          <div className="divide-y divide-white/10">
            {FAQS.map((faq, i) => <FaqItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ───────────────────────────────────────── */}
      {praiseEvents.length > 0 && (
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-14">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">What's coming</p>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">Upcoming events.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {praiseEvents.slice(0, 6).map((event) => (
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

          {/* TODO: Replace with real leader names when confirmed */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {[
              { num: "01", role: "Worship Director",     name: "To be announced", note: "Overseeing the spiritual and creative direction of all worship at VBC." },
              { num: "02", role: "Choir / Vocal Lead",   name: "To be announced", note: "Leading the vocal team and coordinating song selection and rehearsals." },
              { num: "03", role: "Production Director",  name: "To be announced", note: "Responsible for sound, projection, and the full technical worship experience." },
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

          <div className="border-l-2 border-brand-red pl-10">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">Colossians 3:16</p>
            <p className="text-white text-2xl md:text-3xl font-light italic leading-relaxed">
              "Let the word of Christ dwell in you richly… singing psalms and hymns and spiritual songs,{" "}
              <span className="text-brand-red font-semibold not-italic">
                with thankfulness in your hearts to God."
              </span>
            </p>
          </div>

          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Your next step</p>
            <h2 className="text-4xl font-black text-white mb-10 leading-tight">Bring your gift.<br />Serve the church.</h2>

            <div className="divide-y divide-white/10">
              {[
                { icon: <MicIcon className="h-5 w-5" />,  label: "Express Interest", body: "Let us know what you play or sing. Reach out through the contact page and we will be in touch before the next rehearsal cycle." },
                { icon: <RadioIcon className="h-5 w-5" />, label: "Come to a Rehearsal", body: "Thursday evenings at 6:30 PM. Come and see how the team works before you commit to anything." },
                { icon: <HeartIcon className="h-5 w-5" />, label: "Pray for the Ministry", body: "Intercede for the team, the worship atmosphere, and every person who walks into the sanctuary on Sunday." },
              ].map(({ icon, label, body }) => (
                <div key={label} className="flex items-start gap-5 py-6">
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

export default PraiseMinistry;
