"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Tipos para profissionais
export interface Professional {
  id: number
  name: string
  profession: string
  specialty: string
  avatar: string
  coverImage: string
  rating: number
  experience: string
  location: string
  isOnline: boolean
  hourlyRate: number
  completedProjects: number
  completedExchanges: number
  skills: string[]
  availability: string[]
  description: string
  bio: string
  category: string
}

// Query Keys
export const professionalKeys = {
  all: ['professionals'] as const,
  lists: () => [...professionalKeys.all, 'list'] as const,
  list: (filters: any) => [...professionalKeys.lists(), { filters }] as const,
  details: () => [...professionalKeys.all, 'detail'] as const,
  detail: (id: number) => [...professionalKeys.details(), id] as const,
}

// Mock data para demonstração
const mockProfessionals: Professional[] = [
  {
    id: 1,
    name: "Isabella Rodriguez",
    profession: "Artista & Pintora",
    specialty: "Pintura em Aquarela",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=800",
    rating: 4.9,
    experience: "8 anos",
    location: "São Paulo, SP",
    isOnline: true,
    hourlyRate: 85,
    completedProjects: 156,
    completedExchanges: 42,
    skills: ["Aquarela", "Pintura Digital", "Ilustração", "Design Gráfico"],
    availability: ["Segunda", "Terça", "Quinta"],
    description: "Artista especializada em aquarela com mais de 8 anos de experiência.",
    bio: "Apaixonada por arte desde criança, Isabella já expôs em diversas galerias nacionais.",
    category: "Arte"
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    profession: "Desenvolvedor Full Stack",
    specialty: "React & Node.js",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
    rating: 4.8,
    experience: "6 anos",
    location: "Rio de Janeiro, RJ",
    isOnline: false,
    hourlyRate: 120,
    completedProjects: 89,
    completedExchanges: 30,
    skills: ["React", "Node.js", "TypeScript", "MongoDB"],
    availability: ["Segunda", "Quarta", "Sexta"],
    description: "Desenvolvedor full stack especializado em tecnologias modernas.",
    bio: "Carlos já liderou equipes de desenvolvimento em startups e grandes empresas.",
    category: "Tecnologia"
  },
  {
    id: 3,
    name: "Ana Silva",
    profession: "Designer UX/UI",
    specialty: "Design de Interfaces",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b820?w=400&h=400&fit=crop&crop=face",
    coverImage: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?w=800",
    rating: 4.7,
    experience: "5 anos",
    location: "Belo Horizonte, MG",
    isOnline: true,
    hourlyRate: 95,
    completedProjects: 112,
    completedExchanges: 25,
    skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
    availability: ["Terça", "Quinta", "Sábado"],
    description: "Designer UX/UI com foco em experiência do usuário e interfaces intuitivas.",
    bio: "Ana já participou de projetos premiados de design e pesquisa de usuários.",
    category: "Design"
  }
]

// Simular API para profissionais
const professionalsApi = {
  async getProfessionals(filters?: any): Promise<Professional[]> {
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 800))
    
    let filtered = [...mockProfessionals]
    
    if (filters?.searchQuery) {
      filtered = filtered.filter(prof => 
        prof.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        prof.profession.toLowerCase().includes(filters.searchQuery.toLowerCase())
      )
    }
    
    if (filters?.category && filters.category !== "Todos") {
      filtered = filtered.filter(prof => 
        prof.profession.includes(filters.category)
      )
    }
    
    if (filters?.onlineOnly) {
      filtered = filtered.filter(prof => prof.isOnline)
    }
    
    return filtered
  },

  async getProfessional(id: number): Promise<Professional> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const professional = mockProfessionals.find(p => p.id === id)
    if (!professional) {
      throw new Error('Profissional não encontrado')
    }
    return professional
  },

  async updateProfessional(id: number, data: Partial<Professional>): Promise<Professional> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const index = mockProfessionals.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Profissional não encontrado')
    }
    
    mockProfessionals[index] = { ...mockProfessionals[index], ...data }
    return mockProfessionals[index]
  }
}

// Hook para buscar profissionais com filtros
export function useProfessionals(filters?: {
  searchQuery?: string
  category?: string
  location?: string
  onlineOnly?: boolean
  sortBy?: string
}) {
  return useQuery({
    queryKey: professionalKeys.list(filters),
    queryFn: () => professionalsApi.getProfessionals(filters),
    staleTime: 1000 * 60 * 10, // 10 minutos - dados de profissionais mudam menos
    select: (data) => {
      // Aplicar ordenação
      if (filters?.sortBy === 'rating') {
        return [...data].sort((a, b) => b.rating - a.rating)
      }
      if (filters?.sortBy === 'experience') {
        return [...data].sort((a, b) => {
          const aExp = parseInt(a.experience)
          const bExp = parseInt(b.experience)
          return bExp - aExp
        })
      }
      if (filters?.sortBy === 'hourlyRate') {
        return [...data].sort((a, b) => a.hourlyRate - b.hourlyRate)
      }
      return data
    }
  })
}

// Hook para buscar um profissional específico
export function useProfessional(id: number) {
  return useQuery({
    queryKey: professionalKeys.detail(id),
    queryFn: () => professionalsApi.getProfessional(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 15, // 15 minutos
  })
}

// Hook para atualizar profissional
export function useUpdateProfessional() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number, data: Partial<Professional> }) =>
      professionalsApi.updateProfessional(id, data),
    onSuccess: (updatedProfessional, { id }) => {
      // Atualizar cache específico
      queryClient.setQueryData(
        professionalKeys.detail(id),
        updatedProfessional
      )
      
      // Invalidar listas para refetch
      queryClient.invalidateQueries({ 
        queryKey: professionalKeys.lists() 
      })
      
      toast.success('Perfil atualizado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar perfil')
    },
  })
}

// Hook para favoritar profissional (simulado)
export function useFavoriteProfessional() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ professionalId, isFavorited }: { 
      professionalId: number, 
      isFavorited: boolean 
    }) => {
      await new Promise(resolve => setTimeout(resolve, 300))
      return { professionalId, isFavorited }
    },
    onSuccess: ({ isFavorited }) => {
      toast.success(
        isFavorited 
          ? 'Profissional adicionado aos favoritos!' 
          : 'Profissional removido dos favoritos'
      )
    },
    onError: () => {
      toast.error('Erro ao favoritar profissional')
    },
  })
}

// Hook para enviar mensagem para profissional
export function useSendMessage() {
  return useMutation({
    mutationFn: async ({ professionalId, message }: { 
      professionalId: number, 
      message: string 
    }) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { professionalId, message }
    },
    onSuccess: () => {
      toast.success('Mensagem enviada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao enviar mensagem')
    },
  })
}

// Hook para agendar consulta
export function useScheduleAppointment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (appointmentData: {
      professionalId: number
      date: string
      time: string
      duration: string
      subject: string
      message?: string
    }) => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      return appointmentData
    },
    onSuccess: () => {
      // Invalidar cache de appointments se existir
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Agendamento realizado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao realizar agendamento')
    },
  })
}
