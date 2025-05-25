import mongoose from 'mongoose';

export interface iResolutionDetails {
   postId: mongoose.Types.ObjectId;
   resolvedByUserId: mongoose.Types.ObjectId;
   resolutionDescription: string;
   resolutionImages: {
      url: string;
      id: string;
      caption?: string;
   }[];
   resolutionDate: Date;
   citizenConfirmed: boolean;
   citizenFeedback: string;
   citizenRating: number;
   workDetails: {
      startDate: Date;
      endDate: Date;
      workersInvolved: number;
      estimatedCost: number;
      actualCost: number;
      materials: string[];
   };
   verificationStatus: "PENDING" | "VERIFIED" | "DISPUTED";
   verificationNotes: string;
   verifiedBy: mongoose.Types.ObjectId;
   verifiedAt: Date;
   followUpRequired: boolean;
   followUpDate: Date;
   qualityScore: number; // 1-10 based on citizen feedback and verification
}

const resolutionDetailsSchema = new mongoose.Schema({
   postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
      unique: true,
   },
   resolvedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
   },
   resolutionDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
   },
   resolutionImages: [
      {
         url: {
            type: String,
            required: true,
         },
         id: {
            type: String,
            required: true,
         },
         caption: {
            type: String,
            trim: true,
         },
      },
   ],
   resolutionDate: {
      type: Date,
      required: true,
      default: Date.now,
   },
   citizenConfirmed: {
      type: Boolean,
      default: false,
   },
   citizenFeedback: {
      type: String,
      trim: true,
      maxlength: 1000,
   },
   citizenRating: {
      type: Number,
      min: 1,
      max: 5,
   },
   workDetails: {
      startDate: {
         type: Date,
      },
      endDate: {
         type: Date,
      },
      workersInvolved: {
         type: Number,
         min: 0,
      },
      estimatedCost: {
         type: Number,
         min: 0,
      },
      actualCost: {
         type: Number,
         min: 0,
      },
      materials: [
         {
            type: String,
            trim: true,
         },
      ],
   },
   verificationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "DISPUTED"],
      default: "PENDING",
   },
   verificationNotes: {
      type: String,
      trim: true,
   },
   verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
   },
   verifiedAt: {
      type: Date,
   },
   followUpRequired: {
      type: Boolean,
      default: false,
   },
   followUpDate: {
      type: Date,
   },
   qualityScore: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
   },
}, { timestamps: true });

// Create indexes for better performance
resolutionDetailsSchema.index({ postId: 1 });
resolutionDetailsSchema.index({ resolvedByUserId: 1 });
resolutionDetailsSchema.index({ resolutionDate: -1 });
resolutionDetailsSchema.index({ verificationStatus: 1 });

const ResolutionDetails = mongoose.models.ResolutionDetails || mongoose.model<iResolutionDetails>("ResolutionDetails", resolutionDetailsSchema);
export default ResolutionDetails;