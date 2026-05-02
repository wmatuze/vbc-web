import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  BookOpenIcon,
  HeartIcon,
  MusicIcon,
  ShieldCheckIcon,
  UsersIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon,
  SmileIcon,
} from "lucide-react";
import HeroSection from "../../components/common/HeroSection";
import { useEventsQuery } from "../../hooks/useEventsQuery";
import EventCard from "../../components/ChurchCalendar/EventsCard";

// ─── Data ────────────────────────────────────────────────────────────────────

const SUNDAY_FLOW = [
  { num: "01", label: "Welcome & Check-In",  body: "Parents register children securely. Every child receives a name tag and is handed to a familiar, trusted face — no strangers, ever." },
  { num: "02", label: "Kids' Worship",        body: "Songs they can feel, move to, and sing from memory. Real worship — not entertainment. Children learn that praise is a language anyone can speak." },
  { num: "03", label: "Bible Teaching",       body: "Stories told with drama, props, and creativity. Each lesson is age-appropriate and designed to give them something to carry home and think about all week." },
  { num: "04", label: "Small Groups & Play",  body: "Smaller circles where children ask questions, make crafts, and form friendships. Faith grows in relationship — even at six years old." },
];

const AGE_GROUPS = [
  {
    num: "01",
    range: "0 – 2 years",
    label: "Nursery",
    Icon: HeartIcon,
    body: "A safe, clean, and calm environment while parents worship. Dedicated carers who nurture and protect your youngest children.",
  },
  {
    num: "02",
    range: "2 – 4 years",
    label: "Toddlers",
    Icon: SmileIcon,
    body: "Simple Bible stories, songs, and play. This is where children first hear the name of Jesus and learn that church is a happy place.",
  },
  {
    num: "03",
    range: "5 – 8 years",
    label: "Pre-Primary",
    Icon: StarIcon,
    body: "Interactive Bible lessons, memory verses, and activities that build a biblical foundation during the most formative years.",
  },
  {
    num: "04",
    range: "9 – 12 years",
    label: "Primary",
    Icon: BookOpenIcon,
    body: "Deeper teaching, real questions taken seriously, and a community of peers growing in faith together — ready for youth.",
  },
];

const SAFETY = [
  { num: "01", point: "Secure check-in and check-out — children are only released to their registered guardian." },
  { num: "02", point: "All volunteers are screened and known to church leadership before working with children." },
  { num: "03", point: "Two adults are always present in every classroom — no child is ever alone with one adult." },
  { num: "04", point: "Clean, well-maintained facilities with age-appropriate equipment and supplies." },
];

const TESTIMONIALS = [
  {
    quote: "My daughter came home from Sunday School and taught her little brother the entire lesson at the dinner table. Word for word. I didn't expect that.",
    author: "Bupe M.",
    role: "Parent of Amara (7) and Kofi (4)",
  },
  {
    quote: "We visited once and our boys refused to go anywhere else. They talk about their teachers by name. That trust means everything to us as parents.",
    author: "Tendai & Grace K.",
    role: "Parents of Elijah (9) and Samuel (6)",
  },
  {
    quote: "I love it when we do drama for Bible stories. I was the shepherd with the lost sheep and I still remember what the story means.",
    author: "Tina, age 10",
    role: "Children's Ministry Member",
  },
  {
    quote: "The teachers actually remember my son's name every week. He's noticed, and so have I. These people genuinely care.",
    author: "Monde C.",
    role: "Parent of Joshua (8)",
  },
];

const FAQS = [
  {
    q: "What ages does the Children's Ministry serve?",
    a: "From newborns in the nursery all the way through to age 12 in our Primary class. Each age group has its own dedicated space, teacher, and programme designed for that developmental stage.",
  },
  {
    q: "What does a typical Sunday look like for my child?",
    a: "Children are checked in securely, then move through worship, Bible teaching, and small group activity. The session runs alongside the adult service so parents and children finish at the same time.",
  },
  {
    q: "How do I know my child is safe?",
    a: "Every volunteer is known to leadership before they work with children. We use secure check-in, maintain two-adult policies in every room, and keep our facilities clean and child-safe. Your child's safety is our first responsibility.",
  },
  {
    q: "How can I stay connected to what my child is learning?",
    a: "We send home a summary of the lesson each Sunday so you can continue the conversation at home. We believe faith is built in the family — our Sunday programme is designed to support what happens in your home, not replace it.",
  },
  {
    q: "Can I volunteer even if I have no teaching experience?",
    a: "Absolutely. We have roles for teachers, assistants, check-in helpers, and support staff. What matters most is a love for children and a genuine faith. We will train and support you every step of the way.",
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

const ChildrensMinistry = () => {
  const currentYear = new Date().getFullYear();
  const { data: allEvents = [] } = useEventsQuery({ year: currentYear });
  const childrensEvents = allEvents.filter((e) => e?.ministry === "Children's Ministry");

  return (
    <div className="bg-white">
      <Helmet>
        <title>Children's Ministry — Victory Bible Church</title>
        <meta
          name="description"
          content="VBC Children's Ministry: safe, creative, age-appropriate Bible teaching for children aged 0–12. A place where real faith begins."
        />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <HeroSection
        subtitle="Children's Ministry"
        title="Let the Children Come."
        description="A safe, creative, and joyful space where children encounter God, make lifelong friends, and begin building a faith that will carry them through everything."
        backgroundImage="/assets/hero-bg.jpg"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "Ministries", path: "/ministries" },
          { label: "Children's Ministry" },
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
              NOT THE<br />
              <span className="text-white/20">FUTURE.</span><br />
              THE CHURCH.
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Children aren't sitting in a waiting room until they're old enough for "real" church. They worship, they pray, and they encounter God now — in ways that are genuine, lasting, and theirs. We take that seriously.
            </p>
          </div>

          <div className="border-l-2 border-brand-red pl-10">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">Matthew 19:14</p>
            <div className="space-y-5">
              <p className="text-white text-xl font-light leading-relaxed italic">
                "Jesus said,
              </p>
              <p className="text-brand-red text-2xl font-semibold leading-relaxed">
                'Let the little children come to me and do not hinder them,
              </p>
              <p className="text-white text-xl font-light leading-relaxed italic">
                for to such belongs the kingdom of heaven.'"
              </p>
              <p className="text-white/40 text-sm leading-relaxed mt-4">
                He didn't say "bring them to children's church." He said let them come to Him. Our job is to make sure nothing gets in the way of that.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Sundays Look Like ────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Every Sunday</p>
            <h2 className="text-4xl font-black text-gray-900 leading-tight">What happens in the room.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
            {SUNDAY_FLOW.map(({ num, label, body }) => (
              <div key={num} className="bg-white px-8 py-10 group relative overflow-hidden">
                <p
                  className="absolute -bottom-4 -right-2 font-black text-gray-900 select-none leading-none pointer-events-none"
                  style={{ fontSize: "clamp(6rem, 8vw, 8rem)", opacity: 0.04 }}
                >
                  {num}
                </p>
                <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">{num}</p>
                <div className="w-8 h-0.5 bg-brand-red mb-5 group-hover:w-14 transition-all duration-300" />
                <h3 className="text-base font-black text-gray-900 mb-3">{label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Age Groups ────────────────────────────────────────────── */}
      <section className="bg-vbc-dark py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Every child belongs</p>
            <h2 className="text-4xl font-black text-white leading-tight">Age groups.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {AGE_GROUPS.map(({ num, range, label, Icon, body }) => (
              <div key={num} className="bg-vbc-dark p-10 group relative overflow-hidden">
                <Icon
                  className="absolute -bottom-3 -right-3 text-white pointer-events-none"
                  style={{ width: "6rem", height: "6rem", opacity: 0.04 }}
                  strokeWidth={1}
                />
                <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-1">{range}</p>
                <div className="w-8 h-0.5 bg-brand-red mb-5 group-hover:w-14 transition-all duration-300" />
                <h3 className="text-2xl font-black text-white mb-4">{label}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Safety Promise ────────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <div className="lg:sticky lg:top-24 self-start">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">For every parent</p>
            <h2
              className="font-black text-gray-900 leading-[0.9] mb-6"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
            >
              YOUR<br />CHILD IS<br />SAFE HERE.
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              We take child safety with absolute seriousness. These are not policies on a wall — they are the non-negotiable standard for how we operate every single Sunday.
            </p>
          </div>

          <div>
            {SAFETY.map(({ num, point }) => (
              <div key={num} className="flex items-start gap-6 py-6 border-b border-gray-100 group">
                <div className="flex-shrink-0">
                  <ShieldCheckIcon className="h-5 w-5 text-brand-red mt-0.5" />
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
            <div className="mt-10 bg-gray-50 px-8 py-6 border-l-4 border-brand-red">
              <p className="text-gray-900 font-semibold text-sm mb-1">Have concerns or questions?</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Speak to a team member any Sunday or reach us through the contact page. We will always make time for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────── */}
      <section className="bg-vbc-section py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-14">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">From families</p>
            <h2 className="text-4xl font-black text-white leading-tight">What parents are saying.</h2>
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
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">For parents</p>
            <h2
              className="font-black text-white leading-[0.9] mb-6"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
            >
              YOUR<br />QUESTIONS<br />ANSWERED.
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Everything you need before your child's first Sunday. Still unsure? Come and see for yourself — we welcome visits.
            </p>
          </div>
          <div className="divide-y divide-white/10">
            {FAQS.map((faq, i) => <FaqItem key={i} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ───────────────────────────────────────── */}
      {childrensEvents.length > 0 && (
        <section className="bg-white py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-14">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">What's coming</p>
              <h2 className="text-4xl font-black text-gray-900 leading-tight">Upcoming events.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {childrensEvents.slice(0, 6).map((event) => (
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
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">The team</p>
            <h2 className="text-4xl font-black text-white leading-tight">Ministry leadership.</h2>
          </div>

          {/* TODO: Replace with real leader names when confirmed */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {[
              { num: "01", role: "Ministry Leader",     name: "To be announced", note: "Overseeing the vision, safety, and spiritual direction of all children's programmes." },
              { num: "02", role: "Assistant Leader",    name: "To be announced", note: "Coordinating Sunday sessions, volunteer rosters, and age-group programming." },
              { num: "03", role: "Volunteer Coordinator", name: "To be announced", note: "Recruiting, training, and caring for the team that makes every Sunday possible." },
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

      {/* ── Volunteer CTA ─────────────────────────────────────────── */}
      <section className="bg-vbc-dark py-28">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          <div className="border-l-2 border-brand-red pl-10">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">Psalm 127:3</p>
            <p className="text-white text-2xl md:text-3xl font-light italic leading-relaxed">
              "Behold, children are{" "}
              <span className="text-brand-red font-semibold not-italic">
                a heritage from the Lord, the fruit of the womb a reward."
              </span>
            </p>
          </div>

          <div>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Two ways in</p>
            <h2 className="text-4xl font-black text-white mb-10 leading-tight">Bring your child.<br />Become a volunteer.</h2>

            <div className="divide-y divide-white/10">
              {[
                {
                  num: "01",
                  icon: <UsersIcon className="h-5 w-5" />,
                  label: "Bring Your Child",
                  body: "Join us any Sunday morning. Come a few minutes early to check in and meet the team. Your child will be welcomed before you've finished introducing yourself.",
                },
                {
                  num: "02",
                  icon: <HeartIcon className="h-5 w-5" />,
                  label: "Volunteer",
                  body: "You don't need a degree in theology. You need a love for children and a willing heart. We'll train you, support you, and put you somewhere you'll thrive.",
                },
                {
                  num: "03",
                  icon: <MusicIcon className="h-5 w-5" />,
                  label: "Pray for Us",
                  body: "The most important work in this ministry happens on your knees. Pray for the children, the teachers, and the seeds being planted every Sunday.",
                },
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

export default ChildrensMinistry;
