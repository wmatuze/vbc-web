import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import config from "../../config";

// Static data moved outside component for better performance
const FOOTER_LINKS = {
  about: [
    { path: "/about", label: "About Us" },
    { path: "/about/our-story", label: "Our Story" },
    { path: "/about/leadership-team", label: "Leadership" },
    { path: "/about/vision-mission", label: "Vision & Mission" },
    { path: "/about/what-we-believe", label: "What We Believe" },
  ],
  programs: [
    { path: "/foundation-classes", label: "Foundation Classes" },
    { path: "/discipleship-classes", label: "Discipleship Classes" },
    { path: "/membership", label: "Membership" },
    { path: "/cell-groups", label: "Cell Groups" },
  ],
  media: [
    { path: "/audio-sermons", label: "Audio Sermons" },
    { path: "/gallery", label: "Gallery" },
    { path: "/resources", label: "Resources" },
  ],
  connect: [
    { path: "/events", label: "Events" },
    { path: "/missions", label: "Missions" },
    { path: "/contact", label: "Contact Us" },
  ],
};

const SOCIAL_LINKS = [
  {
    icon: "facebook",
    url: "https://facebook.com/VictoryBibleChurchKitwe",
    label: "Facebook",
  },
  {
    icon: "instagram",
    url: "https://instagram.com/victorybiblechurch",
    label: "Instagram",
  },
  {
    icon: "youtube",
    url: "https://youtube.com/@BishopSimwanza",
    label: "YouTube",
  },
  {
    icon: "twitter",
    url: "https://twitter.com/victorybible",
    label: "Twitter",
  },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [churchInfo, setChurchInfo] = useState({
    address: "Off Chiwala Road, CBU East Gate",
    phone: "+260 964 985 651",
    email: "info@victorybiblechurch.com",
  });

  useEffect(() => {
    fetch(`${config.API_URL}/api/config`)
      .then(r => r.ok ? r.json() : null)
      .then(cfg => {
        if (!cfg) return;
        setChurchInfo({
          address: cfg.address || "Off Chiwala Road, CBU East Gate",
          phone:   cfg.phone   || "+260 964 985 651",
          email:   cfg.email   || "info@victorybiblechurch.com",
        });
      })
      .catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, you would send this to your backend
    console.log("Subscribing email:", email);
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-vbc-dark text-white border-t-2 border-brand-red/40">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Church Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link
              to="/"
              className="flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-lg p-1 transition-transform hover:scale-105"
              aria-label="Home Page"
            >
              <div className="flex items-center">
                <img
                  src="/assets/logo.png"
                  alt="Victory Bible Church"
                  className="h-8 w-auto -mr-2 z-10 relative"
                  loading="lazy"
                />
                <span
                  className={`text-lg md:text-base font-bold tracking-tight text-white font-display pl-1`}
                >
                  ictory Bible
                </span>
                <span
                  className={`text-lg md:text-base font-bold tracking-tight text-white font-display ml-1`}
                >
                  Church
                </span>
              </div>
            </Link>
            <p className="text-brand-red text-xs font-semibold uppercase tracking-widest mt-1">Worship · Grow · Impact</p>
            <address className="not-italic text-gray-400">
              <p>Victory Bible Church - Kitwe</p>
              <p>{churchInfo.address}</p>
              <p className="mt-2">
                Phone:{" "}
                <a
                  href={`tel:${churchInfo.phone.replace(/\s/g, "")}`}
                  className="hover:text-primary-400 transition-colors"
                >
                  {churchInfo.phone}
                </a>
              </p>
              <p>
                Email:{" "}
                <a
                  href={`mailto:${churchInfo.email}`}
                  className="hover:text-primary-400 transition-colors"
                >
                  {churchInfo.email}
                </a>
              </p>
            </address>
          </div>

          {/* About Links */}
          <nav aria-label="About">
            <h4 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">
              About
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.about.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 focus:outline-none focus:text-primary-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Programs Links */}
          <nav aria-label="Programs">
            <h4 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">
              Programs
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.programs.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 focus:outline-none focus:text-primary-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Media Links */}
          <nav aria-label="Media">
            <h4 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">
              Media
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.media.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 focus:outline-none focus:text-primary-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect Links */}
          <nav aria-label="Connect">
            <h4 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">
              Connect
            </h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.connect.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 focus:outline-none focus:text-primary-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Secondary Footer Info */}
        <div className="border-t border-white/5 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Times */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Service Times</h4>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">Sunday Services</p>
                  <time className="text-gray-400" dateTime="09:30">
                    09:30 AM
                  </time>
                </div>
                <div>
                  <p className="font-medium">Wednesday Service</p>
                  <time className="text-gray-400" dateTime="18:00">
                    06:00 PM
                  </time>
                </div>
                <Link
                  to="/contact"
                  className="inline-block mt-2 text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Get Directions →
                </Link>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for updates and inspiration.
              </p>

              {isSubscribed ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="p-3 bg-primary-900/50 rounded-lg border border-primary-700 text-primary-300"
                >
                  Thank you for subscribing! You'll receive our next newsletter
                  soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2" noValidate>
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <div className="flex">
                    <input
                      id="newsletter-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      required
                      className="px-3 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary-500 flex-grow text-sm"
                    />
                    <button
                      type="submit"
                      className="bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 text-white px-4 py-2 transition-colors font-semibold text-xs uppercase tracking-wider"
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.icon}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/5 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 text-white p-2.5 transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon === "facebook" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                      </svg>
                    )}
                    {social.icon === "instagram" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    )}
                    {social.icon === "youtube" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      </svg>
                    )}
                    {social.icon === "twitter" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {currentYear} Victory Bible Church. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <Link
                to="/contact"
                className="text-gray-500 hover:text-gray-400 text-sm mx-3"
              >
                Contact Us
              </Link>
              <Link
                to="/about"
                className="text-gray-500 hover:text-gray-400 text-sm mx-3"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
