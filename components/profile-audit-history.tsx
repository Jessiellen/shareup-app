"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useProfileAudit } from '@/hooks/use-profile-audit'
import { ProfileChange } from '@/types/profile'
import { History, Eye, EyeOff, Trash2, Download } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface ProfileAuditHistoryProps {
  userId: string
  isVisible?: boolean
}

export default function ProfileAuditHistory({ userId, isVisible = false }: ProfileAuditHistoryProps) {
  const [showHistory, setShowHistory] = useState(isVisible)
  const { auditLog, getAuditHistory, clearAuditHistory, isLoading } = useProfileAudit(userId)

  useEffect(() => {
    if (showHistory) {
      getAuditHistory()
    }
  }, [showHistory, getAuditHistory])

  const getChangeTypeColor = (changeType: string) => {
    switch (changeType) {
      case 'create': return 'bg-green-500/20 text-green-400'
      case 'update': return 'bg-blue-500/20 text-blue-400'
      case 'delete': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getFieldDisplayName = (field: string) => {
    const fieldNames: Record<string, string> = {
      'name': 'Nome',
      'email': 'Email',
      'bio': 'Biografia',
      'skills': 'Habilidades',
      'avatar': 'Foto de Perfil',
      'location': 'Localização',
      'profession': 'Profissão',
      'specialty': 'Especialidade',
      'experience': 'Experiência',
      'availability': 'Disponibilidade',
      'contactInfo': 'Informações de Contato'
    }
    return fieldNames[field] || field
  }

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return 'Vazio'
    if (typeof value === 'object') return JSON.stringify(value, null, 2)
    if (typeof value === 'string' && value.length > 100) {
      return value.substring(0, 100) + '...'
    }
    return String(value)
  }

  const exportHistory = () => {
    const dataStr = JSON.stringify(auditLog, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `profile-history-${userId}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!showHistory) {
    return (
      <Card className="bg-shareup-dark/60 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <History className="h-5 w-5 mr-2" />
            Histórico de Alterações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setShowHistory(true)}
            className="w-full bg-shareup-cyan hover:bg-shareup-cyan/90 text-shareup-dark"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver Histórico de Alterações
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-shareup-dark/60 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-white">
            <History className="h-5 w-5 mr-2" />
            Histórico de Alterações ({auditLog.length})
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={exportHistory}
              disabled={auditLog.length === 0}
              className="text-shareup-cyan hover:bg-shareup-cyan/20"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(false)}
              className="text-gray-400 hover:bg-gray-700"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-shareup-cyan mx-auto"></div>
            <p className="text-slate-400 mt-2">Carregando histórico...</p>
          </div>
        ) : auditLog.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">Nenhuma alteração registrada ainda</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-96 w-full">
              <div className="space-y-4">
                {auditLog.map((change: ProfileChange, index) => (
                  <div
                    key={change.id || index}
                    className="border border-gray-700 rounded-lg p-4 hover:border-shareup-cyan/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={getChangeTypeColor(change.changeType)}>
                          {change.changeType.toUpperCase()}
                        </Badge>
                        <span className="text-white font-medium">
                          {getFieldDisplayName(change.field)}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {format(new Date(change.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400 mb-1">Valor Anterior:</p>
                        <div className="bg-red-500/10 border border-red-500/20 rounded p-2 text-red-300">
                          {formatValue(change.oldValue)}
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">Novo Valor:</p>
                        <div className="bg-green-500/10 border border-green-500/20 rounded p-2 text-green-300">
                          {formatValue(change.newValue)}
                        </div>
                      </div>
                    </div>
                    
                    {change.ipAddress && (
                      <div className="mt-2 text-xs text-slate-500">
                        IP: {change.ipAddress}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-slate-400">
                Últimas {auditLog.length} alterações registradas
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAuditHistory}
                className="text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Limpar Histórico
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}