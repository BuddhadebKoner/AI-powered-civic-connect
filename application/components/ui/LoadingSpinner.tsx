"use client"

import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: number
  className?: string
  text?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 24, 
  className = "text-purple-400", 
  text 
}) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`animate-spin ${className}`} size={size} />
      {text && <span className="ml-2 text-gray-400">{text}</span>}
    </div>
  )
}

export default LoadingSpinner
