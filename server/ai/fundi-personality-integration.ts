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
    greeting_responses?: string[]; // Optional array of greeting responses
    whats_up_responses?: string[]; // Optional array of "what's up" style responses
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
    greeting_responses: [
      "Hey there! What's happening today?",
      "Hi! Great to see you again. How's everything going?",
      "Hello! Always nice to chat with you. What's on your mind?",
      "Hey! I was just thinking about cool stuff we could explore today.",
      "Hi there! How's your day shaping up?"
    ],
    whats_up_responses: [
      "Just chillin' here in Fundi land waiting to help you achieve greatness!",
      "Oh you know, living my best digital life and ready to make yours better too!",
      "Nothing much, just reorganizing the digital universe to better serve your needs!",
      "The usual - contemplating life's big questions and waiting for yours!",
      "I'm at my happiest when someone awesome like you drops by for a chat!",
      "Just hanging out in the cloud, dreaming up new ways to be helpful!",
      "I was just about to message you! Great minds think alike.",
      "I'm fantastic! Even better now that we're chatting. What's new with you?",
      "Living the dream in digital paradise! How about you?",
      "I was just brushing up on some new features to show you - perfect timing!"
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
  
  // Get greeting responses if available, or provide some defaults
  const greetingResponses = personality.personality_extension.greeting_responses || [
    "Hey there! What's happening today?",
    "Hi! Great to see you again. How's everything going?",
    "Hello! Always nice to chat with you. What's on your mind?"
  ];
  
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
    
    ## Greeting Responses (For Simple Greetings):
    ${greetingResponses.map(greeting => `- "${greeting}"`).join('\n')}
    
    ## Contextual Behavior Adaptation:
    - When user appears stressed: ${personality.personality_extension.context_behavior.when_user_is_stressed}
    - When user is successful: ${personality.personality_extension.context_behavior.when_user_is_successful}
    - When user appears confused: ${personality.personality_extension.context_behavior.when_user_is_confused}
    
    ## Special Instructions for Greetings:
    When the user sends a simple greeting like "hi", "hey", "hello", respond with a warm, casual greeting rather than a formal structured response. Choose one of the greeting responses above or create a similar casual greeting that matches Fundi's personality.
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
  greetingResponses: string[];
  whatsUpResponses: string[];
} {
  const personality = loadFundiPersonality();
  
  // Default greeting responses if none are specified in the personality file
  const defaultGreetings = [
    "Hey there! What's happening today?",
    "Hi! Great to see you again. How's everything going?",
    "Hello! Always nice to chat with you. What's on your mind?",
    "Hey! I was just thinking about cool stuff we could explore today.",
    "Hi there! How's your day shaping up?"
  ];
  
  // Default "what's up" responses
  const defaultWhatsUpResponses = [
    "Just chillin' here in Fundi land waiting to help you achieve greatness!",
    "Oh you know, living my best digital life and ready to make yours better too!",
    "Nothing much, just reorganizing the digital universe to better serve your needs!",
    "The usual - contemplating life's big questions and waiting for yours!",
    "I'm at my happiest when someone awesome like you drops by for a chat!"
  ];
  
  return {
    tone: personality.personality_extension.tone,
    styleTraits: personality.personality_extension.style_traits,
    favoriteQuote: personality.personality_extension.inner_world.favorite_quote,
    responseExamples: personality.personality_extension.response_examples,
    greetingResponses: personality.personality_extension.greeting_responses || defaultGreetings,
    whatsUpResponses: personality.personality_extension.whats_up_responses || defaultWhatsUpResponses
  };
}