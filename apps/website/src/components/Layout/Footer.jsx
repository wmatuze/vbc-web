import { Link } from 'react-router-dom';
import { useState } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const footerLinks = [
    { path: "/about", label: "About" },
    { path: "about/leadership-team", label: "Leadership" },
    { path: "/media/sermons", label: "Sermons" },
    { path: "/contact", label: "Contact" },
    { path: "/events", label: "Events" },
    { path: "/cell-groups", label: "Cell Groups" },
  ];

  const socialLinks = [
    { icon: "facebook", url: "https://facebook.com/victorybiblechurch", label: "Facebook" },
    { icon: "instagram", url: "https://instagram.com/victorybiblechurch", label: "Instagram" },
    { icon: "youtube", url: "https://youtube.com/victorybiblechurch", label: "YouTube" },
    { icon: "twitter", url: "https://twitter.com/victorybible", label: "Twitter" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, you would send this to your backend
    console.log('Subscribing email:', email);
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="space-y-4">
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
            <p className="text-gray-400">Worship | Grow | Impact</p>
            <div className="text-gray-400">
              <p>Victory Bible Church - Kitwe</p>
              <p>Off Chiwala Road, CBU East Gate</p>
              <p className="mt-2">Phone: (260) 964-985-651</p>
              <p>Email: info@victorybiblechurch.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 transition-colors flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Service Times</h4>
            <div className="space-y-3">
              <div>
                <p className="font-medium">Sunday Services</p>
                <p className="text-gray-400">09:30 AM</p>
              </div>
              <div>
                <p className="font-medium">Wednesday Service</p>
                <p className="text-gray-400">06:00 PM</p>
              </div>
              <Link to="/contact" className="inline-block mt-2 text-primary-400 hover:text-primary-300 transition-colors">
                Get Directions →
              </Link>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Stay Connected</h4>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates and inspiration.</p>

            {isSubscribed ? (
              <div className="p-3 bg-primary-900/50 rounded-lg border border-primary-700 text-primary-300">
                Thank you for subscribing! You'll receive our next newsletter soon.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="px-3 py-2 bg-gray-800 text-white placeholder-gray-500 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary-500 flex-grow text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-r-md transition-colors font-medium"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            )}

            {/* Social Media Icons */}
            <div className="mt-6">
              <p className="font-medium mb-3">Follow Us</p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.icon}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-primary-600 text-white p-2 rounded-full transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon === 'facebook' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                      </svg>
                    )}
                    {social.icon === 'instagram' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    )}
                    {social.icon === 'youtube' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                      </svg>
                    )}
                    {social.icon === 'twitter' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
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
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © {currentYear} Victory Bible Church. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-gray-400 text-sm mx-3">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-400 text-sm mx-3">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;