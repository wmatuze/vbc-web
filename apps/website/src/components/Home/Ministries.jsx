import React from 'react';
import { Link } from 'react-router-dom';

const ministries = [
  {
    name: "Youth Ministry - Lit Nation",
    description: "Empowering young people to grow in faith and leadership.",
    image: "/images/youth-ministry.jpg",
    path: "/ministries/youths"
  },
  {
    name: "Men's Ministry",
    description: "Building strong men of faith and integrity.",
    image: "/images/mens-ministry.jpg",
    path: "/ministries/mens"
  },
  {
    name: "Women's Ministry",
    description: "Empowering women through faith, fellowship, and service.",
    image: "/images/womens-ministry.jpg",
    path: "/ministries/womens"
  },
  {
    name: "Praise & Worship Ministry",
    description: "Leading people into God's presence through worship.",
    image: "/images/praise-ministry.jpg",
    path: "/ministries/praise"
  }
];

const Ministries = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-6">
      <div className="container mx-auto text-center">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Ministries
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join us in our various ministries where you can grow, serve, and connect with others in faith.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ministries.map((ministry, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <Link to={ministry.path} className="block">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={ministry.image}
                    alt={ministry.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                </div>
                <div className="p-6 relative">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                    {ministry.name}
                  </h3>
                  <p className="text-gray-600">{ministry.description}</p>
                  <div className="mt-4 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold group-hover:text-primary-700 transition-colors duration-300">
                      Learn More →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ministries;