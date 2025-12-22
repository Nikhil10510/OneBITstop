import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AttendanceChart from "./connectingcomponents/AttendenceChart";
import AttendanceModal from "./connectingcomponents/AttendenceModal";
import Calendar from "./connectingcomponents/Calender";
import Navbar from "./connectingcomponents/MyattendanceNavbar";
import { useAuth } from "./context/AuthContext";
import { useTheme } from "./context/ThemeContext";
import toast, { Toaster } from "react-hot-toast";
import { getAttendance, updateAttendance as updateAttendanceApi } from "./services/operations/attendanceApi";
import FormLoader from "./components/ui/FormLoader";
const AttendenceManager = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [modalDate, setModalDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  useEffect(() => {
    if (!user) {
      toast(
        "Please log in to access attendance manager.",
        {
        icon: "🔒",
        duration: 3000,
        position: "bottom-right",
        }
      );
      navigate("/login");
      return;
    }

    const fetchAttendance = async () => {
      try {
        const token = user?.token || localStorage.getItem("token");

        if (!token) {
          toast(
            "No token found. Redirecting to login.",
            {
              icon: "🔒",
              duration: 3000,
              position: "bottom-right",
            }
          );
          navigate("/");
          return;
        }

        const data = await getAttendance(token);
        if (!Array.isArray(data?.data) || data?.data?.length === 0) {
          toast(
            "No attendance records found.",
            {
              icon: "❌",
              duration: 3000,
              position: "bottom-right",
            }
          );
          return;
        }

        const subs = data?.data?.map((rec) => rec.subject);
        setSubjects(subs);

        const attendanceData = {};
        data?.data?.forEach(({ subject, records }) => {
          if (subject && records) {
            attendanceData[subject] = records;
          }
        });

        setAttendance(attendanceData);
        if (subs.length > 0) setSelectedSubject(subs[0]);
      } catch (error) {
        const msg =
          error.response?.statusText ||
          error.message ||
          "An error occurred while fetching attendance.";
        toast(
          `Error: ${msg}`,
          {
            icon: "❌",
            duration: 3000,
            position: "bottom-right",
          }
        );
      }
    };

    fetchAttendance();
  }, [user, navigate]);

  const handleAttendanceUpdate = async (date, status) => {
    if (!selectedSubject) {
      toast(
        "Please select a subject first",
        {
          icon: "❌",
          duration: 3000,
          position: "bottom-right",
        }
      );
      return;
    }

    setIsUpdating(true);
    try {
      const token = user?.token || localStorage.getItem("token");
      if (!token) {
        toast(
          "No token found",
          {
            icon: "❌",
            duration: 3000,
            position: "bottom-right",
          }
        );
        return;
      }

      const response = await updateAttendanceApi({
        subject: selectedSubject,
        date,
        status: status.toLowerCase(),
      }, token);

      if (response.success) {
        // Update local state
        setAttendance((prev) => {
          const updated = { ...prev };
          if (!updated[selectedSubject]) updated[selectedSubject] = {};
          updated[selectedSubject][date] = status;
          return updated;
        });

        setModalDate(null);
        toast(
          "Attendance updated successfully!",
          {
            icon: "✅",
            duration: 3000,
            position: "bottom-right",
          }
        );
      } else {
        toast.error(response.message || "Failed to update attendance");
      }
    } catch (error) {
      toast(
        "Failed to update attendance",
        {
          icon: "❌",
          duration: 3000,
          position: "bottom-right",
        }
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const getChartDataForSubject = (subject) => {
    const records = attendance[subject] || {};
    const statusCounts = { present: 0, absent: 0, cancelled: 0 };

    Object.values(records).forEach((status) => {
      const normalized = status.toLowerCase();
      if (statusCounts.hasOwnProperty(normalized)) {
        statusCounts[normalized]++;
      }
    });

    return statusCounts;
  };

  return (
    <>
      <Toaster />        
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 pt-24 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <Navbar
            subjects={subjects}
            setSubjects={setSubjects}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
          />
          {selectedSubject && (
            <div className="flex flex-col md:flex-row mt-6 gap-4">
              <Calendar
                subject={selectedSubject}
                attendance={attendance}
                setModalDate={setModalDate}
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
              />
              <AttendanceChart data={getChartDataForSubject(selectedSubject)} />
            </div>
          )}
          <AttendanceModal
            date={modalDate}
            onClose={() => setModalDate(null)}
            onSelect={(date, status) => handleAttendanceUpdate(date, status)}
          />

          {isUpdating && <FormLoader message="Updating attendance, please wait..." />}
        </div>
      </div>
    </>
  );
};

export default AttendenceManager;
