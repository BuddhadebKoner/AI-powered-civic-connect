"use client"

import React from 'react'
import { AlertTriangle } from 'lucide-react'

interface ErrorDisplayProps {
  error: string | null
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null

  return (
    <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-4">
      <div className="flex items-center space-x-2">
        <AlertTriangle className="text-red-400" size={20} />
        <p className="text-red-400">{error}</p>
      </div>
    </div>
  )
}

export default ErrorDisplay
