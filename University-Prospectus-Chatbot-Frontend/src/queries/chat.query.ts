import { chatService } from "@/services/chat"
import { useMutation, UseMutationOptions } from "@tanstack/react-query"

export const useChat = (options? : UseMutationOptions<string, string, unknown>) => {
    return useMutation(
        {
            mutationFn: async (message: string) => await chatService.sendMessage(message),
            retry: false,
            ...options
        }
    )
}