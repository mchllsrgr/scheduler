import React, { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);

  function transition(initial) {
    setMode(initial);
  }

  return { mode, transition };
}