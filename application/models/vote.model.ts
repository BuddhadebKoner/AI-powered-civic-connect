import mongoose from 'mongoose';

export interface iVote {
   userId: mongoose.Types.ObjectId;
   targetId: mongoose.Types.ObjectId;
   targetType: "POST" | "COMMENT" | "RESOLUTION";
   voteType: "UPVOTE" | "DOWNVOTE";
   weight: number; // for weighted voting based on user reputation
   reason?: string; // optional reason for the vote
   isAnonymous: boolean;
}

const voteSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
   },
   targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
   },
   targetType: {
      type: String,
      required: true,
      enum: ["POST", "COMMENT", "RESOLUTION"],
   },
   voteType: {
      type: String,
      required: true,
      enum: ["UPVOTE", "DOWNVOTE"],
   },
   weight: {
      type: Number,
      default: 1,
      min: 0.1,
      max: 5.0,
   },
   reason: {
      type: String,
      trim: true,
      maxlength: 200,
   },
   isAnonymous: {
      type: Boolean,
      default: false,
   },
}, { timestamps: true });

// Create compound index for unique votes per user per target
voteSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

// Create indexes for better performance
voteSchema.index({ targetId: 1, targetType: 1 });
voteSchema.index({ userId: 1 });
voteSchema.index({ voteType: 1 });

const Vote = mongoose.models.Vote || mongoose.model<iVote>("Vote", voteSchema);
export default Vote;