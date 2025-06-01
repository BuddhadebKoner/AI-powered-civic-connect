"use client"

import React from 'react'
import { Shield, Loader2 } from 'lucide-react'

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

interface CreateAuthorityFormProps {
  formData: CreateAuthorityFormData
  loading: boolean
  onInputChange: (field: string, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

const CreateAuthorityForm: React.FC<CreateAuthorityFormProps> = ({
  formData,
  loading,
  onInputChange,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Shield className="text-purple-400" size={24} />
        <h2 className="text-xl font-semibold text-white">Create New Authority</h2>
      </div>
      
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => onInputChange('fullName', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                placeholder="Enter full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => onInputChange('position', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                placeholder="e.g., Municipal Engineer"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
              <select 
                value={formData.department}
                onChange={(e) => onInputChange('department', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                required
              >
                <option value="">Select Department</option>
                <option value="pwd">Public Works Department</option>
                <option value="health">Health Department</option>
                <option value="transport">Transport Department</option>
                <option value="environment">Environment Department</option>
                <option value="police">Police Department</option>
                <option value="fire">Fire Department</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                placeholder="+91-XXXXXXXXXX"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Official Email (Optional)</label>
              <input
                type="email"
                value={formData.officialEmail}
                onChange={(e) => onInputChange('officialEmail', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                placeholder="official@department.gov.in"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Area Type</label>
              <select 
                value={formData.areaType}
                onChange={(e) => onInputChange('areaType', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                required
              >
                <option value="">Select Area Type</option>
                <option value="city">City</option>
                <option value="district">District</option>
                <option value="state">State</option>
                <option value="ward">Ward</option>
                <option value="locality">Locality</option>
                <option value="policeStation">Police Station</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Area Name</label>
              <input
                type="text"
                value={formData.areaName}
                onChange={(e) => onInputChange('areaName', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                placeholder="e.g., Mumbai"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => onInputChange('state', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                placeholder="e.g., Maharashtra"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Areas of Expertise</label>
            <input
              type="text"
              value={formData.expertise}
              onChange={(e) => onInputChange('expertise', e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              placeholder="e.g., Road Infrastructure, Drainage Systems (comma-separated)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Office Address (Optional)</label>
            <textarea
              value={formData.officeAddress}
              onChange={(e) => onInputChange('officeAddress', e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              rows={3}
              placeholder="Enter complete office address"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              <span>Create Authority</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateAuthorityForm
