"use client"

import React from 'react'
import { 
  Users, 
  Shield, 
  Plus,
  Database
} from 'lucide-react'

interface TabNavigationProps {
  activeTab: 'overview' | 'authorities' | 'users' | 'create-authority'
  onTabChange: (tab: 'overview' | 'authorities' | 'users' | 'create-authority') => void
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Database },
    { id: 'authorities', label: 'Authorities', icon: Shield },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'create-authority', label: 'Create Authority', icon: Plus }
  ] as const

  return (
    <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === tab.id
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <tab.icon size={18} />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

export default TabNavigation
