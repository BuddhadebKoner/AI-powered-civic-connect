"use client"

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, RotateCw, Crop } from 'lucide-react';
import Image from 'next/image';

interface CropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onCrop: (croppedFile: File) => void;
  onCancel: () => void;
}

interface CropArea {
  x: number;
  y: number;
  size: number;
}

const CropModal: React.FC<CropModalProps> = ({
  isOpen,
  imageSrc,
  onCrop,
  onCancel
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, size: 200 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 400, height: 400 });

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setRotation(0);
      setImageLoaded(false);
      setCropArea({ x: 0, y: 0, size: 200 });
    }
  }, [isOpen]);

  // Handle image load and calculate initial crop area
  const handleImageLoad = useCallback(() => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const containerWidth = 400;
    const containerHeight = 400;

    // Calculate display size while maintaining aspect ratio
    let displayWidth = img.naturalWidth;
    let displayHeight = img.naturalHeight;

    const aspectRatio = displayWidth / displayHeight;

    if (displayWidth > containerWidth || displayHeight > containerHeight) {
      if (aspectRatio > 1) {
        displayWidth = containerWidth;
        displayHeight = containerWidth / aspectRatio;
      } else {
        displayHeight = containerHeight;
        displayWidth = containerHeight * aspectRatio;
      }
    }

    setContainerSize({ width: displayWidth, height: displayHeight });

    // Center the crop area and make it fit within the image
    const maxCropSize = Math.min(displayWidth, displayHeight) * 0.8;
    const cropSize = Math.min(maxCropSize, 250);
    
    setCropArea({
      x: (displayWidth - cropSize) / 2,
      y: (displayHeight - cropSize) / 2,
      size: cropSize
    });

    setImageLoaded(true);
  }, []);

  // Handle mouse/touch events for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - cropArea.size / 2;
    const y = e.clientY - rect.top - cropArea.size / 2;

    // Constrain crop area within image bounds
    const maxX = containerSize.width - cropArea.size;
    const maxY = containerSize.height - cropArea.size;

    setCropArea(prev => ({
      ...prev,
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    }));
  }, [isDragging, cropArea.size, containerSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle rotation
  const handleRotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  // Resize crop area
  const handleCropResize = useCallback((newSize: number) => {
    const maxSize = Math.min(containerSize.width, containerSize.height);
    const size = Math.max(100, Math.min(newSize, maxSize));
    
    setCropArea(prev => ({
      ...prev,
      size,
      x: Math.max(0, Math.min(prev.x, containerSize.width - size)),
      y: Math.max(0, Math.min(prev.y, containerSize.height - size))
    }));
  }, [containerSize]);

  // Create cropped image
  const handleCrop = useCallback(async () => {
    if (!imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    
    // Set canvas size to desired output size (square)
    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Calculate scale factors
    const scaleX = img.naturalWidth / containerSize.width;
    const scaleY = img.naturalHeight / containerSize.height;

    // Calculate crop area in original image coordinates
    const sourceX = cropArea.x * scaleX;
    const sourceY = cropArea.y * scaleY;
    const sourceSize = cropArea.size * Math.min(scaleX, scaleY);

    // Clear canvas
    ctx.clearRect(0, 0, outputSize, outputSize);

    // Apply rotation if needed
    if (rotation !== 0) {
      ctx.save();
      ctx.translate(outputSize / 2, outputSize / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-outputSize / 2, -outputSize / 2);
    }

    // Draw cropped image
    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      outputSize,
      outputSize
    );

    if (rotation !== 0) {
      ctx.restore();
    }

    // Convert canvas to blob and create file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });
        onCrop(file);
      }
    }, 'image/jpeg', 0.9);
  }, [cropArea, containerSize, rotation, onCrop]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Crop Image</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Adjust and crop your image to a square</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRotate}
                className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Rotate 90°"
              >
                <RotateCw size={16} className="text-gray-600 dark:text-gray-400" />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {rotation}°
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Size:</span>
              <input
                type="range"
                min="100"
                max={Math.min(containerSize.width, containerSize.height)}
                value={cropArea.size}
                onChange={(e) => handleCropResize(Number(e.target.value))}
                className="w-20"
              />
            </div>
          </div>

          {/* Image Container */}
          <div className="relative flex justify-center">
            <div 
              className="relative inline-block bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
              style={{ width: containerSize.width, height: containerSize.height }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <Image
                width={containerSize.width}
                height={containerSize.height}
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                className="w-full h-full object-contain select-none"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.3s ease'
                }}
                onLoad={handleImageLoad}
                draggable={false}
              />
              
              {/* Crop Overlay */}
              {imageLoaded && (
                <>
                  {/* Four-part overlay to create a "hole" */}
                  {/* Top overlay */}
                  <div 
                    className="absolute bg-black/50"
                    style={{
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: cropArea.y
                    }}
                  />
                  
                  {/* Bottom overlay */}
                  <div 
                    className="absolute bg-black/50"
                    style={{
                      left: 0,
                      top: cropArea.y + cropArea.size,
                      width: '100%',
                      height: containerSize.height - (cropArea.y + cropArea.size)
                    }}
                  />
                  
                  {/* Left overlay */}
                  <div 
                    className="absolute bg-black/50"
                    style={{
                      left: 0,
                      top: cropArea.y,
                      width: cropArea.x,
                      height: cropArea.size
                    }}
                  />
                  
                  {/* Right overlay */}
                  <div 
                    className="absolute bg-black/50"
                    style={{
                      left: cropArea.x + cropArea.size,
                      top: cropArea.y,
                      width: containerSize.width - (cropArea.x + cropArea.size),
                      height: cropArea.size
                    }}
                  />
                  
                  {/* Crop area border and handles */}
                  <div
                    className="absolute border-2 border-white shadow-lg cursor-move pointer-events-auto"
                    style={{
                      left: cropArea.x,
                      top: cropArea.y,
                      width: cropArea.size,
                      height: cropArea.size,
                      boxSizing: 'border-box'
                    }}
                    onMouseDown={handleMouseDown}
                  >
                    {/* Corner handles */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-white border border-gray-300 rounded-full shadow-sm" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white border border-gray-300 rounded-full shadow-sm" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border border-gray-300 rounded-full shadow-sm" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-gray-300 rounded-full shadow-sm" />
                    
                    {/* Grid lines - using absolute positioning instead of CSS grid */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Vertical lines */}
                      <div 
                        className="absolute border-l border-white/40" 
                        style={{ left: '33.33%', top: 0, height: '100%' }}
                      />
                      <div 
                        className="absolute border-l border-white/40" 
                        style={{ left: '66.66%', top: 0, height: '100%' }}
                      />
                      {/* Horizontal lines */}
                      <div 
                        className="absolute border-t border-white/40" 
                        style={{ top: '33.33%', left: 0, width: '100%' }}
                      />
                      <div 
                        className="absolute border-t border-white/40" 
                        style={{ top: '66.66%', left: 0, width: '100%' }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Hidden canvas for cropping */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            disabled={!imageLoaded}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-xl transition-all duration-200 font-medium flex items-center justify-center space-x-2"
          >
            <Crop size={16} />
            <span>Crop & Upload</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;