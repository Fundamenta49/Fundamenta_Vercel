import axios from 'axios';

// Response types for different HuggingFace models
export interface HuggingFaceTextClassificationResponse {
  label: string;
  score: number;
}

export interface HuggingFaceTokenClassificationResponse {
  entity_group: string;
  score: number;
  word: string;
  start: number;
  end: number;
}

export interface HuggingFaceSummarizationResponse {
  summary_text: string;
}

export interface HuggingFaceTextGenerationResponse {
  generated_text: string;
}

export interface HuggingFaceQuestionAnsweringResponse {
  answer: string;
  score: number;
  start: number;
  end: number;
}

export interface HuggingFaceTranslationResponse {
  translation_text: string;
}

// Base class for HuggingFace API interactions
class HuggingFaceAPI {
  private apiKey: string;
  private baseURL: string = 'https://api-inference.huggingface.co/models';

  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('HuggingFace API key not found in environment variables');
    }
  }

  /**
   * Make a request to the Hugging Face Inference API with retries
   * @param model The model identifier to use
   * @param inputs The inputs to send to the model
   * @param options Additional options for the request
   * @param retries Number of retry attempts if request fails (default: 2)
   * @returns Promise with the model's response
   */
  async query<T>(
    model: string, 
    inputs: any, 
    options: any = {}, 
    retries: number = 2,
    alternativeModels?: string[]
  ): Promise<T> {
    // Check for API key first and warn if missing
    if (!this.apiKey || this.apiKey.trim() === '') {
      console.error(`HuggingFace API key is missing or empty. Cannot make request to model: ${model}`);
      throw new Error('HuggingFace API key is required. Please set the HUGGINGFACE_API_KEY environment variable.');
    }
    
    let lastError: Error | null = null;
    let currentModel = model;
    
    // Try the main model and retry logic
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Add exponential backoff for retries
        if (attempt > 0) {
          const backoffTime = Math.min(100 * Math.pow(2, attempt), 3000); // Max 3 seconds
          console.log(`Retry attempt ${attempt} for model ${currentModel} (backoff: ${backoffTime}ms)`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
        
        const response = await axios({
          url: `${this.baseURL}/${currentModel}`,
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          data: {
            inputs,
            options
          },
          timeout: 30000 // 30 second timeout
        });
        
        return response.data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Enhanced error logging with request details for better debugging
        const requestDetails = {
          model: currentModel,
          inputType: typeof inputs === 'string' ? 'string' : (Array.isArray(inputs) ? 'array' : 'object'),
          inputLength: typeof inputs === 'string' ? inputs.length : 
                      (Array.isArray(inputs) ? inputs.length : Object.keys(inputs).length),
          options: options
        };
        console.error(`HuggingFace API Error (${currentModel}):`, error);
        console.error('Request details:', requestDetails);
        
        // Determine if we should try an alternative model
        if (
          axios.isAxiosError(error) && 
          error.response && 
          (error.response.status === 503 || error.response.status >= 500) && 
          alternativeModels && 
          alternativeModels.length > 0
        ) {
          // Try an alternative model before giving up completely
          const alternativeModel = alternativeModels.shift(); // Get and remove first alternative
          if (alternativeModel) {
            console.log(`Switching to alternative model: ${alternativeModel}`);
            currentModel = alternativeModel;
            attempt--; // Don't count this as a retry for the same model
            continue;
          }
        }
        
        // For rate limiting, always retry
        if (axios.isAxiosError(error) && error.response && error.response.status === 429) {
          console.log(`Rate limited on attempt ${attempt}, will retry...`);
          continue;
        }
        
        // For other errors, only continue retrying if we have attempts left
        if (attempt < retries) {
          continue;
        }
      }
    }
    
    // If we get here, all retries failed
    if (lastError) {
      // Provide specific error messages based on error type
      if (axios.isAxiosError(lastError)) {
        if (lastError.response) {
          const statusCode = lastError.response.status;
          const errorMessage = lastError.response.data.error || 'Unknown error';
          
          if (statusCode === 401 || statusCode === 403) {
            console.error('Authentication failed. Check your API key.');
          } else if (statusCode === 429) {
            console.error('Rate limit exceeded. Try again later.');
          } else if (statusCode >= 500) {
            console.error('HuggingFace service error. The model might be unavailable.');
          }
          
          throw new Error(`HuggingFace API error (${statusCode}): ${errorMessage}`);
        } else if (lastError.request) {
          console.error('No response received. Check your network connection.');
          throw new Error(`HuggingFace API request failed: No response received`);
        } else {
          console.error('Request setup failed:', lastError.message);
          throw new Error(`HuggingFace API request setup failed: ${lastError.message}`);
        }
      }
      
      throw new Error(`HuggingFace API unknown error: ${lastError.message || 'Unknown error'}`);
    }
    
    // Generic error if we somehow get here
    throw new Error(`Failed to get response from HuggingFace API after ${retries} retries`);
  }
}

// Specialized classes for different model types

export class TextClassifier extends HuggingFaceAPI {
  /**
   * Performs sentiment analysis on the provided text
   * @param text Text to analyze
   * @returns Analysis result with sentiment label and score
   */
  async analyzeSentiment(text: string): Promise<HuggingFaceTextClassificationResponse[]> {
    return this.query<HuggingFaceTextClassificationResponse[]>(
      'distilbert-base-uncased-finetuned-sst-2-english',
      text
    );
  }

  /**
   * Classifies text according to emotion categories
   * @param text Text to analyze for emotions
   * @returns Analysis result with emotion label and confidence score
   */
  async classifyEmotion(text: string): Promise<HuggingFaceTextClassificationResponse[]> {
    // List of alternative emotion classification models to try if the primary one fails
    const alternativeModels = [
      'SamLowe/roberta-base-go_emotions', // Alternative emotion model
      'bhadresh-savani/distilbert-base-uncased-emotion', // Another emotion model
      'arpanghoshal/EmoRoBERTa' // Yet another emotion model
    ];
    
    // Use primary model with alternatives as fallbacks
    return this.query<HuggingFaceTextClassificationResponse[]>(
      'j-hartmann/emotion-english-distilroberta-base',
      text,
      {},
      2, // 2 retries
      alternativeModels
    );
  }

  /**
   * Classifies text into career-related categories
   * @param text Text to analyze for career relevance
   * @returns Analysis result with category label and confidence score
   */
  async classifyCareerContent(text: string): Promise<HuggingFaceTextClassificationResponse[]> {
    // This is a placeholder - in a real implementation, we would use a specific career classification model
    // For now, we'll use a general purpose text classifier
    return this.query<HuggingFaceTextClassificationResponse[]>(
      'facebook/bart-large-mnli',
      {
        text,
        candidate_labels: [
          'job search', 'career development', 'skills', 'resume', 'interview',
          'promotion', 'networking', 'professional growth', 'leadership', 'workplace'
        ]
      }
    );
  }

  /**
   * Classifies financial content into categories
   * @param text Text to analyze for financial relevance
   * @returns Analysis result with category label and confidence score  
   */
  async classifyFinancialContent(text: string): Promise<HuggingFaceTextClassificationResponse[]> {
    // This is a placeholder - in a real implementation, we would use a specific financial classification model
    // For now, we'll use a general purpose text classifier
    return this.query<HuggingFaceTextClassificationResponse[]>(
      'facebook/bart-large-mnli',
      {
        text,
        candidate_labels: [
          'budgeting', 'saving', 'investing', 'debt', 'taxes',
          'insurance', 'retirement', 'financial planning', 'banking', 'credit'
        ]
      }
    );
  }
}

export class EntityRecognizer extends HuggingFaceAPI {
  /**
   * Extracts named entities from text
   * @param text Text to analyze for entity extraction
   * @returns Array of entities with type, score, and position
   */
  async extractEntities(text: string): Promise<HuggingFaceTokenClassificationResponse[]> {
    return this.query<HuggingFaceTokenClassificationResponse[]>(
      'dslim/bert-base-NER',
      text
    );
  }

  /**
   * Extracts skills mentioned in text (useful for resume analysis)
   * @param text Text to analyze for skills
   * @returns Array of skills with confidence scores
   */
  async extractSkills(text: string): Promise<HuggingFaceTokenClassificationResponse[]> {
    // This is a placeholder - in a real implementation, we would use a specific skills extraction model
    // For now, we'll adapt the general NER model results
    const entities = await this.extractEntities(text);
    
    // Filter for entities that might represent skills (organizations, products, etc.)
    // In a real implementation, we would use a dedicated skills extraction model
    return entities.filter(entity => 
      entity.entity_group === 'ORG' || 
      entity.entity_group === 'MISC' ||
      entity.entity_group === 'SKILL' // This would require a custom model
    );
  }
}

export class TextSummarizer extends HuggingFaceAPI {
  /**
   * Generates a concise summary of the input text
   * @param text Long text to summarize
   * @param maxLength Maximum length of summary
   * @returns Summary text
   */
  async summarize(text: string, maxLength: number = 100): Promise<string> {
    const response = await this.query<HuggingFaceSummarizationResponse[]>(
      'facebook/bart-large-cnn',
      text,
      {
        max_length: maxLength,
        min_length: Math.min(30, maxLength / 2)
      }
    );
    
    return response[0]?.summary_text || 'Unable to generate summary.';
  }
}

export class QuestionAnswerer extends HuggingFaceAPI {
  /**
   * Answers a question based on the provided context
   * @param question The question to answer
   * @param context Text containing information to answer the question
   * @returns Answer with confidence score and position in context
   */
  async getAnswer(question: string, context: string): Promise<HuggingFaceQuestionAnsweringResponse> {
    return this.query<HuggingFaceQuestionAnsweringResponse>(
      'deepset/roberta-base-squad2',
      {
        question,
        context
      }
    );
  }
}

export class TextGenerator extends HuggingFaceAPI {
  /**
   * Generates text based on a prompt
   * @param prompt Text prompt to continue from
   * @param maxLength Maximum length of generated text
   * @returns Generated text
   */
  async generateText(prompt: string, maxLength: number = 100): Promise<string> {
    const response = await this.query<HuggingFaceTextGenerationResponse[]>(
      'gpt2',
      prompt,
      {
        max_length: maxLength,
        top_k: 40,
        temperature: 0.7
      }
    );
    
    return response[0]?.generated_text || 'Unable to generate text.';
  }
}

// Create instances of the specialized classes
export const textClassifier = new TextClassifier();
export const entityRecognizer = new EntityRecognizer();
export const textSummarizer = new TextSummarizer();
export const questionAnswerer = new QuestionAnswerer();
export const textGenerator = new TextGenerator();

// Utility functions that combine multiple Hugging Face capabilities

/**
 * Determines the content category of a text message
 * @param text Text to categorize
 * @returns Category string (finance, career, wellness, learning, emergency, general)
 */
export async function getContentCategory(text: string): Promise<string> {
  try {
    // List of alternative models for category classification
    const alternativeModels = [
      'MoritzLaurer/mDeBERTa-v3-base-xnli-multilingual-nli-2mil7', // Alternative zero-shot model
      'facebook/bart-large-mnli', // Fallback to original model with retries
      'valhalla/distilbart-mnli-12-1' // Smaller, faster alternative
    ];
    
    // Try to classify into high-level categories first
    const categoryResponse = await textClassifier.query<HuggingFaceTextClassificationResponse[]>(
      'facebook/bart-large-mnli', // Primary zero-shot model
      {
        text,
        candidate_labels: [
          'finance', 'career', 'wellness', 'learning', 'emergency', 'cooking', 'fitness', 'general'
        ]
      },
      {}, // Default options
      2,  // 2 retries
      alternativeModels
    );
    
    // Return the highest scoring category
    const topCategory = categoryResponse.sort((a, b) => b.score - a.score)[0];
    
    // If confidence is low, do more specific classification based on initial guess
    if (topCategory.score < 0.6) {
      try {
        switch (topCategory.label) {
          case 'finance':
            const financialResults = await textClassifier.classifyFinancialContent(text);
            if (financialResults[0].score > 0.7) return 'finance';
            break;
          case 'career':
            const careerResults = await textClassifier.classifyCareerContent(text);
            if (careerResults[0].score > 0.7) return 'career';
            break;
        }
      } catch (specificError) {
        console.error('Error in specific category classification:', specificError);
        // If specific classification fails, still return the top-level category
        return topCategory.label;
      }
      
      // Only return general if confidence is very low
      if (topCategory.score < 0.3) {
        return 'general';
      }
    }
    
    return topCategory.label;
  } catch (error) {
    console.error('Error determining content category:', error);
    // Safe fallback to general in case of complete failure
    return 'general';
  }
}

/**
 * Analyzes the emotional state of a user message
 * @param message User's message to analyze
 * @returns Object with primary emotion and score
 */
export async function analyzeUserEmotion(message: string): Promise<{
  primaryEmotion: string;
  emotionScore: number;
  emotions: Array<{emotion: string, score: number}>;
}> {
  try {
    const emotions = await textClassifier.classifyEmotion(message);
    
    // Sort emotions by score
    const sortedEmotions = emotions.sort((a, b) => b.score - a.score);
    
    // Convert to the expected return format
    return {
      primaryEmotion: sortedEmotions[0]?.label || 'neutral',
      emotionScore: sortedEmotions[0]?.score || 0,
      emotions: sortedEmotions.map(e => ({ emotion: e.label, score: e.score }))
    };
  } catch (error) {
    console.error('Error analyzing user emotion:', error);
    return {
      primaryEmotion: 'neutral',
      emotionScore: 0,
      emotions: []
    };
  }
}