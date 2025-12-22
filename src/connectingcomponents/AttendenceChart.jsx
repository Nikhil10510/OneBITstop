import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { useTheme } from "../context/ThemeContext";

Chart.register(ArcElement, Tooltip, Legend);

const AttendanceChart = ({ data = {} }) => {
  const { isDark } = useTheme();
  const counts = {
    Present: data.present || 0,
    Absent: data.absent || 0,
    Cancelled: data.cancelled || 0,
  };

  const total = counts.Present + counts.Absent;

  const chartData = {
    labels: ["Present", "Absent", "Cancelled"],
    datasets: [
      {
        data: [counts.Present, counts.Absent, counts.Cancelled],
        backgroundColor: [
          "rgba(52, 211, 153, 0.8)", // green
          "rgba(248, 113, 113, 0.8)", // red
          "rgba(209, 213, 219, 0.8)", // gray
        ],
        borderColor: [
          "rgba(52, 211, 153, 1)",
          "rgba(248, 113, 113, 1)",
          "rgba(209, 213, 219, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#e5e7eb" : "#374151",
          font: {
            size: 14,
            weight: "600",
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? "rgba(31, 41, 55, 0.9)" : "rgba(255, 255, 255, 0.9)",
        titleColor: isDark ? "#e5e7eb" : "#374151",
        bodyColor: isDark ? "#d1d5db" : "#6b7280",
        borderColor: isDark ? "#4b5563" : "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      },
    },
  };

  return (
    <div className="w-full lg:w-2/5 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl shadow-xl flex flex-col items-center p-8 border border-white/20 dark:border-gray-700/30">
      <h3 className="text-2xl font-extrabold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent drop-shadow-sm">
        Attendance Summary
      </h3>
      <div className="w-80 h-80 mb-6">
        <Pie data={chartData} options={chartOptions} />
      </div>
      <div className="text-center text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent tracking-wide drop-shadow-sm">
        {`${counts.Present}/${total} Present`} (
        {total ? ((counts.Present / total) * 100).toFixed(1) : 0}%)
      </div>
    </div>
  );
};

export default AttendanceChart;
