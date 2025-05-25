import mongoose from 'mongoose';

export interface iAIAnalysis {
   postId: mongoose.Types.ObjectId;
   category: string;
   department: mongoose.Types.ObjectId;
   urgencyScore: number;
   keywordsDetected: string[];
   sentimentScore: number;
   suggestedAuthorities: mongoose.Types.ObjectId[];
   rawResponse: any;
   analysisVersion: string;
   confidence: number;
   issueType: string;
   estimatedResolutionTime: number; // in days
   priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
   tags: string[];
}

const aiAnalysisSchema = new mongoose.Schema({
   postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
      unique: true,
   },
   category: {
      type: String,
      required: true,
      trim: true,
   },
   department: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Department',
   },
   urgencyScore: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
   },
   keywordsDetected: [
      {
         type: String,
         trim: true,
      },
   ],
   sentimentScore: {
      type: Number,
      required: true,
      min: -1,
      max: 1,
   },
   suggestedAuthorities: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
      },
   ],
   rawResponse: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
   },
   analysisVersion: {
      type: String,
      required: true,
      default: "1.0",
   },
   confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
   },
   issueType: {
      type: String,
      required: true,
      trim: true,
   },
   estimatedResolutionTime: {
      type: Number,
      default: 7, // days
   },
   priority: {
      type: String,
      required: true,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
   },
   tags: [
      {
         type: String,
         trim: true,
      },
   ],
}, { timestamps: true });

// Create indexes for better performance
aiAnalysisSchema.index({ postId: 1 });
aiAnalysisSchema.index({ department: 1, priority: 1 });
aiAnalysisSchema.index({ urgencyScore: -1 });

const AIAnalysis = mongoose.models.AIAnalysis || mongoose.model<iAIAnalysis>("AIAnalysis", aiAnalysisSchema);
export default AIAnalysis;