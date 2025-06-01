import React from 'react'

const AuthorityDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-orange-400 mb-2">Civic Issues</h3>
          <p className="text-gray-300">Review and manage reported civic issues.</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-orange-400 mb-2">Community Reports</h3>
          <p className="text-gray-300">Monitor community reports and feedback.</p>
        </div>
      </div>
    </div>
  )
}

export default AuthorityDashboard