import mongoose from 'mongoose';

export interface iComment {
   postId: mongoose.Types.ObjectId;
   userId: mongoose.Types.ObjectId;
   content: string;
   parentCommentId?: mongoose.Types.ObjectId;
   replies: mongoose.Types.ObjectId[];
   likes: number;
   dislikes: number;
   likedBy: mongoose.Types.ObjectId[];
   dislikedBy: mongoose.Types.ObjectId[];
   isEdited: boolean;
   editedAt?: Date;
   isDeleted: boolean;
   deletedAt?: Date;
   attachments: {
      url: string;
      type: "IMAGE" | "DOCUMENT";
      id: string;
   }[];
   mentions: mongoose.Types.ObjectId[];
   isOfficial: boolean; // for authority responses
}

const commentSchema = new mongoose.Schema({
   postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
   },
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
   },
   content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
   },
   parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
   },
   replies: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Comment',
         default: [],
      },
   ],
   likes: {
      type: Number,
      default: 0,
   },
   dislikes: {
      type: Number,
      default: 0,
   },
   likedBy: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         default: [],
      },
   ],
   dislikedBy: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         default: [],
      },
   ],
   isEdited: {
      type: Boolean,
      default: false,
   },
   editedAt: {
      type: Date,
   },
   isDeleted: {
      type: Boolean,
      default: false,
   },
   deletedAt: {
      type: Date,
   },
   attachments: [
      {
         url: {
            type: String,
            required: true,
         },
         type: {
            type: String,
            enum: ["IMAGE", "DOCUMENT"],
            required: true,
         },
         id: {
            type: String,
            required: true,
         },
      },
   ],
   mentions: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         default: [],
      },
   ],
   isOfficial: {
      type: Boolean,
      default: false,
   },
}, { timestamps: true });

// Create indexes for better performance
commentSchema.index({ postId: 1, createdAt: -1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ parentCommentId: 1 });

const Comment = mongoose.models.Comment || mongoose.model<iComment>("Comment", commentSchema);
export default Comment;