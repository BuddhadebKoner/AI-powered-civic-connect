"use client"

import React from 'react'
import { X } from 'lucide-react'
import CreateAuthorityForm from './CreateAuthorityForm'

interface CreateAuthorityFormData {
  fullName: string
  email: string
  position: string
  department: string
  phone: string
  officialEmail: string
  areaType: string
  areaName: string
  state: string
  expertise: string
  officeAddress: string
}

interface CreateAuthorityModalProps {
  isOpen: boolean
  onClose: () => void
  formData: CreateAuthorityFormData
  loading: boolean
  onInputChange: (field: string, value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

const CreateAuthorityModal: React.FC<CreateAuthorityModalProps> = ({
  isOpen,
  onClose,
  formData,
  loading,
  onInputChange,
  onSubmit
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Create New Authority</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <CreateAuthorityForm
            formData={formData}
            loading={loading}
            onInputChange={onInputChange}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  )
}

export default CreateAuthorityModal