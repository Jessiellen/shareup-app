// Cache invalidation utility for React Query
// Gerencia invalidação inteligente de cache baseada em relacionamentos de dados

import { QueryClient } from '@tanstack/react-query'

export class CacheManager {
  constructor(private queryClient: QueryClient) {}

  // Invalidar cache relacionado a posts
  invalidatePostRelatedData(postId?: string) {
    // Invalidar listas de posts
    this.queryClient.invalidateQueries({ queryKey: ['posts', 'list'] })
    
    // Invalidar post específico se ID fornecido
    if (postId) {
      this.queryClient.invalidateQueries({ queryKey: ['posts', 'detail', postId] })
    }
    
    // Invalidar estatísticas relacionadas
    this.queryClient.invalidateQueries({ queryKey: ['posts', 'stats'] })
    
    // Invalidar posts do usuário
    this.queryClient.invalidateQueries({ queryKey: ['user', 'posts'] })
  }

  // Invalidar cache relacionado a profissionais
  invalidateProfessionalRelatedData(professionalId?: string) {
    // Invalidar lista de profissionais
    this.queryClient.invalidateQueries({ queryKey: ['professionals', 'list'] })
    
    // Invalidar profissional específico
    if (professionalId) {
      this.queryClient.invalidateQueries({ queryKey: ['professionals', 'detail', professionalId] })
    }
    
    // Invalidar profissionais favoritos
    this.queryClient.invalidateQueries({ queryKey: ['user', 'favorites'] })
  }

  // Invalidar cache relacionado a agendamentos
  invalidateAppointmentRelatedData(appointmentId?: string) {
    // Invalidar listas de agendamentos
    this.queryClient.invalidateQueries({ queryKey: ['appointments', 'list'] })
    
    // Invalidar solicitações de agendamento
    this.queryClient.invalidateQueries({ queryKey: ['appointments', 'requests'] })
    
    // Invalidar agendamento específico
    if (appointmentId) {
      this.queryClient.invalidateQueries({ queryKey: ['appointments', 'detail', appointmentId] })
    }
    
    // Invalidar estatísticas de agendamentos
    this.queryClient.invalidateQueries({ queryKey: ['appointments', 'stats'] })
  }

  // Invalidar cache do usuário atual
  invalidateUserData() {
    this.queryClient.invalidateQueries({ queryKey: ['user'] })
    this.queryClient.invalidateQueries({ queryKey: ['profile'] })
  }

  // Limpar cache desnecessário
  clearStaleCache() {
    // Remove queries não utilizadas há mais de 10 minutos
    this.queryClient.clear()
  }

  // Prefetch dados relacionados baseado na página atual
  prefetchRelatedData(currentPage: string) {
    switch (currentPage) {
      case 'home':
        // Prefetch posts trending e profissionais em destaque
        this.queryClient.prefetchQuery({
          queryKey: ['posts', 'list', { sortBy: 'trending', limit: 10 }],
          staleTime: 1000 * 60 * 3,
        })
        break
        
      case 'posts':
        // Prefetch próxima página de posts
        this.queryClient.prefetchQuery({
          queryKey: ['posts', 'list', { page: 2, limit: 10 }],
          staleTime: 1000 * 60 * 2,
        })
        break
        
      case 'professionals':
        // Prefetch filtros populares de profissionais
        this.queryClient.prefetchQuery({
          queryKey: ['professionals', 'list', { featured: true }],
          staleTime: 1000 * 60 * 5,
        })
        break
        
      case 'appointments':
        // Prefetch solicitações pendentes
        this.queryClient.prefetchQuery({
          queryKey: ['appointments', 'requests', { status: 'pendente' }],
          staleTime: 1000 * 60 * 1,
        })
        break
    }
  }

  // Otimistic updates para melhor UX
  optimisticUpdate<T>(
    queryKey: any[],
    updateFn: (oldData: T) => T,
    rollbackFn?: (oldData: T) => T
  ) {
    // Cancelar refetches em andamento
    this.queryClient.cancelQueries({ queryKey })
    
    // Snapshot dos dados atuais
    const previousData = this.queryClient.getQueryData<T>(queryKey)
    
    // Aplicar update otimista
    if (previousData) {
      this.queryClient.setQueryData(queryKey, updateFn(previousData))
    }
    
    return {
      rollback: () => {
        if (previousData && rollbackFn) {
          this.queryClient.setQueryData(queryKey, rollbackFn(previousData))
        } else if (previousData) {
          this.queryClient.setQueryData(queryKey, previousData)
        }
      }
    }
  }
}

// Hook para usar o cache manager
export function useCacheManager() {
  const queryClient = new QueryClient()
  return new CacheManager(queryClient)
}

// Utilitários de cache específicos
export const cacheUtils = {
  // Chaves de cache padronizadas
  keys: {
    posts: {
      all: ['posts'] as const,
      lists: () => [...cacheUtils.keys.posts.all, 'list'] as const,
      list: (filters: any) => [...cacheUtils.keys.posts.lists(), { filters }] as const,
      details: () => [...cacheUtils.keys.posts.all, 'detail'] as const,
      detail: (id: string) => [...cacheUtils.keys.posts.details(), id] as const,
    },
    professionals: {
      all: ['professionals'] as const,
      lists: () => [...cacheUtils.keys.professionals.all, 'list'] as const,
      list: (filters: any) => [...cacheUtils.keys.professionals.lists(), { filters }] as const,
      details: () => [...cacheUtils.keys.professionals.all, 'detail'] as const,
      detail: (id: string) => [...cacheUtils.keys.professionals.details(), id] as const,
    },
    appointments: {
      all: ['appointments'] as const,
      lists: () => [...cacheUtils.keys.appointments.all, 'list'] as const,
      list: (filters: any) => [...cacheUtils.keys.appointments.lists(), { filters }] as const,
      requests: () => [...cacheUtils.keys.appointments.all, 'requests'] as const,
      request: (filters: any) => [...cacheUtils.keys.appointments.requests(), { filters }] as const,
    }
  },
  
  // Tempos de cache recomendados
  staleTimes: {
    immediate: 0,           // Dados que mudam constantemente
    fast: 1000 * 30,        // 30 segundos - dados dinâmicos
    normal: 1000 * 60 * 5,  // 5 minutos - dados padrão
    slow: 1000 * 60 * 30,   // 30 minutos - dados estáticos
    static: 1000 * 60 * 60, // 1 hora - dados que raramente mudam
  },
  
  // Configurações de retry
  retryConfig: {
    immediate: { retry: 0 },
    normal: { retry: 3, retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 30000) },
    persistent: { retry: 5, retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 30000) },
  }
}
