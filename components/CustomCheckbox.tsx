'use client';
import React from 'react';

interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  size?: 'small' | 'medium' | 'large';
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  checked,
  onChange,
  size = 'small',
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

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden peer"
      />

      <div
        className={`${classes.box} flex items-center justify-center rounded border border-white/30 bg-black/20 peer-checked:bg-blue-600 peer-checked:border-blue-600 dark:peer-checked:bg-white dark:peer-checked:border-white transition-all duration-200`}
        tabIndex={0}
      >
        {checked && (
          <svg
            className={`${classes.icon} dark:text-black text-white`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        )}
      </div>

      <span className="dark:text-white">{label}</span>
    </label>
  );
};

export default CustomCheckbox;
