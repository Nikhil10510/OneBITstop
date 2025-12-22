import React from "react";
import { clubs } from "../data/clubData";
import { motion } from "framer-motion";

const ClubStrip = () => {
  return (
    <div className="relative overflow-hidden py-4 border-y border-gray-200 dark:border-gray-700 bg-transparent backdrop-blur-md">
      {/* Background Text (placed on top with low opacity) */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900/10 dark:text-gray-300/10 drop-shadow-lg whitespace-nowrap">
          Vibrant Clubs of BIT Mesra
        </h2>
      </div>

      {/* Scrolling Clubs */}
      <div className="relative overflow-hidden">
        <div
          className="animate-scroll flex whitespace-nowrap items-center gap-4 sm:gap-6 px-3 sm:px-6 z-10"
          style={{ 
            willChange: "transform",
            width: "fit-content"
          }}
        >
          {/* First set of clubs */}
          {clubs.map((club, index) => (
            <motion.div
              key={`first-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 group cursor-pointer"
            >
              <a
              href={club.instagram}
              target="_blank"
              rel="noopener noreferrer"
                className="block"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 group-hover:border-gray-300 dark:group-hover:border-gray-600">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden mb-3 mx-auto">
                    <img
                      src={club.image}
                      alt={club.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white text-center group-hover:text-purple-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {club.name}
                  </h3>
                </div>
              </a>
            </motion.div>
          ))}

          {/* Duplicate set for seamless loop */}
          {clubs.map((club, index) => (
            <motion.div
              key={`second-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: (index + clubs.length) * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 group cursor-pointer"
            >
              <a
                href={club.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 group-hover:border-gray-300 dark:group-hover:border-gray-600">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden mb-3 mx-auto">
                <img
                  src={club.image}
                  alt={club.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white text-center group-hover:text-rose-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {club.name}
                  </h3>
              </div>
            </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubStrip;
