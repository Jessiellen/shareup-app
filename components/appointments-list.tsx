"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useAppointments, useUpdateAppointment, useDeleteAppointment } from '@/hooks/use-appointments-query'
import { Calendar, Clock, MapPin, Video, User, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function AppointmentsList() {
  const { data: appointments, isLoading, error } = useAppointments()
  const updateAppointmentMutation = useUpdateAppointment()
  const deleteAppointmentMutation = useDeleteAppointment()
  const [filter, setFilter] = useState<'todos' | 'agendado' | 'confirmado' | 'concluido'>('todos')

  const filteredAppointments = (appointments || []).filter(appointment => {
    if (filter === 'todos') return true
    return appointment.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado': return 'bg-blue-500/20 text-blue-400'
      case 'confirmado': return 'bg-green-500/20 text-green-400'
      case 'cancelado': return 'bg-red-500/20 text-red-400'
      case 'concluido': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }
  const handleStatusChange = (appointmentId: string, newStatus: string) => {
    updateAppointmentMutation.mutate({
      id: appointmentId,
      updates: { status: newStatus as any }
    })
  }

  const handleDelete = (appointmentId: string) => {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
      deleteAppointmentMutation.mutate(appointmentId)
    }
  }

  return (
    <Card className="bg-shareup-dark/60 border-gray-700 h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-shareup-cyan" />
            Meus Agendamentos ({filteredAppointments.length})
          </CardTitle>
          
          {/* Filtros */}
          <div className="flex space-x-2">
            {['todos', 'agendado', 'confirmado', 'concluido'].map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter(status as any)}
                className={`text-xs ${
                  filter === status 
                    ? 'bg-shareup-cyan text-shareup-dark' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {isLoading ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-4 rounded-lg bg-slate-800/50 animate-pulse">
                  <div className="h-4 bg-slate-700/50 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-700/50 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-slate-700/50 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 px-6">
              <p className="text-red-400 mb-4">Erro ao carregar agendamentos</p>
              <Button onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-8 px-6">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">
                {filter === 'todos' 
                  ? 'Nenhum agendamento encontrado' 
                  : `Nenhum agendamento ${filter}`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3 p-6">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-700 rounded-lg p-4 hover:border-shareup-cyan/50 transition-colors bg-shareup-dark/40"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">{appointment.title}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-gray-800 border-gray-700">
                            <DropdownMenuItem 
                              className="text-gray-300 hover:bg-gray-700"
                              onClick={() => handleStatusChange(appointment.id, 
                                appointment.status === 'agendado' ? 'confirmado' : 'agendado'
                              )}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              {appointment.status === 'agendado' ? 'Confirmar' : 'Reagendar'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-400 hover:bg-red-500/20"
                              onClick={() => handleDelete(appointment.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Cancelar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Status */}
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>

                      {/* Participante */}
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{appointment.participantName}</span>
                      </div>

                      {/* Data e Hora */}
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(appointment.date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.time} ({appointment.duration}min)</span>
                        </div>
                      </div>

                      {/* Local */}
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        {appointment.type === 'online' ? (
                          <Video className="h-4 w-4" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                        <span>{appointment.location}</span>
                      </div>

                      {/* Descrição */}
                      {appointment.description && (
                        <p className="text-sm text-gray-300 mt-2">{appointment.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}