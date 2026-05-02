import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  HeartIcon,
  UsersIcon,
  BookOpenIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CalendarIcon,
  HandshakeIcon,
  HomeIcon,
  StarIcon,
} from "lucide-react";
import HeroSection from "../../components/common/HeroSection";
import { useEventsQuery } from "../../hooks/useEventsQuery";
import EventCard from "../../components/ChurchCalendar/EventsCard";

// ─── Data ────────────────────────────────────────────────────────────────────

const SEASONS = [
  {
    num: "01",
    Icon: HeartIcon,
    season: "Newlyweds",
    range: "0 – 3 Years",
    body: "The first years set the patterns for everything that follows. We walk alongside new couples as they learn the art of becoming one — communication, conflict, and covenant.",
  },
  {
    num: "02",
    Icon: HomeIcon,
    season: "Building Years",
    range: "3 – 15 Years",
    body: "Careers, children, and competing priorities. This is where marriages get tested. We provide the tools, community, and spiritual foundation to keep the marriage central.",
  },
  {
    num: "03",
    Icon: UsersIcon,
    season: "Mid-Marriage",
    range: "15 – 30 Years",
    body: "Children growing up, purposes shifting, identity re-examined. Some of the most transformative growth in a marriage happens here — and this community celebrates that.",
  },
  {
    num: "04",
    Icon: StarIcon,
    season: "Legacy Years",
    range: "30+ Years",
    body: "Marriages that have endured are the most powerful testimony in the church. We invite experienced couples to share what they've learned — and to keep growing.",
  },
];

const PROGRAMMES = [
  {
    num: "01",
    Icon: CalendarIcon,
    title: "Monthly Enrichment Workshops",
    body: "Practical, biblically-grounded sessions on real marriage topics — communication, finances, intimacy, parenting, conflict. Second Friday of each month.",
  },
  {
    num: "02",
    Icon: UsersIcon,
    title: "Couples Fellowship Nights",
    body: "Evenings designed for connection and fun. Dinners, shared experiences, and the kind of laughter that reminds you why community matters.",
  },
  {
    num: "03",
    Icon: HandshakeIcon,
    title: "Marriage Mentoring",
    body: "Intentional pairing of newer couples with experienced ones. Not counselling — friendship across the seasons of marriage, wisdom given freely.",
  },
  {
    num: "04",
    Icon: BookOpenIcon,
    title: "Annual Marriage Retreat",
    body: "A weekend away — just the two of you, in community with others. Rest, teaching, worship, and dedicated time to invest in one another.",
  },
];

const TESTIMONIALS = [
  {
    quote: "We came to the Couples Ministry on the verge of giving up. Three years later, we are mentors ourselves. This community didn't just save our marriage — it showed us what marriage was actually supposed to be.",
    author: "Bwalya & Mutinta N.",
    role: "Members since 2021",
  },
  {
    quote: "The monthly workshops are not fluffy. They get into the real issues. We've had hard conversations because of what we learned here — and our marriage is so much stronger for it.",
    author: "James & Chanda M.",
    role: "Members since 2022",
  },
  {
    quote: "Having a mentor couple who had walked through exactly what we were facing was unlike anything else. They didn't fix us — they sat with us and pointed us to God.",
    author: "Emmanuel & Grace S.",
    role: "Members since 2023",
  },
  {
    quote: "After 22 years of marriage we joined thinking we had nothing to learn. We were wrong. This community gave us language for things we'd felt for decades but never knew how to say.",
    author: "David & Lina K.",
    role: "Members since 2020",
  },
];

const FAQS = [
  {
    q: "Who can join the Couples Ministry?",
    a: "The ministry is open to married couples at every stage — newlyweds, couples raising families, and those who have been married for decades. Engaged couples who want to prepare well are also welcome.",
  },
  {
    q: "What if our marriage is struggling right now?",
    a: "You are exactly who this ministry is for. You don't need to have it together to walk in. We are not a performance space — we are a community that holds space for honest, hard seasons. Come as you are.",
  },
  {
    q: "When do the monthly workshops meet?",
    a: "Workshops are held on the second Friday of each month. Specific topics and times are announced on our events calendar. Childcare is provided — please let us know in advance.",
  },
  {
    q: "How does the mentoring programme work?",
    a: "Newer couples are matched with an experienced mentor couple for a season of intentional friendship and guidance. You meet regularly, share meals, talk through real things. It's not therapy — it's covenant community.",
  },
  {
    q: "Can we become mentors?",
    a: "If you have been married for five or more years and have a heart for investing in others, we would love to talk with you. The mentoring programme works because experienced couples give generously from what they've learned.",
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

const CouplesMinistry = () => {
  const currentYear = new Date().getFullYear();
  const { data: allEvents = [] } = useEventsQuery({ year: currentYear });
  const couplesEvents = allEvents.filter((e) => e?.ministry === "Couples Ministry");

  return (
    <div className="bg-white">
      <Helmet>
        <title>Couples Ministry — Victory Bible Church</title>
        <meta
          name="description"
          content="VBC Couples Ministry: building strong, Christ-centred marriages through enrichment workshops, fellowship, mentoring, and annual retreats."
        />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <HeroSection
        subtitle="Couples Ministry"
        title="Two Are Better Than One."
        description="A community dedicated to building marriages that don't just last — but flourish. Rooted in Scripture, grounded in community, growing together."
        backgroundImage="/assets/hero-bg.jpg"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Ministries", path: "/ministries" },
          { label: "Couples Ministry" },
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
              <span className="text-white/20">SURVIVE.</span><br />
              THRIVE.
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Most couples seek help when things are already breaking. We exist for <em className="text-white/70 not-italic">before</em> the crisis — for investment, enrichment, and intentional growth at every stage of marriage. Strong families start here.
            </p>
          </div>

          <div className="border-l-2 border-brand-red pl-10">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">Ecclesiastes 4:9–12</p>
            <div className="space-y-4">
              <p className="text-white text-xl font-light leading-relaxed italic">
                "Two are better than one, because they have a good return for their labour.
              </p>
              <p className="text-white/60 text-lg font-light leading-relaxed italic">
                If either of them falls down, one can help the other up.
              </p>
              <p className="text-white/60 text-lg font-light leading-relaxed italic">
                But pity anyone who falls and has no one to help them up.
              </p>
              <p className="text-brand-red text-lg font-semibold leading-relaxed">
                A cord of three strands is not quickly broken."
              </p>
            </div>
            <p className="text-white/30 text-xs leading-relaxed mt-6 max-w-xs">
              Two people. God in the centre. That is the cord of three strands — and that is what we build together.
            </p>
          </div>
        </div>
      </section>

      {/* ── Seasons of Marriage ───────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Every season matters</p>
            <h2 className="text-4xl font-black text-gray-900 leading-tight">Wherever you are in the journey.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
            {SEASONS.map(({ num, Icon, season, range, body }) => (
              <div key={num} className="bg-white px-8 py-10 group relative overflow-hidden">
                <Icon
                  className="absolute -bottom-3 -right-3 text-gray-900 pointer-events-none"
                  style={{ width: "6rem", height: "6rem", opacity: 0.04 }}
                  strokeWidth={1}
                />
                <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-1">{range}</p>
                <div className="w-8 h-0.5 bg-brand-red mb-5 group-hover:w-14 transition-all duration-300" />
                <h3 className="text-xl font-black text-gray-900 mb-4">{season}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programmes ────────────────────────────────────────────── */}
      <section className="bg-vbc-dark py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">What we offer</p>
            <h2 className="text-4xl font-black text-white leading-tight">Four ways we invest in you.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {PROGRAMMES.map(({ num, Icon, title, body }) => (
              <div key={num} className="bg-vbc-dark p-10 group relative overflow-hidden">
                <Icon
                  className="absolute -bottom-3 -right-3 text-white pointer-events-none"
                  style={{ width: "7rem", height: "7rem", opacity: 0.04 }}
                  strokeWidth={1}
                />
                <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">{num}</p>
                <div className="w-8 h-0.5 bg-brand-red mb-5 group-hover:w-14 transition-all duration-300" />
                <h3 className="text-xl font-black text-white mb-4">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mentoring ─────────────────────────────────────────────── */}
      <section className="bg-vbc-section py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">The mentoring programme</p>
            <h2
              className="font-black text-white leading-[0.9] mb-8"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              WISDOM<br />PASSED<br />FORWARD.
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-8">
              The best marriage advice doesn't come from a book — it comes from a couple who has actually lived it. Our mentoring programme pairs newer couples with seasoned ones for a season of intentional friendship and honest guidance.
            </p>
            <p className="text-white/30 text-xs leading-relaxed max-w-sm">
              Mentor couples need only two things: at least five years of marriage and a heart for others. We will walk alongside you every step of the way.
            </p>
          </div>

          <div className="space-y-px bg-white/5">
            {[
              { num: "01", side: "Receive",   body: "Newer couples are matched with an experienced mentor couple. You meet regularly, share real life, and grow with someone who's already been where you are." },
              { num: "02", side: "Give",       body: "Experienced couples (5+ years) invest in those earlier in the journey. There is no greater gift you can give a young marriage than the wisdom you've earned." },
              { num: "03", side: "Together",   body: "The whole community benefits. Marriages strengthened by mentoring become marriages that mentor others. The cycle multiplies." },
            ].map(({ num, side, body }) => (
              <div key={num} className="bg-vbc-section px-8 py-8 group">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <p className="text-brand-red text-xs font-black font-mono">{num}</p>
                    <div className="w-0.5 h-8 bg-brand-red mt-2" />
                  </div>
                  <div>
                    <p className="text-white font-black text-base mb-2">{side}</p>
                    <p className="text-white/40 text-sm leading-relaxed">{body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">From couples who've been there</p>
            <h2 className="text-4xl font-black text-gray-900 leading-tight">Marriages changed.</h2>
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
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Before you come</p>
            <h2
              className="font-black text-white leading-[0.9] mb-6"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
            >
              GOOD TO<br />KNOW.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Everything you need before your first workshop. Whatever season your marriage is in — there is a place for you here.
            </p>
          </div>
          <div className="divide-y divide-white/10">
            {FAQS.map((faq, i) => <FaqItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ───────────────────────────────────────── */}
      {couplesEvents.length > 0 && (
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-14">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">What's coming</p>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">Upcoming events.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {couplesEvents.slice(0, 6).map((event) => (
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
              { num: "01", role: "Lead Couple",         name: "To be announced", note: "Overseeing the vision and spiritual direction of the Couples Ministry." },
              { num: "02", role: "Mentoring Coordinators", name: "To be announced", note: "Matching couples and supporting the mentoring programme across all seasons." },
              { num: "03", role: "Events & Fellowship",  name: "To be announced", note: "Planning workshops, fellowship nights, and the annual marriage retreat." },
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
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">Genesis 2:24</p>
            <p className="text-white text-2xl md:text-3xl font-light italic leading-relaxed">
              "A man leaves his father and mother and is united to his wife,{" "}
              <span className="text-brand-red font-semibold not-italic">
                and they become one flesh."
              </span>
            </p>
            <p className="text-white/30 text-sm leading-relaxed mt-8 max-w-xs">
              One flesh is not just a wedding day declaration. It is a lifetime of choosing each other — and we are here to help you do that well.
            </p>
          </div>

          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Your next step</p>
            <h2 className="text-4xl font-black text-white mb-10 leading-tight">Invest in your marriage.</h2>

            <div className="divide-y divide-white/10">
              {[
                { icon: <CalendarIcon className="h-5 w-5" />, label: "Attend a Workshop",  body: "Come to the next monthly enrichment workshop. No registration needed — just bring yourselves and an open heart." },
                { icon: <HandshakeIcon className="h-5 w-5" />, label: "Join the Mentoring Programme", body: "Whether you want to receive mentoring or give it — get in touch and we will find the right match for your season." },
                { icon: <HeartIcon className="h-5 w-5" />,   label: "Get in Touch",         body: "Have questions or want to know more before coming? Reach us through the contact page — we will reply within 24 hours." },
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

export default CouplesMinistry;
