import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BITListings = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🛒",
      title: "Campus-Only Marketplace",
      description: "Buy and sell exclusively within the BIT Mesra community — no outsiders, no scams."
    },
    {
      icon: "📱",
      title: "Easy Listing & Browsing",
      description: "Post items in seconds with photos and descriptions. Browse categories or search for specific items."
    },
    {
      icon: "💬",
      title: "Direct Communication",
      description: "Chat directly with buyers/sellers through the platform or exchange contact details safely."
    },
    {
      icon: "🔒",
      title: "Verified Users",
      description: "Only verified BIT Mesra students can post and respond — ensuring trust and security."
    },
    {
      icon: "💰",
      title: "No Commission",
      description: "Keep 100% of your sale price. No hidden fees, no platform charges."
    },
    {
      icon: "📍",
      title: "Campus Pickup",
      description: "Meet on campus for safe, convenient exchanges. No need to travel far."
    }
  ];

  const categories = [
    { name: "Textbooks", icon: "📚", color: "from-blue-500 to-blue-600", count: "50+" },
    { name: "Electronics", icon: "💻", color: "from-green-500 to-green-600", count: "30+" },
    { name: "Furniture", icon: "🪑", color: "from-purple-500 to-purple-600", count: "25+" },
    { name: "Sports", icon: "⚽", color: "from-orange-500 to-orange-600", count: "20+" },
    { name: "Fashion", icon: "👕", color: "from-pink-500 to-pink-600", count: "40+" },
    { name: "Others", icon: "📦", color: "from-indigo-500 to-indigo-600", count: "35+" }
  ];

  const popularItems = [
    {
      name: "Data Structures Textbook",
      price: "₹200",
      condition: "Good",
      seller: "CSE 3rd Year"
    },
    {
      name: "Gaming Mouse",
      price: "₹800",
      condition: "Like New",
      seller: "IT 2nd Year"
    },
    {
      name: "Study Table",
      price: "₹1500",
      condition: "Excellent",
      seller: "Final Year"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 via-red-400/10 to-pink-400/10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              🛒 BITListings
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Your campus marketplace for buying and selling textbooks, electronics, furniture, and more. 
              Connect with fellow BITians for great deals!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={() => navigate('/bitlistings')}
              className="group relative px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">Sell Item</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => navigate('/bitlistings')}
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
            Why Choose BITListings?
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

      {/* Categories Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            📂 Browse Categories
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 group cursor-pointer"
                onClick={() => navigate('/sell-buy')}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {category.name}
                </h4>
                <div className={`w-full h-2 bg-gradient-to-r ${category.color} rounded-full mb-4`}></div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  {category.count} items available
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
            🔥 Popular Items
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {popularItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 cursor-pointer"
                onClick={() => navigate('/sell-buy')}
              >
                <div className="text-center mb-6">
                  <div className="text-3xl mb-2">📦</div>
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.condition} condition
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-orange-600">{item.price}</span>
                  <span className="text-sm text-gray-500">{item.seller}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Trading Today
          </h3>
          <p className="text-xl text-orange-100 mb-8">
            Join hundreds of BITians who are already buying and selling on our platform. 
            Great deals, trusted community, no commission!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/bitlistings')}
              className="px-8 py-4 bg-white text-orange-600 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              List Your Item
            </button>
            <button
              onClick={() => navigate('/bitlistings')}
              className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold hover:bg-white hover:text-orange-600 transition-all duration-300"
            >
              Browse Marketplace
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BITListings; 