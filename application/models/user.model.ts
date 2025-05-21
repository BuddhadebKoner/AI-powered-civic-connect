import mongoose from "mongoose";

export interface iUser {
   clerkId: string;
   email: string;
   fullName: string;
   location: string;
   profilePictureUrl: string;
   profilePictureId: string;
   role: string;
   authorityType: mongoose.Types.ObjectId;
   department: mongoose.Types.ObjectId;
   jurisdiction: mongoose.Types.ObjectId;
   posts: mongoose.Types.ObjectId[];
   comments: mongoose.Types.ObjectId[];
   notifications: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema({
   clerkId: {
      type: String,
      required: true,   
   },
   email: {
      type: String,
      required: true,
   },
   fullName: {
      type: String,
      required: true,
   },
   location: {
      type: String,
   },
   profilePictureUrl: {
      type: String,
   },
   profilePictureId: {
      type: String,
   },
   role: {
      type: String,
      required: true,
   },
   authorityType: {
      type: mongoose.Types.ObjectId,
      ref: "AuthorityType",
   },
   department: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
   },
   jurisdiction: {
      type: mongoose.Types.ObjectId,
      ref: "Jurisdiction",
   },
   posts: [
      {
         type: mongoose.Types.ObjectId,
         ref: "Post",
         default: [],
      },
   ],
   comments: [
      {
         type: mongoose.Types.ObjectId,
         ref: "Comment",
         default: [],
      },
   ],
   notifications: [
      {
         type: mongoose.Types.ObjectId,
         ref: "Notification",
         default: [],
      },
   ],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model<iUser>("User", userSchema);
export default User;