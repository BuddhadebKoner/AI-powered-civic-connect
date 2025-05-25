import mongoose from 'mongoose';

export interface iAuthority {
   userId: mongoose.Types.ObjectId;
   department: mongoose.Types.ObjectId;
   position: string;
   verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
   verificationDocuments: string[];
   jurisdiction: string;
   contactInfo: {
      email: string;
      phone: string;
      officialEmail?: string;
      officeAddress?: string;
   };
   assignedIssues: mongoose.Types.ObjectId[];
   expertise: string[];
   workingHours: {
      start: string;
      end: string;
      timezone: string;
   };
   isActive: boolean;
}

const authoritySchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
   },
   department: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Department',
   },
   position: {
      type: String,
      required: true,
      trim: true,
   },
   verificationStatus: {
      type: String,
      required: true,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
   },
   verificationDocuments: [
      {
         type: String,
         required: true,
      },
   ],
   jurisdiction: {
      type: String,
      required: true,
      trim: true,
   },
   contactInfo: {
      email: {
         type: String,
         required: true,
      },
      phone: {
         type: String,
         required: true,
      },
      officialEmail: {
         type: String,
      },
      officeAddress: {
         type: String,
      },
   },
   assignedIssues: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Post',
         default: [],
      },
   ],
   expertise: [
      {
         type: String,
         trim: true,
      },
   ],
   workingHours: {
      start: {
         type: String,
         default: "09:00",
      },
      end: {
         type: String,
         default: "17:00",
      },
      timezone: {
         type: String,
         default: "Asia/Kolkata",
      },
   },
   isActive: {
      type: Boolean,
      default: true,
   },
}, { timestamps: true });

// Create compound index for efficient querying
authoritySchema.index({ department: 1, verificationStatus: 1 });
authoritySchema.index({ jurisdiction: 1, isActive: 1 });

const Authority = mongoose.models.Authority || mongoose.model<iAuthority>("Authority", authoritySchema);
export default Authority;