import { FC } from 'react';
import udgChatLogo from '@/assets/udg_chat.png';
import logo from '@/assets/logo.png';


export const Sidebar: FC = () => {
    return (
        <div className="sm:flex flex-col justify-between items-center py-8 px-5 h-full hidden bg-black text-white shadow-2xl border-r-[3px] border-[#800020] relative overflow-hidden" style={{display: 'none'}}>
            {/* Animated background particles */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-1/2 w-32 h-32 bg-[#800020] rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 left-1/2 w-32 h-32 bg-[#A00030] rounded-full blur-3xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
            
            {/* Vertical gradient line */}
            <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-[#800020] to-transparent"></div>
            
            {/* Top Section - Logo with floating effect */}
            <div className="flex flex-col items-center gap-6 relative z-10">
                <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-[#800020] rounded-2xl blur-2xl opacity-50 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
                    
                    {/* Logo */}
                    <div className="relative">
                        <img 
                            src={logo} 
                            alt="Sixt Logo" 
                            className="h-19 w-auto object-contain mix-blend-screen relative z-15 rounded-2xl"
                            style={{ filter: 'brightness(1.3) contrast(1.2) drop-shadow(0 0 10px rgba(255, 95, 0, 0.5))' }}
                        />
                    </div>
                </div>
                
          
            </div>

          

            {/* Bottom Section - Status with glow */}
            <div className="flex flex-col items-center gap-5 relative z-10">
                <div className="relative group">
                    
                    <img 
                        src={udgChatLogo} 
                        alt="UDG Chat" 
                        className="relative h-80 w-auto object-contain mix-blend-screen rounded-2xl"
                        style={{ filter: 'brightness(1.3) contrast(1.2) drop-shadow(0 0 10px rgba(255, 95, 0, 0.5))' }}
                    />
                </div>
                
             
            </div>
        </div>
    );
};