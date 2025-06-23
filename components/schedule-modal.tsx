"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, User, MessageSquare, CheckCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useCreateAppointment } from "@/hooks/use-appointments-query"

interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  professional: {
    name: string
    avatar: string
    profession: string
    specialty: string
  }
}

export default function ScheduleModal({ isOpen, onClose, professional }: ScheduleModalProps) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    duration: "",
    subject: "",
    message: "",
    meetingType: "video" as "video" | "presencial" | "phone",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const createAppointmentMutation = useCreateAppointment()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create appointment using React Query
      await createAppointmentMutation.mutateAsync({
        title: formData.subject || `Sessão com ${professional.name}`,
        description: formData.message || `Agendamento sobre ${professional.specialty}`,
        date: formData.date,
        time: formData.time,
        duration: parseInt(formData.duration) || 60,
        location: formData.meetingType === 'presencial' ? 'A definir' : 'Online',
        type: formData.meetingType === 'presencial' ? 'presencial' : 'online',
        status: 'agendado',
        participantId: professional.name, // In real app, would be professional.id
        participantName: professional.name,
        participantAvatar: professional.avatar,
      })

      setIsSuccess(true)

      // Close modal after showing success
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
        // Reset form
        setFormData({
          date: "",
          time: "",
          duration: "",
          subject: "",
          message: "",
          meetingType: "video" as "video" | "presencial" | "phone",
        })
      }, 2000)

    } catch (error) {
      console.error('Error creating appointment:', error)
      // Could add toast error notification here
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"]
  const durations = ["30 minutos", "1 hora", "1h 30min", "2 horas"]

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-shareup-dark border-gray-700 text-white max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-shareup-lime mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Agendamento Confirmado!</h3>
            <p className="text-slate-400 mb-4">Sua sessão com {professional.name} foi agendada com sucesso.</p>
            <p className="text-sm text-slate-500">
              Você pode visualizar todos os seus agendamentos na página de Appointments.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-shareup-dark border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-shareup-cyan">Agendar Sessão</DialogTitle>
        </DialogHeader>

        {/* Professional Info */}
        <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg mb-6">
          <Avatar className="h-12 w-12">
            <AvatarImage src={professional.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-shareup-cyan text-shareup-dark">
              {professional.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-bold text-white">{professional.name}</h3>
            <p className="text-shareup-cyan">{professional.profession}</p>
            <p className="text-sm text-slate-400">{professional.specialty}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Data *
              </Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Horário *
              </Label>
              <Select
                value={formData.time}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, time: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {availableTimes.map((time) => (
                    <SelectItem key={time} value={time} className="text-white hover:bg-slate-600">
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration and Meeting Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Duração *</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, duration: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione a duração" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {durations.map((duration) => (
                    <SelectItem key={duration} value={duration} className="text-white hover:bg-slate-600">
                      {duration}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Tipo de Reunião *</Label>
              <Select
                value={formData.meetingType}
                onValueChange={(value: "video" | "presencial" | "phone") =>
                  setFormData((prev) => ({ ...prev, meetingType: value }))
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="video" className="text-white hover:bg-slate-600">
                    Videochamada
                  </SelectItem>
                  <SelectItem value="presencial" className="text-white hover:bg-slate-600">
                    Presencial
                  </SelectItem>
                  <SelectItem value="phone" className="text-white hover:bg-slate-600">
                    Telefone
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label className="text-slate-300 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Assunto da Sessão *
            </Label>
            <Input
              placeholder="Ex: Aula de aquarela para iniciantes"
              value={formData.subject}
              onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label className="text-slate-300 flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Mensagem (Opcional)
            </Label>
            <Textarea
              placeholder="Conte um pouco sobre seus objetivos e expectativas para a sessão..."
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
            />
          </div>

          {/* Info Box */}
          <div className="bg-shareup-cyan/10 border border-shareup-cyan/30 rounded-lg p-4">
            <h4 className="font-medium text-shareup-cyan mb-2">Informações Importantes:</h4>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Você receberá uma confirmação por email</li>
              <li>• O link da videochamada será enviado 15 minutos antes</li>
              <li>• Cancelamentos devem ser feitos com 24h de antecedência</li>
              <li>• Esta é uma troca de conhecimentos - prepare-se para ensinar também!</li>
            </ul>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.date || !formData.time || !formData.duration || !formData.subject}
              className="flex-1 bg-shareup-cyan hover:bg-shareup-cyan/90 text-shareup-dark font-semibold"
            >
              {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
