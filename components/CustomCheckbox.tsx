'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'checkbox' | 'toggle';
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  checked,
  onChange,
  size = 'small',
  variant = 'checkbox',
}) => {
  const sizeClasses = {
    small: {
      box: '~w-2/5 ~h-2/5',
      icon: '~w-3/4 ~h-3/4',
    },
    medium: {
      box: 'w-5 h-5',
      icon: 'w-3 h-3',
    },
    large: {
      box: 'w-6 h-6',
      icon: 'w-4 h-4',
    },
  };

  const classes = sizeClasses[size];

  if (variant === 'toggle') {
    return (
      <label className="flex items-center justify-between gap-2 cursor-pointer">
        <span className="dark:text-white">{label}</span>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="hidden"
        />
        <div
          className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
            checked
              ? 'bg-blue-600 dark:bg-white'
              : 'bg-gray-300 dark:bg-white/20'
          }`}
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onChange()}
        >
          <motion.div
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full shadow-sm ${
              checked
                ? 'bg-white dark:bg-gray-900'
                : 'bg-white dark:bg-gray-400'
            }`}
            animate={{ x: checked ? 16 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </div>
      </label>
    );
  }

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden peer"
      />

      <motion.div
        className={`${classes.box} flex items-center justify-center rounded border border-white/30 bg-black/20 peer-checked:bg-blue-600 peer-checked:border-blue-600 dark:peer-checked:bg-white dark:peer-checked:border-white transition-all duration-200`}
        tabIndex={0}
        whileTap={{ scale: 1.1 }}
      >
        <AnimatePresence>
          {checked && (
            <motion.svg
              className={`${classes.icon} dark:text-black text-white`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
            >
              <motion.polyline
                points="20 6 9 17 4 12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2, delay: 0.05 }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>

      <span className="dark:text-white">{label}</span>
    </label>
  );
};

export default CustomCheckbox;
