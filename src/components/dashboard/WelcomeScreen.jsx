import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Users, FileText, BarChart, Bell, Settings } from 'lucide-react';

const WelcomeScreen = ({ userName }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const dashboardFeatures = [
    { icon: Layers, text: "Document Management", description: "Upload, organize, and manage NLC documents efficiently." },
    { icon: Users, text: "User Administration", description: "Manage user accounts, roles, and permissions." },
    { icon: FileText, text: "Document Requests", description: "Handle and process incoming document requests." },
    { icon: BarChart, text: "Analytics Dashboard", description: "View insights and statistics about system usage." },
    { icon: Bell, text: "Notification Center", description: "Stay updated with important system alerts and messages." },
    { icon: Settings, text: "System Configuration", description: "Customize and configure dashboard settings." }
  ];

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 
        className="text-3xl font-bold text-gray-800 mb-6"
        variants={itemVariants}
      >
        Welcome to NLC Admin Dashboard, {userName}!
      </motion.h1>
      
      <motion.p 
        className="text-gray-600 mb-8"
        variants={itemVariants}
      >
        This dashboard provides centralized access to various administrative tools and features. 
        Explore the sidebar menu to navigate through different sections of the dashboard.
      </motion.p>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        {dashboardFeatures.map((feature, index) => (
          <motion.div
            key={index}
            className="p-4 rounded-lg bg-gray-50 flex items-start"
            whileHover={{ scale: 1.02 }}
          >
            <feature.icon className="w-8 h-8 mr-3 text-blue-500 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-800">{feature.text}</h3>
              <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        className="mt-12 bg-blue-50 p-6 rounded-lg"
        variants={itemVariants}
      >
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Getting Started</h2>
        <p className="text-blue-700">
          To begin, select a section from the sidebar menu. If you need any assistance or have questions about using the dashboard, 
          please refer to the user manual or contact the IT support team.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;