"use client";

import { createContext, useContext, useEffect, useState } from "react";

export const AVAILABLE_YEARS = [2024, 2025, 2026]
export const CURRENT_YEAR  = 2026
export const CURRENT_MONTH = 3

interface YearContextValue {
  selectedYear: number
  setSelectedYear: (y: number) => void
}

const YearContext = createContext<YearContextValue>({
  selectedYear: CURRENT_YEAR,
  setSelectedYear: () => {},
});

export function YearProvider({ children }: { children: React.ReactNode }) {
  const [selectedYear, setSelectedYearState] = useState<number>(CURRENT_YEAR);

  useEffect(() => {
    const saved = localStorage.getItem("mdd-selected-year");
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (AVAILABLE_YEARS.includes(parsed)) {
        setSelectedYearState(parsed);
      }
    }
  }, []);

  function setSelectedYear(y: number) {
    setSelectedYearState(y);
    localStorage.setItem("mdd-selected-year", String(y));
  }

  return (
    <YearContext.Provider value={{ selectedYear, setSelectedYear }}>
      {children}
    </YearContext.Provider>
  );
}

export function useYear() {
  return useContext(YearContext);
}
