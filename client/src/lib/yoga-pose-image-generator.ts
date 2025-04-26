import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// This function will generate vector-based SVG images for yoga poses
export async function generateYogaPoseImage(poseName: string, sanskritName: string): Promise<string> {
  try {
    const prompt = `Create a clean, minimalist vector illustration of a person performing the ${poseName} (${sanskritName}) yoga pose. 
    Use a simple, elegant style with a light blue gradient background. The figure should be a simple silhouette showing the correct form of the pose.
    The image should be appropriate for a yoga instruction application.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "b64_json",
    });

    // Return the base64 image data
    return response.data[0].b64_json || "";
  } catch (error) {
    console.error("Error generating yoga pose image:", error);
    throw error;
  }
}

// This function generates an SVG placeholder for a yoga pose if we don't have an image
export function generatePlaceholderSVG(poseName: string, poseId: string): string {
  const colors = {
    beginner: "#e6f7ff",
    intermediate: "#e6f0fa", 
    advanced: "#e6e6fa"
  };
  
  // Determine the background color based on difficulty level
  let bgColor = colors.beginner;
  if (['tree', 'warrior_1', 'warrior_2', 'triangle', 'chair', 'bridge'].includes(poseId)) {
    bgColor = colors.intermediate;
  } else if (['half_moon', 'eagle', 'pigeon', 'crow', 'side_plank', 'boat'].includes(poseId)) {
    bgColor = colors.advanced;
  }
  
  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="300" height="200" fill="url(#grad)" rx="10" ry="10" />
  <g>
    <text x="150" y="90" font-family="Arial" font-size="18" text-anchor="middle" fill="#333333">${poseName}</text>
    <text x="150" y="120" font-family="Arial" font-size="14" font-style="italic" text-anchor="middle" fill="#666666">Yoga Practice</text>
  </g>
</svg>`;
}