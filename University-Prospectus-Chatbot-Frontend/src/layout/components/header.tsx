import { FC } from 'react';
import logo from '@/assets/logo.png';

export const Header: FC = () => {
  return (
    <div className="bg-primary w-full p-3 fixed top-0 left-0 z-50">
      <img 
        src={logo} 
        alt="Logo" 
        className="h-12 w-auto object-contain mix-blend-screen"
        style={{ filter: 'brightness(1.2) contrast(1.1)' }}
      />
    </div>
  );
};
