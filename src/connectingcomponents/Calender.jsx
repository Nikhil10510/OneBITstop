import React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns";
import { useTheme } from "../context/ThemeContext";
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Map lowercase statuses directly from API to Tailwind classes
const statusColors = {
  present: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg",
  absent: "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg",
  cancelled: "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg",
};

const Calendar = ({
  subject,
  attendance = {},
  setModalDate,
  currentMonth,
  setCurrentMonth,
}) => {
  const { isDark } = useTheme();
  const start = startOfWeek(startOfMonth(currentMonth));
  const end = endOfMonth(currentMonth);

  const getStatus = (date) => {
    if (!subject || !attendance[subject]) return null;
    return attendance[subject][format(date, "yyyy-MM-dd")];
  };

  const renderDays = () => {
    const days = [];
    let date = start;

    while (date <= end || format(date, "EEEE") !== "Sunday") {
      const formatted = format(date, "d");
      const fullDate = format(date, "yyyy-MM-dd");
      const status = getStatus(date);
      const isInMonth = isSameMonth(date, currentMonth);

      days.push(
        <div
          key={fullDate}
          onClick={() => isInMonth && setModalDate(fullDate)}
          className={`flex items-center justify-center p-3 rounded-xl shadow-sm transition-all duration-200 cursor-pointer
            hover:scale-110 hover:shadow-lg 
            ${
              isInMonth
                ? statusColors[status?.toLowerCase()] || "bg-white/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 border border-gray-200/50 dark:border-gray-600/50 hover:bg-blue-50 dark:hover:bg-gray-600/80"
                : "bg-gray-100/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 pointer-events-none"
            }
            ${isInMonth && !status ? "hover:bg-blue-100 dark:hover:bg-blue-900/30" : ""}
          `}
          title={isInMonth ? `${formatted} - ${status || "No record"}` : ""}
        >
          <span className="select-none font-semibold">{formatted}</span>
        </div>
      );
      date = addDays(date, 1);
    }
    return days;
  };

  return (
    <div className="flex flex-col w-full lg:w-3/5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30">
      <div className="flex justify-between mb-6 items-center">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-3 rounded-full bg-white/30 dark:bg-gray-700/40 border border-white/30 dark:border-gray-700/40 shadow-md hover:bg-blue-100/40 dark:hover:bg-blue-900/30 hover:scale-105 transition-all duration-200 flex items-center justify-center"
          aria-label="Previous Month"
        >
          <ChevronLeft size={24} className="text-blue-500 dark:text-blue-400" />
        </button>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent select-none">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-3 rounded-full bg-white/30 dark:bg-gray-700/40 border border-white/30 dark:border-gray-700/40 shadow-md hover:bg-blue-100/40 dark:hover:bg-blue-900/30 hover:scale-105 transition-all duration-200 flex items-center justify-center"
          aria-label="Next Month"
        >
          <ChevronRight size={24} className="text-blue-500 dark:text-blue-400" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-3 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 select-none">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-3">{renderDays()}</div>

      {/* Legend */}
      <div className="flex space-x-6 mt-8 justify-center text-sm text-gray-700 dark:text-gray-300 select-none">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-inner"></div>
          <span>Present</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-inner"></div>
          <span>Absent</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full shadow-inner"></div>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
