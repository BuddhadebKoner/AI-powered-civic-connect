"use client"

import React from 'react'
import { 
  Search, 
  Filter, 
  Plus,
  Shield,
  Loader2,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'
import { getStatusColor, getStatusIcon } from '@/lib/adminUtils'

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

const AuthorityList: React.FC<AuthorityListProps> = ({
  authorities,
  loading,
  searchTerm,
  selectedFilter,
  onSearchChange,
  onFilterChange,
  onCreateClick,
  onStatusUpdate
}) => {
  const filteredAuthorities = authorities.filter(authority =>
    authority.userId.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    authority.position.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(authority =>
    selectedFilter === 'all' || authority.verificationStatus.toLowerCase() === selectedFilter
  )

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search authorities..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none appearance-none"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={20} />
          <span>Create Authority</span>
        </button>
      </div>

      {/* Authorities List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="animate-spin text-purple-400" size={32} />
            <span className="ml-2 text-gray-400">Loading authorities...</span>
          </div>
        ) : filteredAuthorities.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="mx-auto text-gray-500 mb-4" size={48} />
            <p className="text-gray-400">No authorities found</p>
          </div>
        ) : (
          filteredAuthorities.map((authority) => (
            <div key={authority._id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-white">{authority.userId.fullName}</h3>
                    <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(authority.verificationStatus)}`}>
                      {getStatusIcon(authority.verificationStatus)}
                      <span>{authority.verificationStatus}</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Building size={16} />
                      <span className="text-sm">{authority.position}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <MapPin size={16} />
                      <span className="text-sm">{authority.area.name}, {authority.area.state}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Phone size={16} />
                      <span className="text-sm">{authority.contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Mail size={16} />
                      <span className="text-sm">{authority.contactInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <CheckCircle size={16} />
                      <span className="text-sm">{authority.resolvedIssues.length} issues resolved</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Clock size={16} />
                      <span className="text-sm">{authority.pendingIssues.length} pending</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {authority.expertise.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {authority.verificationStatus === 'PENDING' && (
                    <>
                      <button 
                        onClick={() => onStatusUpdate(authority._id, 'VERIFIED')}
                        disabled={loading}
                        className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button 
                        onClick={() => onStatusUpdate(authority._id, 'REJECTED')}
                        disabled={loading}
                        className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors disabled:opacity-50"
                      >
                        <XCircle size={16} />
                      </button>
                    </>
                  )}
                  <button className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 bg-gray-600/20 text-gray-400 rounded-lg hover:bg-gray-600/30 transition-colors">
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AuthorityList
