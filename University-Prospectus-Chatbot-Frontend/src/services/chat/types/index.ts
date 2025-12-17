export type ChatMessage = {
    id: number;
    user: string;
    bot: string;
    userTime: string;
    botTime: string;
}

export type ChatReqeust = {
    chatInput: string;
    sessionId?: string;
    chatHistory: ChatHistory[];
}

export type ChatResponse = {
    answer: string;
    sessionId: string;
}

export type ChatHistory = {
    inputs: ChatInput;
    outputs: ChatOutput;
}

export type ChatInput = {
    chat_input: string;
}

export type ChatOutput = {
    answer: string;
}
