import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import ThemeToggle from '../components/ui/ThemeToggle';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { href: '/lostfound', label: 'Lost & Found' },
    { href: '/bitlistings', label: 'Buy & Sell' },
    { href: '/hopbit', label: 'HopBIT' },
    { href: '/myattendance', label: 'Attendance' },
  ];

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser); // update user in context on login success
    setShowLogin(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    if (href.startsWith('http')) {
      return; // Let external links work normally
    }
    e.preventDefault();

    if (href === "/attendance" && !user) {
      toast("Please login to view and track your attendance.",
        {
          type: "error",
          duration: 3000,
          position: "bottom-right",
          icon: "❌",
        }
      );
      return;
    }

    // Navigate to the page directly without hash handling
    navigate(href);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      // console.error('Logout failed:', error);
      toast.error("Logout failed");
    }
  };

  const LoginOrProfileButton = user ? (
    <div className="flex items-center space-x-4">
      <ThemeToggle className="hidden sm:block" />
      <div className="relative group">
        <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
          <FaUser className="w-4 h-4" />
          <span className="hidden md:block">{user.name || user.fullname || 'Profile'}</span>
        </button>
        
        {/* Dropdown menu */}
        <div className="absolute right-0 mt-2 w-48 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
          <div className="py-2">
            <button
              onClick={() => navigate('/profile')}
              className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <FaUser className="w-4 h-4" />
              <span>View Profile</span>
            </button>
            <button
              onClick={() => navigate('/update-profile')}
              className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <FaUser className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
            <hr className="my-2 border-gray-200 dark:border-gray-600" />
      <button
        onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center space-x-2"
      >
              <FaSignOutAlt className="w-4 h-4" />
              <span>Sign Out</span>
      </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center space-x-4">
      <ThemeToggle className="hidden sm:block" />
      <button
        onClick={() => navigate('/login')}
        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-blue-400 font-medium transition-colors duration-300"
      >
        Sign in
      </button>
      <button
        onClick={() => navigate('/signup')}
        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
      >
        Get Started
      </button>
    </div>
  );

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-gray-50/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700' 
          : 'bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center space-x-2 group"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                OneBITstop
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map(({ href, label }) => {
                const isActive = location.pathname === href;
                return (
                  <a
                    key={label}
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className={`relative text-base font-medium transition-all duration-300 group px-1 ${
                      isActive 
                        ? 'text-purple-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-blue-400'
                    }`}
                  >
                    {label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                  </a>
                );
              })}
              {LoginOrProfileButton}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-4">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <FaTimes size={24} className="transform hover:rotate-90 transition-transform duration-300" />
                ) : (
                  <FaBars size={24} className="transform hover:rotate-180 transition-transform duration-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden fixed top-16 md:top-20 left-0 right-0 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 shadow-xl z-40 animate-slideInRight">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map(({ href, label }) => {
                const isActive = location.pathname === href;
                return (
                  <a
                    key={label}
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-purple-50 dark:bg-blue-900/20 text-purple-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {label}
                  </a>
                );
              })}
              
              <hr className="border-gray-200 dark:border-gray-700" />
              
                {user ? (
                <div className="space-y-3">
                  <div className="px-4 py-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                    <p className="font-medium text-gray-900 dark:text-white">{user.name || user.fullname || user.email}</p>
                  </div>
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <FaUser className="w-4 h-4" />
                    <span>View Profile</span>
                  </button>
                    <button
                    onClick={() => navigate('/update-profile')}
                    className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                    <FaUser className="w-4 h-4" />
                    <span>Edit Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                    <FaSignOutAlt className="w-4 h-4" />
                    <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                <div className="space-y-3">
                    <button
                      onClick={() => navigate('/login')}
                    className="w-full px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 text-left"
                    >
                      Sign in
                    </button>
                    <button
                      onClick={() => navigate('/signup')}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                    >
                      Get Started
                    </button>
                  </div>
                )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
