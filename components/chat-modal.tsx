"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Phone, Video, MoreVertical, Smile, Bot, Loader2, Zap } from "lucide-react"
import { useChat } from "@/contexts/chat-context"
import { useAIChat } from "@/hooks/use-ai-chat"

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  professional: {
    name: string
    avatar: string
    profession: string
    isOnline: boolean
  }
}

export default function ChatModal({ isOpen, onClose, professional }: ChatModalProps) {
  const [message, setMessage] = useState("")
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { chats, createChat, activeChat, setActiveChat, sendMessage, markAsRead } = useChat()
  const { isAIEnabled, setIsAIEnabled, isGenerating, createPersona, generateAIResponse } = useAIChat()

  // Create a stable professional ID
  const professionalId = `prof_${professional.name.replace(/\s+/g, "_").toLowerCase()}`
  
  // Create AI persona for this professional
  const aiPersona = createPersona(professional)

  // Initialize chat when modal opens
  useEffect(() => {
    if (isOpen && !currentChatId) {
      const chat = createChat({
        id: professionalId,
        name: professional.name,
        avatar: professional.avatar,
        profession: professional.profession,
        isOnline: professional.isOnline,
      })
      setCurrentChatId(chat.id)
      setActiveChat(chat)
      markAsRead(chat.id)
    } else if (!isOpen) {
      setCurrentChatId(null)
      setActiveChat(null)
    }
  }, [isOpen]) // Only depend on isOpen

  // Find current chat from chats array
  const currentChat = chats.find((chat) => chat.id === currentChatId)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (currentChat?.messages && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [currentChat?.messages])

  const handleSendMessage = useCallback(async () => {
    if (message.trim() && currentChatId) {
      // Send user message
      sendMessage(currentChatId, message)
      const userMessage = message
      setMessage("")

      // Generate AI response if enabled
      if (isAIEnabled && currentChat) {
        try {
          const aiResponse = await generateAIResponse(
            userMessage, 
            aiPersona,
            currentChat.messages
          )
          
          // Send AI response after a short delay
          setTimeout(() => {
            sendMessage(currentChatId, aiResponse, professionalId)
          }, 500)
        } catch (error) {
          console.error('Erro ao gerar resposta da IA:', error)
        }
      }
    }
  }, [message, currentChatId, sendMessage, isAIEnabled, generateAIResponse, aiPersona, currentChat, professionalId])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen || !currentChat) return null

  const otherParticipant = currentChat.participants.find((p) => p.id !== "current_user")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-shareup-dark border-gray-700 text-white max-w-md h-[600px] p-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={otherParticipant?.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-shareup-cyan text-shareup-dark">
                    {otherParticipant?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {otherParticipant?.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-shareup-lime rounded-full border-2 border-shareup-dark"></div>
                )}
                {isAIEnabled && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full border-2 border-shareup-dark flex items-center justify-center">
                    <Bot className="h-2 w-2 text-white" />
                  </div>
                )}
              </div>
              <div>
                <DialogTitle className="text-white text-sm flex items-center gap-2">
                  {otherParticipant?.name}
                  {isAIEnabled && (
                    <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                      <Zap className="h-3 w-3 mr-1" />
                      IA Ativa
                    </Badge>
                  )}
                </DialogTitle>
                <p className="text-xs text-slate-400">{otherParticipant?.profession}</p>
                <p className="text-xs text-shareup-lime">{otherParticipant?.isOnline ? "Online" : "Offline"}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-8 w-8 ${isAIEnabled ? 'text-purple-400 hover:text-purple-300' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setIsAIEnabled(!isAIEnabled)}
                title={isAIEnabled ? 'Desativar IA' : 'Ativar IA'}
              >
                <Bot className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentChat.messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderId === "current_user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.senderId === "current_user"
                    ? "bg-shareup-cyan text-shareup-dark"
                    : "bg-gray-700 text-white border border-gray-600"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p
                  className={`text-xs mt-1 ${msg.senderId === "current_user" ? "text-shareup-dark/70" : "text-slate-400"}`}
                >
                  {msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          
          {/* AI Typing Indicator */}
          {isGenerating && isAIEnabled && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-white border border-gray-600 rounded-2xl px-4 py-2 flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                <span className="text-sm text-slate-300">{professional.name} está digitando...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
              <Smile className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-shareup-cyan hover:bg-shareup-cyan/90 text-shareup-dark"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
