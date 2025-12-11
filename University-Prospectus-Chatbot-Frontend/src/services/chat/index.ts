import { callApi } from '../utils/api';
import { ChatHistory } from './types';

class ChatService {
  sendMessage = async (message: string): Promise<string> => {
    const history = sessionStorage.getItem('chatHistory');
    const chatHistory: ChatHistory[] = [];

    if (history) {
      const parsedHistory = JSON.parse(history);
      parsedHistory.forEach((item: any) => {
        chatHistory.push({
          inputs: { chat_input: item.user },
          outputs: { answer: item.bot },
        });
      });
    }

    const payload = { chatInput: message, chatHistory };

    const response = await callApi({
      url: '/chat',
      method: 'POST',
      data: payload,
    });

    
    const data = response as { answer: string };
    return data.answer;
  };
}

export const chatService = new ChatService();
