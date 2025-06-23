"use client"

import { useState, useCallback } from 'react'
import { ProfileChange, ProfileAuditLog } from '@/types/profile'

export function useProfileAudit(userId: string) {
  const [auditLog, setAuditLog] = useState<ProfileChange[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const logChange = useCallback(async (
    field: string,
    oldValue: any,
    newValue: any,
    changeType: 'create' | 'update' | 'delete' = 'update'
  ) => {
    try {
      setIsLoading(true)
      
      const change: ProfileChange = {
        id: crypto.randomUUID(),
        userId,
        field,
        oldValue,
        newValue,
        timestamp: new Date(),
        changeType,
        ipAddress: await getClientIP(),
        userAgent: navigator.userAgent
      }

      // Salvar no localStorage (simulando API)
      const existingLogs = JSON.parse(localStorage.getItem(`profile_audit_${userId}`) || '[]')
      const updatedLogs = [change, ...existingLogs].slice(0, 100) // Manter apenas os últimos 100 registros
      
      localStorage.setItem(`profile_audit_${userId}`, JSON.stringify(updatedLogs))
      setAuditLog(updatedLogs)

      // Em produção, você enviaria para uma API
      // await fetch('/api/profile/audit', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(change)
      // })

      // Alteração registrada no sistema de auditoria
    } catch (error) {
      console.error('Erro ao registrar alteração:', error)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const getAuditHistory = useCallback(async () => {
    try {
      setIsLoading(true)
      const logs = JSON.parse(localStorage.getItem(`profile_audit_${userId}`) || '[]')
      setAuditLog(logs)
      return logs
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const clearAuditHistory = useCallback(async () => {
    try {
      localStorage.removeItem(`profile_audit_${userId}`)
      setAuditLog([])
    } catch (error) {
      console.error('Erro ao limpar histórico:', error)
    }
  }, [userId])

  return {
    auditLog,
    logChange,
    getAuditHistory,
    clearAuditHistory,
    isLoading
  }
}

// Função auxiliar para obter IP do cliente
async function getClientIP(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch {
    return 'unknown'
  }
}