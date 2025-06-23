"use client"

import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/contexts/auth-context"
import { ChatProvider } from "@/contexts/chat-context"

interface ProvidersWrapperProps {
  children: React.ReactNode
}

export function ProvidersWrapper({ children }: ProvidersWrapperProps) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ChatProvider>
          {children}
        </ChatProvider>
      </AuthProvider>
    </SessionProvider>
  )
}
