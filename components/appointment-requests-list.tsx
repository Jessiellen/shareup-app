"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { useAppointmentRequests, useRespondToAppointmentRequest } from '@/hooks/use-appointments-query'
import { Mail, Clock, Calendar, MapPin, Video, User, Check, X, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'

export default function AppointmentRequestsList() {
  const { data: appointmentRequests, isLoading } = useAppointmentRequests()
  const respondMutation = useRespondToAppointmentRequest()
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received')
  const [respondingTo, setRespondingTo] = useState<string | null>(null)
  const [responseMessage, setResponseMessage] = useState('')
  const pendingRequests = (appointmentRequests || []).filter(req => req.status === 'pendente' && req.toUserId === 'current-user')
  const sentRequests = (appointmentRequests || []).filter(req => req.fromUserId === 'current-user')

  const handleResponse = async (requestId: string, response: 'aceito' | 'recusado') => {
    try {
      await respondMutation.mutateAsync({
        requestId,
        response,
        message: responseMessage
      })
      
      setRespondingTo(null)
      setResponseMessage('')
    } catch (error) {
      toast.error('Erro ao responder solicitação')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-500/20 text-yellow-400'
      case 'aceito': return 'bg-green-500/20 text-green-400'
      case 'recusado': return 'bg-red-500/20 text-red-400'
      case 'expirado': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const isExpired = (expiresAt: Date) => {
    return new Date() > new Date(expiresAt)
  }

  return (
    <Card className="bg-shareup-dark/60 border-gray-700 h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Mail className="h-5 w-5 mr-2 text-shareup-cyan" />
            Solicitações de Agendamento
          </CardTitle>
          
          {/* Tabs */}
          <div className="flex space-x-2">
            <Button
              variant={activeTab === 'received' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('received')}
              className={`text-xs ${
                activeTab === 'received' 
                  ? 'bg-shareup-cyan text-shareup-dark' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Recebidas ({pendingRequests.length})
            </Button>
            <Button
              variant={activeTab === 'sent' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('sent')}
              className={`text-xs ${
                activeTab === 'sent' 
                  ? 'bg-shareup-cyan text-shareup-dark' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Enviadas ({sentRequests.length})
            </Button>
          </div>
        </div>      </CardHeader>
      
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shareup-cyan"></div>
          </div>
        ) : (
          <ScrollArea className="h-96">
          {activeTab === 'received' ? (
            // Solicitações recebidas
            pendingRequests.length === 0 ? (
              <div className="text-center py-8 px-6">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Nenhuma solicitação pendente</p>
              </div>
            ) : (
              <div className="space-y-4 p-6">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`border rounded-lg p-4 transition-colors ${
                      isExpired(request.expiresAt)
                        ? 'border-gray-600 bg-gray-800/50'
                        : 'border-gray-700 bg-shareup-dark/40 hover:border-shareup-cyan/50'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img
                            src={request.fromUserAvatar}
                            alt={request.fromUserName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-white">{request.fromUserName}</h3>
                            <p className="text-sm text-gray-400">
                              {format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {isExpired(request.expiresAt) ? 'Expirado' : request.status}
                        </Badge>
                      </div>

                      {/* Título */}
                      <h4 className="text-lg font-medium text-white">{request.title}</h4>

                      {/* Detalhes */}
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{format(new Date(request.requestedDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{request.requestedTime} ({request.duration}min)</span>
                        </div>
                        <div className="flex items-center space-x-2 col-span-2">
                          {request.type === 'online' ? (
                            <Video className="h-4 w-4 text-gray-400" />
                          ) : (
                            <MapPin className="h-4 w-4 text-gray-400" />
                          )}
                          <span>{request.location || `${request.type}`}</span>
                        </div>
                      </div>

                      {/* Descrição */}
                      {request.description && (
                        <p className="text-sm text-gray-300 bg-gray-800/50 rounded p-3">
                          {request.description}
                        </p>
                      )}

                      {/* Mensagem */}
                      {request.message && (
                        <div className="bg-shareup-cyan/10 border border-shareup-cyan/30 rounded p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <MessageSquare className="h-4 w-4 text-shareup-cyan" />
                            <span className="text-sm font-medium text-shareup-cyan">Mensagem:</span>
                          </div>
                          <p className="text-sm text-gray-300">{request.message}</p>
                        </div>
                      )}

                      {/* Ações */}
                      {!isExpired(request.expiresAt) && request.status === 'pendente' && (
                        <div className="flex space-x-2 pt-2">
                          {respondingTo === request.id ? (
                            <div className="w-full space-y-3">
                              <Textarea
                                placeholder="Mensagem de resposta (opcional)..."
                                value={responseMessage}
                                onChange={(e) => setResponseMessage(e.target.value)}
                                className="bg-gray-700 border-gray-600 text-white"
                                rows={2}
                              />
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleResponse(request.id, 'aceito')}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Aceitar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleResponse(request.id, 'recusado')}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Recusar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setRespondingTo(null)
                                    setResponseMessage('')
                                  }}
                                  className="text-gray-400"
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => setRespondingTo(request.id)}
                              className="bg-shareup-cyan hover:bg-shareup-cyan/90 text-shareup-dark"
                            >
                              Responder
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Expiração */}
                      {!isExpired(request.expiresAt) && request.status === 'pendente' && (
                        <p className="text-xs text-yellow-400">
                          Expira em: {format(new Date(request.expiresAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // Solicitações enviadas
            sentRequests.length === 0 ? (
              <div className="text-center py-8 px-6">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Nenhuma solicitação enviada</p>
              </div>
            ) : (
              <div className="space-y-4 p-6">
                {sentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-700 rounded-lg p-4 bg-shareup-dark/40"
                  >
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <User className="h-8 w-8 text-gray-400" />
                          <div>
                            <h3 className="font-semibold text-white">Para: {request.toUserName}</h3>
                            <p className="text-sm text-gray-400">
                              Enviado em: {format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>

                      {/* Título */}
                      <h4 className="text-lg font-medium text-white">{request.title}</h4>

                      {/* Status específico */}
                      <div className="text-sm">
                        {request.status === 'pendente' && (
                          <p className="text-yellow-400">⏳ Aguardando resposta</p>
                        )}
                        {request.status === 'aceito' && (
                          <p className="text-green-400">✅ Aceito - Agendamento criado</p>
                        )}
                        {request.status === 'recusado' && (
                          <p className="text-red-400">❌ Recusado</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )          )}
        </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}