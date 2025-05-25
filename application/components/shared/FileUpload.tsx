"use client"

import React, { useRef, useState, useCallback } from "react";
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { Upload, X, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';
import { useImageKit } from '@/context/ImageKitProvider';

// Define proper types for ImageKit upload response
interface ImageKitUploadResponse {
    fileId: string;
    name: string;
    size: number;
    filePath: string;
    url: string;
    fileType: string;
    height?: number;
    width?: number;
    thumbnailUrl?: string;
}

interface FileUploadProps {
    onUploadSuccess?: (response: ImageKitUploadResponse) => void;
    onUploadError?: (error: Error) => void;
    accept?: string;
    maxSize?: number; // in MB
    className?: string;
    disabled?: boolean;
    multiple?: boolean;
}

interface UploadState {
    isUploading: boolean;
    progress: number;
    error: string | null;
    success: boolean;
    uploadedFile: ImageKitUploadResponse | null;
}

const FileUpload: React.FC<FileUploadProps> = ({
    onUploadSuccess,
    onUploadError,
    accept = "image/*",
    maxSize = 5,
    className = "",
    disabled = false,
    multiple = false
}) => {
    const { getAuthParams } = useImageKit();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const [uploadState, setUploadState] = useState<UploadState>({
        isUploading: false,
        progress: 0,
        error: null,
        success: false,
        uploadedFile: null
    });

    const resetState = useCallback(() => {
        setUploadState({
            isUploading: false,
            progress: 0,
            error: null,
            success: false,
            uploadedFile: null
        });
    }, []);

    const validateFile = useCallback((file: File): string | null => {
        // Check file type
        if (accept === "image/*" && !file.type.startsWith('image/')) {
            return 'Please select a valid image file';
        }

        // Check file size
        if (file.size > maxSize * 1024 * 1024) {
            return `File size should be less than ${maxSize}MB`;
        }

        return null;
    }, [accept, maxSize]);

    const handleUpload = useCallback(async (file: File) => {
        try {
            setUploadState(prev => ({
                ...prev,
                isUploading: true,
                error: null,
                success: false
            }));

            // Create new AbortController for this upload
            abortControllerRef.current = new AbortController();

            // Get authentication parameters
            const authParams = await getAuthParams();
            const { signature, expire, token, publicKey } = authParams;

            // Upload file
            const uploadResponse = await upload({
                file,
                fileName: `post-${Date.now()}-${file.name}`,
                expire: parseInt(expire),
                token,
                signature,
                publicKey,
                folder: "/posts",
                onProgress: (event) => {
                    const progress = (event.loaded / event.total) * 100;
                    setUploadState(prev => ({
                        ...prev,
                        progress
                    }));
                },
                abortSignal: abortControllerRef.current.signal,
            }) as ImageKitUploadResponse;

            // Success
            setUploadState(prev => ({
                ...prev,
                isUploading: false,
                success: true,
                uploadedFile: uploadResponse,
                progress: 100
            }));

            onUploadSuccess?.(uploadResponse);

            // Reset to allow more uploads in multiple mode
            if (multiple) {
                setTimeout(() => {
                    setUploadState(prev => ({
                        ...prev,
                        success: false,
                        uploadedFile: null
                    }));
                }, 2000);
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

            onUploadError?.(error as Error);
        }
    }, [getAuthParams, onUploadSuccess, onUploadError, multiple]);

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

        handleUpload(file);
    }, [validateFile, resetState, handleUpload]);

    const handleCancel = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        resetState();
    }, [resetState]);

    const handleClick = useCallback(() => {
        if (disabled || uploadState.isUploading) return;
        fileInputRef.current?.click();
    }, [disabled, uploadState.isUploading]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        if (multiple) {
            // Handle multiple files
            files.forEach(file => {
                handleFileSelect(file);
            });
        } else {
            // Handle single file
            const file = files[0];
            if (file) {
                handleFileSelect(file);
            }
        }
        
        // Reset input value to allow re-selecting the same file
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [handleFileSelect, multiple]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (disabled || uploadState.isUploading) return;

        const files = Array.from(e.dataTransfer.files);
        
        if (multiple) {
            // Handle multiple files
            files.forEach(file => {
                handleFileSelect(file);
            });
        } else {
            // Handle single file
            const file = files[0];
            if (file) {
                handleFileSelect(file);
            }
        }
    }, [disabled, uploadState.isUploading, handleFileSelect, multiple]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Upload Area */}
            <div
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`
                    relative border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 cursor-pointer
                    ${uploadState.isUploading || disabled
                        ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-blue-900/10'
                    }
                    ${uploadState.error ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/10' : ''}
                    ${uploadState.success ? 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/10' : ''}
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={disabled || uploadState.isUploading}
                />

                {/* Upload Content */}
                <div className="flex flex-col items-center space-y-2">
                    {uploadState.isUploading ? (
                        <>
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <Upload size={16} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-900 dark:text-white">
                                    Uploading... {Math.round(uploadState.progress)}%
                                </p>
                                <div className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 transition-all duration-300 ease-out"
                                        style={{ width: `${uploadState.progress}%` }}
                                    />
                                </div>
                            </div>
                        </>
                    ) : uploadState.success ? (
                        <>
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <Check size={16} className="text-green-600 dark:text-green-400" />
                            </div>
                            <p className="text-xs font-medium text-green-900 dark:text-green-400">
                                Upload successful!
                            </p>
                        </>
                    ) : uploadState.error ? (
                        <>
                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-red-900 dark:text-red-400">
                                    Upload failed
                                </p>
                                <p className="text-xs text-red-600 dark:text-red-400">
                                    {uploadState.error}
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <ImageIcon size={16} className="text-gray-600 dark:text-gray-400" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-gray-900 dark:text-white">
                                    {multiple ? 'Click or drag images to upload' : 'Click or drag image to upload'}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {accept === "image/*" ? "PNG, JPG, GIF" : "Select file"} up to {maxSize}MB
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Cancel Button */}
                {uploadState.isUploading && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCancel();
                        }}
                        className="absolute top-1 right-1 p-1 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={12} className="text-gray-600 dark:text-gray-400" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
