"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Tipos para agendamentos
export interface Appointment {
  id: string
  title: string
  description: string
  date: string
  time: string
  duration: number
  location: string
  type: 'online' | 'presencial'
  status: 'agendado' | 'confirmado' | 'cancelado' | 'concluido'
  participantId: string
  participantName: string
  participantAvatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface AppointmentRequest {
  id: string
  title: string
  description: string
  requestedDate: string
  requestedTime: string
  alternativeDates?: Array<{ date: string; time: string }>
  duration: number
  location: string
  type: 'online' | 'presencial'
  status: 'pendente' | 'aceito' | 'recusado' | 'expirado'
  fromUserId: string
  fromUserName: string
  fromUserAvatar?: string
  toUserId: string
  toUserName: string
  toUserAvatar?: string
  message?: string
  createdAt: Date
  expiresAt: Date
}

// Query Keys
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters: any) => [...appointmentKeys.lists(), { filters }] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...appointmentKeys.details(), id] as const,
  requests: () => [...appointmentKeys.all, 'requests'] as const,
}

// Mock data para demonstração
const mockAppointments: Appointment[] = [
  {
    id: '1',
    title: 'Aula de Aquarela - Técnicas Básicas',
    description: 'Sessão de ensino sobre técnicas básicas de aquarela',
    date: '2024-12-30',
    time: '14:00',
    duration: 120,
    location: 'Online via Zoom',
    type: 'online',
    status: 'confirmado',
    participantId: '2',
    participantName: 'Carlos Santos',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    createdAt: new Date('2024-12-28'),
    updatedAt: new Date('2024-12-28'),
  },
  {
    id: '2',
    title: 'Sessão de Desenvolvimento Web',
    description: 'Mentoria sobre React e desenvolvimento frontend',
    date: '2024-12-31',
    time: '10:00',
    duration: 90,
    location: 'Presencial - Café Tech SP',
    type: 'presencial',
    status: 'agendado',
    participantId: '3',
    participantName: 'Ana Silva',
    participantAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b820?w=400&h=400&fit=crop&crop=face',
    createdAt: new Date('2024-12-29'),
    updatedAt: new Date('2024-12-29'),
  }
]

const mockAppointmentRequests: AppointmentRequest[] = [
  {
    id: '1',
    title: 'Consultoria em Design UX',
    description: 'Gostaria de uma sessão sobre princípios de UX Design',
    requestedDate: '2025-01-05',
    requestedTime: '15:00',
    alternativeDates: [
      { date: '2025-01-06', time: '15:00' },
      { date: '2025-01-07', time: '14:00' }
    ],
    duration: 60,
    location: 'Online',
    type: 'online',
    status: 'pendente',
    fromUserId: '4',
    fromUserName: 'Pedro Costa',
    fromUserAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    toUserId: '3',
    toUserName: 'Ana Silva',
    toUserAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b820?w=400&h=400&fit=crop&crop=face',
    message: 'Tenho um projeto pessoal e gostaria de orientação sobre UX.',
    createdAt: new Date('2025-01-02'),
    expiresAt: new Date('2025-01-09'),
  }
]

// Simular API para agendamentos
const appointmentsApi = {
  async getAppointments(): Promise<Appointment[]> {
    await new Promise(resolve => setTimeout(resolve, 600))
    return [...mockAppointments]
  },

  async getAppointment(id: string): Promise<Appointment> {
    await new Promise(resolve => setTimeout(resolve, 400))
    const appointment = mockAppointments.find(a => a.id === id)
    if (!appointment) {
      throw new Error('Agendamento não encontrado')
    }
    return appointment
  },

  async createAppointment(data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const newAppointment: Appointment = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockAppointments.push(newAppointment)
    return newAppointment
  },

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    await new Promise(resolve => setTimeout(resolve, 800))
    const index = mockAppointments.findIndex(a => a.id === id)
    if (index === -1) {
      throw new Error('Agendamento não encontrado')
    }
    
    mockAppointments[index] = {
      ...mockAppointments[index],
      ...updates,
      updatedAt: new Date(),
    }
    return mockAppointments[index]
  },

  async deleteAppointment(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = mockAppointments.findIndex(a => a.id === id)
    if (index === -1) {
      throw new Error('Agendamento não encontrado')
    }
    mockAppointments.splice(index, 1)
  },

  async getAppointmentRequests(): Promise<AppointmentRequest[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return [...mockAppointmentRequests]
  },

  async sendAppointmentRequest(data: Omit<AppointmentRequest, 'id' | 'createdAt' | 'expiresAt'>): Promise<AppointmentRequest> {
    await new Promise(resolve => setTimeout(resolve, 1200))
    const newRequest: AppointmentRequest = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expira em 7 dias
    }
    mockAppointmentRequests.push(newRequest)
    return newRequest
  },

  async respondToRequest(requestId: string, response: 'aceito' | 'recusado', message?: string): Promise<AppointmentRequest> {
    await new Promise(resolve => setTimeout(resolve, 800))
    const index = mockAppointmentRequests.findIndex(r => r.id === requestId)
    if (index === -1) {
      throw new Error('Solicitação não encontrada')
    }
    
    mockAppointmentRequests[index].status = response
    return mockAppointmentRequests[index]
  }
}

// Hook para buscar todos os agendamentos
export function useAppointments() {
  return useQuery({
    queryKey: appointmentKeys.lists(),
    queryFn: appointmentsApi.getAppointments,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para buscar um agendamento específico
export function useAppointment(id: string) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => appointmentsApi.getAppointment(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutos
  })
}

// Hook para criar agendamento
export function useCreateAppointment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: appointmentsApi.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      toast.success('Agendamento criado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao criar agendamento')
    },
  })
}

// Hook para atualizar agendamento
export function useUpdateAppointment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Appointment> }) =>
      appointmentsApi.updateAppointment(id, updates),
    onSuccess: (updatedAppointment) => {
      // Atualizar cache específico
      queryClient.setQueryData(
        appointmentKeys.detail(updatedAppointment.id),
        updatedAppointment
      )
      // Invalidar lista
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      toast.success('Agendamento atualizado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar agendamento')
    },
  })
}

// Hook para deletar agendamento
export function useDeleteAppointment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: appointmentsApi.deleteAppointment,
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({ queryKey: appointmentKeys.detail(deletedId) })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      toast.success('Agendamento cancelado com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao cancelar agendamento')
    },
  })
}

// Hook para buscar solicitações de agendamento
export function useAppointmentRequests() {
  return useQuery({
    queryKey: appointmentKeys.requests(),
    queryFn: appointmentsApi.getAppointmentRequests,
    staleTime: 1000 * 60 * 2, // 2 minutos - dados mais voláteis
  })
}

// Hook para enviar solicitação de agendamento
export function useSendAppointmentRequest() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: appointmentsApi.sendAppointmentRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.requests() })
      toast.success('Solicitação de agendamento enviada!')
    },
    onError: () => {
      toast.error('Erro ao enviar solicitação')
    },
  })
}

// Hook para responder à solicitação de agendamento
export function useRespondToAppointmentRequest() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ requestId, response, message }: { 
      requestId: string, 
      response: 'aceito' | 'recusado', 
      message?: string 
    }) => appointmentsApi.respondToRequest(requestId, response, message),
    onSuccess: (_, { response }) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.requests() })
      toast.success(
        response === 'aceito' 
          ? 'Solicitação aceita com sucesso!' 
          : 'Solicitação recusada'
      )
    },
    onError: () => {
      toast.error('Erro ao responder solicitação')
    },
  })
}
