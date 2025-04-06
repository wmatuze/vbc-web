// apps/website/src/pages/Ministries/PraiseMinistry.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getEvents } from "../../services/api";
import EventCard from "../../components/ChurchCalendar/EventsCard";
import PlaceHolderbanner from "../../assets/ministry-banners/ph.png"; //Using placeholder banner, you can replace with a Praise Ministry specific banner
import FallbackImage from "../../assets/fallback-image.png"; // Import fallback image

const PraiseMinistry = () => {
  const [praiseMinistryEvents, setPraiseMinistryEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        // Filter events for Praise Ministry
        const filteredEvents = data.filter(
          (event) => event?.ministry === "Praise Ministry"
        );
        setPraiseMinistryEvents(filteredEvents);
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Simulate loading all images
    const timer = setTimeout(() => setIsImageLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: "James Wilson",
      quote: "Being part of the Praise Ministry has deepened my worship experience and allowed me to use my musical gifts to serve the Lord.",
      role: "Guitarist, member since 2018"
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      quote: "I've grown so much as a worship leader through the mentoring and training provided by our ministry. The team feels like family.",
      role: "Vocalist, member since 2019"
    },
    {
      id: 3,
      name: "Thomas Greene",
      quote: "Working with the tech team has been such a blessing. It's amazing how our behind-the-scenes work helps create a seamless worship experience.",
      role: "Sound Engineer, member since 2020"
    }
  ];

  // FAQ data
  const faqs = [
    {
      id: 1,
      question: "What musical experience do I need to join the Praise Ministry?",
      answer: "While some musical background is helpful, we welcome people of all skill levels. More important than technical ability is a heart for worship and a willingness to grow and learn."
    },
    {
      id: 2,
      question: "What positions are available in the Praise Ministry?",
      answer: "We have opportunities for vocalists, instrumentalists (guitar, keyboard, drums, bass, etc.), sound technicians, visual/projection team members, and more."
    },
    {
      id: 3,
      question: "How often does the team rehearse?",
      answer: "We have weekly rehearsals on Thursday evenings from 6:30-8:30 PM. Additionally, worship teams arrive early on Sunday mornings for a final run-through before the service."
    },
    {
      id: 4,
      question: "Is there an audition process to join the worship team?",
      answer: "Yes, we do have a simple audition process, but it's designed to help us understand your skills and place you appropriately, not to exclude people. Contact us to schedule an informal audition with our worship leader."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* **Hero Section** */}
      <section
        className="bg-blue-700 rounded-b-lg relative"
        style={{
          backgroundImage: `url(${PlaceHolderbanner})`, // Replace PlaceHolderbanner with your Praise Ministry banner image
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 relative z-10 h-screen flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white text-center mb-4">
            Praise Ministry
          </h1>
          <p className="text-lg text-white text-center">
            Our Praise Ministry is dedicated to leading our congregation in
            worship and creating an atmosphere where everyone can encounter
            God's presence... (rest of your "About Us" intro paragraph)
          </p>
        </div>
        <div className="absolute inset-0 bg-black/50 rounded-b-lg"></div>
      </section>

      {/* **About Us Section** - Redesigned with card-like appearance */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-xl shadow-lg p-8 transform -mt-20 relative z-20">
            <div className="flex items-center mb-8">
              <div className="w-2 h-12 bg-blue-600 rounded-full mr-4"></div>
              <h2 className="text-3xl font-bold text-gray-800">
                About Praise Ministry
              </h2>
            </div>

            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              Our Praise Ministry is passionate about creating dynamic worship
              experiences that inspire and uplift the church. We believe that
              worship is a vital part of our relationship with God, and through
              music, song, and creative arts, we strive to lead people into His
              presence. Whether you are a musician, vocalist, or have a passion
              for worship, we invite you to join us in making a joyful noise to
              the Lord. We practice weekly and lead worship during Sunday
              services and special events. Contact our ministry leader, [Praise
              Ministry Leader Name], at [email protected] to learn more about
              how you can get involved.
            </p>

            {/* **Activities with icons** */}
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2 border-gray-200">
              Activities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 9l6-6m0 0l6 6m-6-6v12"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Weekly Rehearsals
                  </h4>
                  <p className="text-gray-600">Thursdays, 6:30 PM</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
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
                    Sunday Worship Leadership
                  </h4>
                  <p className="text-gray-600">Every Sunday morning</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Special Music Events
                  </h4>
                  <p className="text-gray-600">
                    Seasonal concerts and performances
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
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
                    Worship Workshops
                  </h4>
                  <p className="text-gray-600">
                    Training and skill development
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
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                    PL
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      Mr Praise Leader
                    </h4>
                    <p className="text-gray-600">Praise Ministry Leader</p>
                    <p className="text-blue-600 text-sm mt-1">
                      [email protected]
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                    AL
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">
                      Mr Assist Leader
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
              backgroundImage: "radial-gradient(#3b82f6 1px, transparent 1px)", // Blue color for Praise Ministry
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 relative inline-block">
              <span className="relative z-10">
                Worship Team Testimonials
              </span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-blue-200 -z-10 rounded"></span>
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
                  <svg className="h-8 w-8 text-blue-400 mb-4" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-gray-600 italic mb-4">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm mr-3">
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
              <span className="absolute bottom-0 left-0 w-full h-3 bg-blue-200 -z-10 rounded"></span>
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
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm mr-3">
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
            <div className="bg-blue-600 py-4 px-8">
              <h2 className="text-3xl font-bold text-white text-center">
                Get Involved with Praise Ministry!
              </h2>
            </div>

            <div className="p-8">
              <p className="text-gray-700 text-lg mb-8 text-center">
                Are you gifted in music or have a passion for leading worship?
                Here's how to get involved:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 9l6-6m0 0l6 6m-6-6v12"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Attend Rehearsals
                  </h3>
                  <p className="text-gray-600">
                    Thursdays at 6:30 PM in the Sanctuary
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-blue-600"
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
                    Join a Worship Team
                  </h3>
                  <p className="text-gray-600">
                    Vocals, instruments, tech team
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-blue-600"
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
                <button className="px-8 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg inline-flex items-center">
                  <span>Get Involved Today</span>
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

export default PraiseMinistry;
