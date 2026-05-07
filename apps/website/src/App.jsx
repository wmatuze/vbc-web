import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QueryProvider from "./providers/QueryProvider";
import { DarkModeProvider } from "./contexts/DarkModeContext";

// ── Always-loaded layout / shell components ────────────────────────────────
import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";
import GlobalErrorBoundary from "./components/GlobalErrorBoundary";

// ── Home page sections (loaded on first visit, shared across sessions) ─────
import HeroSection from "./components/Home/HeroSection";
import MonthlyPrograms from "./components/Home/MonthlyPrograms";
import Ministries from "./components/Home/Ministries";
import HomeSermons from "./components/Home/Sermons";
import CallToAction from "./components/Home/CallToAction";

// ── Route-level lazy chunks (one JS file per page, loaded on demand) ───────
const AboutUs = lazy(() => import("./pages/AboutUs"));
const OurStory = lazy(() => import("./pages/OurStory"));
const Leadership = lazy(() => import("./pages/Leadership"));
const VisionMission = lazy(() => import("./pages/VisionMission"));
const WhatWeBelieve = lazy(() => import("./pages/WhatWeBelieve"));
const Missions = lazy(() => import("./pages/Missions"));
const Sermons = lazy(() => import("./pages/Sermons"));
const AudioSermons = lazy(() => import("./pages/AudioSermons"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Resources = lazy(() => import("./pages/Resources"));
const ZonesPage = lazy(() => import("./pages/ZonesPage"));
const ZoneDetailPage = lazy(() => import("./pages/ZoneDetailPage"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Membership = lazy(() => import("./pages/Membership"));
const Renew = lazy(() => import("./pages/Renew"));
const FirstTimers = lazy(() => import("./pages/FirstTimers"));
const FoundationClasses = lazy(() => import("./pages/FoundationClasses"));
const DiscipleshipClasses = lazy(() => import("./pages/DiscipleshipClasses"));
const ChurchCalendar = lazy(
  () => import("./components/ChurchCalendar/ChurchCalendar"),
);
const MensMinistry = lazy(() => import("./pages/Ministries/MensMinistry"));
const WomensMinistry = lazy(() => import("./pages/Ministries/WomensMinistry"));
const YouthMinistry = lazy(() => import("./pages/Ministries/YouthMinistry"));
const ChildrensMinistry = lazy(
  () => import("./pages/Ministries/ChildrensMinistry"),
);
const PraiseMinistry = lazy(() => import("./pages/Ministries/PraiseMinistry"));
const CouplesMinistry = lazy(
  () => import("./pages/Ministries/CouplesMinistry"),
);
// ── Admin ─────────────────────────────────────────────────────────────────
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./components/admin/AdminLogin"));
const DashboardContent = lazy(
  () => import("./components/admin/DashboardContent"),
);
const SermonManagerWrapper = lazy(
  () => import("./components/admin/SermonManagerWrapper"),
);
const EventManager = lazy(() => import("./components/admin/EventManager"));
const RecurringEventManager = lazy(
  () => import("./components/admin/RecurringEventManager"),
);
const LeaderManager = lazy(() => import("./components/admin/LeaderManager"));
const CellGroupManager = lazy(
  () => import("./components/admin/CellGroupManager"),
);
const RequestsManager = lazy(
  () => import("./components/admin/RequestsManager"),
);
const FoundationClassSessionManager = lazy(
  () => import("./components/admin/FoundationClassSessionManager"),
);
const DiscipleshipAdmin = lazy(
  () => import("./components/admin/DiscipleshipAdmin"),
);
const ResourceAdmin = lazy(() => import("./components/admin/ResourceAdmin"));
const ReportsAdmin = lazy(() => import("./components/admin/ReportsAdmin"));
const MediaManager = lazy(() => import("./components/admin/MediaManager"));
const SettingsContent = lazy(
  () => import("./components/admin/SettingsContent"),
);
const AdminGuide = lazy(() => import("./pages/admin/AdminGuide"));
const Support = lazy(() => import("./pages/admin/Support"));
const ErrorTester = lazy(() => import("./components/ErrorTester"));
const NotFound = lazy(() => import("./pages/NotFound"));

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

const NavbarWrapper = ({ isNavHidden }) => {
  const location = useLocation();
  if (location.pathname.startsWith("/admin")) return null;
  // All public pages open with a dark full-screen hero, so the navbar
  // starts transparent with white text and transitions to white on scroll.
  return <Navbar isHidden={isNavHidden} />;
};

const PageWrapper = ({ children, noPadding }) => (
  <div className={noPadding ? "" : "pt-20 2xl:pt-24 3xl:pt-28"}>{children}</div>
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
    // Reset nav visibility on every route change
    setIsNavHidden(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-vbc-dark">
      <ScrollToTop />
      <NavbarWrapper isNavHidden={isNavHidden} />

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
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
              </div>
            }
          >
            <Routes>
              <Route
                path="/"
                element={
                  <PageWrapper noPadding>
                    <HeroSection ref={heroRef} />
                    <MonthlyPrograms />
                    <Ministries />
                    <HomeSermons />
                    <CallToAction />
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
                path="/first-timers"
                element={
                  <PageWrapper noPadding>
                    <FirstTimers />
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
              <Route
                path="/discipleship-classes"
                element={
                  <PageWrapper noPadding>
                    <DiscipleshipClasses />
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

              {/* Media Pages - Now accessible directly */}
              <Route
                path="/sermons"
                element={
                  <PageWrapper noPadding>
                    <Sermons />
                  </PageWrapper>
                }
              />
              <Route
                path="/audio-sermons"
                element={
                  <PageWrapper noPadding>
                    <AudioSermons />
                  </PageWrapper>
                }
              />
              <Route
                path="/gallery"
                element={
                  <PageWrapper>
                    <Gallery />
                  </PageWrapper>
                }
              />
              <Route
                path="/resources"
                element={
                  <PageWrapper noPadding>
                    <Resources />
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

              {/* Admin login (standalone, outside layout) */}
              <Route
                path="/admin/login"
                element={
                  <DarkModeProvider>
                    <AdminLogin />
                  </DarkModeProvider>
                }
              />

              {/* Admin — nested routes under shared layout */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<DashboardContent />} />
                <Route path="sermons" element={<SermonManagerWrapper />} />
                <Route path="events" element={<EventManager />} />
                <Route
                  path="recurring-events"
                  element={<RecurringEventManager />}
                />
                <Route path="leaders" element={<LeaderManager />} />
                <Route path="cell-groups" element={<CellGroupManager />} />
                <Route path="members" element={<RequestsManager />} />
                <Route
                  path="foundation-classes"
                  element={<FoundationClassSessionManager />}
                />
                <Route path="discipleship" element={<DiscipleshipAdmin />} />
                <Route path="resources" element={<ResourceAdmin />} />
                <Route path="reports" element={<ReportsAdmin />} />
                <Route path="media" element={<MediaManager />} />
                <Route path="settings" element={<SettingsContent />} />
                <Route path="help" element={<AdminGuide />} />
                <Route path="support" element={<Support />} />
              </Route>

              {/* Sermons Debug route removed */}

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
          </Suspense>
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
