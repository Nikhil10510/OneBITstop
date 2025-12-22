import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const AttendancePreview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: "📊",
      title: "Visual Analytics",
      description: "Track your attendance with beautiful charts and detailed statistics."
    },
    {
      icon: "📅",
      title: "Calendar View",
      description: "Mark attendance directly on an interactive calendar interface."
    },
    {
      icon: "📚",
      title: "Subject Management",
      description: "Add, remove, and manage multiple subjects with ease."
    },
    {
      icon: "📈",
      title: "Progress Tracking",
      description: "Monitor your attendance percentage and identify patterns."
    },
    {
      icon: "🔔",
      title: "Smart Reminders",
      description: "Never miss marking your attendance with intelligent notifications."
    },
    {
      icon: "📱",
      title: "Mobile Friendly",
      description: "Access your attendance data from anywhere, anytime."
    }
  ];

  const stats = [
    { label: "Subjects", value: "Unlimited", icon: "📚" },
    { label: "Attendance Types", value: "3", icon: "✅❌🚫" },
    { label: "Data Sync", value: "Real-time", icon: "🔄" },
    { label: "Export", value: "Available", icon: "📤" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-indigo-400/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              📊 Attendance Manager
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Track your academic progress with precision. Monitor attendance across all subjects, 
              visualize your performance, and stay on top of your academic goals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate('/myattendance')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Start Tracking</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => navigate('/myattendance')}
              className="group relative px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <span className="relative z-10">View Demo</span>
              <div className="absolute inset-0 bg-gray-50 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            ✨ Key Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
              📈 Platform Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl mb-3">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                Smart Attendance Tracking
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Our intelligent attendance system helps you maintain accurate records across all your subjects. 
                With visual analytics, you can easily identify patterns and improve your attendance percentage.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-3">✓</span>
                  Easy one-click attendance marking
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-3">✓</span>
                  Real-time percentage calculations
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-3">✓</span>
                  Export data for analysis
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <span className="text-green-500 mr-3">✓</span>
                  Mobile-responsive design
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-2xl p-8 h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Attendance Dashboard</h4>
                  <p className="text-gray-600 dark:text-gray-400">Track, Analyze, Excel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Take Control of Your Academic Journey
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who are already using our attendance manager to stay on track 
            and achieve their academic goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/myattendance')}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Get Started Now
            </button>
            <button
              onClick={() => navigate('/myattendance')}
              className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AttendancePreview; 