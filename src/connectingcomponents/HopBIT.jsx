import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HopBIT = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🚉",
      title: "Match Travel Plans with Peers",
      description: "Going to Patna, Ranchi, Kolkata, or Delhi? Just post your travel plans and find others heading the same way."
    },
    {
      icon: "👤",
      title: "Trusted Campus-Only Platform",
      description: "Only verified students from BIT Mesra can join — no outsiders, no random drivers."
    },
    {
      icon: "💬",
      title: "Coordinate Easily",
      description: "Use in-app chat or contact details to discuss transport options — train, auto, bus, or shared taxi."
    },
    {
      icon: "💸",
      title: "Save Money, Travel Smart",
      description: "Share cabs, autos, or split rides from station to campus. Budget-friendly and convenient."
    },
    {
      icon: "🌍",
      title: "Build Your Circle",
      description: "Meet new people, travel safer, and make your journey more enjoyable."
    },
    {
      icon: "📅",
      title: "No Cabs, No Bookings, No Commission",
      description: "HopBIT isn't a ride-hailing app — it's a travel matchmaker for students."
    }
  ];

  const popularRoutes = [
    { from: "BIT Mesra", to: "Ranchi Station", icon: "🚂", color: "from-blue-500 to-blue-600" },
    { from: "BIT Mesra", to: "Patna", icon: "🚌", color: "from-green-500 to-green-600" },
    { from: "BIT Mesra", to: "Kolkata", icon: "✈️", color: "from-purple-500 to-purple-600" },
    { from: "BIT Mesra", to: "Delhi", icon: "🚄", color: "from-orange-500 to-orange-600" },
    { from: "BIT Mesra", to: "Jamshedpur", icon: "🚗", color: "from-red-500 to-red-600" },
    { from: "BIT Mesra", to: "Bokaro", icon: "🚐", color: "from-indigo-500 to-indigo-600" }
  ];

  const travelTypes = [
    { type: "Train Travel", icon: "🚂", description: "Find travel buddies for train journeys" },
    { type: "Bus Trips", icon: "🚌", description: "Share bus rides to nearby cities" },
    { type: "Airport Drop", icon: "✈️", description: "Coordinate airport pickups and drops" },
    { type: "Local Travel", icon: "🚗", description: "Share autos and cabs within city" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-indigo-400/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              🚗 HopBIT
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Connect with fellow BITians for safe, affordable, and convenient travel arrangements. 
              No more solo journeys — find your travel buddy today!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate('/hopbit')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Start Traveling</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => navigate('/hopbit')}
              className="group relative px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <span className="relative z-10">Learn More</span>
              <div className="absolute inset-0 bg-gray-50 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            🤝 Why HopBIT?
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
                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            🗺️ Popular Routes
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularRoutes.map((route, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {route.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {route.from} → {route.to}
                </h4>
                <div className={`w-full h-2 bg-gradient-to-r ${route.color} rounded-full mb-4`}></div>
                <p className="text-gray-600 dark:text-gray-300">
                  Popular route with frequent travelers
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Types */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            Types of Travel
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {travelTypes.map((travel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {travel.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {travel.type}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {travel.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of BITians who are already using HopBIT to make their travels safer, 
            cheaper, and more enjoyable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/hopbit')}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Get Started Now
            </button>
            <button
              onClick={() => navigate('/hopbit')}
              className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Browse Routes
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HopBIT; 