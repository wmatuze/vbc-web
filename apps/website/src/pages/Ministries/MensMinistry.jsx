import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  BookOpenIcon,
  UsersIcon,
  HeartIcon,
  ShieldIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HandshakeIcon,
  MicIcon,
  LayersIcon,
} from "lucide-react";
import HeroSection from "../../components/common/HeroSection";
import { useEventsQuery } from "../../hooks/useEventsQuery";
import EventCard from "../../components/ChurchCalendar/EventsCard";

// ─── Data ────────────────────────────────────────────────────────────────────

const PILLARS = [
  {
    num: "01",
    Icon: BookOpenIcon,
    title: "Discipleship",
    body: "Small groups built around Scripture — where men grow in faith, hold each other accountable, and pursue Christlikeness together.",
  },
  {
    num: "02",
    Icon: UsersIcon,
    title: "Fellowship",
    body: "Monthly gatherings that build brotherhood. Men who sharpen one another, share life, and refuse to walk the journey alone.",
  },
  {
    num: "03",
    Icon: HandshakeIcon,
    title: "Service",
    body: "Faith that works. From outreach to hospitality to community support — we find the place where our hands match God's call.",
  },
  {
    num: "04",
    Icon: ShieldIcon,
    title: "Leadership",
    body: "Raising godly men who lead their families, their workplaces, and their communities with integrity, conviction, and grace.",
  },
];

const SERVICE_AREAS = [
  "Outreach",
  "Prayer & Intercession",
  "Worship Team (Choir)",
  "Media, Communication & Marketing",
  "Finances & Fund-raising",
  "Events Planning & Decorations",
  "Hospitality",
  "Care & Compassion",
  "Visitation & Follow-up",
  "Capacity Building & Empowerment",
  "Protocol",
];

const EVENTS_GRID = [
  { num: "01", label: "Monthly Meetings",   scope: "Every Month",        body: "Our core gathering — for fellowship, accountability, and growing together in the Word." },
  { num: "02", label: "Men's Ministry Day", scope: "Father's Day · June", body: "Our annual celebration observed on Father's Day — honouring men, affirming calling, and strengthening resolve." },
  { num: "03", label: "Seminars & Retreats",scope: "As Scheduled",       body: "Invested development of godly men through focused teaching, rest, and intentional brotherhood." },
];

const TESTIMONIALS = [
  {
    quote: "The Men's Ministry gave me brothers who could speak truth to my face and pray for me in the same breath. That kind of accountability changed how I lead my family.",
    author: "Chanda M.",
    role: "Member since 2020",
  },
  {
    quote: "I joined not knowing what to expect. I left my first meeting knowing these were men who took their faith seriously. I haven't missed a gathering since.",
    author: "Emmanuel S.",
    role: "Member since 2022",
  },
  {
    quote: "Serving through the Men's Ministry in outreach reminded me that faith is never passive. We are called to go — and this ministry gave me somewhere to go.",
    author: "Isaac B.",
    role: "Member since 2019",
  },
  {
    quote: "The small group has been the most spiritually formative experience of my adult life. Iron sharpening iron — exactly what the Scripture promises.",
    author: "Mwansa K.",
    role: "Member since 2021",
  },
];

const FAQS = [
  {
    q: "Who can join the Men's Ministry?",
    a: "Membership is open to all men — those who are members of Victory Bible Church and those from the wider community who share the church's vision. Whether your faith is deep-rooted or still taking shape, you are welcome.",
  },
  {
    q: "When do you meet?",
    a: "Meetings are held monthly. Our annual Men's Ministry Day is observed on Father's Day in June. Seminars and retreats are organised throughout the year as they are scheduled — check the events calendar for upcoming dates.",
  },
  {
    q: "What are small groups and how do I join one?",
    a: "Small groups are the heartbeat of the Men's Ministry — smaller, more intimate gatherings built around discipleship, relationship, and accountability. Speak to one of our leaders after a meeting to be placed in a group.",
  },
  {
    q: "What if I cannot attend in person?",
    a: "We make provision for associate members — those who support the ministry but cannot attend due to work, physical constraints, or other justifiable reasons. We will find a way to keep you connected.",
  },
  {
    q: "How do I find a place to serve?",
    a: "We have eleven defined service areas — from prayer and outreach to media, hospitality, and protocol. During your first few meetings you will have the opportunity to indicate where your gifts and interests align.",
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

const MensMinistry = () => {
  const currentYear = new Date().getFullYear();
  const { data: allEvents = [] } = useEventsQuery({ year: currentYear });
  const mensEvents = allEvents.filter((e) => e?.ministry === "Men's Ministry");

  return (
    <div className="bg-white">
      <Helmet>
        <title>Men's Ministry — Victory Bible Church</title>
        <meta
          name="description"
          content="VBC Men's Ministry: discipleship, brotherhood, and service. Monthly gatherings, small groups, and annual events for men of all ages."
        />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <HeroSection
        subtitle="Men's Ministry"
        title="Iron Sharpens Iron."
        description="A brotherhood built on Scripture, accountability, and service. Men discovering their ministry and rising into it — together."
        backgroundImage="/assets/hero-bg.jpg"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Ministries", path: "/ministries" },
          { label: "Men's Ministry" },
        ]}
      />

      {/* ── Vision ────────────────────────────────────────────────── */}
      <section className="bg-vbc-section py-28">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Our purpose</p>
            <h2
              className="font-black text-white leading-[0.88] mb-8"
              style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
            >
              DISCOVER.<br />
              <span className="text-white/20">PREPARE.</span><br />
              SERVE.
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              We exist to motivate men to discover their God-given ministry, prepare them for it, and provide every opportunity to live it out — for the church, the family, and the world around us.
            </p>
          </div>

          <div className="border-l-2 border-brand-red pl-10">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">Hebrews 10:24–25</p>
            <div className="space-y-5">
              <p className="text-white text-xl font-light leading-relaxed italic">
                "And let us consider how to stir up one another to love and good works,
              </p>
              <p className="text-white/60 text-lg font-light leading-relaxed italic">
                not neglecting to meet together, as is the habit of some, but encouraging one another,
              </p>
              <p className="text-brand-red text-lg font-semibold leading-relaxed">
                and all the more as you see the Day drawing near."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Four Pillars ──────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">How we grow</p>
            <h2 className="text-4xl font-black text-gray-900 leading-tight">Built on four pillars.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
            {PILLARS.map(({ num, Icon, title, body }) => (
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

      {/* ── Events & Gatherings ───────────────────────────────────── */}
      <section className="bg-vbc-dark py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">When we meet</p>
            <h2 className="text-4xl font-black text-white leading-tight">Gatherings & events.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {EVENTS_GRID.map(({ num, label, scope, body }) => (
              <div key={num} className="bg-vbc-dark px-8 py-10 group relative overflow-hidden">
                <p
                  className="absolute -bottom-4 -right-2 font-black text-white select-none leading-none pointer-events-none"
                  style={{ fontSize: "clamp(6rem, 10vw, 9rem)", opacity: 0.04 }}
                >
                  {num}
                </p>
                <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-1">{scope}</p>
                <h3 className="text-2xl font-black text-white mb-4">{label}</h3>
                <div className="w-8 h-0.5 bg-brand-red mb-5 group-hover:w-14 transition-all duration-300" />
                <p className="text-white/50 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Where to Serve ────────────────────────────────────────── */}
      <section className="bg-vbc-section py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <div className="lg:sticky lg:top-24 self-start">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Put faith to work</p>
            <h2
              className="font-black text-white leading-[0.9] mb-6"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
            >
              FIND<br />YOUR<br />PLACE.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              We have identified eleven areas where men can serve — matching gifts, skills, and calling with real ministry need. Every man has a place here.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5">
            {SERVICE_AREAS.map((area, i) => (
              <div key={area} className="bg-vbc-section flex items-center gap-4 px-6 py-5 group hover:bg-white/5 transition-colors">
                <span
                  className="text-brand-red text-xs font-black font-mono flex-shrink-0"
                  style={{ minWidth: "1.8rem" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">In their words</p>
            <h2 className="text-4xl font-black text-gray-900 leading-tight">Men transformed.</h2>
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
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Questions</p>
            <h2
              className="font-black text-white leading-[0.9] mb-6"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
            >
              GOOD TO<br />KNOW.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              What you need before your first meeting. Still unsure? Just show up — our team will take care of the rest.
            </p>
          </div>
          <div className="divide-y divide-white/10">
            {FAQS.map((faq, i) => <FaqItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ───────────────────────────────────────── */}
      {mensEvents.length > 0 && (
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-14">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">What's coming</p>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">Upcoming events.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mensEvents.slice(0, 6).map((event) => (
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
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Executive Council</p>
            <h2 className="text-4xl font-black text-white leading-tight">Ministry leadership.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {[
              { num: "01", role: "Chairman / Director",  name: "Elder Knight Kabaso",   note: "Oversees the ministry vision and appoints Small Group Leaders — appointed by the Senior Pastor." },
              { num: "02", role: "Treasurer",             name: "Deacon Aongola Sooli",  note: "Responsible for the ministry's finances and stewardship of resources." },
              { num: "03", role: "Secretary",             name: "To be announced",       note: "Supporting the Executive Council with administration and ministry coordination." },
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
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">Proverbs 27:17</p>
            <p className="text-white text-2xl md:text-3xl font-light italic leading-relaxed">
              "As iron sharpens iron,{" "}
              <span className="text-brand-red font-semibold not-italic">
                so one person sharpens another."
              </span>
            </p>
          </div>

          {/* Engagement */}
          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Get involved</p>
            <h2 className="text-4xl font-black text-white mb-10 leading-tight">Join the brotherhood.</h2>

            <div className="divide-y divide-white/10">
              {[
                { num: "01", icon: <UsersIcon className="h-5 w-5" />,  label: "Show Up",  body: "Come to the next monthly meeting. No registration required — just walk in and be welcomed." },
                { num: "02", icon: <LayersIcon className="h-5 w-5" />, label: "Go Deep",  body: "Get placed in a small group where real discipleship and accountability happen." },
                { num: "03", icon: <MicIcon className="h-5 w-5" />,   label: "Step Up",  body: "Find your service area and put your faith into visible, tangible action." },
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

export default MensMinistry;
