import { useEffect } from "react";
import Timeline from "../components/Timeline/Timeline";

const OurStory = () => {
  // Ensure the navbar is visible by setting a CSS variable that can be used in the navbar component
  useEffect(() => {
    // Add a class to the body to ensure the navbar is visible on this page
    document.body.classList.add('force-navbar-visible');
    
    return () => {
      // Clean up when component unmounts
      document.body.classList.remove('force-navbar-visible');
    };
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Spacer div to push content below navbar */}
      <div className="h-20"></div>
      <Timeline />
    </div>
  );
};

export default OurStory;
