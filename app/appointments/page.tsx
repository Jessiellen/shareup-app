"use client"

import Navigation from '@/components/navigation'
import AppointmentsList from '@/components/appointments-list'
import AppointmentRequestForm from '@/components/appointment-request-form'
import AppointmentRequestsList from '@/components/appointment-requests-list'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Send, Mail, Plus } from 'lucide-react'
import { useAppointments } from '@/hooks/use-appointments-query'

export default function AppointmentsPage() {
  const { data: appointments, isLoading, error } = useAppointments()
  
  return (
    <div className="min-h-screen bg-shareup-dark text-white">
      <Navigation />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Agendamentos</h1>
          <p className="text-gray-400">
            Gerencie seus agendamentos, envie solicitações e responda a pedidos de outros profissionais
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            Erro ao carregar agendamentos: {error.message}
          </div>
        )}

        <Tabs defaultValue="my-appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
            <TabsTrigger 
              value="my-appointments" 
              className="data-[state=active]:bg-shareup-cyan data-[state=active]:text-shareup-dark"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Meus Agendamentos
            </TabsTrigger>
            <TabsTrigger 
              value="request-appointment"
              className="data-[state=active]:bg-shareup-cyan data-[state=active]:text-shareup-dark"
            >
              <Send className="h-4 w-4 mr-2" />
              Solicitar Agendamento
            </TabsTrigger>
            <TabsTrigger 
              value="manage-requests"
              className="data-[state=active]:bg-shareup-cyan data-[state=active]:text-shareup-dark"
            >
              <Mail className="h-4 w-4 mr-2" />
              Solicitações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-appointments">
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shareup-cyan"></div>
                </div>
              ) : (
                <AppointmentsList />
              )}
            </div>
          </TabsContent>

          <TabsContent value="request-appointment">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Formulário de Solicitação */}
              <div>
                <AppointmentRequestForm />
              </div>

              {/* Lista de Solicitações Enviadas */}
              <div>
                <AppointmentRequestsList />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manage-requests">
            <div className="max-w-4xl mx-auto">
              <AppointmentRequestsList />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
