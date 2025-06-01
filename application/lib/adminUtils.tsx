import { CheckCircle, Clock, XCircle } from 'lucide-react'

export const getStatusColor = (status: string): string => {
  switch (status.toUpperCase()) {
    case 'VERIFIED': return 'text-green-400 bg-green-400/10'
    case 'PENDING': return 'text-yellow-400 bg-yellow-400/10'
    case 'REJECTED': return 'text-red-400 bg-red-400/10'
    default: return 'text-gray-400 bg-gray-400/10'
  }
}

export const getStatusIcon = (status: string, size: number = 16) => {
  switch (status.toUpperCase()) {
    case 'VERIFIED': return <CheckCircle size={size} />
    case 'PENDING': return <Clock size={size} />
    case 'REJECTED': return <XCircle size={size} />
    default: return <Clock size={size} />
  }
}

export const getRoleColor = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'authority': return 'bg-purple-600/20 text-purple-300'
    case 'masteradmin': return 'bg-red-600/20 text-red-300'
    case 'user': return 'bg-blue-600/20 text-blue-300'
    default: return 'bg-gray-600/20 text-gray-300'
  }
}

export const getActivityTypeColor = (type: string): string => {
  switch (type) {
    case 'success': return 'bg-green-400'
    case 'warning': return 'bg-yellow-400'
    case 'pending': return 'bg-blue-400'
    case 'info': return 'bg-purple-400'
    default: return 'bg-gray-400'
  }
}
