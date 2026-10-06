import React from 'react';
import tamilNaduEmblemImg from './TamilNaduEmblem.jpg';

interface Props {
  className?: string;
  size?: number;
}

export const TamilNaduEmblem: React.FC<Props> = ({ 
  className = '', 
  size = 52 
}) => {
  return (
    <img
      src={tamilNaduEmblemImg}
      alt="Government of Tamil Nadu Official Emblem"
      width={size}
      height={size}
      className={`object-contain rounded-full shadow-xs shrink-0 select-none max-w-full ${className}`}
      loading="eager"
    />
  );
};

export default TamilNaduEmblem;
