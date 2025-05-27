import React, { useCallback } from 'react';
import Image from 'next/image';
import FileUpload from '../shared/MultipleImageUpload';
import { Swiper, SwiperSlide } from 'swiper/react';   
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { LoaderCircle } from 'lucide-react';

interface FormData {
   title: string;
   subtitle: string;
   images: ImageData[];
   tags: string[];
   location: {
      city: string;
      locality: string;
      state: string;
      country: string;
      postcode: string;
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
      location: {
         city: '',
         locality: '',
         state: '',
         country: '',
         postcode: '',
      },
      visibility: 'PUBLIC' as 'PUBLIC' | 'PRIVATE' | 'RESTRICTED',
   });

   const [tagInput, setTagInput] = React.useState('');
   const [tagGenerating, setTagGenerating] = React.useState(false);

   const handleLocationChange = (field: keyof FormData['location'], value: string) => {
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

   const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      // remove unnessary whitespace and commas
      const cleanedValue = value.replace(/\s*,\s*/g, ',').replace(/,+/g, ',').trim();
      setTagInput(cleanedValue);

      // Convert comma-separated string to array
      const tagsArray = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      setFormData(prev => ({
         ...prev,
         tags: tagsArray
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

   const generateTags = useCallback(async () => {
      if (!formData.title && !formData.subtitle) {
         alert('Please enter a title or description first to generate relevant tags.');
         return;
      }

      setTagGenerating(true);
      try {
         const response = await fetch('/api/agent/get-tags', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               title: formData.title,
               description: formData.subtitle,
            }),
         });

         if (!response.ok) {
            throw new Error('Failed to generate tags');
         }

         const data = await response.json();
         const generatedTags = data.tags || [];

         // Update both the tags in formData and the tagInput display
         setFormData(prev => ({
            ...prev,
            tags: generatedTags
         }));
         setTagInput(generatedTags.join(', '));

      } catch (error) {
         console.error('Error generating tags:', error);
         alert('Failed to generate tags. Please try again.');
      } finally {
         setTagGenerating(false);
      }
   }, [formData.title, formData.subtitle]);

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

         {/* Location Section - Updated */}
         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Issue Location *
            </label>
            <div className="space-y-3">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                     <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        City *
                     </label>
                     <input
                        type="text"
                        value={formData.location.city}
                        onChange={(e) => handleLocationChange('city', e.target.value)}
                        required
                        placeholder="Enter city"
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                     />
                  </div>
                  <div>
                     <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Locality *
                     </label>
                     <input
                        type="text"
                        value={formData.location.locality}
                        onChange={(e) => handleLocationChange('locality', e.target.value)}
                        required
                        placeholder="Enter locality/area"
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                     />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                     <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        State *
                     </label>
                     <input
                        type="text"
                        value={formData.location.state}
                        onChange={(e) => handleLocationChange('state', e.target.value)}
                        required
                        placeholder="Enter state"
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                     />
                  </div>
                  <div>
                     <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Country *
                     </label>
                     <input
                        type="text"
                        value={formData.location.country}
                        onChange={(e) => handleLocationChange('country', e.target.value)}
                        required
                        placeholder="Enter country"
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                     />
                  </div>
                  <div>
                     <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Postcode *
                     </label>
                     <input
                        type="text"
                        value={formData.location.postcode}
                        onChange={(e) => handleLocationChange('postcode', e.target.value)}
                        required
                        placeholder="Enter postcode"
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                     />
                  </div>
               </div>
            </div>
         </div>

         {/* Multiple Image Upload with Swiper */}
         <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
               Add Images (Optional)
            </label>

            {/* File Upload Component */}
            <FileUpload
               onUploadSuccess={handleImageUploadSuccess}
               onUploadError={onUploadError}
               accept="image/*"
               maxSize={5}
               multiple={true}
            />

            {/* Display uploaded images with Swiper */}
            {formData.images.length > 0 && (
               <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                     Uploaded Images ({formData.images.length})
                  </h4>
                  <div className="relative">
                     <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={12}
                        slidesPerView={1}
                        navigation={{
                           nextEl: '.swiper-button-next-custom',
                           prevEl: '.swiper-button-prev-custom',
                        }}
                        pagination={{
                           clickable: true,
                           dynamicBullets: true
                        }}
                        breakpoints={{
                           640: { slidesPerView: 2 },
                           768: { slidesPerView: 3 },
                           1024: { slidesPerView: 4 }
                        }}
                        className="uploaded-images-swiper !pb-10"
                     >
                        {formData.images.map((image, index) => (
                           <SwiperSlide key={image.id}>
                              <div className="relative group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                 <div className="aspect-square relative">
                                    <Image
                                       src={image.url}
                                       alt={`Upload ${index + 1}`}
                                       fill
                                       className="object-cover"
                                       sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    />
                                    {/* Remove button */}
                                    <button
                                       type="button"
                                       onClick={() => removeImage(image.id)}
                                       className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
                                    >
                                       ×
                                    </button>
                                    {/* Image number badge */}
                                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                                       {index + 1} of {formData.images.length}
                                    </div>
                                 </div>
                              </div>
                           </SwiperSlide>
                        ))}
                     </Swiper>

                     {/* Custom navigation buttons */}
                     {formData.images.length > 4 && (
                        <>
                           <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              ‹
                           </button>
                           <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                              ›
                           </button>
                        </>
                     )}
                  </div>
               </div>
            )}
         </div>

         {/* Tags */}
         <div>
            <div className="flex items-center justify-between mb-2">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tags (Optional)
               </label>
               <button
                  type="button"
                  onClick={generateTags}
                  disabled={tagGenerating || (!formData.title && !formData.subtitle)}
                  className="px-3 py-1 text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900/30 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
               >
                  {tagGenerating ? (
                     <span className="flex items-center gap-1">
                       <LoaderCircle className="animate-spin h-4 w-4" />
                        Generating...
                     </span>
                  ) : (
                     'Generate Tags'
                  )}
               </button>
            </div>
            <div className="space-y-3">
               <input
                  type="text"
                  value={tagInput}
                  onChange={handleTagsChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all duration-200"
                  placeholder="Add tags separated by commas (e.g. road repair, pothole, traffic)"
               />
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
               disabled={
                  !formData.title ||
                  !formData.subtitle ||
                  !formData.location.city ||
                  !formData.location.locality ||
                  !formData.location.state ||
                  !formData.location.country ||
                  !formData.location.postcode
               }
               className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
               🚀 Submit Issue
            </button>
         </div>
      </form>
   );
};

export default CreatePostForm;
