import { callApi } from '../utils/api';
import { ChatHistory, ChatResponse } from './types';

class ChatService {
  private getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  };

  sendMessage = async (message: string): Promise<string> => {
    const sessionId = this.getSessionId();
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

    const payload = { chatInput: message, sessionId, chatHistory };

    const response = await callApi({
      url: '/chat',
      method: 'POST',
      data: payload,
    });

    const data = response as ChatResponse;
    if (data.sessionId) {
      sessionStorage.setItem('sessionId', data.sessionId);
    }
    return data.answer;
  };

  clearSession = (): void => {
    sessionStorage.removeItem('sessionId');
  };
}

export const chatService = new ChatService();
