import React from 'react';
import { Loader2 } from 'lucide-react';

const Spinner = ({
  size = 'md',
  color = 'primary',
  fullScreen = false,
  text,
  className = '',
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colors = {
    primary: 'text-primary-600',
    secondary: 'text-gray-600',
    white: 'text-white',
  };

  const spinnerClasses = `
    animate-spin
    ${sizes[size]}
    ${colors[color]}
    ${className}
  `;

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={spinnerClasses} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Spinner;