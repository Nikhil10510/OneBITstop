// src/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './connectingcomponents/Navbar';
import HeroSection from './connectingcomponents/HeroSection';
import BITListings from './connectingcomponents/BITListings';
import LostAndFound from './connectingcomponents/LostAndFound';
import HopBIT from './connectingcomponents/HopBIT';
import AttendancePreview from './connectingcomponents/AttendancePreview';
import BITMesraInfo from './connectingcomponents/BITMesraInfo';
// import Footer from './connectingcomponents/Footer';
import ClubStrip from './connectingcomponents/ClubStrip';
import LayoutGridDemo from './components/ui/layout-grid-demo';
import Loader from './components/ui/Loader';

const MainLayout = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <HeroSection />
      <ClubStrip />
      
      <LostAndFound />
      <HopBIT />
      {/* <SellBuySection /> */}
      <BITListings />
      <AttendancePreview />
      <BITMesraInfo />
    </>
  );
};

export default MainLayout;
