import React, { useCallback } from 'react';
import Image from 'next/image';
import FileUpload from '../shared/FileUpload';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface FormData {
   title: string;
   subtitle: string;
   images: ImageData[];
   tags: string[];
   keywords: string[];
   location: {
      latitude: number;
      longitude: number;
      address: string;
   };
   visibility: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED';
}

interface UploadResponse {
   url: string;
   fileId: string;
}

interface CreatePostFormProps {
   onSubmit: (formData: FormData) => void;
   onUploadSuccess: (response: UploadResponse) => void;
   onUploadError: (error: Error) => void;
}

interface ImageData {
   url: string;
   id: string;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({
   onSubmit,
   onUploadSuccess,
   onUploadError,
}) => {
   const [formData, setFormData] = React.useState<FormData>({
      title: '',
      subtitle: '',
      images: [] as ImageData[],
      tags: [] as string[],
      keywords: [] as string[],
      location: {
         latitude: 0,
         longitude: 0,
         address: '',
      },
      visibility: 'PUBLIC' as 'PUBLIC' | 'PRIVATE' | 'RESTRICTED',
   });

   const [tagInput, setTagInput] = React.useState('');
   const [keywordInput, setKeywordInput] = React.useState('');
   const [locationLoading, setLocationLoading] = React.useState(false);

   // Auto-fetch location on component mount
   React.useEffect(() => {
      getCurrentLocation();
   }, []);

   const getCurrentLocation = () => {
      setLocationLoading(true);
      if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(
            async (position) => {
               const { latitude, longitude } = position.coords;

               try {
                  // Reverse geocoding to get address
                  const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                  const data = await response.json();
                  const address = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                  
                  setFormData(prev => ({
                     ...prev,
                     location: {
                        latitude,
                        longitude,
                        address
                     }
                  }));
               } catch (error) {
                  console.error('Error getting address:', error);
                  setFormData(prev => ({
                     ...prev,
                     location: {
                        latitude,
                        longitude,
                        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                     }
                  }));
               }
               setLocationLoading(false);
            },
            (error) => {
               console.error('Error getting location:', error);
               setLocationLoading(false);
            }
         );
      } else {
         console.error('Geolocation is not supported by this browser.');
         setLocationLoading(false);
      }
   };

   const handleLocationChange = (field: 'latitude' | 'longitude' | 'address', value: string | number) => {
      setFormData(prev => ({
         ...prev,
         location: {
            ...prev.location,
            [field]: value
         }
      }));
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value
      }));
   };

   const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && tagInput.trim()) {
         e.preventDefault();
         if (!formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
               ...prev,
               tags: [...prev.tags, tagInput.trim()]
            }));
         }
         setTagInput('');
      }
   };

   const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && keywordInput.trim()) {
         e.preventDefault();
         if (!formData.keywords.includes(keywordInput.trim())) {
            setFormData(prev => ({
               ...prev,
               keywords: [...prev.keywords, keywordInput.trim()]
            }));
         }
         setKeywordInput('');
      }
   };

   const removeTag = (tagToRemove: string) => {
      setFormData(prev => ({
         ...prev,
         tags: prev.tags.filter(tag => tag !== tagToRemove)
      }));
   };

   const removeKeyword = (keywordToRemove: string) => {
      setFormData(prev => ({
         ...prev,
         keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
      }));
   };

   const handleImageUploadSuccess = (response: UploadResponse) => {
      // Add the uploaded image to the images array
      const newImage: ImageData = {
         url: response.url,
         id: response.fileId
      };
      
      setFormData(prev => ({
         ...prev,
         images: [...prev.images, newImage]
      }));
      
      onUploadSuccess(response);
   };

   const deleteImage = useCallback(async (imageId: string) => {
      try {
         const response = await fetch('/api/imagekit-delete', {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fileId: imageId })
         });

         if (!response.ok) {
            console.warn('Failed to delete image:', response.statusText);
         }
      } catch (error) {
         console.warn('Error deleting image:', error);
      }
   }, []);

   const removeImage = useCallback(async (imageId: string) => {
      // Delete from ImageKit
      await deleteImage(imageId);
      
      // Remove from local state
      setFormData(prev => ({
         ...prev,
         images: prev.images.filter(img => img.id !== imageId)
      }));
   }, [deleteImage]);

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      // Console log the form data as requested
      console.log('Form Data Submitted:', {
         ...formData,
         // Additional fields that will be handled server-side
         owner: null, // Will be set from authentication
         category: null, // Will be determined by AI agent
         department: null, // Will be determined by AI agent
         status: 'PENDING',
         upvotes: 0,
         downvotes: 0,
         assignedAuthorities: [],
         comments: [],
         resolutionDetails: null,
         aiAnalysis: null,
         urgencyScore: 5,
         votedUsers: []
      });
      
      onSubmit(formData);
   };

   return (
      <form onSubmit={handleSubmit} className="space-y-6">
         {/* Title */}
         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Issue Title *
            </label>
            <input
               type="text"
               name="title"
               value={formData.title}
               onChange={handleInputChange}
               required
               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all duration-200"
               placeholder="Give your issue a clear, descriptive title..."
            />
         </div>

         {/* Subtitle/Description */}
         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Description *
            </label>
            <textarea
               name="subtitle"
               value={formData.subtitle}
               onChange={handleInputChange}
               required
               rows={4}
               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 resize-none transition-all duration-200"
               placeholder="Describe the issue in detail. What's the problem? How does it affect you and your community?"
            />
         </div>

         {/* Location Section */}
         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Location *
            </label>
            <div className="space-y-3">
               {/* Address Input */}
               <div>
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                     Address
                  </label>
                  <input
                     type="text"
                     value={formData.location.address}
                     onChange={(e) => handleLocationChange('address', e.target.value)}
                     required
                     placeholder={locationLoading ? "Fetching current location..." : "Enter the exact location of the issue..."}
                     disabled={locationLoading}
                     className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all duration-200 disabled:opacity-50"
                  />
               </div>
               
               {/* Coordinates */}
               <div className="grid grid-cols-2 gap-3">
                  <div>
                     <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Latitude
                     </label>
                     <input
                        type="number"
                        step="any"
                        value={formData.location.latitude || ''}
                        onChange={(e) => handleLocationChange('latitude', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Latitude"
                     />
                  </div>
                  <div>
                     <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Longitude
                     </label>
                     <input
                        type="number"
                        step="any"
                        value={formData.location.longitude || ''}
                        onChange={(e) => handleLocationChange('longitude', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Longitude"
                     />
                  </div>
               </div>

               <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {locationLoading ? 'Fetching location...' : '📍 Refresh current location'}
               </button>
            </div>
         </div>

         {/* Multiple Image Upload with Swiper */}
         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Add Images (Optional)
            </label>
            
            {/* Display uploaded images with Swiper */}
            {formData.images.length > 0 && (
               <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                     Uploaded Images ({formData.images.length})
                  </h4>
                  <Swiper
                     modules={[Navigation, Pagination]}
                     spaceBetween={10}
                     slidesPerView={1}
                     navigation
                     pagination={{ clickable: true }}
                     breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 }
                     }}
                     className="uploaded-images-swiper"
                  >
                     {formData.images.map((image, index) => (
                        <SwiperSlide key={image.id}>
                           <div className="relative group">
                              <Image
                                 src={image.url}
                                 alt={`Upload ${index + 1}`}
                                 width={200}
                                 height={128}
                                 className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-gray-600"
                              />
                              <button
                                 type="button"
                                 onClick={() => removeImage(image.id)}
                                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                              >
                                 ×
                              </button>
                              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                 {index + 1}/{formData.images.length}
                              </div>
                           </div>
                        </SwiperSlide>
                     ))}
                  </Swiper>
               </div>
            )}
            
            {/* File Upload Component */}
            <FileUpload
               onUploadSuccess={handleImageUploadSuccess}
               onUploadError={onUploadError}
               accept="image/*"
               maxSize={5}
               multiple={true}
            />
         </div>

         {/* Tags */}
         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Tags (Optional)
            </label>
            <div className="space-y-3">
               <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="Add tags to help categorize your issue (press Enter to add)..."
               />
               {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                     {formData.tags.map((tag, index) => (
                        <span
                           key={index}
                           className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                        >
                           {tag}
                           <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                           >
                              ×
                           </button>
                        </span>
                     ))}
                  </div>
               )}
            </div>
         </div>

         {/* Keywords */}
         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Keywords (Optional)
            </label>
            <div className="space-y-3">
               <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleAddKeyword}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="Add keywords for better searchability (press Enter to add)..."
               />
               {formData.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                     {formData.keywords.map((keyword, index) => (
                        <span
                           key={index}
                           className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm rounded-full"
                        >
                           {keyword}
                           <button
                              type="button"
                              onClick={() => removeKeyword(keyword)}
                              className="text-green-600 hover:text-green-800 dark:text-green-300 dark:hover:text-green-100"
                           >
                              ×
                           </button>
                        </span>
                     ))}
                  </div>
               )}
            </div>
         </div>

         {/* Visibility */}
         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Visibility
            </label>
            <select
               name="visibility"
               value={formData.visibility}
               onChange={handleInputChange}
               className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all duration-200"
            >
               <option value="PUBLIC">🌐 Public - Everyone can see</option>
               <option value="PRIVATE">🔒 Private - Only you can see</option>
               <option value="RESTRICTED">👥 Restricted - Limited visibility</option>
            </select>
         </div>

         {/* Submit Button */}
         <div className="flex justify-end pt-4">
            <button
               type="submit"
               disabled={!formData.title || !formData.subtitle || !formData.location.address}
               className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
               🚀 Submit Issue
            </button>
         </div>
      </form>
   );
};

export default CreatePostForm;
