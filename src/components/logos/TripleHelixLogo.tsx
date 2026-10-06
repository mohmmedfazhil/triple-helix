import React from 'react';
import tripleHelixLogoImg from './TripleHelixLogo.jpg';

interface Props {
  className?: string;
  height?: number;
  showText?: boolean;
}

export const TripleHelixLogo: React.FC<Props> = ({ 
  className = '', 
  height = 44 
}) => {
  return (
    <div 
      className={`inline-flex items-center shrink-0 select-none max-w-full ${className}`}
    >
      <img
        src={tripleHelixLogoImg}
        alt="Triple Helix - Government · Academia · Industry"
        className="h-full w-auto max-w-full object-contain shrink-0"
        loading="eager"
      />
    </div>
  );
};

export default TripleHelixLogo;
