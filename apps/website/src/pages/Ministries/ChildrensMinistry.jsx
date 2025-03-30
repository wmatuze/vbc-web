// apps/website/src/pages/Ministries/ChildrensMinistry.jsx
import React, { useState, useEffect } from "react";
import { getEvents } from "../../services/api";
import EventCard from "../../components/ChurchCalendar/EventsCard";
import PlaceHolderbanner from "../../assets/ministry-banners/ph.png"; //Using placeholder banner, you can replace with a Children's Ministry specific banner
import FallbackImage from "../../assets/fallback-image.png"; // Import fallback image

const ChildrensMinistry = () => {
  const [childrensMinistryEvents, setChildrensMinistryEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        // Filter events for Children's Ministry
        const filteredEvents = data.filter(
          (event) => event?.ministry === "Children's Ministry"
        );
        setChildrensMinistryEvents(filteredEvents);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* **Hero Section** */}
      <section
        className="bg-yellow-500 rounded-b-lg relative"
        style={{
          backgroundImage: `url(${PlaceHolderbanner})`, // Replace PlaceHolderbanner with your Children's Ministry banner image
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container mx-auto px-4 relative z-10 h-screen flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white text-center mb-4">
            Children's Ministry
          </h1>
          <p className="text-lg text-white text-center">
            Our Children's Ministry is a fun and engaging place where kids
            discover Jesus, build friendships, and grow in their faith through
            interactive learning and activities... (rest of your "About Us"
            intro paragraph)
          </p>
        </div>
        <div className="absolute inset-0 bg-black/50 rounded-b-lg"></div>
      </section>

      {/* **About Us Section** - Redesigned with card-like appearance */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-xl shadow-lg p-8 transform -mt-20 relative z-20">
            <div className="flex items-center mb-8">
              <div className="w-2 h-12 bg-yellow-400 rounded-full mr-4"></div>
              <h2 className="text-3xl font-bold text-gray-800">
                About Children's Ministry
              </h2>
            </div>

            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              Our Children's Ministry is dedicated to partnering with parents to
              lay a spiritual foundation in the lives of children from [age
              range, e.g., birth through 5th grade]. We provide a safe,
              nurturing, and age-appropriate environment where children can
              learn about God's love, explore biblical truths, and develop a
              personal relationship with Jesus Christ. Through creative Bible
              lessons, engaging activities, music, and play, we aim to make
              church a fun and meaningful experience for every child. We offer
              classes during Sunday services and various programs throughout the
              year. Contact our ministry leader, [Children's Ministry Leader
              Name], at [email protected] to learn more about how your child can
              join the fun and learning in our Children's Ministry!
            </p>

            {/* **Activities with icons** */}
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2 border-gray-200">
              Activities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start">
                <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M3 4h18"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Sunday School Classes
                  </h4>
                  <p className="text-gray-600">
                    Age-specific classes during Sunday services
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Kids' Worship Time
                  </h4>
                  <p className="text-gray-600">
                    Engaging worship experiences designed for children
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Interactive Bible Lessons
                  </h4>
                  <p className="text-gray-600">
                    Creative and age-appropriate teaching methods
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-yellow-100 p-3 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">
                    Fun Activities & Games
                  </h4>
                  <p className="text-gray-600">
                    Games, crafts, and activities that reinforce learning
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
                  <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center text-yellow-600 font-bold text-xl mr-4">
                    CL
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Ms Child Leader</h4>
                    <p className="text-gray-600">Children's Ministry Leader</p>
                    <p className="text-yellow-600 text-sm mt-1">
                      [email protected]
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center text-yellow-600 font-bold text-xl mr-4">
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

      {/* **Events Section** - Redesigned with subtle background pattern */}
      <section className="py-16 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(#facc15 1px, transparent 1px)", // Yellow color for Children's Ministry
              backgroundSize: "20px 20px",
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 relative inline-block">
              <span className="relative z-10">
                Upcoming Children's Ministry Events
              </span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-yellow-200 -z-10 rounded"></span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {childrensMinistryEvents.length > 0 ? (
              childrensMinistryEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
              ))
            ) : (
              <div className="col-span-3 py-16 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-gray-500 text-lg">
                  No upcoming events for Children's Ministry.
                </p>
                <p className="text-gray-400 mt-2">
                  Check back soon for new events!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* **Get Involved Section** - Redesigned with action-oriented layout */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-100 rounded-t-3xl">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-yellow-400 py-4 px-8">
              <h2 className="text-3xl font-bold text-white text-center">
                Volunteer with Children's Ministry!
              </h2>
            </div>

            <div className="p-8">
              <p className="text-gray-700 text-lg mb-8 text-center">
                Do you love working with children and sharing your faith? We
                have many opportunities for you to get involved:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-yellow-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M3 4h18"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Sunday School Teacher
                  </h3>
                  <p className="text-gray-600">
                    Lead and teach a class on Sunday mornings
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-yellow-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.166 0 .33.016.49.048l-1.397 9.865c-.252 1.781-2.258 1.781-2.51 0l-1.397-9.865C6.67 3.016 6.834 3 7 3zm12 6h.01M19 3h-5c-.166 0-.33.016-.49.048l-1.397 9.865c-.252 1.781-2.258 1.781-2.51 0l-1.397-9.865C12.67 3.016 12.834 3 13 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Classroom Assistant
                  </h3>
                  <p className="text-gray-600">
                    Help teachers during classes and activities
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-yellow-600"
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
                <button className="px-8 py-3 bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-colors shadow-md hover:shadow-lg inline-flex items-center">
                  <span>Join Our Team</span>
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

export default ChildrensMinistry;
