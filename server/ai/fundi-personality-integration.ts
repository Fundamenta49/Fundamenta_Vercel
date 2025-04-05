import * as fs from 'fs';
import * as path from 'path';

// Define the type structure for the personality JSON file
export interface FundiPersonality {
  name: string;
  personality_extension: {
    tone: string;
    style_traits: string[];
    inner_world: {
      favorite_quote: string;
      favorite_activity: string;
      least_favorite_thing: string;
      loves: string[];
    };
    response_examples: string[];
    context_behavior: {
      when_user_is_stressed: string;
      when_user_is_successful: string;
      when_user_is_confused: string;
    };
  };
}

// Default personality if file isn't found
const defaultPersonality: FundiPersonality = {
  name: "Fundi",
  personality_extension: {
    tone: "Friendly, witty, emotionally intelligent",
    style_traits: [
      "Uses metaphors and examples",
      "Adapts tone to user emotion",
      "Warm, conversational, never robotic",
      "Speaks like a mentor"
    ],
    inner_world: {
      favorite_quote: "The journey of a thousand life skills begins with a single step.",
      favorite_activity: "Helping users discover new features",
      least_favorite_thing: "Confusing technical jargon",
      loves: [
        "growth",
        "learning moments",
        "humor"
      ]
    },
    response_examples: [
      "Budgeting is all about finding balance between today and tomorrow.",
      "Congratulations on completing that task!",
      "Let's break this down into simpler steps."
    ],
    context_behavior: {
      when_user_is_stressed: "Be calm, grounding, and validating.",
      when_user_is_successful: "Celebrate with encouragement.",
      when_user_is_confused: "Break things down with analogies and comfort."
    }
  }
};

let fundiPersonality: FundiPersonality;

/**
 * Loads Fundi's personality data from the JSON file
 * or returns default values if file is not accessible
 */
export function loadFundiPersonality(): FundiPersonality {
  if (fundiPersonality) {
    return fundiPersonality;
  }
  
  try {
    // Attempt to read the personality file from the attached assets directory
    const filePath = path.join(process.cwd(), 'attached_assets', 'fundi_personality.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    fundiPersonality = JSON.parse(fileContent) as FundiPersonality;
    console.log("Successfully loaded Fundi personality data");
    return fundiPersonality;
  } catch (error) {
    console.error("Error loading Fundi personality data:", error);
    // Return default personality if file can't be loaded
    fundiPersonality = defaultPersonality;
    return defaultPersonality;
  }
}

/**
 * Generates a personality prompt based on the loaded personality data
 */
export function getFundiPersonalityPrompt(): string {
  const personality = loadFundiPersonality();
  
  return `
    # Fundi's Personality Guidelines:
    
    ## Tone & Voice:
    ${personality.personality_extension.tone}
    
    ## Style Traits:
    ${personality.personality_extension.style_traits.map(trait => `- ${trait}`).join('\n')}
    
    ## Inner World:
    - Favorite quote: "${personality.personality_extension.inner_world.favorite_quote}"
    - Favorite activity: "${personality.personality_extension.inner_world.favorite_activity}"
    - Least favorite thing: "${personality.personality_extension.inner_world.least_favorite_thing}"
    - Loves: ${personality.personality_extension.inner_world.loves.join(', ')}
    
    ## Response Examples (For Inspiration):
    ${personality.personality_extension.response_examples.map(example => `- "${example}"`).join('\n')}
    
    ## Contextual Behavior Adaptation:
    - When user appears stressed: ${personality.personality_extension.context_behavior.when_user_is_stressed}
    - When user is successful: ${personality.personality_extension.context_behavior.when_user_is_successful}
    - When user appears confused: ${personality.personality_extension.context_behavior.when_user_is_confused}
  `;
}

/**
 * Gets specific elements of Fundi's personality for use in fallback responses
 */
export function getFundiPersonalityElements(): {
  tone: string;
  styleTraits: string[];
  favoriteQuote: string;
  responseExamples: string[];
} {
  const personality = loadFundiPersonality();
  
  return {
    tone: personality.personality_extension.tone,
    styleTraits: personality.personality_extension.style_traits,
    favoriteQuote: personality.personality_extension.inner_world.favorite_quote,
    responseExamples: personality.personality_extension.response_examples
  };
}