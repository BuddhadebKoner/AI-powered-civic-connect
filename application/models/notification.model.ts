import mongoose from 'mongoose';

export interface iNotification {
   userId: mongoose.Types.ObjectId;
   type: "NEW_ASSIGNMENT" | "STATUS_UPDATE" | "COMMENT" | "RESOLUTION_REQUEST" | "SYSTEM" | "POST_UPVOTE" | "POST_COMMENT" | "VERIFICATION_UPDATE" | "AUTHORITY_RESPONSE";
   title: string;
   content: string;
   referenceId: mongoose.Types.ObjectId;
   referenceType: "POST" | "COMMENT" | "USER" | "AUTHORITY" | "RESOLUTION";
   isRead: boolean;
   readAt?: Date;
   priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
   actionUrl?: string;
   metadata: {
      senderName?: string;
      senderAvatar?: string;
      postTitle?: string;
      departmentName?: string;
      [key: string]: any;
   };
   expiresAt?: Date;
   isArchived: boolean;
}

const notificationSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
   },
   type: {
      type: String,
      required: true,
      enum: [
         "NEW_ASSIGNMENT", 
         "STATUS_UPDATE", 
         "COMMENT", 
         "RESOLUTION_REQUEST", 
         "SYSTEM", 
         "POST_UPVOTE", 
         "POST_COMMENT", 
         "VERIFICATION_UPDATE", 
         "AUTHORITY_RESPONSE"
      ],
   },
   title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
   },
   content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
   },
   referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
   },
   referenceType: {
      type: String,
      required: true,
      enum: ["POST", "COMMENT", "USER", "AUTHORITY", "RESOLUTION"],
   },
   isRead: {
      type: Boolean,
      default: false,
   },
   readAt: {
      type: Date,
   },
   priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
   },
   actionUrl: {
      type: String,
      trim: true,
   },
   metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
   },
   expiresAt: {
      type: Date,
   },
   isArchived: {
      type: Boolean,
      default: false,
   },
}, { timestamps: true });

// Create indexes for better performance
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.models.Notification || mongoose.model<iNotification>("Notification", notificationSchema);
export default Notification;