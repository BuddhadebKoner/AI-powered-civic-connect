"use client"

import React from 'react'
import { 
  Users, 
  Shield, 
  Plus,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  totalAuthorities: number
  pendingVerifications: number
  totalIssues: number
}

interface DashboardOverviewProps {
  dashboardStats: DashboardStats | null
  loading: boolean
  onTabChange: (tab: 'overview' | 'authorities' | 'users' | 'create-authority') => void
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  dashboardStats,
  loading,
  onTabChange
}) => {
  const stats = [
    {
      label: 'Total Users',
      value: dashboardStats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-400'
    },
    {
      label: 'Active Authorities',
      value: dashboardStats?.totalAuthorities || 0,
      icon: Shield,
      color: 'text-purple-400'
    },
    {
      label: 'Pending Verifications',
      value: dashboardStats?.pendingVerifications || 0,
      icon: AlertTriangle,
      color: 'text-yellow-400'
    },
    {
      label: 'Total Issues',
      value: dashboardStats?.totalIssues || 0,
      icon: CheckCircle,
      color: 'text-green-400'
    }
  ]

  const quickActions = [
    {
      title: 'Create New Authority',
      description: 'Add authority to system',
      icon: Plus,
      color: 'purple',
      action: () => onTabChange('create-authority')
    },
    {
      title: 'Manage Authorities',
      description: 'View and edit authorities',
      icon: Shield,
      color: 'blue',
      action: () => onTabChange('authorities')
    },
    {
      title: 'User Management',
      description: 'Manage user roles',
      icon: Users,
      color: 'green',
      action: () => onTabChange('users')
    }
  ]

  const recentActivities = [
    { action: 'New authority verification request', user: 'Dr. Rajesh Kumar', time: '2 hours ago', type: 'pending' },
    { action: 'User role updated to authority', user: 'Ms. Priya Sharma', time: '4 hours ago', type: 'success' },
    { action: 'Authority account suspended', user: 'Mr. Vikram Singh', time: '1 day ago', type: 'warning' },
    { action: 'New department created', user: 'Environment Dept.', time: '2 days ago', type: 'info' }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">
                  {loading ? <Loader2 className="animate-spin" size={24} /> : stat.value}
                </p>
              </div>
              <stat.icon className={stat.color} size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`flex items-center space-x-3 p-4 bg-${action.color}-600/20 border border-${action.color}-500/30 rounded-lg hover:bg-${action.color}-600/30 transition-colors`}
            >
              <action.icon className={`text-${action.color}-400`} size={20} />
              <div className="text-left">
                <p className="text-white font-medium">{action.title}</p>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-400' :
                  activity.type === 'warning' ? 'bg-yellow-400' :
                  activity.type === 'pending' ? 'bg-blue-400' : 'bg-purple-400'
                }`} />
                <div>
                  <p className="text-white">{activity.action}</p>
                  <p className="text-gray-400 text-sm">{activity.user}</p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview
