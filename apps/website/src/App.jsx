import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { HelmetProvider } from "react-helmet-async"; // Import HelmetProvider
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QueryProvider from "./providers/QueryProvider";
import Navbar from "./components/Layout/Navbar";
import HeroSection from "./components/Home/HeroSection";
import Ministries from "./components/Home/Ministries";
import HomeSermons from "./components/Home/Sermons";
import CallToAction from "./components/Home/CallToAction";
import Footer from "./components/Layout/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import GlobalErrorBoundary from "./components/GlobalErrorBoundary";
import Membership from "./pages/Membership";
import Renew from "./pages/Renew"; // Import Membership Renewal page
import FoundationClasses from "./pages/FoundationClasses"; // Import Foundation Classes page
import ZonesPage from "./pages/ZonesPage";
import ZoneDetailPage from "./pages/ZoneDetailPage";
import Media from "./pages/Media";
import Missions from "./pages/Missions";
import AboutUs from "./pages/AboutUs";
import Sermons from "./pages/Sermons";
import SermonsDebug from "./pages/SermonsDebug"; // Import debug component
import Videos from "./pages/Videos";
import Resources from "./pages/Resources";
import Podcasts from "./pages/Podcasts";
import Gallery from "./pages/Gallery";
import NotFound from "./pages/NotFound";
import OurStory from "./pages/OurStory";
import Leadership from "./pages/Leadership";
import VisionMission from "./pages/VisionMission"; // Import new Vision & Mission page
import WhatWeBelieve from "./pages/WhatWeBelieve"; // Import new What We Believe page
import MensMinistry from "./pages/Ministries/MensMinistry";
import WomensMinistry from "./pages/Ministries/WomensMinistry";
import YouthMinistry from "./pages/Ministries/YouthMinistry";
import ChildrensMinistry from "./pages/Ministries/ChildrensMinistry";
import PraiseMinistry from "./pages/Ministries/PraiseMinistry";
import CouplesMinistry from "./pages/Ministries/CouplesMinistry";
import ContactUs from "./pages/ContactUs";
import Admin from "./pages/Admin"; // Import Admin component
import AdminGuide from "./pages/admin/AdminGuide"; // Import Admin Guide page
import Support from "./pages/admin/Support"; // Import Support page
import ErrorTester from "./components/ErrorTester"; // Import Error Tester component
import ProtectedRoute from "./components/auth/ProtectedRoute"; // Import ProtectedRoute component
import TestMedia from "./pages/TestMedia"; // Import our test page

// ✅ Import the ChurchCalendar component
import ChurchCalendar from "./components/ChurchCalendar/ChurchCalendar";

// Move these components inside the Router context
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

const NavbarWrapper = ({ heroRef, isNavHidden }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isSermonsPage = location.pathname.includes("/sermons");

  return (
    <Navbar isHidden={isNavHidden} forceOpaque={isAdminPage || isSermonsPage} />
  );
};

const PageWrapper = ({ children, noPadding }) => (
  <div className={noPadding ? "" : "pt-20 pb-16"}>{children}</div>
);

// Create a new AppContent component that uses Router-dependent hooks
const AppContent = () => {
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const heroRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => setIsPageLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      // Only apply this effect on pages with hero sections (noPadding pages)
      if (location.pathname === "/" || !location.pathname.includes("admin")) {
        // Use a different scroll threshold for non-homepage routes
        const scrollPosition = window.scrollY;
        setIsNavHidden(scrollPosition > 100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ScrollToTop />
      <NavbarWrapper isNavHidden={isNavHidden} heroRef={heroRef} />

      <main className="flex-grow relative">
        <div
          className={`
            fixed inset-0 bg-white z-50 pointer-events-none
            transition-opacity duration-300
            ${isPageLoading ? "opacity-100" : "opacity-0"}
          `}
        />

        <div
          className={`
            transition-opacity duration-300 ease-in-out
            ${isPageLoading ? "opacity-0" : "opacity-100"}
          `}
        >
          <Routes>
            <Route
              path="/"
              element={
                <PageWrapper noPadding>
                  <div className="space-y-16 md:space-y-24">
                    <HeroSection ref={heroRef} />
                    <Ministries />
                    <HomeSermons />
                    <CallToAction />
                  </div>
                </PageWrapper>
              }
            />

            {/* AboutUs */}
            <Route
              path="/about"
              element={
                <PageWrapper noPadding>
                  <AboutUs />
                </PageWrapper>
              }
            />
            <Route
              path="/about/our-story"
              element={
                <PageWrapper noPadding>
                  <OurStory />
                </PageWrapper>
              }
            />
            <Route
              path="/about/leadership-team"
              element={
                <PageWrapper noPadding>
                  <Leadership />
                </PageWrapper>
              }
            />
            <Route
              path="/about/vision-mission"
              element={
                <PageWrapper noPadding>
                  <VisionMission />
                </PageWrapper>
              }
            />
            <Route
              path="/about/what-we-believe"
              element={
                <PageWrapper noPadding>
                  <WhatWeBelieve />
                </PageWrapper>
              }
            />

            {/* Membership */}
            <Route
              path="/membership"
              element={
                <PageWrapper noPadding>
                  <Membership />
                </PageWrapper>
              }
            />
            <Route
              path="/renew"
              element={
                <PageWrapper noPadding>
                  <Renew />
                </PageWrapper>
              }
            />
            <Route
              path="/foundation-classes"
              element={
                <PageWrapper noPadding>
                  <FoundationClasses />
                </PageWrapper>
              }
            />

            {/* Cell Groups */}
            <Route
              path="/cell-groups"
              element={
                <PageWrapper noPadding>
                  <ZonesPage />
                </PageWrapper>
              }
            />
            <Route
              path="/cell-groups/:zoneId"
              element={
                <PageWrapper noPadding>
                  <ZoneDetailPage />
                </PageWrapper>
              }
            />

            {/* Media Pages */}
            <Route
              path="/media"
              element={
                <PageWrapper noPadding>
                  <Media />
                </PageWrapper>
              }
            />
            <Route
              path="/media/sermons"
              element={
                <PageWrapper noPadding>
                  <Sermons />
                </PageWrapper>
              }
            />
            <Route
              path="/media/videos"
              element={
                <PageWrapper>
                  <Videos />
                </PageWrapper>
              }
            />
            <Route
              path="/media/podcasts"
              element={
                <PageWrapper>
                  <Podcasts />
                </PageWrapper>
              }
            />
            <Route
              path="/media/gallery"
              element={
                <PageWrapper>
                  <Gallery />
                </PageWrapper>
              }
            />
            <Route
              path="/media/resources"
              element={
                <PageWrapper>
                  <Resources />
                </PageWrapper>
              }
            />
            <Route
              path="/media/test"
              element={
                <PageWrapper>
                  <TestMedia />
                </PageWrapper>
              }
            />

            {/* Ministries Pages */}
            <Route
              path="/ministries/mens"
              element={
                <PageWrapper noPadding>
                  <MensMinistry />
                </PageWrapper>
              }
            />
            <Route
              path="/ministries/womens"
              element={
                <PageWrapper noPadding>
                  <WomensMinistry />
                </PageWrapper>
              }
            />
            <Route
              path="/ministries/youths"
              element={
                <PageWrapper noPadding>
                  <YouthMinistry />
                </PageWrapper>
              }
            />
            <Route
              path="/ministries/children"
              element={
                <PageWrapper noPadding>
                  <ChildrensMinistry />
                </PageWrapper>
              }
            />
            <Route
              path="/ministries/praise"
              element={
                <PageWrapper noPadding>
                  <PraiseMinistry />
                </PageWrapper>
              }
            />
            <Route
              path="/ministries/couples"
              element={
                <PageWrapper noPadding>
                  <CouplesMinistry />
                </PageWrapper>
              }
            />

            {/* Missions Page */}
            <Route
              path="/missions"
              element={
                <PageWrapper noPadding>
                  <Missions />
                </PageWrapper>
              }
            />

            {/* Church Events */}
            <Route
              path="/events"
              element={
                <PageWrapper noPadding>
                  <ChurchCalendar />
                </PageWrapper>
              }
            />

            {/* Contact Us */}
            <Route
              path="/contact"
              element={
                <PageWrapper noPadding>
                  <ContactUs />
                </PageWrapper>
              }
            />

            {/* Admin Dashboard and related pages */}
            <Route
              path="/admin"
              element={
                <PageWrapper>
                  <Admin />
                </PageWrapper>
              }
            />
            <Route
              path="/admin/help"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <AdminGuide darkMode={false} />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/support"
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Support darkMode={false} />
                  </PageWrapper>
                </ProtectedRoute>
              }
            />

            {/* Sermons Debug */}
            <Route
              path="/sermons-debug"
              element={
                <PageWrapper>
                  <SermonsDebug />
                </PageWrapper>
              }
            />

            {/* Error Boundary Test */}
            <Route
              path="/test-error-boundary"
              element={
                <PageWrapper>
                  <ErrorTester />
                </PageWrapper>
              }
            />

            {/* 404 Error Page */}
            <Route
              path="*"
              element={
                <PageWrapper>
                  <NotFound />
                </PageWrapper>
              }
            />
          </Routes>
        </div>
      </main>

      {/* Only show the main footer on non-admin pages */}
      {!location.pathname.includes("/admin") && <Footer />}
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <GlobalErrorBoundary>
        <QueryProvider>
          <BrowserRouter>
            <AppContent />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </BrowserRouter>
        </QueryProvider>
      </GlobalErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
