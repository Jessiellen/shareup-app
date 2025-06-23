"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useSendAppointmentRequest } from '@/hooks/use-appointments-query'
import { Search, Send, User, Star, MapPin, Video, Calendar, Clock, Check } from 'lucide-react'
import { toast } from 'sonner'

// Mock data dos profissionais (em produção viria de uma API)
const mockProfessionals = [
  {
    id: '1',
    name: 'Isabella Rodriguez',
    profession: 'Artista & Pintora',
    specialty: 'Pintura em Aquarela',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    rating: 4.9,
    location: 'Lisboa, Portugal',
    skills: ['Aquarela', 'Pintura', 'Arte Digital'],
    isOnline: true
  },
  {
    id: '2',
    name: 'Roberto Silva',
    profession: 'Engenheiro Civil',
    specialty: 'Projetos Estruturais',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    rating: 4.7,
    location: 'Braga, Portugal',
    skills: ['AutoCAD', 'Projetos Estruturais', 'Gestão de Obras'],
    isOnline: true
  },
  {
    id: '3',
    name: 'Dr. Juliana Santos',
    profession: 'Nutricionista',
    specialty: 'Nutrição Esportiva',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    rating: 4.8,
    location: 'Aveiro, Portugal',
    skills: ['Nutrição Esportiva', 'Dietas Personalizadas', 'Suplementação'],
    isOnline: false
  }
]

export default function AppointmentRequestForm() {
  const createRequestMutation = useSendAppointmentRequest()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [requestData, setRequestData] = useState({
    title: '',
    description: '',
    requestedDate: '',
    requestedTime: '',
    duration: 60,
    location: '',
    type: 'online' as 'online' | 'presencial',
    message: ''
  })

  const filteredProfessionals = mockProfessionals.filter(prof =>
    prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prof.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prof.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleSelectProfessional = (professional: any) => {
    setSelectedProfessional(professional)
    setRequestData(prev => ({
      ...prev,
      title: `Sessão com ${professional.name}`,
      description: `Gostaria de uma sessão sobre ${professional.specialty}`
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedProfessional) {
      toast.error('Por favor, selecione um profissional')
      return
    }

    setIsSubmitting(true)

    try {
      // Validações básicas
      if (!requestData.title || !requestData.requestedDate || !requestData.requestedTime) {
        throw new Error('Por favor, preencha todos os campos obrigatórios')
      }

      // Verificar se a data não é no passado
      const requestDate = new Date(`${requestData.requestedDate}T${requestData.requestedTime}`)
      if (requestDate < new Date()) {
        throw new Error('Não é possível solicitar agendamento para uma data/hora no passado')
      }      // Enviar solicitação
      await createRequestMutation.mutateAsync({
        ...requestData,
        status: 'pendente',
        fromUserId: 'current-user',
        fromUserName: 'Você',
        toUserId: selectedProfessional.id,
        toUserName: selectedProfessional.name,
        toUserAvatar: selectedProfessional.avatar
      })

      // Mostrar sucesso
      setShowSuccess(true)
      
      // Resetar formulário após 3 segundos
      setTimeout(() => {
        setSelectedProfessional(null)
        setRequestData({
          title: '',
          description: '',
          requestedDate: '',
          requestedTime: '',
          duration: 60,
          location: '',
          type: 'online',
          message: ''
        })
        setShowSuccess(false)
      }, 3000)

      toast.success(`Solicitação enviada para ${selectedProfessional.name}!`)

    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao enviar solicitação')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setRequestData(prev => ({ ...prev, [field]: value }))
  }

  if (showSuccess) {
    return (
      <Card className="bg-shareup-dark/60 border-gray-700">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Solicitação Enviada!</h3>
            <p className="text-gray-400">
              Sua solicitação foi enviada para <strong>{selectedProfessional?.name}</strong>.
              Você receberá uma notificação quando ela for respondida.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-shareup-dark/60 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Send className="h-5 w-5 mr-2 text-shareup-cyan" />
          Solicitar Agendamento
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!selectedProfessional ? (
          // Busca de profissionais
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Buscar Profissional</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Busque por nome, profissão ou habilidade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredProfessionals.map((professional) => (
                <div
                  key={professional.id}
                  className="border border-gray-700 rounded-lg p-4 hover:border-shareup-cyan/50 transition-colors cursor-pointer"
                  onClick={() => handleSelectProfessional(professional)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={professional.avatar}
                      alt={professional.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white">{professional.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-300">{professional.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-shareup-cyan">{professional.profession}</p>
                      <p className="text-xs text-gray-400 flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {professional.location}
                        {professional.isOnline && (
                          <Badge className="ml-2 bg-green-500/20 text-green-400">Online</Badge>
                        )}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {professional.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Formulário de solicitação
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profissional selecionado */}
            <div className="border border-shareup-cyan/50 rounded-lg p-4 bg-shareup-cyan/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedProfessional.avatar}
                    alt={selectedProfessional.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-white">{selectedProfessional.name}</h4>
                    <p className="text-sm text-shareup-cyan">{selectedProfessional.profession}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProfessional(null)}
                  className="text-gray-400 hover:text-white"
                >
                  Alterar
                </Button>
              </div>
            </div>

            {/* Título */}
            <div>
              <Label htmlFor="title" className="text-gray-300">Título da Sessão *</Label>
              <Input
                id="title"
                value={requestData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                required
              />
            </div>

            {/* Data e Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-gray-300">Data Desejada *</Label>
                <Input
                  id="date"
                  type="date"
                  value={requestData.requestedDate}
                  onChange={(e) => handleInputChange('requestedDate', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time" className="text-gray-300">Hora Desejada *</Label>
                <Input
                  id="time"
                  type="time"
                  value={requestData.requestedTime}
                  onChange={(e) => handleInputChange('requestedTime', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  required
                />
              </div>
            </div>

            {/* Duração */}
            <div>
              <Label className="text-gray-300">Duração</Label>
              <Select
                value={requestData.duration.toString()}
                onValueChange={(value) => handleInputChange('duration', parseInt(value))}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="30" className="text-white hover:bg-gray-600">30 minutos</SelectItem>
                  <SelectItem value="60" className="text-white hover:bg-gray-600">1 hora</SelectItem>
                  <SelectItem value="90" className="text-white hover:bg-gray-600">1h 30min</SelectItem>
                  <SelectItem value="120" className="text-white hover:bg-gray-600">2 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo */}
            <div>
              <Label className="text-gray-300">Tipo de Sessão</Label>
              <Select
                value={requestData.type}
                onValueChange={(value: 'online' | 'presencial') => handleInputChange('type', value)}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="online" className="text-white hover:bg-gray-600">
                    <div className="flex items-center">
                      <Video className="h-4 w-4 mr-2" />
                      Online
                    </div>
                  </SelectItem>
                  <SelectItem value="presencial" className="text-white hover:bg-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Presencial
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Local/Link */}
            <div>
              <Label htmlFor="location" className="text-gray-300">
                {requestData.type === 'online' ? 'Preferência de Plataforma' : 'Local Preferido'}
              </Label>
              <Input
                id="location"
                value={requestData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder={
                  requestData.type === 'online' 
                    ? "Ex: Google Meet, Zoom, Teams..." 
                    : "Ex: Centro de Lisboa, sua escolha..."
                }
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Mensagem */}
            <div>
              <Label htmlFor="message" className="text-gray-300">Mensagem Personalizada</Label>
              <Textarea
                id="message"
                value={requestData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Conte um pouco sobre o que você gostaria de aprender ou seus objetivos..."
                className="bg-gray-700 border-gray-600 text-white"
                rows={4}
              />
            </div>

            {/* Botão Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-shareup-cyan hover:bg-shareup-cyan/90 text-shareup-dark font-semibold"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-shareup-dark mr-2"></div>
                  Enviando...
                </div>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Solicitação
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}