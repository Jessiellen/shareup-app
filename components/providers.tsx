"use client"

import { useState, useEffect } from "react"
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { AuthProvider } from "@/contexts/auth-context"
import { ChatProvider } from "@/contexts/chat-context"
import { FilterProvider } from "@/contexts/filter-context"

export function Providers({ 
  children, 
  session 
}: { 
  children: React.ReactNode
  session: any 
}) {
  // Criar QueryClient apenas uma vez por componente
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutos - dados ficam "fresh"
        gcTime: 1000 * 60 * 10,   // 10 minutos - garbage collection
        retry: 3,                 // 3 tentativas em caso de erro
        refetchOnWindowFocus: false, // Não refetch ao focar na janela
        // Prefetch estratégico
        refetchOnMount: 'always', // Sempre refetch ao montar
        refetchInterval: 1000 * 60 * 2, // Auto-refetch a cada 2 minutos para dados críticos
      },
      mutations: {
        retry: 1, // 1 tentativa para mutations
        // Retry delay exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  }))

  // Prefetch dados importantes na inicialização
  useEffect(() => {
    // Prefetch posts populares
    queryClient.prefetchQuery({
      queryKey: ['posts', 'list', { page: 1, limit: 10, sortBy: 'trending' }],
      staleTime: 1000 * 60 * 3, // 3 minutos para dados prefetched
    })

    // Prefetch profissionais em destaque
    queryClient.prefetchQuery({
      queryKey: ['professionals', 'list', { featured: true, limit: 6 }],
      staleTime: 1000 * 60 * 5, // 5 minutos
    })
  }, [queryClient])

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <AuthProvider>
          <ChatProvider>
            <FilterProvider>
              {children}
            </FilterProvider>
          </ChatProvider>
        </AuthProvider>
      </SessionProvider>
      {/* DevTools apenas em desenvolvimento */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}