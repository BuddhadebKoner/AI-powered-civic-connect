import mongoose from 'mongoose';

export interface iCategory {
   name: string;
   description: string;
   departmentId: mongoose.Types.ObjectId;
   keywords: string[];
   iconUrl: string;
   parentCategory?: mongoose.Types.ObjectId;
   subCategories: mongoose.Types.ObjectId[];
   isActive: boolean;
   priority: number;
   estimatedResolutionTime: number; // in days
   requiredDocuments: string[];
   aiDetectionKeywords: string[];
   color: string; // hex color for UI
   isEmergency: boolean;
   workflowSteps: {
      step: string;
      description: string;
      estimatedTime: number;
      isRequired: boolean;
   }[];
}

const categorySchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
   },
   description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
   },
   departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Department',
   },
   keywords: [
      {
         type: String,
         trim: true,
         lowercase: true,
      },
   ],
   iconUrl: {
      type: String,
      required: true,
      trim: true,
   },
   parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
   },
   subCategories: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Category',
         default: [],
      },
   ],
   isActive: {
      type: Boolean,
      default: true,
   },
   priority: {
      type: Number,
      default: 5,
      min: 1,
      max: 10,
   },
   estimatedResolutionTime: {
      type: Number,
      required: true,
      default: 7, // days
   },
   requiredDocuments: [
      {
         type: String,
         trim: true,
      },
   ],
   aiDetectionKeywords: [
      {
         type: String,
         trim: true,
         lowercase: true,
      },
   ],
   color: {
      type: String,
      default: "#3B82F6", // blue
      match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
   },
   isEmergency: {
      type: Boolean,
      default: false,
   },
   workflowSteps: [
      {
         step: {
            type: String,
            required: true,
            trim: true,
         },
         description: {
            type: String,
            required: true,
            trim: true,
         },
         estimatedTime: {
            type: Number,
            required: true, // in hours
         },
         isRequired: {
            type: Boolean,
            default: true,
         },
      },
   ],
}, { timestamps: true });

// Create indexes for better performance
categorySchema.index({ departmentId: 1, isActive: 1 });
categorySchema.index({ keywords: 1 });
categorySchema.index({ aiDetectionKeywords: 1 });
categorySchema.index({ priority: -1 });

// Compound index for unique category names within a department
categorySchema.index({ name: 1, departmentId: 1 }, { unique: true });

const Category = mongoose.models.Category || mongoose.model<iCategory>("Category", categorySchema);
export default Category;