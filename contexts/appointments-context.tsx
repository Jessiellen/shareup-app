"use client"

import React, { createContext, useContext, useState, useCallback } from 'react'

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

interface AppointmentsContextType {
  appointments: Appointment[]
  appointmentRequests: AppointmentRequest[]
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateAppointment: (id: string, updates: Partial<Appointment>) => void
  deleteAppointment: (id: string) => void
  sendAppointmentRequest: (request: Omit<AppointmentRequest, 'id' | 'createdAt' | 'expiresAt'>) => void
  respondToRequest: (requestId: string, response: 'aceito' | 'recusado', message?: string) => void
  getPendingRequests: () => AppointmentRequest[]
  getSentRequests: () => AppointmentRequest[]
  getAppointmentsByDate: (date: string) => Appointment[]
  getUpcomingAppointments: () => Appointment[]
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined)

export function AppointmentsProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([
    // Alguns agendamentos de exemplo
    {
      id: '1',
      title: 'Aula de React',
      description: 'Aula sobre hooks avançados em React',
      date: '2024-01-15',
      time: '14:00',
      duration: 60,
      location: 'Online - Google Meet',
      type: 'online',
      status: 'confirmado',
      participantId: '2',
      participantName: 'Maria Silva',
      participantAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    }
  ])

  const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>([
    // Exemplo de solicitação recebida
    {
      id: '1',
      title: 'Mentoria em Python',
      description: 'Gostaria de uma mentoria sobre desenvolvimento backend com Python',
      requestedDate: '2024-01-25',
      requestedTime: '15:00',
      duration: 90,
      location: 'Online - Preferência por Google Meet',
      type: 'online',
      status: 'pendente',
      fromUserId: '3',
      fromUserName: 'Carlos Santos',
      fromUserAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      toUserId: 'current-user',
      toUserName: 'Você',
      message: 'Olá! Vi seu perfil e gostaria muito de aprender Python com você. Sou iniciante mas muito motivado!',
      createdAt: new Date('2024-01-12'),
      expiresAt: new Date('2024-01-19') // 7 dias para responder
    }
  ])

  const addAppointment = useCallback((appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setAppointments(prev => [newAppointment, ...prev])
    return newAppointment
  }, [])

  const updateAppointment = useCallback((id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === id 
          ? { ...appointment, ...updates, updatedAt: new Date() }
          : appointment
      )
    )
  }, [])

  const deleteAppointment = useCallback((id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id))
  }, [])

  const sendAppointmentRequest = useCallback((requestData: Omit<AppointmentRequest, 'id' | 'createdAt' | 'expiresAt'>) => {
    const newRequest: AppointmentRequest = {
      ...requestData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias para responder
    }

    setAppointmentRequests(prev => [newRequest, ...prev])
    console.log('Solicitação enviada:', newRequest)
    return newRequest
  }, [])

  const respondToRequest = useCallback((requestId: string, response: 'aceito' | 'recusado', message?: string) => {
    setAppointmentRequests(prev => 
      prev.map(request => {
        if (request.id === requestId) {
          const updatedRequest = { ...request, status: response }
          
          // Se aceito, criar o agendamento
          if (response === 'aceito') {
            const newAppointment: Appointment = {
              id: crypto.randomUUID(),
              title: request.title,
              description: request.description,
              date: request.requestedDate,
              time: request.requestedTime,
              duration: request.duration,
              location: request.location,
              type: request.type,
              status: 'confirmado',
              participantId: request.fromUserId,
              participantName: request.fromUserName,
              participantAvatar: request.fromUserAvatar,
              createdAt: new Date(),
              updatedAt: new Date()
            }
            
            setAppointments(prevApps => [newAppointment, ...prevApps])
          }
          
          return updatedRequest
        }
        return request
      })
    )
  }, [])

  const getPendingRequests = useCallback(() => {
    return appointmentRequests.filter(request => 
      request.status === 'pendente' && 
      request.toUserId === 'current-user' &&
      new Date() < new Date(request.expiresAt)
    )
  }, [appointmentRequests])

  const getSentRequests = useCallback(() => {
    return appointmentRequests.filter(request => request.fromUserId === 'current-user')
  }, [appointmentRequests])

  const getAppointmentsByDate = useCallback((date: string) => {
    return appointments.filter(appointment => appointment.date === date)
  }, [appointments])

  const getUpcomingAppointments = useCallback(() => {
    const now = new Date()
    return appointments
      .filter(appointment => {
        const appointmentDate = new Date(`${appointment.date}T${appointment.time}`)
        return appointmentDate > now && appointment.status !== 'cancelado'
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`)
        const dateB = new Date(`${b.date}T${b.time}`)
        return dateA.getTime() - dateB.getTime()
      })
  }, [appointments])

  return (
    <AppointmentsContext.Provider value={{
      appointments,
      appointmentRequests,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      sendAppointmentRequest,
      respondToRequest,
      getPendingRequests,
      getSentRequests,
      getAppointmentsByDate,
      getUpcomingAppointments
    }}>
      {children}
    </AppointmentsContext.Provider>
  )
}

export function useAppointments() {
  const context = useContext(AppointmentsContext)
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentsProvider')
  }
  return context
}
