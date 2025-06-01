"use client"

import React from 'react'
import AuthorityListComponent from './AuthorityListComponent'

interface Authority {
  _id: string
  userId: {
    fullName: string
  }
  position: string
  area: {
    name: string
    state: string
  }
  contactInfo: {
    phone: string
    email: string
  }
  verificationStatus: string
  expertise: string[]
  resolvedIssues: string[]
  pendingIssues: string[]
}

interface AuthorityListProps {
  authorities: Authority[]
  loading: boolean
  searchTerm: string
  selectedFilter: string
  onSearchChange: (value: string) => void
  onFilterChange: (value: string) => void
  onCreateClick: () => void
  onStatusUpdate: (authorityId: string, status: 'VERIFIED' | 'REJECTED') => void
}

const AuthorityList: React.FC<AuthorityListProps> = (props) => {
  return <AuthorityListComponent {...props} />
}

export default AuthorityList