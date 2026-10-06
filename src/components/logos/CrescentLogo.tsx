import React from 'react';
import crescentLogoImg from '../../assets/images/crescent_logo_1790734106697.jpg';

interface CrescentLogoProps {
  className?: string;
  size?: number;
}

export const CrescentLogo: React.FC<CrescentLogoProps> = ({
  className = '',
  size = 40
}) => {
  return (
    <div className={`inline-flex items-center gap-2 select-none shrink-0 ${className}`}>
      <img
        src={crescentLogoImg}
        alt="B.S. Abdur Rahman Crescent Institute of Science & Technology Logo"
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        className="rounded-full object-contain shrink-0 shadow-xs border border-white/20"
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default CrescentLogo;
