"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useAdminAPI } from '@/hooks/useAdminAPI'
import { useCreateAuthorityForm } from '@/hooks/useCreateAuthorityForm'

// Import reusable components
import TabNavigation from '@/components/admin/TabNavigation'
import ErrorDisplay from '@/components/admin/ErrorDisplay'
import DashboardOverview from '@/components/admin/DashboardOverview'
import AuthorityListComponent from '@/components/admin/AuthorityListComponent'
import UserManagement from '@/components/admin/UserManagement'
import CreateAuthorityForm from '@/components/admin/CreateAuthorityForm'

const MasterAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'authorities' | 'users' | 'create-authority'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedUserRole, setSelectedUserRole] = useState<{[key: string]: string}>({})
  
  // Use custom hook for form management
  const {
    formData: createAuthorityForm,
    updateField: updateFormField,
    resetForm: resetAuthorityForm,
    validateForm: validateAuthorityForm,
    transformFormDataForAPI
  } = useCreateAuthorityForm()

  // API hooks
  const {
    dashboardStats,
    authorities,
    users,
    loading,
    error,
    fetchDashboardStats,
    fetchAuthorities,
    fetchUsers,
    createAuthority,
    updateUserRole,
    updateAuthorityStatus
  } = useAdminAPI()

  // Memoize the data fetching function to prevent unnecessary re-renders
  const loadInitialData = useCallback(() => {
    fetchDashboardStats()
    fetchAuthorities()
    fetchUsers()
  }, [fetchDashboardStats, fetchAuthorities, fetchUsers])

  // Load data on component mount
  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  // Initialize user role selections
  useEffect(() => {
    if (users.length > 0) {
      const roleMap: {[key: string]: string} = {}
      users.forEach(user => {
        roleMap[user._id] = user.role
      })
      setSelectedUserRole(roleMap)
    }
  }, [users])

  // Handle create authority form submission
  const handleCreateAuthority = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateAuthorityForm()) {
      return
    }

    const authorityData = transformFormDataForAPI()
    const success = await createAuthority(authorityData)
    
    if (success) {
      // Reset form
      resetAuthorityForm()
      
      // Switch to authorities tab
      setActiveTab('authorities')
      
      // Refresh authorities list
      fetchAuthorities()
    }
  }

  // Handle user role update
  const handleUserRoleUpdate = async (userId: string) => {
    const newRole = selectedUserRole[userId]
    const success = await updateUserRole(userId, newRole as 'user' | 'authority' | 'masteradmin')
    if (success) {
      // Refresh users list
      fetchUsers()
    }
  }

  // Handle authority status update
  const handleAuthorityStatusUpdate = async (authorityId: string, status: 'VERIFIED' | 'REJECTED') => {
    const success = await updateAuthorityStatus(authorityId, status)
    if (success) {
      // Refresh authorities list
      fetchAuthorities()
    }
  }

  // Form input change handler - Fixed type annotation
  const handleFormInputChange = (field: string, value: string) => {
    updateFormField(field as keyof typeof createAuthorityForm, value)
  }

  // User role change handler
  const handleUserRoleChange = (userId: string, role: string) => {
    setSelectedUserRole(prev => ({ ...prev, [userId]: role }))
  }
  return (
    <div className="space-y-6">
      {/* Error Display */}
      <ErrorDisplay error={error} />

      {/* Navigation Tabs */}
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <DashboardOverview 
          dashboardStats={dashboardStats}
          loading={loading}
          onTabChange={setActiveTab}
        />
      )}

      {/* Authorities Tab */}
      {activeTab === 'authorities' && (
        <AuthorityListComponent
          authorities={authorities}
          loading={loading}
          searchTerm={searchTerm}
          selectedFilter={selectedFilter}
          onSearchChange={setSearchTerm}
          onFilterChange={setSelectedFilter}
          onCreateClick={() => setActiveTab('create-authority')}
          onStatusUpdate={handleAuthorityStatusUpdate}
        />
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <UserManagement
          users={users}
          loading={loading}
          selectedUserRole={selectedUserRole}
          onUserRoleChange={handleUserRoleChange}
          onUserRoleUpdate={handleUserRoleUpdate}
        />
      )}

      {/* Create Authority Tab */}
      {activeTab === 'create-authority' && (
        <CreateAuthorityForm
          formData={createAuthorityForm}
          loading={loading}
          onInputChange={handleFormInputChange}
          onSubmit={handleCreateAuthority}
          onCancel={() => setActiveTab('authorities')}
        />
      )}
    </div>
  )
}

export default MasterAdminDashboard