import { Router } from 'express';
import multer from 'multer';
import OpenAI from 'openai';
import path from 'path';
import fs from 'fs';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configure multer for in-memory storage
const yogaImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit to 5MB
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

// Endpoint to analyze yoga pose
router.post('/analyze-pose', yogaImageUpload.single('image'), async (req, res) => {
  try {
    console.log("Yoga pose analysis request received");
    const image = req.file;
    const { poseName } = req.body; // The name of the pose being attempted
    
    if (!image) {
      console.log("No image file received in request");
      return res.status(400).json({ error: 'No image uploaded or invalid image type' });
    }
    
    if (!poseName) {
      console.log("No pose name provided");
      return res.status(400).json({ error: 'Pose name is required' });
    }
    
    console.log(`Image received: ${image.originalname}, size: ${image.size}, mimetype: ${image.mimetype}`);
    console.log(`Pose being analyzed: ${poseName}`);
    
    // Convert image to base64 for OpenAI API
    const base64Image = image.buffer.toString('base64');
    
    // Use OpenAI GPT-4 Vision to analyze the yoga pose
    console.log("Calling OpenAI API to analyze the yoga pose...");
    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OpenAI API key");
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }
    
    // Create the prompt for pose analysis
    const analysisPrompt = `
      Analyze this yoga pose image where the person is attempting the "${poseName}" pose.
      
      Provide a detailed form analysis focusing on:
      1. Key alignment points (e.g., shoulders, hips, back, neck)
      2. What they're doing correctly
      3. What could be improved
      4. Specific, gentle adjustments to enhance the pose
      5. Safety concerns if any
      
      Format your response as JSON with these fields:
      {
        "overallAssessment": "Brief overall assessment of the pose",
        "strengths": [
          "List of 2-3 things done well"
        ],
        "improvements": [
          "List of 2-3 specific adjustments to improve form"
        ],
        "safetyNotes": "Any safety considerations or contraindications",
        "alignmentTips": "Key alignment pointers for this specific pose",
        "difficultyAssessment": "Assessment of pose difficulty and person's current level (beginner/intermediate/advanced)",
        "confidenceScore": 0.85 // 0-1 score of how confident the analysis is based on image clarity
      }
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // using the newest model with vision capabilities
      messages: [
        {
          role: "system",
          content: "You are an expert yoga instructor with 15 years experience teaching all levels from beginner to advanced. You provide constructive, supportive feedback that helps students improve their practice safely. Your feedback is always positive, specific, and focused on proper alignment principles."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: analysisPrompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${image.mimetype};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });
    
    if (!response.choices[0].message?.content) {
      throw new Error('Failed to analyze yoga pose image');
    }
    
    try {
      console.log("OpenAI API response received");
      const poseAnalysis = JSON.parse(response.choices[0].message.content);
      
      // Return the analysis
      res.json({
        success: true,
        poseAnalysis
      });
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      res.status(500).json({ error: 'Failed to parse analysis response' });
    }
    
  } catch (error) {
    console.error("Error analyzing yoga pose:", error);
    res.status(500).json({ 
      error: 'Failed to analyze yoga pose',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Endpoint to get reference poses
router.get('/reference-poses', (req, res) => {
  // This would typically come from a database. For now, we'll hardcode some common poses
  const referenceYogaPoses = [
    {
      id: 'mountain',
      name: 'Mountain Pose (Tadasana)',
      description: 'The foundation of all standing poses, mountain pose teaches proper posture and body awareness.',
      difficulty: 'beginner',
      imageUrl: 'https://images.unsplash.com/photo-1566501206188-5dd0cf160a0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1vdW50YWluJTIwcG9zZSUyMHlvZ2F8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      keyAlignmentPoints: [
        'Feet parallel, big toes touching or hip-width apart',
        'Engage quadriceps, lift kneecaps',
        'Tailbone tucked slightly, core engaged',
        'Shoulders stacked over hips, relaxed away from ears',
        'Crown of head reaching toward the ceiling'
      ]
    },
    {
      id: 'downward-dog',
      name: 'Downward-Facing Dog (Adho Mukha Svanasana)',
      description: 'A foundational pose that strengthens the arms and legs while stretching the hamstrings and calves.',
      difficulty: 'beginner',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG93bndhcmQlMjBkb2d8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      keyAlignmentPoints: [
        'Hands shoulder-width apart, fingers spread wide',
        'Feet hip-width apart, heels reaching toward the floor',
        'Hips lifting up and back',
        'Spine long, head between arms',
        'Weight distributed evenly between hands and feet'
      ]
    },
    {
      id: 'warrior-2',
      name: 'Warrior II (Virabhadrasana II)',
      description: 'A standing pose that builds strength, stability and concentration.',
      difficulty: 'intermediate',
      imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2FycmlvciUyMDIlMjB5b2dhfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      keyAlignmentPoints: [
        'Front knee directly over ankle, not beyond toes',
        'Back foot parallel to back edge of mat',
        'Hips and shoulders facing the side of the mat',
        'Arms extended parallel to the floor',
        'Gaze over front middle finger'
      ]
    },
    {
      id: 'tree',
      name: 'Tree Pose (Vrksasana)',
      description: 'A balancing pose that improves focus, stability and posture.',
      difficulty: 'beginner',
      imageUrl: 'https://images.unsplash.com/photo-1508341591423-4347099e1f19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dHJlZSUyMHBvc2UlMjB5b2dhfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      keyAlignmentPoints: [
        'Standing foot firmly grounded',
        'Foot placed on inner thigh (not on knee)',
        'Hips square to the front',
        'Hands at heart center or extended overhead',
        'Gaze at a fixed point for balance'
      ]
    }
  ];
  
  res.json({ success: true, poses: referenceYogaPoses });
});

export default router;