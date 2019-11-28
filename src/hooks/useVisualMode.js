import React, { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode) {
    setHistory([...history, newMode]);
    setMode(newMode);
  }

  function back() {
    let newHist = [...history].slice(0, history.length-1)
    setHistory(newHist);
    setMode(newHist[newHist.length - 1]);
  }

  return { mode, transition, back };
}