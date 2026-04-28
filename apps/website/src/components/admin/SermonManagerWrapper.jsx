import SermonManager from "./SermonManager";
import SafeRender from "../common/SafeRender";
import { useDarkMode } from "../../contexts/DarkModeContext";

const SermonManagerWrapper = () => {
  const { darkMode } = useDarkMode();
  return (
    <SafeRender darkMode={darkMode}>
      <SermonManager darkMode={darkMode} />
    </SafeRender>
  );
};

export default SermonManagerWrapper;
