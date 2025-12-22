// src/App.jsx
import "./App.css";
import { Routes, Route } from "react-router-dom";
import AttendenceManager from "./AttendenceManager";
import MainLayout from "./MainLayout";
import SellBuyPage from "./SellBuyPage";
import ScrollToTop from "./connectingcomponents/ScrollToTop";
import LostAndFoundListing from "./LostAndFoundListing";
import CarpoolingListing from "./CarpoolingListing";
import ProfileCard from "./ProfileCard";
import Navbar from "./connectingcomponents/Navbar";
import Footer from "./connectingcomponents/Footer";
import UpdateProfileForm from "./UpdateProfileForm";
import DeleteSubjectExample from "./DeleteSubjectExample";
import ClearAttendanceButton from "./clearAllattendencefromdb";
import VerifyEmailPage from "./verify-email";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import ImagePickerTest from "./ImagePickerTest";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const App = () => {
 return (
  <>
    <Navbar />
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/test" element={<h1>Test Page</h1>} />
      <Route path="/myattendance" element={<AttendenceManager />} />
      <Route path="/bitlistings" element={<SellBuyPage />} />
      <Route path="/lostfound" element={<LostAndFoundListing />} />
      <Route path="/hopbit" element={<CarpoolingListing />} />
      <Route path="/profile" element={<ProfileCard />} />
      <Route path="/update-profile" element={<UpdateProfileForm />} />
      <Route path="/deleteallAttendance" element={<ClearAttendanceButton />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      {/* ✅ New Image Picker Testing Route */}
      <Route path="/test-image-picker" element={<ImagePickerTest />} />
    </Routes>
    <Footer />
  </>
);
};

export default App;
