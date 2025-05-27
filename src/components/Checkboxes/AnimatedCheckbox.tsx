import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface AnimatedCheckboxProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const AnimatedCheckbox: React.FC<AnimatedCheckboxProps> = ({
  checked,
  onChange,
  label,
}) => {
  return (
    <label className="inline-flex items-center cursor-pointer group">
      <div className="relative">
        <motion.div
          initial={false}
          animate={{
            backgroundColor: checked ? '#6366F1' : '#fff',
            borderColor: checked ? '#6366F1' : '#D1D5DB',
          }}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
            checked ? 'bg-indigo-500 border-indigo-500' : 'border-gray-300'
          }`}
          onClick={onChange}
        >
          <motion.div
            initial={false}
            animate={{
              opacity: checked ? 1 : 0,
              scale: checked ? 1 : 0.5,
            }}
            transition={{ duration: 0.2 }}
          >
            <Check size={14} className="text-white" />
          </motion.div>
        </motion.div>
      </div>
      <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">
        {label}
      </span>
    </label>
  );
};

export default AnimatedCheckbox;