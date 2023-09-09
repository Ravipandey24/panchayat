import { z } from 'zod'

export const addFriendValidator = z.object({
    query: z.string()
})

export const messageValidator = z.object({
    conversationId: z.string(),
    conversationType: z.enum(["single", "group"]),
    senderId: z.string(),
    text: z.string()
})