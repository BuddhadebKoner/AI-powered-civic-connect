import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GOOGLE_GMINI_API_KEY;

if (!API_KEY) {
   throw new Error("GOOGLE_GMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(request: NextRequest) { 
   try {
      const { title, description } = await request.json();
      
      if (!title && !description) {
         return NextResponse.json(
            { error: "Title or description is required" }, 
            { status: 400 }
         );
      }

      const caption = `${title || ''} ${description || ''}`.trim();

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `
      Analyze the following civic issue description and generate relevant tags for it.
      
      Description: "${caption}"
      
      Requirements:
      - Generate between 2 and 3 tags
      - Tags should be specific and relevant to civic issues
      - Focus on the problem type, location context, and urgency
      - Use short, descriptive phrases (2-4 words max per tag)
      - Return only the tags as a comma-separated list
      - No additional text or formatting
      
      Examples:
      - "road repair, potholes, village roads"
      - "street lighting, safety, maintenance"
      - "garbage collection, sanitation, community"
      
      Generate tags for the given description:
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const tags = text
         .trim()
         .split(',')
         .map(tag => tag.trim().replace(/['"]/g, ''))
         .filter(tag => tag.length > 0)
         .slice(0, 10); 

      if (tags.length < 2) {
         if (tags.length === 1) {
            tags.push('civic issue');
         } else {
            tags.push('civic issue', 'community');
         }
      }

      return NextResponse.json({ tags });

   } catch (error) {
      console.error('Error generating tags:', error);
      return NextResponse.json(
         { error: "Failed to generate tags" }, 
         { status: 500 }
      );
   }
};