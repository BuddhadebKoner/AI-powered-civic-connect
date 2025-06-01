"use client"

import React from 'react'
import { getActivityTypeColor } from '@/lib/adminUtils'

interface Activity {
  action: string
  user: string
  time: string
  type: 'success' | 'warning' | 'pending' | 'info'
}

interface RecentActivitiesProps {
  activities?: Activity[]
  title?: string
}

const RecentActivitiesComponent: React.FC<RecentActivitiesProps> = ({ 
  activities = [
    { action: 'New authority verification request', user: 'Dr. Rajesh Kumar', time: '2 hours ago', type: 'pending' },
    { action: 'User role updated to authority', user: 'Ms. Priya Sharma', time: '4 hours ago', type: 'success' },
    { action: 'Authority account suspended', user: 'Mr. Vikram Singh', time: '1 day ago', type: 'warning' },
    { action: 'New department created', user: 'Environment Dept.', time: '2 days ago', type: 'info' }
  ],
  title = "Recent Activity"
}) => {
  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold text-purple-400 mb-4">{title}</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${getActivityTypeColor(activity.type)}`} />
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
  )
}

export default RecentActivitiesComponent