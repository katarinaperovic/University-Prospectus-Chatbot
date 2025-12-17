import { ChatMessage } from '@/services/chat/types';
import { chatService } from '@/services/chat';
import { FC, useEffect, useRef, useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import { ChatComponent } from './components/chat';
import { useChat } from '@/queries/chat.query';
import { Textarea } from '@/components/ui/textarea';
import BeatLoader from 'react-spinners/BeatLoader';


export const ChatPage: FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>(JSON.parse(sessionStorage.getItem('chatHistory') || '[]'));
  const lastMessage = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: send, isPending: isPendingAnswer } = useChat({
    onSuccess: (data) => {
      messages[messages.length - 1].bot = data;
      setMessages([...messages]);
      // Vrati fokus nakon što bot odgovori
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    },
    onError: (error) => {
      console.log('Error: ', error);
    },
  });

  const sendMessage = () => {
    if (isPendingAnswer) {
      return;
    }
    if (message == '') {
      console.log('please enter a message');
      return;
    }
    if (message) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          user: message,
          bot: '',
          userTime: new Date().toTimeString(),
          botTime: new Date().toTimeString(),
        },
      ]);
      send(message);
      setMessage('');
      // Vrati fokus na textarea nakon slanja
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };
  
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          user: '',
          bot: 'Dobrodošli na UDG Chatbot! U duhu naše filozofije "Istorija budućnosti", kreirali smo ovog virtuelnog asistenta da Vam pomogne da lakše zakoračite u svijet znanja, ideja i mogućnosti koje UDG nudi. Naš Chatbot koristi vještačku inteligenciju da vam pruži informacije, odgovori na vaša pitanja i usmjeri vas ka pravim izvorima. Ipak, za sve ključne detalje u vezi sa upisom, konkursima i programima – preporučujemo da se obratite direktno osoblju ili konsultujete zvanične dokumente. Hvala što ste ovdje. Budućnost počinje sada – i počinje s vama.',
          userTime: '',
          botTime: new Date().toTimeString(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('chatHistory', JSON.stringify(messages));
    if (lastMessage.current) {
      lastMessage.current.scrollTop = lastMessage.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearMessages = () => {
    chatService.clearSession();
    setMessages([
      {
        id: 1,
        user: '',
        bot: 'Dobrodošli na UDG Chatbot! U duhu naše filozofije "Istorija budućnosti", kreirali smo ovog virtuelnog asistenta da Vam pomogne da lakše zakoračite u svijet znanja, ideja i mogućnosti koje UDG nudi. Naš Chatbot koristi vještačku inteligenciju da vam pruži informacije, odgovori na vaša pitanja i usmjeri vas ka pravim izvorima. Ipak, za sve ključne detalje u vezi sa upisom, konkursima i programima – preporučujemo da se obratite direktno osoblju ili konsultujete zvanične dokumente. Hvala što ste ovdje. Budućnost počinje sada – i počinje s vama.',
        userTime: '',
        botTime: new Date().toTimeString(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-800 dark:bg-gray-800 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-sixt opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-sixt-light opacity-5 rounded-full blur-3xl"></div>
      
      {/* Header - Ultra Modern */}
      <div className="relative overflow-hidden bg-black border-b-[3px] border-[#800020]">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#800020]/10 via-transparent to-[#800020]/10 animate-shimmer"></div>
        
        {/* Glassmorphism layer */}
        <div className="glass-effect absolute inset-0"></div>
        
        {/* Content */}
        <div className="relative z-10 px-8 py-6">
          <div className="flex items-center gap-4">
            {/* Title */}
            <div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-xs text-gray-400 font-medium">ChatBot is available 24/7</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom glow effect */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#800020] to-transparent"></div>
      </div>

      {/* Chat Messages Area */}
      <div 
        className="flex-1 overflow-y-auto px-6 md:px-12 py-8 space-y-4 scroll-smooth relative z-10" 
        ref={lastMessage}
      >
        <ChatComponent messages={messages} isPendingAnswer={isPendingAnswer} />
      </div>

      {/* Input Area - Ultra Modern */}
      <div className="relative border-t-2 border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-black/90 backdrop-blur-2xl">
        {/* Gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#800020] to-transparent"></div>
        
        <div className="px-6 md:px-12 py-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Clear conversation button */}
            {messages.length > 1 && (
              <div className="flex justify-end mb-3">
                <button
                  onClick={clearMessages}
                  className="text-sm text-[#800020] hover:text-[#A00030] font-medium transition-colors duration-300 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-[#800020]/5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Clear conversation
                </button>
              </div>
            )}
            
            <div className="relative group">
              {/* Focus glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#800020] to-[#600018] rounded-3xl opacity-0 group-focus-within:opacity-20 blur-xl transition-opacity duration-500"></div>
              
              <div className="relative flex items-end gap-3">
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask me anything about UDG University..."
                    onKeyDown={handleKeyPress}
                    value={message}
                    className="w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 focus:border-[#800020] dark:focus:border-[#800020] rounded-2xl min-h-[60px] max-h-[150px] resize-none text-base px-5 py-4 shadow-xl shadow-[#800020]/15 transition-all duration-300 hover:shadow-2xl hover:shadow-[#800020]/20 focus:shadow-2xl focus:shadow-[#800020]/25 placeholder:text-gray-400"
                    disabled={isPendingAnswer}
                  />
                  
                  {/* Character counter */}
                 
                </div>
                
                {/* Send button with advanced styling */}
                <button
                  onClick={sendMessage}
                  disabled={isPendingAnswer || !message.trim()}
                  className={`
                    w-[60px] h-[60px] rounded-2xl flex-shrink-0
                    flex items-center justify-center
                    transition-all duration-500
                    ${
                      isPendingAnswer || !message.trim()
                        ? 'bg-gray-300 dark:bg-gray-700 opacity-50 cursor-not-allowed'
                        : 'bg-gradient-to-br from-[#800020] to-[#600018] hover:from-[#A00030] hover:to-[#800020] text-white shadow-2xl hover:shadow-[#800020]/50 hover:scale-110 active:scale-95 cursor-pointer'
                    }
                  `}
                >
                  {isPendingAnswer ? (
                    <div className="animate-spin">
                      <BeatLoader size={8} color="white" />
                    </div>
                  ) : (
                    <IoIosSend className="w-7 h-7" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Bottom text */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <p className='text-xs text-gray-500 dark:text-gray-400 font-medium'>
                Bot can make mistakes. Please verify important information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
