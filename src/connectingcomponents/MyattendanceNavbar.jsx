import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext"; // Adjust path as needed
import { deleteSubject, addSubject, updateAttendance } from "../services/operations/attendanceApi";
import { toast } from "react-hot-toast";
import { BiTrash } from "react-icons/bi";
import { CalendarCheck } from "lucide-react";
import DropdownPortal from "../components/ui/DropdownPortal";
import FormLoader from "../components/ui/FormLoader";

const AddSubjectModal = ({ isOpen, onClose, onAddSubject }) => {
  const [newSubject, setNewSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    setIsLoading(true);
    try {
      await onAddSubject(newSubject);
      setNewSubject("");
      onClose();
    } catch (error) {
      // console.error("Error adding subject:", error);
      toast.error("Error adding subject");    
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-200/60 dark:border-gray-700/60">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add New Subject</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl transition-colors"
          >
            ×
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject Name
            </label>
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter subject name"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newSubject.trim() || isLoading}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                !newSubject.trim() || isLoading
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              }`}
            >
              {isLoading ? "Adding..." : "Add Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, subjectName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-200/60 dark:border-gray-700/60">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <BiTrash className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Delete Subject</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete <span className="font-semibold text-red-600 dark:text-red-400">{subjectName}</span>?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            This will permanently remove the subject and all its attendance records.
          </p>
        </div>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Delete Subject
          </button>
        </div>
      </div>
    </div>
  );
};

const Navbar = ({
  subjects,
  setSubjects,
  selectedSubject,
  setSelectedSubject,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [newSubject, setNewSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token, user } = useAuth(); // Use token from your Auth context
  // const token = localStorage.getItem("token"); // Fallback if not using context
  const dropdownButtonRef = useRef(null);

  const handleAddSubject = async (subjectName) => {
    setIsSubmitting(true);
    try {
      const trimmedSubject = subjectName.trim().toUpperCase(); // Convert to uppercase
      if (!trimmedSubject) return;

      if (!subjects.includes(trimmedSubject)) {
        const res = await addSubject(trimmedSubject, token);
        
        if (res.success) {
          setSubjects([...subjects, trimmedSubject]);
          setSelectedSubject(trimmedSubject);
          toast.success("Subject added successfully!");
        } else {
          toast.error(res.message || "Failed to add subject");
        }
      } else {
        toast.error("Subject already exists");
      }
    } catch (error) {
      // console.error("Failed to add subject:", error);
      toast.error("Failed to add subject");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (subject) => {
    setSubjectToDelete(subject);
    setIsDeleteModalOpen(true);
    setIsDropdownOpen(false); // Close dropdown when opening delete modal
  };

  const handleDeleteConfirm = async () => {
    if (!subjectToDelete) return;

    if (!token) {
      toast("User not authenticated",
        {
          type: "warning",
          duration: 3000,
          position: "bottom-right",
          icon: "🔔",
        }
      )
      // console.warn("No token found, aborting subject removal.");
      return;
    }

    try {
      // Use the API function instead of direct axios call
      await deleteSubject(subjectToDelete, token);

      // Remove subject locally after successful delete
      setSubjects(subjects.filter((s) => s !== subjectToDelete));

      // Reset selected subject if it was deleted
      if (selectedSubject === subjectToDelete) {
        setSelectedSubject(null);
      }

      toast.success("Subject deleted successfully!");
    } catch (error) {
      // console.error("Failed to delete subject:", error);
      toast("Failed to delete subject from database.",
        {
          type: "error",
          duration: 3000,
          position: "bottom-right",
          icon: "❌",
        }
      )
    } finally {
      setIsDeleteModalOpen(false);
      setSubjectToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setSubjectToDelete(null);
  };

  return (
    <>
      <nav className="flex flex-col md:flex-row items-center justify-between bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/30">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <CalendarCheck size={36} className="text-blue-500 dark:text-blue-400 drop-shadow-md" style={{background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} />
          <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent tracking-wide select-none">
            MyAttendance
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* My Subjects Dropdown */}
          <div className="relative">
            <button
              ref={dropdownButtonRef}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-colors"
            >
              <span className="font-semibold text-gray-800 dark:text-white">My Subjects</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">({subjects.length})</span>
              <svg
                className={`w-4 h-4 transition-transform text-gray-500 dark:text-gray-400 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <DropdownPortal anchorRef={dropdownButtonRef} open={isDropdownOpen}>
              <div className="mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Select Subject</h3>
                  {subjects.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No subjects added yet</p>
                  ) : (
                    <div className="space-y-1">
                      {subjects.map((subject) => (
                        <div
                          key={subject}
                          className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                            selectedSubject === subject
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                          }`}
                          onClick={() => {
                            setSelectedSubject(subject);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <span className="font-medium">{subject}</span>
                          <button
                            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:outline-none ml-2 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(subject);
                            }}
                            title="Remove subject"
                          >
                            <BiTrash/>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </DropdownPortal>
          </div>

          {/* Selected Subject Display */}
          {selectedSubject && (
            <div className="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
              {selectedSubject}
            </div>
          )}

          {/* Add New Subject Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none transition-colors whitespace-nowrap flex items-center gap-2"
            aria-label="Add new subject"
          >
            ➕ Add New Subject
          </button>
        </div>
      </nav>

      <AddSubjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSubject={handleAddSubject}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        subjectName={subjectToDelete}
      />

      {isSubmitting && <FormLoader message="Adding subject, please wait..." />}
    </>
  );
};

export default Navbar;
