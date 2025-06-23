"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface Message {
  id: string
  senderId: string
  senderName: string
  content: string
  timestamp: Date
  type: "text" | "system"
}

interface Chat {
  id: string
  participants: {
    id: string
    name: string
    avatar: string
    profession: string
    isOnline: boolean
  }[]
  messages: Message[]
  lastMessage?: Message
  unreadCount: number
}

interface ChatContextType {
  chats: Chat[]
  activeChat: Chat | null
  setActiveChat: (chat: Chat | null) => void
  sendMessage: (chatId: string, content: string, senderId?: string) => void
  createChat: (participant: {
    id: string
    name: string
    avatar: string
    profession: string
    isOnline: boolean
  }) => Chat
  markAsRead: (chatId: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<Chat | null>(null)

  const createChat = useCallback(
    (participant: {
      id: string
      name: string
      avatar: string
      profession: string
      isOnline: boolean
    }) => {
      // Check if chat already exists
      const existingChatIndex = chats.findIndex((chat) => chat.participants.some((p) => p.id === participant.id))

      if (existingChatIndex !== -1) {
        return chats[existingChatIndex]
      }

      const newChat: Chat = {
        id: `chat_${Date.now()}_${participant.id}`,
        participants: [
          {
            id: "current_user",
            name: "Você",
            avatar: "/placeholder.svg?height=40&width=40&text=Você",
            profession: "Usuário",
            isOnline: true,
          },
          participant,
        ],
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderId: participant.id,
            senderName: participant.name,
            content: `Olá! Vi que você tem interesse em ${participant.profession.toLowerCase()}. Como posso te ajudar?`,
            timestamp: new Date(),
            type: "text",
          },
        ],
        unreadCount: 1,
      }

      setChats((prev) => [...prev, newChat])
      return newChat
    },
    [chats],
  )

  const sendMessage = useCallback(
    (chatId: string, content: string, senderId: string = "current_user") => {
      const chat = chats.find(c => c.id === chatId)
      const sender = senderId === "current_user" 
        ? { id: "current_user", name: "Você" }
        : chat?.participants.find(p => p.id === senderId) || { id: senderId, name: "Desconhecido" }

      const newMessage: Message = {
        id: `msg_${Date.now()}_${Math.random()}`,
        senderId: sender.id,
        senderName: sender.name,
        content,
        timestamp: new Date(),
        type: "text",
      }

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: newMessage,
            }
          }
          return chat
        }),
      )
    },
    [chats],
  )

  const markAsRead = useCallback((chatId: string) => {
    setChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat)))
  }, [])

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        setActiveChat,
        sendMessage,
        createChat,
        markAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
