import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronDown, ArrowRight } from "lucide-react";
import {
  CalendarDaysIcon,
  MapPinIcon,
  UsersIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

import { useEventsQuery } from "../../hooks/useEventsQuery";
import EventCard from "../../components/ChurchCalendar/EventsCard";

import litNationLogo from "../../assets/images/litnationlogo.png";
import cbuLogo       from "../../assets/images/cbu-logo.png";
import youthGallery1 from "../../assets/images/youth/gallery1.jpg";
import youthGallery2 from "../../assets/images/youth/gallery2.jpg";
import youthGallery3 from "../../assets/images/youth/gallery3.jpg";

// ─── Static data ──────────────────────────────────────────────────────────────

const TABS = [
  { id: "main",    label: "About Lit Nation" },
  { id: "cbu",     label: "CBU Fellowship"   },
  { id: "gallery", label: "Photo Gallery"    },
  { id: "events",  label: "Upcoming Events"  },
  { id: "leaders", label: "Leadership Team"  },
];

const VALUES = [
  { num: "01", title: "Passion",   body: "Living with fire for God and His purposes — unashamed and all-in." },
  { num: "02", title: "Community", body: "Building authentic relationships that go beyond Sunday." },
  { num: "03", title: "Growth",    body: "Constantly developing in faith, character, and calling." },
  { num: "04", title: "Impact",    body: "Making a difference right where we are — in our schools, homes, and city." },
];

const SCHEDULE = [
  { name: "Friday Night Live",   time: "6:30 PM",    day: "Every Friday",    venue: "Main Sanctuary",     note: "Worship · Teaching · Games · Community" },
  { name: "Sunday Youth Class",  time: "9:30 AM",    day: "Every Sunday",    venue: "Youth Room",         note: "Biblical grounding for the week ahead" },
  { name: "Discipleship Groups", time: "4:00 PM",    day: "Wednesdays",      venue: "Various Locations",  note: "Small-group faith conversations" },
];

const TESTIMONIALS = [
  { quote: "Lit Nation is my second family. The friends I've made and the spiritual growth I've experienced have changed my life.", author: "Alex J.", role: "Member since 2021 · Age 17" },
  { quote: "I love how our youth group makes the Bible relevant to our everyday lives. The leaders really understand what we're going through.", author: "Sophia W.", role: "Member since 2022 · Age 16" },
  { quote: "The worship sessions and retreats have helped me build a personal relationship with God. I've never felt more connected to my faith.", author: "Nathan T.", role: "Member since 2020 · Age 19" },
];

const FAQS = [
  { q: "What ages does Lit Nation serve?", a: "Lit Nation welcomes youth ages 13–25. We have programmes tailored for middle school (13–14), high school (15–18), and young adults (19–25)." },
  { q: "When and where do you meet?", a: "Every Friday at 6:30 PM in the Main Sanctuary for our main service. Sunday youth classes at 9:30 AM, and small discipleship groups on Wednesdays at 4:00 PM." },
  { q: "Do I need to be a church member?", a: "Not at all. Everyone is welcome at Lit Nation. Many attendees aren't formal members. Come as you are!" },
  { q: "What happens at a Friday night service?", a: "Dynamic worship, relevant teaching, interactive activities, small group discussions, and time to build friendships. First-time visitors are welcomed but never put on the spot." },
];

const ANNUAL_CALENDAR = [
  { month: "Jan", event: "Youth Vision Retreat",   date: "Jan 15–17" },
  { month: "Mar", event: "Spring Break Mission",    date: "Mar 20–27" },
  { month: "May", event: "Graduate Recognition",   date: "May 22"    },
  { month: "Jun", event: "Summer Camp",             date: "Jun 15–21" },
  { month: "Aug", event: "Back to School Rally",   date: "Aug 28"    },
  { month: "Oct", event: "Fall Youth Conference",  date: "Oct 8–10"  },
  { month: "Dec", event: "Christmas Celebration",  date: "Dec 17"    },
];

const LEADERS = [
  { name: "Youth Leader",       title: "Youth Pastor",              bio: "Passionate about helping young people discover their purpose and grow in faith." },
  { name: "Assistant Leader",   title: "Assistant Youth Leader",    bio: "Creative and energetic leader dedicated to building authentic community." },
  { name: "CBU Coordinator",    title: "CBU Fellowship Coordinator",bio: "Connects church and campus life for university students with understanding and vision." },
];

const CBU_TESTIMONIALS = [
  { quote: "Finding this church while at CBU has been life-changing. I've grown spiritually and made lifelong friends.", author: "James C.", program: "Computer Science" },
  { quote: "The CBU Fellowship helped me stay grounded during exam stress. It's been my anchor.", author: "Mercy N.", program: "Engineering" },
  { quote: "I appreciate the mentorship programme that connected me with professionals who share my faith.", author: "Thomas M.", program: "Business Administration" },
];

// ─────────────────────────────────────────────────────────────────────────────

const YouthMinistry = () => {
  const [activeTab,    setActiveTab]    = useState("main");
  const [openFaq,      setOpenFaq]      = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: events = [] } = useEventsQuery({ year: new Date().getFullYear() });

  const youthEvents = events.filter(
    (e) => e?.ministry === "Youth Ministry" || e?.ministry === "CBU Fellowship",
  );

  const gallery = [
    { src: youthGallery1, caption: "Worship Night 2024" },
    { src: youthGallery2, caption: "Summer Retreat"     },
    { src: youthGallery3, caption: "Community Outreach" },
  ];

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((p) => (p + 1) % gallery.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-white">
      <Helmet>
        <title>Lit Nation Youth Ministry — Victory Bible Church</title>
        <meta name="description" content="Lit Nation — Victory Bible Church's dynamic youth ministry for ages 13–25. Meet every Friday at 6:30 PM." />
      </Helmet>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/assets/hero-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-vbc-dark/80" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
          {/* Logo */}
          <div className="mb-8">
            <img src={litNationLogo} alt="Lit Nation" className="h-24 w-auto mx-auto" onError={(e) => { e.target.style.display = "none"; }} />
          </div>

          {/* Eyebrow */}
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.3em] mb-4">
            Victory Bible Church · Youth Ministry
          </p>

          {/* Title */}
          <h1
            className="font-black text-white leading-[0.88] mb-6"
            style={{ fontSize: "clamp(4rem, 14vw, 10rem)" }}
          >
            LIT NATION
          </h1>

          <p className="text-white/60 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            A vibrant community where youth experience faith, friendship, and purpose — every Friday at 6:30 PM.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => { setActiveTab("main"); document.getElementById("tab-content")?.scrollIntoView({ behavior: "smooth" }); }}
              className="bg-brand-red text-white text-sm font-semibold px-8 py-4 hover:bg-red-700 transition-colors"
            >
              Join Lit Nation
            </button>
            <Link to="/contact"
              className="border border-white/20 text-white text-sm font-semibold px-8 py-4 hover:bg-white/5 transition-colors">
              Get in Touch
            </Link>
          </div>

          {/* Quick facts strip */}
          <div className="mt-16 grid grid-cols-3 gap-px bg-white/10 max-w-xl mx-auto">
            {[["Friday", "Night Live"], ["6:30", "PM"], ["Ages", "13 – 25"]].map(([top, bot]) => (
              <div key={top} className="bg-vbc-dark/60 py-5 px-4 text-center">
                <p className="text-white font-black text-xl">{top}</p>
                <p className="text-white/40 text-xs uppercase tracking-wider">{bot}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TAB NAV ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); document.getElementById("tab-content")?.scrollIntoView({ behavior: "smooth" }); }}
                className={`flex-shrink-0 px-5 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-brand-red text-brand-red"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB CONTENT ─────────────────────────────────────────── */}
      <div id="tab-content">

        {/* ════════════════════════════════════════════════════════
            TAB 1 — ABOUT LIT NATION
        ════════════════════════════════════════════════════════ */}
        {activeTab === "main" && (
          <div>
            {/* Intro — dark */}
            <section className="bg-vbc-section py-24">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Who we are</p>
                  <h2
                    className="font-black text-white leading-[0.9] mb-6"
                    style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
                  >
                    More than<br />
                    <span className="text-white/25">a youth</span><br />
                    group.
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                    Lit Nation is where teenagers and young adults come alive in their faith. We create space to experience God's presence, build authentic friendships, and discover real purpose.
                  </p>
                </div>

                {/* Schedule */}
                <div className="divide-y divide-white/10">
                  {SCHEDULE.map(({ name, time, day, venue, note }) => (
                    <div key={name} className="flex items-center justify-between gap-6 py-5 group">
                      <div className="flex items-start gap-4">
                        <div className="w-0.5 h-12 bg-brand-red flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-bold text-sm">{name}</p>
                          <p className="text-white/40 text-xs mt-0.5">{day} · {venue}</p>
                          <p className="text-white/30 text-xs mt-0.5 italic">{note}</p>
                        </div>
                      </div>
                      <p className="text-white font-black text-lg flex-shrink-0">{time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Core values — light */}
            <section className="bg-white py-24">
              <div className="max-w-7xl mx-auto px-6">
                <div className="mb-14">
                  <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">What drives us</p>
                  <h2 className="text-4xl font-black text-gray-900">Core values.</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100">
                  {VALUES.map(({ num, title, body }) => (
                    <div key={num} className="bg-white px-8 py-10 relative overflow-hidden group">
                      <p
                        className="absolute -top-3 -right-1 font-black text-gray-900 select-none leading-none pointer-events-none"
                        style={{ fontSize: "clamp(5rem, 8vw, 7rem)", opacity: 0.04 }}
                      >
                        {num}
                      </p>
                      <div className="w-8 h-0.5 bg-brand-red mb-5 group-hover:w-14 transition-all duration-300" />
                      <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">{num}</p>
                      <h3 className="text-xl font-black text-gray-900 mb-3">{title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials — dark */}
            <section className="bg-vbc-section py-24">
              <div className="max-w-7xl mx-auto px-6">
                <div className="mb-14">
                  <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Youth voices</p>
                  <h2 className="text-4xl font-black text-white">What they're saying.</h2>
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

                {/* Others */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
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

            {/* FAQ — light */}
            <section className="bg-white py-24">
              <div className="max-w-4xl mx-auto px-6">
                <div className="mb-14">
                  <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Got questions?</p>
                  <h2 className="text-4xl font-black text-gray-900">Frequently asked.</h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {FAQS.map((faq, i) => (
                    <div key={i}>
                      <button
                        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      >
                        <span className="text-base font-semibold text-gray-900 group-hover:text-brand-red transition-colors">
                          {faq.q}
                        </span>
                        <ChevronDown className={`h-4 w-4 flex-shrink-0 text-brand-red transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
                      </button>
                      {openFaq === i && (
                        <p className="pb-6 text-gray-500 text-sm leading-relaxed -mt-2">{faq.a}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA — dark */}
            <section id="join-us" className="bg-vbc-dark py-28">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/5">
                {[
                  { Icon: CalendarDaysIcon, label: "When", value: "Every Friday",  sub: "6:30 PM" },
                  { Icon: MapPinIcon,        label: "Where", value: "Main Sanctuary", sub: "Victory Bible Church" },
                  { Icon: UsersIcon,         label: "Who",   value: "Ages 13 – 25", sub: "All are welcome" },
                ].map(({ Icon, label, value, sub }) => (
                  <div key={label} className="bg-vbc-dark px-10 py-12 text-center">
                    <Icon className="h-6 w-6 text-brand-red mx-auto mb-4" />
                    <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-white text-2xl font-black mb-1">{value}</p>
                    <p className="text-white/40 text-xs">{sub}</p>
                  </div>
                ))}
              </div>
              <div className="text-center mt-16">
                <Link to="/contact"
                  className="inline-flex items-center gap-2 bg-brand-red text-white text-sm font-semibold px-10 py-4 hover:bg-red-700 transition-colors">
                  Contact Us For More Info <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB 2 — CBU FELLOWSHIP
        ════════════════════════════════════════════════════════ */}
        {activeTab === "cbu" && (
          <div className="py-16 max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-4 mb-10">
              <img src={cbuLogo} alt="CBU" className="h-10 w-auto" onError={(e) => { e.target.style.display = "none"; }} />
              <div>
                <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em]">On Campus</p>
                <h2 className="text-3xl font-black text-gray-900">CBU Student Fellowship</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 space-y-6 text-gray-600 text-base leading-relaxed">
                <p>We're proud to host a thriving fellowship specifically for Copperbelt University students. Located just minutes from campus, our church serves as a spiritual home for many CBU students.</p>
                <p>Our CBU Fellowship connects students with peers who share their faith, provides mentorship with professionals in various fields, and offers a supportive environment to thrive academically and spiritually.</p>
                <div className="border-l-4 border-brand-red bg-gray-50 p-6">
                  <p className="font-semibold text-gray-900 mb-1">Free Transportation Available</p>
                  <p className="text-sm text-gray-500">Shuttle from CBU main entrance every Sunday at 8:30 AM, returning after service.</p>
                </div>
                <div className="pt-4 divide-y divide-gray-100">
                  {[
                    ["Midweek Bible Study", "Wednesdays · 5 PM · Student Center"],
                    ["Semester Kickoff",    "First Friday of each semester"],
                    ["Exam Prayer Support", "During final exam weeks"],
                    ["Career Mentorship",   "Monthly professional networking"],
                  ].map(([name, detail]) => (
                    <div key={name} className="flex justify-between py-4">
                      <span className="font-medium text-gray-900 text-sm">{name}</span>
                      <span className="text-gray-400 text-sm">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-vbc-dark p-8">
                <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">Get connected</p>
                <h3 className="text-xl font-black text-white mb-6">CBU Fellowship</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <EnvelopeIcon className="h-4 w-4 text-brand-red flex-shrink-0" />
                    cbufellowship@victorybiblechurch.org
                  </div>
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <PhoneIcon className="h-4 w-4 text-brand-red flex-shrink-0" />
                    +260 97X XXX XXX
                  </div>
                </div>
                <div className="divide-y divide-white/10">
                  {CBU_TESTIMONIALS.map((t, i) => (
                    <div key={i} className="py-5">
                      <p className="text-white/60 text-xs italic leading-relaxed mb-3">"{t.quote}"</p>
                      <p className="text-white text-xs font-semibold">{t.author}</p>
                      <p className="text-white/30 text-xs">{t.program}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB 3 — PHOTO GALLERY
        ════════════════════════════════════════════════════════ */}
        {activeTab === "gallery" && (
          <div className="py-16 max-w-7xl mx-auto px-6">
            <div className="mb-10">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Memories</p>
              <h2 className="text-3xl font-black text-gray-900">Youth Life in Pictures</h2>
            </div>

            {/* Slideshow */}
            <div className="relative h-[480px] bg-gray-100 overflow-hidden mb-4">
              {gallery.map((img, i) => (
                <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === currentSlide ? "opacity-100" : "opacity-0"}`}>
                  <img src={img.src} alt={img.caption} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-vbc-dark/70 to-transparent" />
                  <p className="absolute bottom-8 left-8 text-white font-semibold text-xl">{img.caption}</p>
                </div>
              ))}
              <button onClick={() => setCurrentSlide((p) => (p - 1 + gallery.length) % gallery.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 transition-colors">
                ←
              </button>
              <button onClick={() => setCurrentSlide((p) => (p + 1) % gallery.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 transition-colors">
                →
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {gallery.map((_, i) => (
                  <button key={i} onClick={() => setCurrentSlide(i)}
                    className={`w-2 h-2 transition-colors ${i === currentSlide ? "bg-white" : "bg-white/30"}`} />
                ))}
              </div>
            </div>

            {/* Activity categories */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-gray-100 mt-8">
              {[
                { title: "Worship Nights",    bg: "bg-vbc-dark"    },
                { title: "Summer Camp",        bg: "bg-vbc-section" },
                { title: "Mission Trips",      bg: "bg-vbc-dark"    },
                { title: "Game Nights",        bg: "bg-vbc-section" },
                { title: "Community Service",  bg: "bg-vbc-dark"    },
                { title: "Bible Studies",      bg: "bg-vbc-section" },
              ].map(({ title, bg }) => (
                <div key={title} className={`${bg} h-40 flex items-end p-6`}>
                  <p className="text-white font-bold text-base">{title}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-vbc-dark p-8 text-center">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Follow us</p>
              <h3 className="text-2xl font-black text-white mb-4">See more on Instagram</h3>
              <a href="https://instagram.com/litnation" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-red text-white text-sm font-semibold px-8 py-3 hover:bg-red-700 transition-colors">
                @litnation <ArrowRightIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB 4 — UPCOMING EVENTS
        ════════════════════════════════════════════════════════ */}
        {activeTab === "events" && (
          <div className="py-16 max-w-7xl mx-auto px-6">
            <div className="mb-10">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">What's on</p>
              <h2 className="text-3xl font-black text-gray-900">Upcoming Youth Events</h2>
            </div>

            {youthEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 mb-16">
                {youthEvents.map((event) => (
                  <div key={event.id} className="bg-white">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 mb-16">
                <CalendarDaysIcon className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-semibold mb-1">No upcoming youth events right now</p>
                <p className="text-gray-400 text-sm">Check back soon — something is always in the works.</p>
              </div>
            )}

            {/* Annual calendar */}
            <div className="bg-vbc-section py-12 px-10">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Plan ahead</p>
              <h3 className="text-2xl font-black text-white mb-8">Annual Calendar</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
                {ANNUAL_CALENDAR.map(({ month, event, date }) => (
                  <div key={event} className="bg-vbc-section flex items-center gap-5 px-6 py-5">
                    <div className="bg-brand-red text-white text-xs font-bold uppercase px-3 py-1.5 flex-shrink-0">{month}</div>
                    <div>
                      <p className="text-white text-sm font-semibold">{event}</p>
                      <p className="text-white/40 text-xs">{date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            TAB 5 — LEADERSHIP
        ════════════════════════════════════════════════════════ */}
        {activeTab === "leaders" && (
          <div className="py-16 max-w-7xl mx-auto px-6">
            <div className="mb-10">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">The team</p>
              <h2 className="text-3xl font-black text-gray-900">Our Leadership Team</h2>
            </div>

            <p className="text-gray-500 text-base leading-relaxed max-w-2xl mb-12">
              Meet the dedicated team that serves and guides our youth ministry with passion, wisdom, and love. Our leaders are committed to creating a safe and nurturing environment where young people can grow.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-100 mb-16">
              {LEADERS.map(({ name, title, bio }) => (
                <div key={name} className="bg-white p-10">
                  <div className="w-16 h-16 bg-gray-100 flex items-center justify-center mb-6">
                    <UsersIcon className="h-7 w-7 text-gray-400" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-red mb-1">{title}</p>
                  <h3 className="text-xl font-black text-gray-900 mb-3">{name}</h3>
                  <div className="w-8 h-0.5 bg-brand-red mb-4" />
                  <p className="text-gray-400 text-sm leading-relaxed">{bio}</p>
                </div>
              ))}
            </div>

            {/* Get involved */}
            <div className="bg-vbc-dark p-12">
              <div className="max-w-xl">
                <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-3">Serve with us</p>
                <h3 className="text-3xl font-black text-white mb-4">Get Involved</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-8">
                  We're always looking for passionate adults who want to make a difference in the lives of young people. If you're interested in volunteering with Lit Nation, we'd love to hear from you.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/contact"
                    className="inline-block bg-brand-red text-white text-sm font-semibold px-8 py-4 hover:bg-red-700 transition-colors">
                    Contact Youth Pastor
                  </Link>
                  <a href="mailto:youth@victorybiblechurch.org"
                    className="inline-block border border-white/20 text-white text-sm font-semibold px-8 py-4 hover:bg-white/5 transition-colors">
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default YouthMinistry;
