import React from 'react';
import { FieldError } from 'react-hook-form';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface FormFieldProps {
  label: string;
  name: string;
  error?: FieldError;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  error,
  children,
  className,
}) => {
  return (
    <div className={clsx("mb-5", className)}>
      <label 
        htmlFor={name} 
        className="mb-2 block text-sm font-medium text-slate-900 dark:text-slate-100"
      >
        {label}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-500"
        >
          {error.message}
        </motion.p>
      )}
    </div>
  );
};

export default FormField;