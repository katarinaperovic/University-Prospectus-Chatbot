export type ChatMessage = {
    id: number;
    user: string;
    bot: string;
    userTime: string;
    botTime: string;
}

export type ChatReqeust = {
    chatInput: string;
    chatHistory: ChatHistory[];
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
