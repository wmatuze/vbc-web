import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  HandshakeIcon,
  GlobeIcon,
  UsersIcon,
  BuildingIcon,
  ArrowRightIcon,
  HeartIcon,
} from "lucide-react";
import HeroSection from "../components/common/HeroSection";

// ─── Data ────────────────────────────────────────────────────────────────────

const AREAS = [
  {
    num: "01",
    Icon: HandshakeIcon,
    title: "Local Community Outreach",
    body: "Food distribution, shelter support, after-school tutoring, and emergency assistance for families in crisis — meeting immediate needs while sharing the love of Christ.",
    help: [
      "Volunteer at monthly food drives",
      "Donate non-perishable food items",
      "Contribute to the emergency assistance fund",
      "Mentor youth in after-school programmes",
    ],
  },
  {
    num: "02",
    Icon: GlobeIcon,
    title: "Global Missions",
    body: "Short-term mission teams, long-term missionary support, and humanitarian aid in regions where the Gospel is needed most. We send. We sustain.",
    help: [
      "Join a short-term mission trip",
      "Sponsor a missionary",
      "Participate in our prayer team",
      "Give to specific global projects",
    ],
  },
  {
    num: "03",
    Icon: UsersIcon,
    title: "Youth Empowerment",
    body: "Mentorship, biblical training, and practical leadership experiences for the next generation. We invest in young people and give them room to lead.",
    help: [
      "Mentor a young person",
      "Volunteer with youth programmes",
      "Sponsor a youth for leadership training",
      "Provide internship opportunities",
    ],
  },
  {
    num: "04",
    Icon: BuildingIcon,
    title: "Church Planting",
    body: "Identifying, training, and supporting church planters to establish new congregations. Resources, mentorship, and funding to help new churches become self-sustaining.",
    help: [
      "Join a church planting team",
      "Provide financial support for new churches",
      "Offer professional skills (legal, accounting)",
      "Pray for planters and new congregations",
    ],
  },
];

const TESTIMONIALS = [
  {
    quote: "Serving alongside fellow believers to meet needs in our own community has strengthened my faith and given me a deeper understanding of Christ's love in action.",
    author: "Watu M.",
    role: "Local Outreach Volunteer",
  },
  {
    quote: "Our mission trip to East Africa was transformative. We helped build a school and witnessed several people come to Christ. The relationships we formed continue to this day.",
    author: "Sarah J.",
    role: "Global Missions Team",
  },
  {
    quote: "Being mentored through the youth empowerment programme gave me confidence in my faith. Now I'm a youth leader myself, passing on what I've learned.",
    author: "Michael T.",
    role: "Youth Leader",
  },
  {
    quote: "Seeing a new congregation form and grow, reaching people who might never have entered a traditional church — it reminds me of the early church in Acts.",
    author: "Rebecca L.",
    role: "Church Planting Supporter",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

const Missions = () => (
  <div className="bg-white">
    <Helmet>
      <title>Missions — Victory Bible Church</title>
      <meta
        name="description"
        content="Victory Bible Church missions: local outreach, global evangelism, youth empowerment, and church planting. Discover how to get involved."
      />
    </Helmet>

    {/* ── Hero ──────────────────────────────────────────────────── */}
    <HeroSection
      subtitle="Missions"
      title="Sent to the World"
      description="Spreading the love of Christ through outreach, church planting, and humanitarian efforts — locally and around the world."
      backgroundImage="/assets/hero-bg.jpg"
      breadcrumbs={[{ label: "Home", path: "/" }, { label: "Missions" }]}
    />

    {/* ── The Call ──────────────────────────────────────────────── */}
    <section className="bg-vbc-section py-28">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left — typographic statement */}
        <div>
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Our mandate</p>
          <h2
            className="font-black text-white leading-[0.88] mb-8"
            style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}
          >
            GO.<br />
            <span className="text-white/20">MAKE.</span><br />
            DISCIPLES.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm">
            The Great Commission is not a suggestion — it is the organizing principle of everything we do as a church. It shapes our priorities and drives our decisions, from Kitwe to the ends of the earth.
          </p>
        </div>

        {/* Right — scripture as typographic beats */}
        <div className="border-l-2 border-brand-red pl-10">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">Matthew 28:19–20</p>
          <div className="space-y-5">
            <p className="text-white text-xl font-light leading-relaxed italic">
              "Go therefore and make disciples of all nations,
            </p>
            <p className="text-white/60 text-lg font-light leading-relaxed italic">
              baptizing them in the name of the Father and of the Son and of the Holy Spirit,
            </p>
            <p className="text-white text-xl font-light leading-relaxed italic">
              teaching them to observe all that I have commanded you.
            </p>
            <p className="text-brand-red text-lg font-semibold leading-relaxed">
              And behold, I am with you always, to the end of the age."
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* ── Our Reach — Acts 1:8 Strategy ────────────────────────── */}
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Acts 1:8 Strategy</p>
          <h2 className="text-4xl font-black text-gray-900 leading-tight">How we reach the world.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100">
          {[
            { num: "01", label: "Jerusalem", scope: "Our City", body: "We begin where we are. Kitwe is our Jerusalem — meeting needs, sharing the Gospel, and building community right here at home." },
            { num: "02", label: "Judea & Samaria", scope: "Our Region", body: "Extending into Zambia and neighbouring nations, partnering with regional churches and organisations to multiply our impact." },
            { num: "03", label: "Ends of the Earth", scope: "The World", body: "Short-term teams, long-term missionaries, and financial support reaching nations where the Gospel is most needed." },
          ].map(({ num, label, scope, body }) => (
            <div key={num} className="bg-white px-8 py-10 group relative overflow-hidden">
              <p
                className="absolute -bottom-4 -right-2 font-black text-gray-900 select-none leading-none pointer-events-none"
                style={{ fontSize: "clamp(6rem, 10vw, 9rem)", opacity: 0.04 }}
              >
                {num}
              </p>
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-1">{scope}</p>
              <h3 className="text-2xl font-black text-gray-900 mb-4">{label}</h3>
              <div className="w-8 h-0.5 bg-brand-red mb-5 group-hover:w-14 transition-all duration-300" />
              <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Mission Areas ─────────────────────────────────────────── */}
    <section className="bg-vbc-dark py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">What we do</p>
          <h2 className="text-4xl font-black text-white leading-tight">Mission areas.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
          {AREAS.map(({ num, Icon, title, body, help }) => (
            <div key={num} className="bg-vbc-dark p-10 relative overflow-hidden group">
              {/* Ghost icon */}
              <Icon
                className="absolute -bottom-4 -right-4 text-white pointer-events-none"
                style={{ width: "8rem", height: "8rem", opacity: 0.04 }}
                strokeWidth={1}
              />
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-2">{num}</p>
              <div className="w-8 h-0.5 bg-brand-red mb-5 group-hover:w-14 transition-all duration-300" />
              <h3 className="text-xl font-black text-white mb-4">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6">{body}</p>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/30 mb-3">How to help</p>
                <ul className="space-y-1.5">
                  {help.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-white/50">
                      <span className="text-brand-red mt-0.5 flex-shrink-0">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Stories from the Field ────────────────────────────────── */}
    <section className="bg-vbc-section py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-14">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Testimonies</p>
          <h2 className="text-4xl font-black text-white leading-tight">Stories from the field.</h2>
        </div>

        {/* Featured quote */}
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

        {/* Other testimonials */}
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

    {/* ── Join the Mission ──────────────────────────────────────── */}
    <section className="bg-vbc-dark py-28">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* Scripture */}
        <div className="border-l-2 border-brand-red pl-10">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-6">Romans 10:15</p>
          <p className="text-white text-2xl md:text-3xl font-light italic leading-relaxed">
            "And how are they to preach unless they are sent? As it is written,{" "}
            <span className="text-brand-red font-semibold not-italic">
              'How beautiful are the feet of those who preach the good news!'"
            </span>
          </p>
        </div>

        {/* Engagement */}
        <div>
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Get involved</p>
          <h2 className="text-4xl font-black text-white mb-10 leading-tight">Join the mission.</h2>

          <div className="divide-y divide-white/10">
            {[
              { num: "01", icon: <HeartIcon className="h-5 w-5" />, label: "Pray", body: "Intercede for our missionaries, church planters, and the nations we're reaching." },
              { num: "02", icon: <ArrowRightIcon className="h-5 w-5" />, label: "Give",  body: "Support missionaries, fund trips, and resource new churches with your generosity." },
              { num: "03", icon: <UsersIcon className="h-5 w-5" />,    label: "Go",   body: "Join a short-term mission team or explore a long-term calling." },
            ].map(({ num, icon, label, body }) => (
              <div key={num} className="flex items-start gap-5 py-6 group">
                <div className="flex-shrink-0 text-brand-red mt-0.5">{icon}</div>
                <div>
                  <p className="text-white font-bold mb-1">{label}</p>
                  <p className="text-white/40 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link to="/contact"
              className="inline-block bg-brand-red text-white text-sm font-semibold px-8 py-4 hover:bg-red-700 transition-colors">
              Get in Touch
            </Link>
            <Link to="/foundation-classes"
              className="inline-block border border-white/20 text-white text-sm font-semibold px-8 py-4 hover:bg-white/5 hover:border-white/40 transition-colors">
              Start Foundation Classes
            </Link>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Missions;
