import mongoose from 'mongoose';

export interface iAuthority {
   userId: mongoose.Types.ObjectId;
   position: string;
   verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
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
   pendingIssues: mongoose.Types.ObjectId[];
   resolvedIssues: mongoose.Types.ObjectId[];
   area: {
      type: string;
      name: string;
   }
}

const authoritySchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
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
   pendingIssues: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Post',
         default: [],
      },
   ],
   resolvedIssues: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Post',
         default: [],
      },
   ],
   area: {
      type: {
         type: String,
         enum: ['city', 'district', 'state', 'country', 'policeStation', 'village', 'ward', 'block', 'locality'],
         required: true,
      },
      name: {
         type: String,
         required: true,
      },
      state: {
         type: String,
         required: true,
      },
      country: {
         type: String,
         required: true,
      },
      postalCode: {
         type: String,
         required: true,
      }
   }
}, { timestamps: true });

const Authority = mongoose.models.Authority || mongoose.model<iAuthority>("Authority", authoritySchema);
export default Authority;