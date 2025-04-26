import { Router } from 'express';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Ensure yoga poses directory exists
const posesDir = path.join(process.cwd(), 'public/images/yoga-poses');
if (!fs.existsSync(posesDir)) {
  fs.mkdirSync(posesDir, { recursive: true });
}

// Map of pose IDs with proper descriptions for accurate image generation
const POSE_DESCRIPTIONS: Record<string, string> = {
  // Level 1-2 Poses
  'mountain': 'A person performing Mountain Pose (Tadasana) in yoga with feet together, standing tall with arms relaxed at sides',
  'child': 'A person performing Child\'s Pose (Balasana) in yoga, kneeling with forehead on mat and arms stretched forward',
  'corpse': 'A person performing Corpse Pose (Savasana) in yoga, lying flat on back with arms at sides and palms up',
  'downward_dog': 'A person performing Downward-Facing Dog (Adho Mukha Svanasana) pose in yoga, forming an inverted V-shape',
  'cat_cow': 'A person demonstrating Cat-Cow Pose sequence (Marjaryasana-Bitilasana) in yoga on hands and knees',
  'forward_fold': 'A person performing Standing Forward Fold (Uttanasana) in yoga, bending forward from hips with hands toward floor',

  // Level 3-4 Poses
  'tree': 'A person performing Tree Pose (Vrksasana) in yoga, standing on one leg with the other foot placed on inner thigh',
  'warrior_1': 'A person performing Warrior I Pose (Virabhadrasana I) in yoga with one leg forward, knee bent, arms raised overhead',
  'warrior_2': 'A person performing Warrior II Pose (Virabhadrasana II) in yoga with legs wide, arms extended to sides',
  'triangle': 'A person performing Triangle Pose (Trikonasana) in yoga with legs wide, one arm extended down to shin, other arm raised',
  'chair': 'A person performing Chair Pose (Utkatasana) in yoga, knees bent as if sitting in invisible chair, arms extended upward',
  'bridge': 'A person performing Bridge Pose (Setu Bandha Sarvangasana) in yoga, lying on back with hips lifted, feet flat on floor',

  // Level 5 Poses
  'half_moon': 'A person performing Half Moon Pose (Ardha Chandrasana) in yoga, balancing on one leg with body parallel to floor',
  'eagle': 'A person performing Eagle Pose (Garudasana) in yoga with legs and arms wrapped around each other',
  'pigeon': 'A person performing Pigeon Pose (Eka Pada Rajakapotasana) in yoga with one leg extended back, other leg bent in front',

  // Level 6 Poses
  'crow': 'A person performing Crow Pose (Bakasana) in yoga, balancing on hands with knees resting on elbows',
  'side_plank': 'A person performing Side Plank (Vasisthasana) in yoga, balancing on one hand with body in straight line',
  'boat': 'A person performing Boat Pose (Navasana) in yoga, balancing on sit bones with legs and torso forming a V-shape'
};

// Endpoint to generate a yoga pose image using AI
router.get('/generate-pose-image/:poseId', async (req, res) => {
  try {
    const { poseId } = req.params;
    
    if (!poseId) {
      return res.status(400).json({ error: 'Pose ID is required' });
    }
    
    // Check if we have a description for this pose
    if (!POSE_DESCRIPTIONS[poseId]) {
      return res.status(404).json({ error: `No description found for pose: ${poseId}` });
    }
    
    // Check if image already exists
    const imagePath = path.join(posesDir, `${poseId}.png`);
    if (fs.existsSync(imagePath)) {
      return res.json({ 
        success: true, 
        message: 'Image already exists',
        imageUrl: `/images/yoga-poses/${poseId}.png` 
      });
    }
    
    // Generate image with OpenAI
    console.log(`Generating image for pose: ${poseId}`);
    
    // Use the specific pose description for better results
    const poseDescription = POSE_DESCRIPTIONS[poseId];
    const prompt = `A clean, minimalist photo of a person performing the ${poseDescription}. Clean white background, no text, focus on proper alignment, professional yoga photography style.`;
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "url"
    });
    
    if (!response.data || !response.data[0]?.url) {
      throw new Error('Failed to generate image');
    }
    
    // Download the generated image
    const imageUrl = response.data[0].url;
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
    
    return res.json({ 
      success: true, 
      message: 'Image generated successfully',
      imageUrl: `/images/yoga-poses/${poseId}.png` 
    });
    
  } catch (error) {
    console.error("Error generating pose image:", error);
    res.status(500).json({ 
      error: 'Failed to generate pose image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Endpoint to generate all yoga pose images
router.get('/generate-all-pose-images', async (req, res) => {
  try {
    const poses = Object.keys(POSE_DESCRIPTIONS);
    const results: Record<string, string> = {};
    
    // Generate images sequentially to avoid rate limiting
    for (const poseId of poses) {
      try {
        // Check if image already exists
        const imagePath = path.join(posesDir, `${poseId}.png`);
        if (fs.existsSync(imagePath)) {
          results[poseId] = `/images/yoga-poses/${poseId}.png`;
          continue;
        }
        
        // Generate image with OpenAI
        console.log(`Generating image for pose: ${poseId}`);
        
        // Use the specific pose description for better results
        const poseDescription = POSE_DESCRIPTIONS[poseId];
        const prompt = `A clean, minimalist photo of a person performing the ${poseDescription}. Clean white background, no text, focus on proper alignment, professional yoga photography style.`;
        
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          response_format: "url"
        });
        
        if (!response.data[0]?.url) {
          throw new Error(`Failed to generate image for ${poseId}`);
        }
        
        // Download the generated image
        const imageUrl = response.data[0].url;
        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        fs.writeFileSync(imagePath, Buffer.from(imageResponse.data));
        
        results[poseId] = `/images/yoga-poses/${poseId}.png`;
        
        // Wait a bit between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (poseError) {
        console.error(`Error generating image for pose ${poseId}:`, poseError);
        results[poseId] = 'error';
      }
    }
    
    return res.json({ 
      success: true, 
      message: 'Image generation process completed',
      results
    });
    
  } catch (error) {
    console.error("Error in batch generation:", error);
    res.status(500).json({ 
      error: 'Failed to complete batch image generation',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Endpoint to get all available pose images
router.get('/get-pose-images', (req, res) => {
  try {
    const results: Record<string, string> = {};
    
    // Check which images exist
    for (const poseId of Object.keys(POSE_DESCRIPTIONS)) {
      const imagePath = path.join(posesDir, `${poseId}.png`);
      if (fs.existsSync(imagePath)) {
        results[poseId] = `/images/yoga-poses/${poseId}.png`;
      } else {
        results[poseId] = 'not-available';
      }
    }
    
    return res.json({ 
      success: true, 
      images: results
    });
    
  } catch (error) {
    console.error("Error getting pose images:", error);
    res.status(500).json({ 
      error: 'Failed to get pose images',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;