export interface ProfileChange {
  id: string
  userId: string
  field: string
  oldValue: any
  newValue: any
  timestamp: Date
  changeType: 'create' | 'update' | 'delete'
  ipAddress?: string
  userAgent?: string
}

export interface ProfileAuditLog {
  id: string
  userId: string
  changes: ProfileChange[]
  sessionId: string
  timestamp: Date
}