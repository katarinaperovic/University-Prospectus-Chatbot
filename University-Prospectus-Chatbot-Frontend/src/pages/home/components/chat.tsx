import { ChatMessage } from '@/services/chat/types';
import { FC } from 'react';
import {AiOutlineUser} from "react-icons/ai"
import { RiRobot2Line } from 'react-icons/ri';
import { formate } from '@/utils/formater';
import BeatLoader from 'react-spinners/BeatLoader';

interface ChatComponentProps {
  messages: ChatMessage[];
  isPendingAnswer: boolean;
}

export const ChatComponent: FC<ChatComponentProps> = ({ messages, isPendingAnswer }) => {
  return (
    <div className="flex flex-col space-y-8 text-sm">
      <div className="space-y-8">
        {messages.map((message: ChatMessage, index: number) => {
          return (
            <div key={message.id} className="flex flex-col space-y-6 animate-slide-in-up" style={{animationDelay: `${index * 0.15}s`, opacity: 0, animationFillMode: 'forwards'}}>
              {message.user && (
                <div className="flex gap-4 justify-end items-start">
                  <div className="relative group max-w-[80%]">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF5F00] to-[#E55500] rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    
                    {/* Message bubble */}
                    <div className="relative bg-gradient-to-br from-[#FF5F00] to-[#E55500] text-white rounded-2xl rounded-tr-md px-7 py-5 shadow-2xl shadow-[#FF5F00]/30 transform hover:scale-[1.02] transition-all duration-300 border border-[#FF7A2E]/30">
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl rounded-tr-md"></div>
                      <p className="relative text-[15px] leading-relaxed font-medium">{message.user}</p>
                    </div>
                  </div>
                  
                  <div className='relative flex-shrink-0'>
                    <div className='flex justify-center items-center rounded-full bg-gradient-to-br from-gray-100 to-gray-300 w-12 h-12 shadow-xl border-2 border-white transform hover:scale-110 transition-transform duration-300'>
                      <AiOutlineUser className="w-6 h-6 text-gray-700" />
                    </div>
                  </div>
                </div>
              )}
              <div className="flex gap-4 justify-start items-start">
                <div className='relative flex-shrink-0'>
                  {/* Pulsing glow */}
                  <div className='absolute inset-0 bg-[#FF5F00] rounded-full blur-lg opacity-40 animate-pulse'></div>
                  <div className='relative flex justify-center items-center rounded-full bg-gradient-to-br from-[#FF5F00] to-[#E55500] w-12 h-12 shadow-2xl border-2 border-[#FF7A2E] transform hover:scale-110 hover:rotate-12 transition-all duration-300'>
                    <RiRobot2Line className="text-white w-6 h-6" />
                  </div>
                </div>
                
                <div className="relative group max-w-[80%]">
                  {/* Subtle glow */}
                  <div className="absolute inset-0 bg-[#FF5F00] rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300"></div>
                  
                  {/* Message bubble */}
                  <div className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl rounded-tl-md px-7 py-5 shadow-2xl shadow-[#FF5F00]/20 border-2 border-gray-100 dark:border-gray-800 transform hover:scale-[1.02] transition-all duration-300">
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent rounded-2xl rounded-tl-md dark:from-white/5"></div>
                    
                    {message.bot === '' && isPendingAnswer ? (
                      <div className="flex items-center gap-3">
                        <BeatLoader size={8} color='#FF5F00' />
                        <span className="text-xs text-gray-500 font-medium animate-pulse">Typing...</span>
                      </div>
                    ) : (
                      <div className="relative text-[15px] leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                        {formate(message.bot)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
