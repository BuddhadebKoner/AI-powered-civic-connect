import mongoose from 'mongoose';

export interface iDepartment {
   name: string;
   description: string;
   categories: mongoose.Types.ObjectId[];
   contactEmail: string;
   contactPhone: string;
   authorities: mongoose.Types.ObjectId[];
   headOfDepartment: mongoose.Types.ObjectId;
   isActive: boolean;
   workingHours: {
      start: string;
      end: string;
      workingDays: string[];
      timezone: string;
   };
   emergencyContact: string;
   jurisdiction: string[];
   budget: {
      annual: number;
      allocated: number;
      spent: number;
   };
   performanceMetrics: {
      totalIssuesHandled: number;
      averageResolutionTime: number; // in days
      citizenSatisfactionScore: number;
      completionRate: number; // percentage
   };
   socialMedia: {
      facebook?: string;
      twitter?: string;
      website?: string;
   };
}

const departmentSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 100,
   },
   description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
   },
   categories: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Category',
         default: [],
      },
   ],
   contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
   },
   contactPhone: {
      type: String,
      required: true,
      trim: true,
   },
   authorities: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         default: [],
      },
   ],
   headOfDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
   },
   isActive: {
      type: Boolean,
      default: true,
   },
   workingHours: {
      start: {
         type: String,
         default: "09:00",
      },
      end: {
         type: String,
         default: "17:00",
      },
      workingDays: [
         {
            type: String,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
         },
      ],
      timezone: {
         type: String,
         default: "Asia/Kolkata",
      },
   },
   emergencyContact: {
      type: String,
      trim: true,
   },
   jurisdiction: [
      {
         type: String,
         trim: true,
      },
   ],
   budget: {
      annual: {
         type: Number,
         default: 0,
      },
      allocated: {
         type: Number,
         default: 0,
      },
      spent: {
         type: Number,
         default: 0,
      },
   },
   performanceMetrics: {
      totalIssuesHandled: {
         type: Number,
         default: 0,
      },
      averageResolutionTime: {
         type: Number,
         default: 0,
      },
      citizenSatisfactionScore: {
         type: Number,
         default: 0,
         min: 0,
         max: 5,
      },
      completionRate: {
         type: Number,
         default: 0,
         min: 0,
         max: 100,
      },
   },
   socialMedia: {
      facebook: {
         type: String,
         trim: true,
      },
      twitter: {
         type: String,
         trim: true,
      },
      website: {
         type: String,
         trim: true,
      },
   },
}, { timestamps: true });

// Create indexes for better performance
departmentSchema.index({ name: 1 });
departmentSchema.index({ isActive: 1 });
departmentSchema.index({ "performanceMetrics.averageResolutionTime": 1 });

const Department = mongoose.models.Department || mongoose.model<iDepartment>("Department", departmentSchema);
export default Department;