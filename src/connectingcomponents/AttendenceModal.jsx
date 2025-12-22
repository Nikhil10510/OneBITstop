import React from "react";
import Modal from "react-modal";

// Set the app element for the modal
Modal.setAppElement("#root");

const AttendanceModal = ({ date, onClose, onSelect }) => {
  if (!date) return null;
  
  
  return (
  <Modal
    isOpen={!!date}
    onRequestClose={onClose}
    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-sm mx-auto p-8 outline-none relative transform transition-all duration-300 ease-in-out scale-100 border border-white/20 dark:border-gray-700/30"
    overlayClassName="fixed inset-0 backdrop-blur-sm bg-black/20 dark:bg-black/40 flex items-center justify-center z-50 p-4"
  >
    <h2 className="text-2xl font-extrabold mb-8 text-center bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent tracking-wide">
      Mark Attendance for <span className="text-blue-600 dark:text-blue-400">{date}</span>
    </h2>

    <div className="flex flex-col gap-4">
      <button
        onClick={() => onSelect(date, "Present")}
        className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 active:from-green-700 active:to-emerald-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
      >
        ✅ Present
      </button>

      <button
        onClick={() => onSelect(date, "Absent")}
        className="flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 active:from-red-700 active:to-pink-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
      >
        ❌ Absent
      </button>

      <button
        onClick={() => onSelect(date, "Cancelled")}
        className="flex items-center justify-center gap-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 active:from-gray-700 active:to-gray-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
      >
        🚫 Cancelled
      </button>
    </div>

    <button
      onClick={onClose}
      className="mt-8 block mx-auto text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none transition-colors duration-200"
    >
      Close
    </button>
  </Modal>
);
};

export default AttendanceModal;
