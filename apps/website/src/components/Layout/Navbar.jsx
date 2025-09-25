import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  InformationCircleIcon,
  UserGroupIcon,
  FilmIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  ArrowUpIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid"; // Import ChevronDownIcon for dropdown indicator
import PropTypes from "prop-types";

const Navbar = ({
  isHidden = false,
  scrollThreshold = 10,
  forceOpaque = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const mobileMenuRef = useRef(null);
  const [isMinistriesDropdownOpen, setIsMinistriesDropdownOpen] =
    useState(false); // State for Desktop Ministries dropdown
  const ministriesDropdownRef = useRef(null); // Ref for Desktop Ministries dropdown
  const [isProgramsDropdownOpen, setIsProgramsDropdownOpen] =
    useState(false); // State for Desktop Programs dropdown
  const programsDropdownRef = useRef(null); // Ref for Desktop Programs dropdown
  const [isConnectDropdownOpen, setIsConnectDropdownOpen] =
    useState(false); // State for Desktop Connect dropdown
  const connectDropdownRef = useRef(null); // Ref for Desktop Connect dropdown
  const [isMediaDropdownOpen, setIsMediaDropdownOpen] =
    useState(false); // State for Desktop Media dropdown
  const mediaDropdownRef = useRef(null); // Ref for Desktop Media dropdown
  const location = useLocation();
  const [isMobileMinistriesDropdownOpen, setIsMobileMinistriesDropdownOpen] =
    useState(false); // State for Mobile Ministries dropdown
  const [isMobileProgramsDropdownOpen, setIsMobileProgramsDropdownOpen] =
    useState(false); // State for Mobile Programs dropdown
  const [isMobileConnectDropdownOpen, setIsMobileConnectDropdownOpen] =
    useState(false); // State for Mobile Connect dropdown
  const [isMobileMediaDropdownOpen, setIsMobileMediaDropdownOpen] =
    useState(false); // State for Mobile Media dropdown

  const links = useMemo(
    () => [
      { path: "/", label: "Home", icon: HomeIcon },
      { path: "/about", label: "About", icon: InformationCircleIcon },
      {
        label: "Programs",
        icon: UserGroupIcon,
        children: [
          { path: "/foundation-classes", label: "Foundation Classes" },
          { path: "/discipleship-classes", label: "Discipleship Classes" },
        ],
      },
      {
        label: "Ministries",
        icon: UserGroupIcon,
        children: [
          // Add children for dropdown
          { path: "/ministries/mens", label: "Men's Ministry" },
          { path: "/ministries/womens", label: "Women's Ministry" },
          { path: "/ministries/youths", label: "Youth Ministry" },
          {
            path: "/ministries/children",
            label: "Children's Ministry",
          },
          { path: "/ministries/praise", label: "Praise Ministry" },
          { path: "/ministries/couples", label: "Couples Ministry" },
        ],
      },
      {
        label: "Media",
        icon: FilmIcon,
        children: [
          { path: "/audio-sermons", label: "Audio Sermons" },
          { path: "/gallery", label: "Gallery" },
          { path: "/resources", label: "Resources" },
        ],
      },
      {
        label: "Connect",
        icon: CalendarDaysIcon,
        children: [
          { path: "/cell-groups", label: "Cell Groups" },
          { path: "/events", label: "Events & Calendar" },
          { path: "/missions", label: "Missions" },
        ],
      },
      { path: "/contact", label: "Contact", icon: EnvelopeIcon },
    ],
    []
  );

  // Memoized scroll handler
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    setHasScrolled(scrollPosition > scrollThreshold);
    setShowScrollToTop(scrollPosition > 300); // Show button after scrolling 300px
  }, [scrollThreshold]);

  // Effect for scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutsideMobileMenu = (event) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideMobileMenu);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideMobileMenu);
  }, [isMobileMenuOpen]);

  // Close desktop ministries dropdown when clicking outside
  useEffect(() => {
    const handleClickOutsideMinistriesDropdown = (event) => {
      if (
        isMinistriesDropdownOpen &&
        ministriesDropdownRef.current &&
        !ministriesDropdownRef.current.contains(event.target)
      ) {
        setIsMinistriesDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutsideMinistriesDropdown
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutsideMinistriesDropdown
      );
  }, [isMinistriesDropdownOpen]);

  // Close desktop programs dropdown when clicking outside
  useEffect(() => {
    const handleClickOutsideProgramsDropdown = (event) => {
      if (
        isProgramsDropdownOpen &&
        programsDropdownRef.current &&
        !programsDropdownRef.current.contains(event.target)
      ) {
        setIsProgramsDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutsideProgramsDropdown
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutsideProgramsDropdown
      );
  }, [isProgramsDropdownOpen]);

  // Close desktop connect dropdown when clicking outside
  useEffect(() => {
    const handleClickOutsideConnectDropdown = (event) => {
      if (
        isConnectDropdownOpen &&
        connectDropdownRef.current &&
        !connectDropdownRef.current.contains(event.target)
      ) {
        setIsConnectDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutsideConnectDropdown
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutsideConnectDropdown
      );
  }, [isConnectDropdownOpen]);

  // Close desktop media dropdown when clicking outside
  useEffect(() => {
    const handleClickOutsideMediaDropdown = (event) => {
      if (
        isMediaDropdownOpen &&
        mediaDropdownRef.current &&
        !mediaDropdownRef.current.contains(event.target)
      ) {
        setIsMediaDropdownOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutsideMediaDropdown
    );
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutsideMediaDropdown
      );
  }, [isMediaDropdownOpen]);

  const getTextColor = (defaultColor) =>
    hasScrolled || forceOpaque ? "text-gray-800" : defaultColor;

  const getBackgroundStyle = () => {
    if (isHidden) {
      return "opacity-0 pointer-events-none";
    }
    if (forceOpaque) {
      return "bg-white shadow-soft-xl";
    }
    return hasScrolled
      ? "bg-white/95 backdrop-blur-md shadow-soft-xl"
      : "bg-transparent";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleMobileMinistriesDropdown = () => {
    setIsMobileMinistriesDropdownOpen((prev) => !prev);
  };

  const toggleMobileProgramsDropdown = () => {
    setIsMobileProgramsDropdownOpen((prev) => !prev);
  };

  const toggleMobileConnectDropdown = () => {
    setIsMobileConnectDropdownOpen((prev) => !prev);
  };

  const toggleMobileMediaDropdown = () => {
    setIsMobileMediaDropdownOpen((prev) => !prev);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${getBackgroundStyle()}`}
        aria-label="Main Navigation"
      >
        <div className="w-full max-w-none px-3 md:px-4 lg:px-6 xl:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo Section */}
            <Link
              to="/"
              className="flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-lg p-1 transition-transform hover:scale-105 flex-shrink-0"
              aria-label="Home Page"
            >
              <div className="flex items-center">
                <img
                  src="/assets/logo.png"
                  alt="Victory Bible Church Logo"
                  className="h-10 md:h-12 w-auto -mr-3 z-10 relative"
                  loading="lazy"
                />
                <span
                  className={`text-sm md:text-sm lg:text-base font-bold tracking-tight ${getTextColor(
                    "text-white"
                  )} font-display pl-1`}
                >
                  ictory Bible
                </span>
                <span
                  className={`text-sm md:text-sm lg:text-base font-bold tracking-tight ${getTextColor(
                    "text-white"
                  )} font-display ml-1`}
                >
                  Church
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1.5 lg:space-x-2 xl:space-x-2.5">
              {links.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    ref={
                      link.label === "Programs" ? programsDropdownRef :
                      link.label === "Ministries" ? ministriesDropdownRef :
                      link.label === "Media" ? mediaDropdownRef :
                      link.label === "Connect" ? connectDropdownRef : null
                    }
                  >
                    <button
                      className={`
                        flex items-center gap-1
                        font-sans text-xs md:text-sm font-medium
                        hover:text-primary-500 focus:text-primary-600
                        transition-all duration-300 tracking-wide
                        focus:outline-none focus:ring-2 focus:ring-primary-300
                        rounded-lg px-1 md:px-1.5 lg:px-2 py-1 hover:bg-primary-50/50
                        ${getTextColor("text-white")}
                      `}
                      onClick={() => {
                        if (link.label === "Programs") {
                          setIsProgramsDropdownOpen(!isProgramsDropdownOpen);
                        } else if (link.label === "Ministries") {
                          setIsMinistriesDropdownOpen(!isMinistriesDropdownOpen);
                        } else if (link.label === "Media") {
                          setIsMediaDropdownOpen(!isMediaDropdownOpen);
                        } else if (link.label === "Connect") {
                          setIsConnectDropdownOpen(!isConnectDropdownOpen);
                        }
                      }}
                      aria-expanded={
                        link.label === "Programs" ? isProgramsDropdownOpen :
                        link.label === "Ministries" ? isMinistriesDropdownOpen :
                        link.label === "Media" ? isMediaDropdownOpen :
                        link.label === "Connect" ? isConnectDropdownOpen : false
                      }
                      aria-haspopup="true"
                    >
                      <link.icon className="h-3 w-3 md:h-4 md:w-4" />
                      {link.label}
                      <ChevronDownIcon
                        className={`h-2.5 w-2.5 md:h-3 md:w-3 transition-transform duration-300 ${
                          (link.label === "Programs" ? isProgramsDropdownOpen :
                           link.label === "Ministries" ? isMinistriesDropdownOpen :
                           link.label === "Media" ? isMediaDropdownOpen :
                           link.label === "Connect" ? isConnectDropdownOpen : false) ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`
                        absolute left-0 mt-2 w-56 rounded-xl
                        shadow-soft-xl bg-white ring-1 ring-black/5
                        focus:outline-none transform
                        transition-all duration-300 origin-top
                        ${
                          (link.label === "Programs" ? isProgramsDropdownOpen :
                           link.label === "Ministries" ? isMinistriesDropdownOpen :
                           link.label === "Media" ? isMediaDropdownOpen :
                           link.label === "Connect" ? isConnectDropdownOpen : false)
                            ? "opacity-100 scale-100 translate-y-0"
                            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                        }
                      `}
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby={`${link.label.toLowerCase()}-menu-button`}
                    >
                      <div className="py-2" role="menuitem" id="menu-items">
                        {link.children.map((childLink) => (
                          <Link
                            key={childLink.label}
                            to={childLink.path}
                            className="
                              block px-4 py-2.5 text-sm text-gray-700
                              hover:bg-primary-50 hover:text-primary-600
                              transition-colors duration-200
                              first:rounded-t-xl last:rounded-b-xl
                            "
                            role="menuitem"
                            onClick={() => {
                              if (link.label === "Programs") {
                                setIsProgramsDropdownOpen(false);
                              } else if (link.label === "Ministries") {
                                setIsMinistriesDropdownOpen(false);
                              } else if (link.label === "Connect") {
                                setIsConnectDropdownOpen(false);
                              }
                            }}
                          >
                            {childLink.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      flex items-center gap-1
                      font-sans text-xs md:text-sm font-medium
                      hover:text-primary-500 focus:text-primary-600
                      transition-all duration-300 tracking-wide
                      focus:outline-none focus:ring-2 focus:ring-primary-300
                      rounded-lg px-1 md:px-1.5 lg:px-2 py-1 hover:bg-primary-50/50
                      ${getTextColor("text-white")}
                    `}
                  >
                    <link.icon className="h-3 w-3 md:h-4 md:w-4" />
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
              className="
                p-1.5
                md:hidden
                focus:outline-none focus:ring-2 focus:ring-primary-400
                rounded-lg hover:bg-primary-50/50
                transition-colors duration-200
              "
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon
                  className={`h-6 w-6 ${getTextColor("text-white")}`}
                />
              ) : (
                <Bars3Icon
                  className={`h-6 w-6 ${getTextColor("text-white")}`}
                />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            ref={mobileMenuRef}
            className={`
              md:hidden
              overflow-hidden
              transition-all
              duration-300
              ease-in-out
              ${isMobileMenuOpen ? "max-h-screen" : "max-h-0"}
            `}
          >
            <div
              className={`
                ${
                  hasScrolled
                    ? "bg-white shadow-md"
                    : "bg-black/80 backdrop-blur-sm"
                }
                pb-4
                rounded-b-lg
              `}
            >
              {links.map((link) =>
                link.children ? ( // Ministries Mobile Dropdown
                  <div key={link.label}>
                    <button
                      className={`
                        flex items-center justify-between
                        px-4 py-3
                        text-base
                        font-semibold
                        uppercase
                        tracking-wide
                        transition-colors
                        group
                        w-full
                        ${
                          hasScrolled
                            ? "text-gray-800 hover:text-red-600 hover:bg-gray-100"
                            : "text-white hover:text-red-300 hover:bg-white/20"
                        }
                      `}
                      onClick={
                        link.label === "Programs" ? toggleMobileProgramsDropdown :
                        link.label === "Ministries" ? toggleMobileMinistriesDropdown :
                        link.label === "Media" ? toggleMobileMediaDropdown :
                        link.label === "Connect" ? toggleMobileConnectDropdown : null
                      }
                    >
                      <div className="flex items-center">
                        <link.icon
                          className={`
                            h-6 w-6 mr-3
                            ${hasScrolled ? "text-gray-600" : "text-white/80"}
                            group-hover:text-red-500
                          `}
                        />
                        {link.label}
                      </div>
                      <ChevronDownIcon
                        className={`
                          h-5 w-5
                          transition-transform duration-300
                          ${link.label === "Programs" ? (isMobileProgramsDropdownOpen ? "rotate-180" : "") :
                            link.label === "Ministries" ? (isMobileMinistriesDropdownOpen ? "rotate-180" : "") :
                            link.label === "Media" ? (isMobileMediaDropdownOpen ? "rotate-180" : "") :
                            link.label === "Connect" ? (isMobileConnectDropdownOpen ? "rotate-180" : "") : ""}
                          ${hasScrolled ? "text-gray-600" : "text-white/80"}
                          group-hover:text-red-500
                        `}
                      />
                    </button>
                    {(link.label === "Programs" ? isMobileProgramsDropdownOpen :
                      link.label === "Ministries" ? isMobileMinistriesDropdownOpen :
                      link.label === "Media" ? isMobileMediaDropdownOpen :
                      link.label === "Connect" ? isMobileConnectDropdownOpen : false) && (
                      <div className="pl-6">
                        {link.children.map((childLink) => (
                          <Link
                            key={childLink.label}
                            to={childLink.path}
                            className={`
                              block px-4 py-2.5 text-sm font-medium
                              transition-colors duration-200
                              ${
                                hasScrolled
                                  ? "text-gray-700 hover:text-red-600 hover:bg-gray-100"
                                  : "text-white hover:text-red-300 hover:bg-white/20"
                              }
                            `}
                            onClick={toggleMobileMenu}
                          >
                            {childLink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular Mobile Links
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      flex items-center
                      px-4 py-3
                      text-base
                      font-semibold
                      uppercase
                      tracking-wide
                      transition-colors
                      group
                      ${
                        hasScrolled
                          ? "text-gray-800 hover:text-red-600 hover:bg-gray-100"
                          : "text-white hover:text-red-300 hover:bg-white/20"
                      }
                    `}
                    onClick={toggleMobileMenu}
                  >
                    <link.icon
                      className={`
                        h-6 w-6 mr-3
                        ${hasScrolled ? "text-gray-600" : "text-white/80"}
                        group-hover:text-red-500
                      `}
                    />
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`
          fixed bottom-6 right-6 z-40
          bg-primary-500 hover:bg-primary-600
          text-white p-3 rounded-full shadow-lg
          transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary-400
          ${showScrollToTop ? "opacity-90 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
        `}
        aria-label="Scroll to top"
      >
        <ArrowUpIcon className="h-6 w-6" />
      </button>
    </>
  );
};

Navbar.propTypes = {
  isHidden: PropTypes.bool,
  scrollThreshold: PropTypes.number,
  forceOpaque: PropTypes.bool,
};

Navbar.defaultProps = {
  isHidden: false,
  scrollThreshold: 10,
  forceOpaque: false,
};

export default Navbar;
