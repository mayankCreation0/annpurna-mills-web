import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Loading = () => {
  const businessName = "श्री ANNAPURNA MILLS";
  const establishedYear = "SINCE 1958";

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4 text-white"
          variants={itemVariants}
        >
          {businessName.split(' ').map((word, idx) => (
            <span
              key={idx}
              className="inline-block mr-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            >
              {word}
            </span>
          ))}
        </motion.h1>
        <motion.h2
          className="text-xl md:text-2xl mb-8 text-gray-400 tracking-widest"
          variants={itemVariants}
        >
          {establishedYear}
        </motion.h2>
        <motion.div
          className="w-64 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden"
          variants={itemVariants}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
          />
        </motion.div>
        <motion.div
          className="mt-6 text-gray-500"
          variants={itemVariants}
        >
          Loading your experience...
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Loading;