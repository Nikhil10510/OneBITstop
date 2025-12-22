import React, { useState } from "react";
import { clearAllAttendance } from "./services/operations/attendanceApi";
import ConfirmationModal from "./components/ui/ConfirmationModal";

const ClearAttendanceButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleClearAttendance = async () => {
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await clearAllAttendance(token);

      setMessage(
        response.message || "Attendance data cleared successfully."
      );
    } catch (error) {
      // console.error("Failed to clear attendance:", error);
      setMessage("Failed to clear attendance data.");
    } finally {
      setLoading(false);
    }
  };

  const openConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="pt-32 px-4 flex justify-center">
      <div className="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-sm text-center">
        <button
          onClick={openConfirmModal}
          disabled={loading}
          className={`w-full py-3 text-lg font-semibold rounded transition-colors duration-300 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 cursor-pointer"
          } text-white`}
        >
          {loading ? "Clearing..." : "Clear All Attendance"}
        </button>
        {message && (
          <p className="mt-4 text-gray-800 font-medium">{message}</p>
        )}
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={closeConfirmModal}
        onConfirm={handleClearAttendance}
        title="Clear All Attendance Data"
        message="Are you sure you want to clear ALL attendance data? This action cannot be undone."
        confirmText="Clear All Data"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        loading={loading}
      />
    </div>
  );
};

export default ClearAttendanceButton;
