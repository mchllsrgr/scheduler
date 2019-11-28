import React, { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace) {
    let newHist = [...history, newMode]
    setHistory(newHist);
    setMode(newMode);

    if (replace === true) {
      newHist.splice(newHist.length-2, 2, newMode);
      setHistory(newHist)
      setMode(newHist[newHist.length - 1])
    }
  }

  function back() {
    let newHist = [...history].slice(0, history.length-1);
    if (newHist.length >= 1) {
      setHistory(newHist);
      setMode(newHist[newHist.length - 1]);
    }
  }

  return { mode, transition, back };
}