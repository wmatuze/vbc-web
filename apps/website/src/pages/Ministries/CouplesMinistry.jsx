// apps/website/src/pages/Ministries/CouplesMinistry.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import events from "../../assets/data/events";
import EventCard from "../../components/ChurchCalendar/EventsCard";
import PlaceHolderbanner from "../../assets/ministry-banners/ph.png"; //Using placeholder banner, you can replace with a Couples Ministry specific banner

const CouplesMinistry = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading all images
    const timer = setTimeout(() => setIsImageLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter events for Couples Ministry
  const couplesMinistryEvents = events.filter(
    (event) => event.ministry === "Couples Ministry"
  );

  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: "David & Sarah Johnson",
      quote: "The Couples Ministry has transformed our marriage. We've learned to communicate better and grow closer to God together.",
      role: "Members since 2019"
    },
    {
      id: 2,
      name: "Michael & Jennifer Wilson",
      quote: "The fellowship with other couples has been such a blessing. It's encouraging to know we're not alone in our journey.",
      role: "Members since 2020"
    },
    {
      id: 3,
      name: "Robert & Lisa Thompson",
      quote: "The marriage enrichment workshops gave us practical tools to strengthen our relationship. We're so grateful for this ministry!",
      role: "Members since 2018"
    }
  ];

  // FAQ data
  const faqs = [
    {
      id: 1,
      question: "Who can join the Couples Ministry?",
      answer: "Our Couples Ministry welcomes all married couples, engaged couples, and couples in committed relationships who want to grow together in their faith and strengthen their relationship."
    },
    {
      id: 2,
      question: "When and where do you meet for monthly workshops?",
      answer: "Our monthly marriage enrichment workshops are typically held on the second Friday of each month from 7:00-9:00 PM in the Fellowship Hall. Check our calendar for specific dates and topics."
    },
    {
      id: 3,
      question: "Do you offer childcare during your events?",
      answer: "Yes, we provide childcare for most of our couple events. Please let us know in advance if you'll need childcare so we can ensure we have adequate staff."
    },
    {
      id: 4,
      question: "How can we get involved in the Marriage Mentoring Program?",
      answer: "You can either sign up to receive mentoring or volunteer to become mentors yourselves (if you've been married for at least 5 years). Contact our ministry leaders at [email protected] to learn more."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* **Hero Section** */}
      <section
        className="bg-orange-700 rounded-b-lg relative"
        style={{
          backgroundImage: `url(${PlaceHolderbanner})`, // Replace PlaceHolderbanner with your Couples Ministry banner image
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 relative z-10 h-screen flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white text-center mb-4">
            Couples Ministry
          </h1>
          <p className="text-lg text-white text-center">
            Welcome to the Couples Ministry, a community dedicated to
            strengthening marriages and relationships through biblical
            principles and fellowship... (rest of your "About Us" intro
            paragraph)
          </p>
        </div>
        <div className="absolute inset-0 bg-black/50 rounded-b-lg"></div>
      </section>

      {/* **About Us Section** - Redesigned with card-like appearance */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-xl shadow-lg p-8 transform -mt-20 relative z-20">
            <div className="flex items-center mb-8">
              <div className="w-2 h-12 bg-orange-600 rounded-full mr-4"></div>
              <h2 className="text-3xl font-bold text-gray-800">
                About Couples Ministry
              </h2>
            </div>

            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              Our Couples Ministry is committed to building strong,
              Christ-centered marriages. We believe that healthy marriages are
              the foundation of strong families and a vibrant church. We offer
              resources, events, and a supportive community to help couples
              enrich their relationships, navigate challenges, and grow together
              in faith. Whether you are newlyweds, raising a family, or enjoying
              retirement, we invite you to join us as we learn to love and serve
              each other better, reflecting God's love in our marriages. Contact
              our ministry leaders, [Couple Leaders Names], at [email protected]
              to learn more about how you can connect with our Couples Ministry.
            </p>

            {/* **Activities with icons** */}
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2 border-gray-200">
              Activities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Monthly Marriage Enrichment Workshops
                  </h4>
                  <p className="text-gray-600">
                    Interactive sessions on marriage topics
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Couples Fellowship Nights
                  </h4>
                  <p className="text-gray-600">
                    Social and fun events for couples
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Marriage Mentoring Program
                  </h4>
                  <p className="text-gray-600">
                    Guidance from experienced mentor couples
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-orange-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-2.318 0-4.407-.635-6.072-1.745"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 9h.01M15 12h.01M15 15h.01M15 18h.01M15 21h.01M15 3h.01M15 6h.01"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Relationship Resources
                  </h4>
                  <p className="text-gray-600">
                    Books, seminars, and online content recommendations
                  </p>
                </div>
              </div>
            </div>

            {/* **Ministry Leaders Section with profile cards** */}
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2 border-gray-200">
              Ministry Leaders
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl mr-4">
                    CL
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      Mr & Mrs Couple Leader
                    </h4>
                    <p className="text-gray-600">Couples Ministry Leaders</p>
                    <p className="text-orange-600 text-sm mt-1">
                      [email protected]
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl mr-4">
                    AL
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      Mr & Mrs Assist Leader
                    </h4>
                    <p className="text-gray-600">Assistant Leaders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* **Testimonials Section** - New addition */}
      <section className="py-16 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(#ea580c 1px, transparent 1px)", // Orange color for Couples Ministry
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 relative inline-block">
              <span className="relative z-10">
                Couples' Testimonials
              </span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-orange-200 -z-10 rounded"></span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: testimonial.id * 0.1 }}
              >
                <div className="mb-4">
                  <svg className="h-8 w-8 text-orange-400 mb-4" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-gray-600 italic mb-4">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm mr-3">
                      {testimonial.name.split(' ')[0][0] + testimonial.name.split(' ')[2][0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* **FAQ Section** - New addition */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 relative inline-block">
              <span className="relative z-10">
                Frequently Asked Questions
              </span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-orange-200 -z-10 rounded"></span>
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <motion.div
                key={faq.id}
                className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: faq.id * 0.1 }}
              >
                <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center">
                  <div className="bg-orange-100 w-8 h-8 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm mr-3">
                    Q
                  </div>
                  {faq.question}
                </h3>
                <div className="pl-11">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* **Get Involved Section** - Redesigned with action-oriented layout */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-100 rounded-t-3xl">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-orange-600 py-4 px-8">
              <h2 className="text-3xl font-bold text-white text-center">
                Strengthen Your Marriage with Couples Ministry!
              </h2>
            </div>

            <div className="p-8">
              <p className="text-gray-700 text-lg mb-8 text-center">
                Ready to invest in your relationship and connect with other
                couples? Here's how to get involved:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="bg-orange-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-orange-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Attend Workshops
                  </h3>
                  <p className="text-gray-600">
                    Check our calendar for monthly dates and topics
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="bg-orange-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-orange-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Join Fellowship Nights
                  </h3>
                  <p className="text-gray-600">
                    See our events for upcoming social events
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="bg-orange-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-orange-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Contact Us
                  </h3>
                  <p className="text-gray-600">Email: [email protected]</p>
                </div>
              </div>

              <div className="text-center">
                <button className="px-8 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors shadow-md hover:shadow-lg inline-flex items-center">
                  <span>Strengthen Your Relationship</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CouplesMinistry;
