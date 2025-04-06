// apps/website/src/pages/Ministries/WomensMinistry.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import events from "../../assets/data/events";
import EventCard from "../../components/ChurchCalendar/EventsCard";
import PlaceHolderbanner from "../../assets/ministry-banners/ph.png"; //Using placeholder banner, you can replace with a Women's Ministry specific banner

const WomensMinistry = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading all images
    const timer = setTimeout(() => setIsImageLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Filter events for women's Ministry
  const womensMinistryEvents = events.filter(
    (event) => event.ministry === "Women's Ministry"
  );

  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      quote: "The Women's Ministry has been a source of strength and encouragement for me during challenging times.",
      role: "Member since 2019"
    },
    {
      id: 2,
      name: "Emily Davis",
      quote: "I've formed deep friendships through our Bible studies that have helped me grow in my faith journey.",
      role: "Member since 2017"
    },
    {
      id: 3,
      name: "Michelle Thompson",
      quote: "The annual retreat changed my life! I found healing, hope and a renewed passion for God's word.",
      role: "Member since 2020"
    }
  ];

  // FAQ data
  const faqs = [
    {
      id: 1,
      question: "When and where do the Women's Bible Studies meet?",
      answer: "We offer two Bible study times to accommodate different schedules: Wednesday mornings at 10:00 AM and Wednesday evenings at 7:00 PM, both in the church fellowship hall."
    },
    {
      id: 2,
      question: "Do I need to bring anything to the Bible studies?",
      answer: "Just bring your Bible and a heart ready to learn! Study materials are provided, though you may want to bring a notebook and pen for taking notes."
    },
    {
      id: 3,
      question: "Is childcare available during women's events?",
      answer: "Yes, we provide childcare for most of our events, including our Wednesday morning Bible studies. Please let us know in advance if you'll need childcare."
    },
    {
      id: 4,
      question: "How can I volunteer with the Women's Ministry?",
      answer: "We have many opportunities to serve! Please contact our ministry leader at [email protected] to discuss your interests and how you can get involved."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* **Hero Section** */}
      <section
        className="bg-purple-700 rounded-b-lg relative"
        style={{
          backgroundImage: `url(${PlaceHolderbanner})`, // Replace PlaceHolderbanner with your Women's Ministry banner image
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 relative z-10 h-screen flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white text-center mb-4">
            Women's Ministry
          </h1>
          <p className="text-lg text-white text-center">
            Welcome to the Women's Ministry, a community where women of all ages
            connect, grow in faith, and support each other on their spiritual
            journeys... (rest of your "About Us" intro paragraph)
          </p>
        </div>
        <div className="absolute inset-0 bg-black/50 rounded-b-lg"></div>
      </section>

      {/* **About Us Section** - Redesigned with card-like appearance */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-xl shadow-lg p-8 transform -mt-20 relative z-20">
            <div className="flex items-center mb-8">
              <div className="w-2 h-12 bg-purple-600 rounded-full mr-4"></div>
              <h2 className="text-3xl font-bold text-gray-800">
                About Women's Ministry
              </h2>
            </div>

            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              Our Women's Ministry is a vibrant and supportive community
              dedicated to helping women of all ages grow in their relationship
              with Christ. We provide a welcoming space for women to connect
              with one another, study the Bible, and apply biblical principles
              to their daily lives. Through various events, small groups, and
              service opportunities, we encourage spiritual growth, personal
              development, and lasting friendships. Whether you are looking to
              deepen your faith, find fellowship, or serve others, we invite you
              to join us. Contact our ministry leader, [Women's Ministry Leader
              Name], at [email protected] to learn more about how you can get
              involved.
            </p>

            {/* **Activities with icons** */}
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2 border-gray-200">
              Activities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
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
                    Weekly Bible Studies
                  </h4>
                  <p className="text-gray-600">
                    Wednesdays, 10:00 AM & 7:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 13l-5 5m0 0l-5-5m5 5V6"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Monthly Prayer Meetings
                  </h4>
                  <p className="text-gray-600">First Saturday of each month</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0H7m2 0h2m-2 0H7"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Annual Women's Retreat
                  </h4>
                  <p className="text-gray-600">
                    Weekend retreat for spiritual renewal
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-.447.894L15 14M5 10l4.553-2.276A1 1 0 0111 8.618v6.764a1 1 0 01-.447.894L5 14m0 0v2.581A2 2 0 007 19h10a2 2 0 002-2.419V14"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Service Projects
                  </h4>
                  <p className="text-gray-600">
                    Outreach and community support initiatives
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
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl mr-4">
                    WL
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Ms Women Leader</h4>
                    <p className="text-gray-600">Women's Ministry Leader</p>
                    <p className="text-purple-600 text-sm mt-1">
                      [email protected]
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl mr-4">
                    AL
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      Ms Assist Leader
                    </h4>
                    <p className="text-gray-600">Assistant Leader</p>
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
              backgroundImage: "radial-gradient(#9333ea 1px, transparent 1px)", // Purple color for Women's Ministry
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 relative inline-block">
              <span className="relative z-10">
                Member Testimonials
              </span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-purple-200 -z-10 rounded"></span>
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
                  <svg className="h-8 w-8 text-purple-400 mb-4" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-gray-600 italic mb-4">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm mr-3">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
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
              <span className="absolute bottom-0 left-0 w-full h-3 bg-purple-200 -z-10 rounded"></span>
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
                  <div className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm mr-3">
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
            <div className="bg-purple-600 py-4 px-8">
              <h2 className="text-3xl font-bold text-white text-center">
                Get Involved with Women's Ministry!
              </h2>
            </div>

            <div className="p-8">
              <p className="text-gray-700 text-lg mb-8 text-center">
                Looking for a place to connect with other women and grow in your
                faith? Here's how to get involved:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="bg-purple-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-purple-600"
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
                    Attend Bible Studies
                  </h3>
                  <p className="text-gray-600">Wednesdays at 10 AM or 7 PM</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="bg-purple-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 13l-5 5m0 0l-5-5m5 5V6"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Join Prayer Meetings
                  </h3>
                  <p className="text-gray-600">First Saturday monthly</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="bg-purple-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-purple-600"
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
                <button className="px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-md hover:shadow-lg inline-flex items-center">
                  <span>Become a Member</span>
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

export default WomensMinistry;
