"use client";

import { createContext, useContext, useEffect, useState } from "react";

const _now = new Date()
export const CURRENT_YEAR  = _now.getFullYear()
export const CURRENT_MONTH = _now.getMonth() + 1

function buildAvailableYears(): number[] {
  const years: number[] = []
  if (CURRENT_MONTH === 12) years.push(CURRENT_YEAR + 1)
  for (let y = CURRENT_YEAR; y >= 2024; y--) years.push(y)
  return years
}
export const AVAILABLE_YEARS = buildAvailableYears()

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
