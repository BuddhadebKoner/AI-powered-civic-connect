"use client"

import React from 'react'
import { 
  Users, 
  Shield, 
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

interface DashboardStatsProps {
  stats: DashboardStats | null
  loading: boolean
}

const DashboardStatsComponent: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
  const statsConfig = [
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-400'
    },
    {
      label: 'Active Authorities',
      value: stats?.totalAuthorities || 0,
      icon: Shield,
      color: 'text-purple-400'
    },
    {
      label: 'Pending Verifications',
      value: stats?.pendingVerifications || 0,
      icon: AlertTriangle,
      color: 'text-yellow-400'
    },
    {
      label: 'Total Issues',
      value: stats?.totalIssues || 0,
      icon: CheckCircle,
      color: 'text-green-400'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsConfig.map((stat, index) => (
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
  )
}

export default DashboardStatsComponent