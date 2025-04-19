import React from "react";
import SermonManager from "./SermonManager";
import SafeRender from "../common/SafeRender";

// This wrapper component catches and handles any rendering errors
// related to objects being rendered directly as React children
const SermonManagerWrapper = ({ darkMode }) => {
  return (
    <SafeRender darkMode={darkMode}>
      <SermonManager darkMode={darkMode} />
    </SafeRender>
  );
};

export default SermonManagerWrapper;
