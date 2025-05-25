import mongoose from 'mongoose';

export interface iActivity {
   userId: mongoose.Types.ObjectId;
   actionType: "POST_CREATED" | "COMMENT_ADDED" | "ISSUE_RESOLVED" | "STATUS_CHANGED" | "AUTH_ASSIGNED" | "UPVOTED" | "DOWNVOTED" | "PROFILE_UPDATED" | "AUTHORITY_VERIFIED" | "RESOLUTION_CONFIRMED";
   resourceId: mongoose.Types.ObjectId;
   resourceType: "POST" | "COMMENT" | "USER" | "AUTHORITY" | "RESOLUTION" | "NOTIFICATION";
   description: string;
   metadata: {
      oldValue?: any;
      newValue?: any;
      targetUserId?: mongoose.Types.ObjectId;
      departmentId?: mongoose.Types.ObjectId;
      categoryId?: mongoose.Types.ObjectId;
      [key: string]: any;
   };
   ipAddress?: string;
   userAgent?: string;
   isPublic: boolean;
   severity: "LOW" | "MEDIUM" | "HIGH";
}

const activitySchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
   },
   actionType: {
      type: String,
      required: true,
      enum: [
         "POST_CREATED", 
         "COMMENT_ADDED", 
         "ISSUE_RESOLVED", 
         "STATUS_CHANGED", 
         "AUTH_ASSIGNED", 
         "UPVOTED", 
         "DOWNVOTED", 
         "PROFILE_UPDATED", 
         "AUTHORITY_VERIFIED", 
         "RESOLUTION_CONFIRMED"
      ],
   },
   resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
   },
   resourceType: {
      type: String,
      required: true,
      enum: ["POST", "COMMENT", "USER", "AUTHORITY", "RESOLUTION", "NOTIFICATION"],
   },
   description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
   },
   metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
   },
   ipAddress: {
      type: String,
      trim: true,
   },
   userAgent: {
      type: String,
      trim: true,
   },
   isPublic: {
      type: Boolean,
      default: true,
   },
   severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
   },
}, { timestamps: true });

// Create indexes for better performance
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ actionType: 1 });
activitySchema.index({ resourceId: 1, resourceType: 1 });
activitySchema.index({ createdAt: -1 });

// TTL index to automatically delete activities older than 1 year
activitySchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

const Activity = mongoose.models.Activity || mongoose.model<iActivity>("Activity", activitySchema);
export default Activity;