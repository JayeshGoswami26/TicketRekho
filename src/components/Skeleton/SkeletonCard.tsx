import React from 'react';
import { motion } from 'framer-motion';
// import './shimmer.css';

const shimmerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  hover: {
    y: -5,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

const SupportCardSkeleton = () => {
  return (
    <motion.div
      className="relative bg-white dark:bg-boxdark rounded-xl shadow-sm border border-stroke dark:border-strokedark overflow-hidden"
      variants={shimmerVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="p-5">
        {/* Avatar and user info */}
        <div className="flex items-start mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-violet-400 shimmerCard" />
          <div className="ml-3 flex-1">
            <div className="h-4 w-2/5 mb-2 rounded bg-gradient-to-r from-indigo-300 to-violet-300 shimmerCard" />
            <div className="h-3 w-1/3 rounded bg-gradient-to-r from-indigo-200 to-violet-200 shimmerCard" />
          </div>
        </div>

        {/* Title & message */}
        <div className="mb-5">
          <div className="h-4 w-3/5 mb-3 rounded bg-gradient-to-r from-indigo-300 to-violet-300 shimmerCard" />
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-gradient-to-r from-indigo-200 to-violet-200 shimmerCard" />
            <div className="h-3 w-11/12 rounded bg-gradient-to-r from-indigo-200 to-violet-200 shimmerCard" />
            <div className="h-3 w-4/5 rounded bg-gradient-to-r from-indigo-200 to-violet-200 shimmerCard" />
          </div>
        </div>

        {/* Buttons and status */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex space-x-2">
            <div className="w-9 h-9 rounded-lg shimmerCard bg-gradient-to-r from-indigo-100 to-violet-100" />
            <div className="w-9 h-9 rounded-lg shimmerCard bg-gradient-to-r from-indigo-100 to-violet-100" />
          </div>
          <div className="px-5 py-2 rounded-full shimmerCard bg-gradient-to-r from-indigo-100 to-violet-100 text-xs font-medium w-20 h-6" />
        </div>
      </div>
    </motion.div>
  );
};

export default SupportCardSkeleton;
