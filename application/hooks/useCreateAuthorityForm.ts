"use client"

import { useState } from 'react'

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

const initialFormData: CreateAuthorityFormData = {
  fullName: '',
  email: '',
  position: '',
  department: '',
  phone: '',
  officialEmail: '',
  areaType: '',
  areaName: '',
  state: '',
  expertise: '',
  officeAddress: ''
}

export const useCreateAuthorityForm = () => {
  const [formData, setFormData] = useState<CreateAuthorityFormData>(initialFormData)

  const updateField = (field: keyof CreateAuthorityFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData(initialFormData)
  }

  const validateForm = (): boolean => {
    const requiredFields: (keyof CreateAuthorityFormData)[] = [
      'fullName', 'email', 'position', 'department', 'phone', 'areaType', 'areaName', 'state', 'expertise'
    ]
    
    return requiredFields.every(field => formData[field].trim() !== '')
  }

  const transformFormDataForAPI = () => {
    return {
      userId: '', // This should be set from a user selection or creation
      position: formData.position,
      contactInfo: {
        email: formData.email,
        phone: formData.phone,
        officialEmail: formData.officialEmail || undefined,
        officeAddress: formData.officeAddress || undefined
      },
      expertise: formData.expertise.split(',').map(s => s.trim()).filter(s => s),
      area: {
        type: formData.areaType,
        name: formData.areaName,
        state: formData.state,
        country: 'India',
        postalCode: ''
      }
    }
  }

  return {
    formData,
    updateField,
    resetForm,
    validateForm,
    transformFormDataForAPI
  }
}

export type { CreateAuthorityFormData }
