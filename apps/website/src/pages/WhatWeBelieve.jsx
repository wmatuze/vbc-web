import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import HeroSection from "../components/common/HeroSection";

const beliefs = [
  {
    num: "01",
    title: "The Bible",
    content:
      "We believe the Bible is the inspired, infallible Word of God, the supreme authority for faith and practice. Scripture is our foundation for understanding God's truth and guidance for daily living.",
  },
  {
    num: "02",
    title: "God",
    content:
      "We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit. God is the Creator and Sustainer of all things, infinite in love, perfect in holiness, and worthy of all worship.",
  },
  {
    num: "03",
    title: "Jesus Christ",
    content:
      "We believe in Jesus Christ, God's only Son, fully divine and fully human. We affirm His virgin birth, sinless life, sacrificial death, bodily resurrection, and ascension to heaven where He now intercedes for believers.",
  },
  {
    num: "04",
    title: "Holy Spirit",
    content:
      "We believe in the Holy Spirit who convicts the world of sin, regenerates believers, and empowers Christians for godly living and service. The Spirit bestows spiritual gifts for the edification of the church.",
  },
  {
    num: "05",
    title: "Salvation",
    content:
      "We believe salvation is by grace through faith in Jesus Christ alone. This salvation includes regeneration, justification, sanctification, and glorification. Good works are the fruit of genuine faith, not the means of salvation.",
  },
  {
    num: "06",
    title: "The Church",
    content:
      "We believe the Church is the body of Christ, composed of all true believers. The local church is called to worship God, nurture believers, and proclaim the gospel through word and deed to all nations.",
  },
  {
    num: "07",
    title: "Baptism & Communion",
    content:
      "We believe in water baptism by immersion as a public declaration of faith in Christ. We observe the Lord's Supper in remembrance of His sacrifice, recognising our unity in the body of Christ.",
  },
  {
    num: "08",
    title: "The Lord's Return",
    content:
      "We believe in the personal, visible return of Christ to establish His kingdom in its fullness. We anticipate the resurrection of the dead, the final judgment, and the eternal state of either heaven or hell.",
  },
];

const WhatWeBelieve = () => {
  return (
    <div className="bg-white">
      <Helmet>
        <title>What We Believe | Victory Bible Church</title>
        <meta
          name="description"
          content="Our statement of faith and core doctrinal beliefs at Victory Bible Church."
        />
      </Helmet>

      <HeroSection
        title="What We Believe"
        subtitle="Statement of Faith"
        description="The foundational truths of the Christian faith as held by Victory Bible Church."
        primaryAccentText="Believe"
        scrollText="READ OUR BELIEFS"
        backgroundImage="/assets/hero-bg.jpg"
        breadcrumbs={[
          { label: "Home", path: "/" },
          { label: "About", path: "/about" },
          { label: "What We Believe" },
        ]}
      />

      {/* ── SCRIPTURE — the theological anchor ──────────────────────────── */}
      <section className="bg-vbc-section py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-12 md:mb-16">
            Foundation
          </p>

          {/* Three-beat typographic declaration */}
          <div className="space-y-0 mb-12 md:mb-16">
            <p className="text-white/30 text-sm uppercase tracking-[0.2em] mb-6">
              1 Corinthians 15:3–4
            </p>

            <div className="border-l-2 border-brand-red pl-8 space-y-5">
              <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/60 italic leading-snug">
                "For I delivered to you as of first importance what I also received:
              </p>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-snug">
                that Christ died for our sins
                <span className="text-white/40 font-light"> in accordance with the Scriptures,</span>
              </p>
              <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white/60 italic leading-snug">
                that he was buried,
              </p>
              <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-400 leading-snug">
                that he was raised on the third day
                <span className="text-white/40 font-light text-2xl md:text-3xl"> in accordance with the Scriptures."</span>
              </p>
            </div>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
            At Victory Bible Church, we hold to the foundational truths of the
            Christian faith as revealed in Scripture. These beliefs shape our
            teaching, guide our practices, and unite us in our mission to win
            a generation for Christ.
          </p>
        </div>
      </section>

      {/* ── BELIEFS — 2×4 flat grid ─────────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-14 items-end">
            <div className="md:col-span-2">
              <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                What We Believe
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug">
                Our Statement<br />of Faith
              </h2>
            </div>
            <p className="md:col-span-3 text-gray-400 text-sm leading-relaxed">
              Eight core doctrines that define our understanding of God, Scripture,
              and the Christian life. These are not peripheral — they are the
              convictions we build everything on.
            </p>
          </div>

          {/* 2×4 grid — all 8 beliefs visible at once */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200">
            {beliefs.map((belief) => (
              <div key={belief.num} className="bg-white p-8 flex flex-col gap-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em]">
                    {belief.num}
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    {belief.title}
                  </h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {belief.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING — dark, brief ────────────────────────────────────────── */}
      <section className="bg-vbc-section py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-2">
            <p className="text-brand-red text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              A Living Faith
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
              More Than a Document
            </h2>
          </div>
          <div className="md:col-span-3 space-y-4">
            <p className="text-gray-400 text-sm leading-relaxed">
              This statement of faith does not exhaust the extent of our beliefs.
              The Bible itself, as the inspired and infallible Word of God, speaks
              with final authority concerning truth, morality, and the proper
              conduct of mankind.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              We invite you to join us in worship and study as we explore these
              beliefs together. If you have questions or would like to discuss
              them further, please{" "}
              <Link
                to="/contact"
                className="text-white border-b border-white/30 hover:border-white transition-colors"
              >
                contact us
              </Link>{" "}
              or speak with one of our pastors after a service.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhatWeBelieve;
