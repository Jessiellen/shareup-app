"use client"

import { useCallback } from 'react'
import { useProfileAudit } from './use-profile-audit'

export function useProfileTracker(userId: string) {
  const { logChange } = useProfileAudit(userId)

  const trackProfileChange = useCallback(async (
    field: string,
    oldValue: any,
    newValue: any,
    changeType: 'create' | 'update' | 'delete' = 'update'
  ) => {
    // Só registra se os valores forem diferentes
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      await logChange(field, oldValue, newValue, changeType)
    }
  }, [logChange])

  const trackMultipleChanges = useCallback(async (changes: Array<{
    field: string
    oldValue: any
    newValue: any
    changeType?: 'create' | 'update' | 'delete'
  }>) => {
    for (const change of changes) {
      await trackProfileChange(
        change.field,
        change.oldValue,
        change.newValue,
        change.changeType || 'update'
      )
    }
  }, [trackProfileChange])

  return {
    trackProfileChange,
    trackMultipleChanges
  }
}