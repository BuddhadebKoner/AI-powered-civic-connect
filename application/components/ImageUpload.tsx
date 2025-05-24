"use client"

import React, { useRef, useState, useCallback } from "react";
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { Camera, Upload, X, User, Check, AlertCircle } from 'lucide-react';
import { useImageKit } from '@/context/ImageKitProvider';
import Image from "next/image";

interface ImageUploadProps {
    currentImage?: string;
    onUploadSuccess?: (imageUrl: string, imageId?: string) => void;
    onUploadError?: (error: unknown) => void;
    className?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

interface UploadState {
    isUploading: boolean;
    progress: number;
    error: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    currentImage,
    onUploadSuccess,
    onUploadError,
    className = "",
    disabled = false,
    size = 'md'
}) => {
    const { getAuthParams } = useImageKit();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    
    const [uploadState, setUploadState] = useState<UploadState>({
        isUploading: false,
        progress: 0,
        error: null
    });

    const [previewImage, setPreviewImage] = useState<string>(currentImage || '');

    const sizeClasses = {
        sm: 'w-16 h-16',
        md: 'w-24 h-24',
        lg: 'w-32 h-32'
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24
    };

    const resetState = useCallback(() => {
        setUploadState({
            isUploading: false,
            progress: 0,
            error: null
        });
    }, []);

    const validateFile = useCallback((file: File): string | null => {
        // Check file type
        if (!file.type.startsWith('image/')) {
            return 'Please select a valid image file';
        }
        
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            return 'Image size should be less than 5MB';
        }

        return null;
    }, []);

    const handleUpload = useCallback(async (file: File) => {
        try {
            setUploadState(prev => ({
                ...prev,
                isUploading: true,
                error: null
            }));

            // Create new AbortController for this upload
            abortControllerRef.current = new AbortController();

            // Get authentication parameters
            const authParams = await getAuthParams();
            const { signature, expire, token, publicKey } = authParams;

            // Upload file
            const uploadResponse = await upload({
                file,
                fileName: `profile-${Date.now()}-${file.name}`,
                expire: parseInt(expire),
                token,
                signature,
                publicKey,
                folder: "/profiles",
                onProgress: (event) => {
                    const progress = (event.loaded / event.total) * 100;
                    setUploadState(prev => ({
                        ...prev,
                        progress
                    }));
                },
                abortSignal: abortControllerRef.current.signal,
            });

            // Success
            setUploadState(prev => ({
                ...prev,
                isUploading: false,
                progress: 100
            }));

            if (uploadResponse.url) {
                onUploadSuccess?.(uploadResponse.url, uploadResponse.fileId);
            }

        } catch (error) {
            let errorMessage = 'Upload failed. Please try again.';

            if (error instanceof ImageKitAbortError) {
                errorMessage = 'Upload cancelled';
            } else if (error instanceof ImageKitInvalidRequestError) {
                errorMessage = 'Invalid file or request';
            } else if (error instanceof ImageKitUploadNetworkError) {
                errorMessage = 'Network error. Please check your connection.';
            } else if (error instanceof ImageKitServerError) {
                errorMessage = 'Server error. Please try again later.';
            }

            setUploadState(prev => ({
                ...prev,
                isUploading: false,
                error: errorMessage,
                progress: 0
            }));

            // Reset preview on error
            setPreviewImage(currentImage || '');
            onUploadError?.(error);
        }
    }, [getAuthParams, onUploadSuccess, onUploadError, currentImage]);

    const handleFileSelect = useCallback((file: File) => {
        resetState();

        const validationError = validateFile(file);
        if (validationError) {
            setUploadState(prev => ({
                ...prev,
                error: validationError
            }));
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);

        handleUpload(file);
    }, [validateFile, resetState, handleUpload]);

    const handleCancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setPreviewImage(currentImage || '');
        resetState();
    }, [resetState, currentImage]);

    const handleClick = useCallback(() => {
        if (disabled || uploadState.isUploading) return;
        fileInputRef.current?.click();
    }, [disabled, uploadState.isUploading]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
        // Reset input value to allow re-selecting the same file
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [handleFileSelect]);

    return (
        <div className={`relative ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled || uploadState.isUploading}
            />

            {/* Image Container */}
            <div 
                onClick={handleClick}
                className={`
                    relative ${sizeClasses[size]} rounded-2xl overflow-hidden cursor-pointer
                    bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 
                    border-3 border-white dark:border-gray-600 shadow-xl
                    transition-all duration-300 hover:scale-105
                    ${uploadState.isUploading ? 'cursor-not-allowed' : 'hover:shadow-2xl'}
                    ${uploadState.error ? 'ring-2 ring-red-500' : 'ring-4 ring-blue-100 dark:ring-blue-900/30'}
                `}
            >
                {/* Image or Placeholder */}
                {previewImage ? (
                    <Image
                        fill
                        src={previewImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <User size={iconSizes[size] + 8} className="text-gray-400 dark:text-gray-500" />
                    </div>
                )}

                {/* Upload Progress Overlay */}
                {uploadState.isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-white text-xs font-medium">
                                {Math.round(uploadState.progress)}%
                            </p>
                        </div>
                    </div>
                )}

                {/* Success Overlay */}
                {uploadState.progress === 100 && !uploadState.isUploading && !uploadState.error && (
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <Check size={iconSizes[size]} className="text-green-600" />
                    </div>
                )}
            </div>

            {/* Camera Icon */}
            <div className={`
                absolute -bottom-2 -right-2 
                ${uploadState.isUploading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} 
                rounded-xl p-2 border-3 border-white dark:border-gray-900 shadow-lg 
                transition-all duration-200 
                ${uploadState.isUploading ? 'cursor-not-allowed' : 'hover:scale-110 cursor-pointer'}
            `}>
                {uploadState.isUploading ? (
                    <Upload size={iconSizes[size] - 6} className="text-white" />
                ) : (
                    <Camera size={iconSizes[size] - 6} className="text-white" />
                )}
            </div>

            {/* Cancel Button */}
            {uploadState.isUploading && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCancel();
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full shadow-md transition-colors"
                >
                    <X size={12} className="text-white" />
                </button>
            )}

            {/* Error Message */}
            {uploadState.error && (
                <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <AlertCircle size={14} className="text-red-600 dark:text-red-400 flex-shrink-0" />
                        <p className="text-red-600 dark:text-red-400 text-xs font-medium">
                            {uploadState.error}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
