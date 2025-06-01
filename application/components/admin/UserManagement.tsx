"use client"

import React from 'react'
import { 
  Search, 
  Users,
  Loader2
} from 'lucide-react'
import { getRoleColor } from '@/lib/adminUtils'

interface User {
  _id: string
  fullName: string
  username: string
  email: string
  role: string
  location?: string
  createdAt: string
}

interface UserManagementProps {
  users: User[]
  loading: boolean
  selectedUserRole: {[key: string]: string}
  onUserRoleChange: (userId: string, role: string) => void
  onUserRoleUpdate: (userId: string) => void
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  loading,
  selectedUserRole,
  onUserRoleChange,
  onUserRoleUpdate
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">User Management</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="animate-spin text-purple-400" size={32} />
            <span className="ml-2 text-gray-400">Loading users...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="mx-auto text-gray-500 mb-4" size={48} />
            <p className="text-gray-400">No users found</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.fullName.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{user.fullName}</h3>
                    <p className="text-gray-400">{user.username} • {user.email}</p>
                    <p className="text-gray-500 text-sm">{user.location || 'Location not set'} • Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  
                  <select 
                    value={selectedUserRole[user._id] || user.role}
                    onChange={(e) => onUserRoleChange(user._id, e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm focus:border-purple-500 focus:outline-none"
                  >
                    <option value="user">User</option>
                    <option value="authority">Authority</option>
                    <option value="masteradmin">Master Admin</option>
                  </select>
                  
                  <button 
                    onClick={() => onUserRoleUpdate(user._id)}
                    disabled={loading || selectedUserRole[user._id] === user.role}
                    className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="animate-spin" size={14} /> : 'Update'}
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

export default UserManagement
