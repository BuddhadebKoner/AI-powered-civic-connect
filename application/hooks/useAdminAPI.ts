"use client";

import { useState, useCallback } from 'react';

interface DashboardStats {
  totalUsers: number;
  totalAuthorities: number;
  pendingVerifications: number;
  totalIssues: number;
  resolvedIssues: number;
  pendingIssues: number;
}

interface Authority {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    username: string;
  };
  position: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  contactInfo: {
    email: string;
    phone: string;
    officialEmail?: string;
    officeAddress?: string;
  };
  expertise: string[];
  area: {
    type: string;
    name: string;
    state: string;
    country: string;
    postalCode: string;
  };
  assignedIssues: string[];
  pendingIssues: string[];
  resolvedIssues: string[];
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
  username: string;
  role: 'user' | 'authority' | 'masteradmin';
  location?: string;
  isPrivateProfile: boolean;
  posts: string[];
  createdAt: string;
  updatedAt: string;
}

interface CreateAuthorityData {
  userId: string;
  position: string;
  contactInfo: {
    email: string;
    phone: string;
    officialEmail?: string;
    officeAddress?: string;
  };
  expertise: string[];
  area: {
    type: string;
    name: string;
    state: string;
    country: string;
    postalCode: string;
  };
}

export const useAdminAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const setErrorState = (message: string) => {
    setError(message);
    console.error(message);
  };

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      const data = await response.json();
      setDashboardStats(data);
      setError(null);
    } catch (err) {
      setErrorState('Failed to fetch dashboard statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAuthorities = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/authorities')
      
      if (response.ok) {
        const data = await response.json()
        setAuthorities(data)
        setError(null)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to fetch authorities')
      }
    } catch (err) {
      setError('Error fetching authorities')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setErrorState('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAuthority = async (authorityData: CreateAuthorityData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/authorities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(authorityData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create authority');
      }

      const newAuthority = await response.json();
      setAuthorities(prev => [...prev, newAuthority]);
      setError(null);
      return newAuthority;
    } catch (err) {
      setErrorState(err instanceof Error ? err.message : 'Failed to create authority');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user role');
      }

      const updatedUser = await response.json();
      setUsers(prev => 
        prev.map(user => user._id === userId ? updatedUser : user)
      );
      setError(null);
      return updatedUser;
    } catch (err) {
      setErrorState(err instanceof Error ? err.message : 'Failed to update user role');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAuthorityStatus = async (authorityId: string, status: 'VERIFIED' | 'REJECTED') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/authorities/${authorityId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ verificationStatus: status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update authority status');
      }

      const updatedAuthority = await response.json();
      setAuthorities(prev =>
        prev.map(auth => auth._id === authorityId ? updatedAuthority : auth)
      );
      setError(null);
      return updatedAuthority;
    } catch (err) {
      setErrorState(err instanceof Error ? err.message : 'Failed to update authority status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    dashboardStats,
    authorities,
    users,
    fetchDashboardStats,
    fetchAuthorities,
    fetchUsers,
    createAuthority,
    updateUserRole,
    updateAuthorityStatus,
  };
};