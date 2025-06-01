
export interface User {
  id: string
  name: string
  email: string
  role: 'MASTER_ADMIN' | 'AUTHORITY_ADMIN' | 'CITIZEN'
  status: 'active' | 'inactive' | 'pending'
  createdAt: string
  lastLogin?: string
}

export interface Authority {
  id: string
  name: string
  type: string
  state: string
  city: string
  district: string
  pincode: string
  contactEmail: string
  contactPhone: string
  status: 'active' | 'inactive' | 'pending'
  admin?: User
  createdAt: string
  updatedAt: string
}

export interface DashboardStats {
  totalUsers: number
  totalAuthorities: number
  pendingVerifications: number
  totalIssues: number
}

export interface RecentActivity {
  id: string
  type: 'user_registration' | 'authority_creation' | 'issue_reported' | 'authority_verification'
  description: string
  timestamp: string
  user?: {
    name: string
    email: string
  }
  authority?: {
    name: string
    type: string
  }
}

export interface CreateAuthorityFormData {
  name: string
  type: string
  state: string
  city: string
  district: string
  pincode: string
  contactEmail: string
  contactPhone: string
  adminName: string
  adminEmail: string
  adminPhone: string
}

export interface CreateAuthorityApiPayload {
  authority: {
    name: string
    type: string
    state: string
    city: string
    district: string
    pincode: string
    contactEmail: string
    contactPhone: string
  }
  admin: {
    name: string
    email: string
    phone: string
  }
}

export interface TabConfig {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export interface ApiError {
  message: string
  status?: number
  details?: any
}

export interface PaginationConfig {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface FilterConfig {
  status?: string
  type?: string
  state?: string
  role?: string
  search?: string
}

// Form validation types
export interface FormErrors {
  [key: string]: string | undefined
}

export interface FormValidationRule {
  required?: boolean
  pattern?: RegExp
  minLength?: number
  maxLength?: number
  custom?: (value: string) => string | undefined
}

export interface FormValidationRules {
  [key: string]: FormValidationRule
}

// Component prop types
export interface DashboardOverviewProps {
  dashboardStats: DashboardStats | null
  recentActivities: RecentActivity[]
  isLoading: boolean
  error: string | null
  onCreateAuthority: () => void
  onRefresh: () => void
}

export interface AuthorityListComponentProps {
  authorities: Authority[]
  isLoading: boolean
  error: string | null
  onEdit: (authority: Authority) => void
  onDelete: (authorityId: string) => void
  onStatusChange: (authorityId: string, status: Authority['status']) => void
  pagination?: PaginationConfig
  onPageChange?: (page: number) => void
  filters?: FilterConfig
  onFilterChange?: (filters: FilterConfig) => void
}

export interface UserManagementProps {
  users: User[]
  isLoading: boolean
  error: string | null
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
  onRoleChange: (userId: string, role: User['role']) => void
  onStatusChange: (userId: string, status: User['status']) => void
  pagination?: PaginationConfig
  onPageChange?: (page: number) => void
  filters?: FilterConfig
  onFilterChange?: (filters: FilterConfig) => void
}

export interface CreateAuthorityFormProps {
  onSubmit: (data: CreateAuthorityFormData) => Promise<void>
  isLoading: boolean
  error: string | null
  initialData?: Partial<CreateAuthorityFormData>
}

export interface TabNavigationProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  tabs: TabConfig[]
}

export interface ErrorDisplayProps {
  error: string | null
  onRetry?: () => void
  showRetry?: boolean
  className?: string
}

export interface DashboardStatsProps {
  stats: DashboardStats | null
  isLoading: boolean
  onStatClick?: (statType: keyof DashboardStats) => void
}

export interface RecentActivitiesProps {
  activities: RecentActivity[]
  isLoading: boolean
  onActivityClick?: (activity: RecentActivity) => void
  maxItems?: number
}

// Hook return types
export interface UseCreateAuthorityFormReturn {
  formData: CreateAuthorityFormData
  errors: FormErrors
  isSubmitting: boolean
  handleInputChange: (name: string, value: string) => void
  handleSubmit: (onSubmit: (data: CreateAuthorityFormData) => Promise<void>) => Promise<void>
  resetForm: () => void
  validateForm: () => boolean
}

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: ApiError
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationConfig
}
