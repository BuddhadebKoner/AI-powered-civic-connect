export interface Authority {
  _id: string
  name: string
  email: string
  department: string
  jurisdiction: string
  contactNumber: string
  address: string
  status: 'PENDING' | 'VERIFIED' | 'REJECTED'
  createdAt: string
  updatedAt: string
  // Change this from string[] to Issue[]
  resolvedIssues: Issue[]
  // ...any other existing properties...
}

// Make sure Issue interface is also defined
export interface Issue {
  _id: string
  title: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  category: string
  location: {
    address: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  reportedBy: string
  assignedTo?: string
  resolvedAt?: string
  createdAt: string
  updatedAt: string
  // ...any other existing properties...
}