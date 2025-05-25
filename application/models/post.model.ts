import mongoose from 'mongoose';

export interface iPost {
   owner: mongoose.Types.ObjectId;
   title: string;
   subtitle: string;
   images: {
      url: string;
      id: string;
   }[];
   tags: string[];
   keywords: string[];
   location: {
      city: string;
      locality: string;
      state: string;
      country: string;
      postcode: string;
   };
   category: mongoose.Types.ObjectId;
   department: mongoose.Types.ObjectId;
   status: "PENDING" | "REVIEWING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
   visibility: "PUBLIC" | "PRIVATE" | "RESTRICTED";
   isEdited?: boolean;
   upvotes: number;
   downvotes: number;
   assignedAuthorities: mongoose.Types.ObjectId[];
   comments: mongoose.Types.ObjectId[];
   resolutionDetails: mongoose.Types.ObjectId | null;
   aiAnalysis: mongoose.Types.ObjectId | null;
   urgencyScore: number;
   votedUsers: {
      userId: mongoose.Types.ObjectId;
      voteType: "UPVOTE" | "DOWNVOTE";
   }[];
}

const postSchema = new mongoose.Schema({
   owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
   },
   title: {
      type: String,
      required: true,
      trim: true,
   },
   subtitle: {
      type: String,
      required: true,
      trim: true,
   },
   images: [
      {
         url: {
            type: String,
            required: true,
         },
         id: {
            type: String,
            required: true,
         },
      },
   ],
   tags: {
      type: [String],
      default: [],
   },
   keywords: {
      type: [String],
      default: [],
   },
   location: {
      city: {
         type: String,
         required: true,
      },
      locality: {
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
      postcode: {
         type: String,
         required: true,
      },
   },
   category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
   },
   department: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Department',
   },
   status: {
      type: String,
      required: true,
      enum: ["PENDING", "REVIEWING", "IN_PROGRESS", "RESOLVED", "REJECTED"],
      default: "PENDING",
   },
   visibility: {
      type: String,
      required: true,
      enum: ["PUBLIC", "PRIVATE", "RESTRICTED"],
      default: "PUBLIC",
   },
   isEdited: {
      type: Boolean,
      default: false,
   },
   upvotes: {
      type: Number,
      default: 0,
   },
   downvotes: {
      type: Number,
      default: 0,
   },
   assignedAuthorities: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         default: [],
      },
   ],
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Comment',
         default: [],
      },
   ],
   resolutionDetails: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: 'ResolutionDetails',
   },
   aiAnalysis: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: 'AIAnalysis',
   },
   urgencyScore: {
      type: Number,
      default: 5,
      min: 1,
      max: 10,
   },
   votedUsers: [
      {
         userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
         },
         voteType: {
            type: String,
            enum: ["UPVOTE", "DOWNVOTE"],
            required: true,
         },
      },
   ],
}, { timestamps: true });

const Post = mongoose.models.Post || mongoose.model<iPost>("Post", postSchema);
export default Post;