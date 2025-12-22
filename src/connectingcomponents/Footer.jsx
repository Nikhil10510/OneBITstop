import React, { useState } from "react";
import {
  Heart,
  Linkedin,
  Instagram,
  Github,
  TreePalm,
  Home,
  X,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);

  const socialProfiles = [
    {
      id: "home",
      name: "Home",
      icon: Home,
      color: "orange",
      link: "/",
      description: "Return to homepage"
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "blue",
      description: "Connect with our team on LinkedIn",
      profiles: [
        {
          id: "Nikhil",
          name: "Nikhil Kumar",
          role: "Aspiring Software Developer",
          company: "BIT Mesra",
          location: "Ranchi, Jharkhand",
          about: "Creative developer focused on user experience and modern web technologies.",
          experience: "1.5+ years in Full Stack development",
          skills: ["React", "Nodejs", "TypeScript", "CSS", "DataStructure&Algorithms"],
          link: "https://www.linkedin.com/in/nikhil-kumar-4918a6312"
        },
      ]
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "pink",
      description: "Follow our team on Instagram",
      profiles: [
        {
          id: "Nikhil",
          name: "Nikhil Kumar",
          handle: "@nikhil_1656",
          followers: "400+",
          content: "Personal Instagram",
          highlights: ["Personal", "Lifestyle", "Campus Life"],
          link: "https://www.instagram.com/nikhil_1656?igsh=MTJxd3V2MjhqdGtlMQ=="
        },
      ]
    },
    {
      id: "github",
      name: "GitHub",
      icon: Github,
      color: "black",
      description: "View our projects on GitHub",
      profiles: [
        {
          id: "Nikhil10510",
          name: "Nikhil Kumar",
          repos: "15+",
          followers: "10+",
          contributions: "50+",
          topLanguages: ["TypeScript", "React", "Nodejs"],
          featuredProjects: ["UI Components", "Portfolio", "Blog"],
          link: "https://github.com/Nikhil10510"
        },
      ]
    },
  ];

  const handleProfileClick = (platform) => {
    if (platform.id === "home") {
      window.location.href = platform.link;
    } else if (platform.profiles && platform.profiles.length > 0) {
      // Skip selection and go straight to the first profile's details
      setSelectedProfile(platform.profiles[0]);
    }
  };

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile);
    setSelectedPlatform(null);
  };

  const closePopup = () => {
    setSelectedProfile(null);
    setSelectedPlatform(null);
  };

  const handleBackToPlatform = () => {
    setSelectedProfile(null);
    // Don't set selectedPlatform to null here, keep it open
  };

  const handleExternalLink = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
    closePopup();
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Updates', href: '/updates' }
    ],
    support: [
      { name: 'Documentation', href: '/docs' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Contact Us', href: '/contact' }
    ],
    legal: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Data Protection', href: '/data-protection' }
    ]
  };

  return (
    <footer className="bg-gradient-to-t from-gray-100 via-white to-white dark:from-slate-900 dark:via-gray-900 dark:to-gray-900 text-gray-700 dark:text-gray-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(to_bottom,white,transparent)] dark:bg-grid-slate-700/50 dark:[mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xs">O</span>
              </div>
              <span className="text-base sm:text-lg md:text-xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                OneBITstop
              </span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Empowering students, digitally ✨
            </p>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-center md:text-left mb-4 md:mb-0">
            &copy; {currentYear} OneBITstop. All rights reserved. - Made with ❤️ by BITians for BITians
          </p>
          <div className="flex items-center space-x-4">
            {socialProfiles.map((platform, index) => (
              <button
                key={platform.id}
                onClick={() => handleProfileClick(platform)}
                className="p-2 rounded-full bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-300/70 dark:hover:bg-gray-600/70 transition-all duration-200"
                aria-label={`Visit our ${platform.name}`}
              >
                <platform.icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            ))}
          </div>
        </div>
      </div>

      

      {/* Pop-up for profile details */}
      {selectedProfile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={closePopup}
        >
          <motion.div
             initial={{ scale: 0.9, y: 20 }}
             animate={{ scale: 1, y: 0 }}
             exit={{ scale: 0.9, y: 20 }}
             transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-lg relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col items-center text-center">
              <img
                src={`https://ui-avatars.com/api/?name=${selectedProfile.name.replace(/\s/g, '+')}&background=random`}
                alt={selectedProfile.name}
                className="w-24 h-24 rounded-full mb-4 border-4 border-gray-200 dark:border-gray-700"
              />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProfile.name}</h3>
              {selectedProfile.role && <p className="text-md text-gray-600 dark:text-gray-400">{selectedProfile.role} @ {selectedProfile.company}</p>}
              {selectedProfile.handle && <p className="text-md text-gray-500 dark:text-gray-400">{selectedProfile.handle}</p>}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedProfile.location}</p>
              
              <div className="my-6 w-full border-t border-gray-200 dark:border-gray-700" />
              
              {selectedProfile.about && (
                <div className="text-left w-full mb-4">
                  <h4 className="font-semibold mb-1 text-gray-800 dark:text-white">About</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{selectedProfile.about}</p>
                </div>
              )}
              {selectedProfile.experience && (
                <div className="text-left w-full mb-4">
                  <h4 className="font-semibold mb-1 text-gray-800 dark:text-white">Experience</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{selectedProfile.experience}</p>
                </div>
              )}
              {selectedProfile.skills && (
                <div className="text-left w-full mb-4">
                  <h4 className="font-semibold mb-1 text-gray-800 dark:text-white">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedProfile.topLanguages && (
                <div className="text-left w-full mb-4">
                  <h4 className="font-semibold mb-1 text-gray-800 dark:text-white">Top Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.topLanguages.map((lang, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedProfile.featuredProjects && (
                <div className="text-left w-full mb-4">
                  <h4 className="font-semibold mb-1 text-gray-800 dark:text-white">Featured Projects</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProfile.featuredProjects.map((project, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {project}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {selectedProfile.theme && (
                <div className="text-left w-full mb-4">
                  <h4 className="font-semibold mb-1 text-gray-800 dark:text-white">Theme</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{selectedProfile.theme}</p>
                </div>
              )}
              
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleBackToPlatform}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => handleExternalLink(selectedProfile.link)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Visit Profile
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </footer>
  );
};

export default Footer;
