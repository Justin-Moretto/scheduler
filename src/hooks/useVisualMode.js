//import { action } from "@storybook/addon-actions/dist/preview";
import { useState } from "react";

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode);
  const [modeHistory, setModeHistory] = useState([initialMode]);

  const transition = (newMode, replace = false) => {
    if (newMode) {
      if (replace) {
        modeHistory.pop();
      }
      setMode(newMode);
      modeHistory.push(newMode);
      setModeHistory(prev => modeHistory);
    }
  }

  const back = () => {
    if (modeHistory.length > 1) {
      modeHistory.pop();
      setMode(modeHistory[modeHistory.length - 1]);
      setModeHistory(prev => modeHistory);
    }
  }

  return { mode, transition, back };
}
