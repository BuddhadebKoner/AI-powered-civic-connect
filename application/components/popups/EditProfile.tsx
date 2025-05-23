"use client"

import React, { useState, useRef, useMemo, useEffect } from 'react'
import { X, Camera, User, AtSign, FileText, Lock, Unlock, Check } from 'lucide-react'
import { UserTypeContext } from '@/types';
import { useUserAuthentication } from '@/context/AuthProvider'

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ isOpen, onClose }) => {
  const { user, isLoading: userLoading } = useUserAuthentication();
  
  // Store original values for comparison
  const originalData = useMemo(() => ({ 
    fullName: user?.fullName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    isPrivateProfile: user?.isPrivateProfile || false,
    profilePictureUrl: user?.profilePictureUrl || ''
  }), [user]);

  const [formData, setFormData] = useState(originalData);
  const [previewImage, setPreviewImage] = useState<string>(user?.profilePictureUrl || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when user data changes or modal opens
  useEffect(() => {
    if (isOpen && user) {
      const newData = {
        fullName: user.fullName || '',
        username: user.username || '',
        bio: user.bio || '',
        isPrivateProfile: user.isPrivateProfile || false,
        profilePictureUrl: user.profilePictureUrl || ''
      };
      setFormData(newData);
      setPreviewImage(user.profilePictureUrl || '');
      setErrors({});
    }
  }, [isOpen, user]);

  // Check if any changes were made
  const hasChanges = useMemo(() => {
    return (
      formData.fullName !== originalData.fullName ||
      formData.username !== originalData.username ||
      formData.bio !== originalData.bio ||
      formData.isPrivateProfile !== originalData.isPrivateProfile ||
      formData.profilePictureUrl !== originalData.profilePictureUrl
    );
  }, [formData, originalData]);

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          newErrors.fullName = 'Name is required';
        } else if (value.length < 2) {
          newErrors.fullName = 'Name must be at least 2 characters';
        } else {
          delete newErrors.fullName;
        }
        break;
      case 'username':
        if (!value.trim()) {
          newErrors.username = 'Username is required';
        } else if (value.length < 3) {
          newErrors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          newErrors.username = 'Username can only contain letters, numbers, and underscores';
        } else {
          delete newErrors.username;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Optimized change handler with debouncing for validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Clear existing errors immediately for better UX
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
      
      // Validate only after user stops typing (debounced validation)
      if (name === 'fullName' || name === 'username') {
        const timeoutId = setTimeout(() => {
          validateField(name, value);
        }, 300);
        
        return () => clearTimeout(timeoutId);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clear previous image errors
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewImage(result);
        setFormData(prev => ({
          ...prev,
          profilePictureUrl: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setFormData(originalData);
    setPreviewImage(originalData.profilePictureUrl);
    setErrors({});
  };

  const handleSave = async () => {
    // Validate all fields before saving
    const isFullNameValid = validateField('fullName', formData.fullName);
    const isUsernameValid = validateField('username', formData.username);
    
    if (!isFullNameValid || !isUsernameValid) {
      return;
    }

    // Only send changed fields
    const changedFields: Partial<UserTypeContext> = {};
    
    if (formData.fullName !== originalData.fullName) {
      changedFields.fullName = formData.fullName;
    }
    
    if (formData.username !== originalData.username) {
      changedFields.username = formData.username;
    }
    
    if (formData.bio !== originalData.bio) {
      changedFields.bio = formData.bio;
    }
    
    if (formData.isPrivateProfile !== originalData.isPrivateProfile) {
      changedFields.isPrivateProfile = formData.isPrivateProfile;
    }
    
    if (formData.profilePictureUrl !== originalData.profilePictureUrl) {
      changedFields.profilePictureUrl = formData.profilePictureUrl;
    }

    setIsLoading(true);
    try {
      // Here you would make the API call to save the profile
      console.log('Saving profile changes:', changedFields);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message briefly
      console.log('Profile updated successfully');
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors(prev => ({ ...prev, general: 'Failed to save changes. Please try again.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = Object.keys(errors).length === 0;
  const canSave = hasChanges && isFormValid && !isLoading;

  // Show loading state if user data is still loading
  if (!isOpen) return null;

  if (userLoading || !user) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-2xl">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Customize your public profile</p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-200 group"
            aria-label="Close"
          >
            <X size={20} className="text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* General Error */}
          {errors.general && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{errors.general}</p>
            </div>
          )}

          {/* Profile Picture */}
          <div className="flex justify-center">
            <div className="relative group">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 border-3 border-white dark:border-gray-600 shadow-xl cursor-pointer hover:scale-105 transition-all duration-300 ring-4 ring-blue-100 dark:ring-blue-900/30"
              >
                {previewImage ? (
                  <img 
                    src={previewImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={32} className="text-gray-400 dark:text-gray-500" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 rounded-xl p-2 border-3 border-white dark:border-gray-900 shadow-lg transition-all duration-200 group-hover:scale-110">
                <Camera size={14} className="text-white" />
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {errors.image && (
            <div className="text-center">
              <p className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg inline-block">{errors.image}</p>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all duration-200 text-sm font-medium ${
                    errors.fullName ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-600'
                  }`}
                  placeholder="Enter your full name"
                  maxLength={50}
                />
                {formData.fullName && !errors.fullName && (
                  <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                )}
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all duration-200 text-sm font-medium ${
                    errors.username ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-600'
                  }`}
                  placeholder="@username"
                  maxLength={30}
                />
                {formData.username && !errors.username && (
                  <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
                )}
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {errors.username}
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 resize-none transition-all duration-200 text-sm"
                placeholder="Tell people about yourself..."
                maxLength={160}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">Optional</p>
                <p className={`text-xs font-medium ${formData.bio.length > 140 ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  {formData.bio.length}/160
                </p>
              </div>
            </div>

            {/* Privacy Toggle */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border-2 border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${formData.isPrivateProfile ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                    {formData.isPrivateProfile ? (
                      <Lock size={18} className="text-red-600 dark:text-red-400" />
                    ) : (
                      <Unlock size={18} className="text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-semibold text-sm">Private Account</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      {formData.isPrivateProfile ? "Only approved followers can see your posts" : "Anyone can see your public posts"}
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPrivateProfile"
                    checked={formData.isPrivateProfile}
                    onChange={handleInputChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 dark:peer-focus:ring-blue-900/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 shadow-inner"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex space-x-3">
          {hasChanges && (
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 font-semibold text-sm hover:scale-105"
              disabled={isLoading}
            >
              Reset
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all duration-200 font-semibold text-sm hover:scale-105 disabled:hover:scale-100"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className={`flex-1 px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold flex items-center justify-center text-sm ${
              canSave
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : hasChanges ? (
              'Save Changes'
            ) : (
              'No Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;