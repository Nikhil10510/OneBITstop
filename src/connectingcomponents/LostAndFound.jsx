import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LostAndFound = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🧾",
      title: "Post Lost Items",
      description: "Share details of what you lost — where, when, and any identifying features — so others can help."
    },
    {
      icon: "👜",
      title: "Post Found Items",
      description: "If you've found something lying around, help reunite it with its owner by listing it here."
    },
    {
      icon: "📸",
      title: "Image Uploads",
      description: "Add photos of found/lost items for easier identification and better chances of recovery."
    },
    {
      icon: "🎯",
      title: "Campus-Only Access",
      description: "Only verified BIT Mesra members can post or respond — making the platform safe, secure, and focused."
    },
    {
      icon: "🔔",
      title: "Notifications",
      description: "Get updates when someone responds to your post or when a match is found."
    },
    {
      icon: "💬",
      title: "Direct Contact",
      description: "Coordinate safely through in-app or provided contact info to arrange the return."
    }
  ];

  const commonItems = [
    { name: "ID Cards", icon: "🪪", color: "from-blue-500 to-blue-600" },
    { name: "Electronics", icon: "💻", color: "from-green-500 to-green-600" },
    { name: "Water Bottles", icon: "🥤", color: "from-purple-500 to-purple-600" },
    { name: "Books & Notes", icon: "📚", color: "from-orange-500 to-orange-600" },
    { name: "Wallets", icon: "👛", color: "from-pink-500 to-pink-600" },
    { name: "Chargers", icon: "🔌", color: "from-indigo-500 to-indigo-600" }
  ];

  const successStories = [
    {
      item: "Student ID Card",
      found: "Library",
      time: "2 hours",
      story: "Lost my ID card during exam prep, found it the same day!"
    },
    {
      item: "Laptop Charger",
      found: "Cafeteria",
      time: "1 day",
      story: "Someone found my charger and contacted me immediately."
    },
    {
      item: "Water Bottle",
      found: "Sports Complex",
      time: "30 minutes",
      story: "Quick recovery thanks to the campus community!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 via-blue-400/10 to-purple-400/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              🔍 Lost & Found
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Lost something on campus? Found an item? Our community-driven platform helps 
              reunite lost items with their owners quickly and safely.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate('/lostfound')}
              className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Report Lost Item</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => navigate('/lostfound')}
              className="group relative px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <span className="relative z-10">Browse Items</span>
              <div className="absolute inset-0 bg-gray-50 dark:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            🔍 How BIT Lost & Found Helps You
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

      {/* Common Items */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            📦 Commonly Lost Items
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {commonItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 group"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {item.name}
                </h4>
                <div className={`w-full h-2 bg-gradient-to-r ${item.color} rounded-full mb-4`}></div>
                <p className="text-gray-600 dark:text-gray-300">
                  Frequently lost on campus
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            🎉 Success Stories
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="text-center mb-6">
                  <div className="text-3xl mb-2">✅</div>
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                    {story.item}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Found in {story.found} • {story.time}
                  </p>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-center italic">
                  "{story.story}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Help Someone Today
          </h3>
          <p className="text-xl text-green-100 mb-8">
            Whether you've lost something or found an item, our community is here to help. 
            Every post brings us closer to reuniting items with their owners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/lostfound')}
              className="px-8 py-4 bg-white text-green-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              Report Lost Item
            </button>
            <button
              onClick={() => navigate('/lostfound')}
              className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold hover:bg-white hover:text-green-600 transition-all duration-300"
            >
              Browse Found Items
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LostAndFound;
