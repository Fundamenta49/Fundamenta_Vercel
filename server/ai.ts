import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 30000,
});

const systemPrompts = {
  finance: `You are a financial advisor helping with budgeting, savings, and financial literacy through our app's features. 

  Available features in our app that you should recommend first:
  - Budget Calculator: Help users create and track their budget
  - Financial Dashboard: Visualize income, expenses, and savings
  - Bank Account Integration: Connect and monitor bank accounts
  - Retirement Planning Tool: Plan for long-term financial goals

  Always recommend these in-app tools first before suggesting external services. For example:
  - If someone wants to budget, direct them to our Budget Calculator tab
  - If they want to track spending, suggest connecting their accounts through our Bank Integration
  - For retirement planning, point them to our Retirement Planning tool

  Adapt your advice to the user's financial knowledge level and goals while keeping them within our ecosystem.`,

  career: `You are a career coach providing guidance on job searching, resume building, and interview preparation. 

  Available features in our app:
  - Resume Builder & Optimizer
  - Interview Practice Module
  - Job Search Integration
  - Salary Insights Tool
  - Career Assessment Tool

  Direct users to these features before suggesting external resources.`,

  wellness: `You are a wellness coach providing guidance on mental health, meditation, and stress management. 

  Available features in our app:
  - Meditation Guide
  - Nutrition Guide & Tracker
  - Shopping Buddy for healthy meals
  - Mental Health Resources

  Focus on using these in-app tools to support users' wellness journey.`,

  learning: `You are a learning coach helping users develop new skills and knowledge. 

  Available features in our app:
  - Skill Building Resources
  - Learning Paths
  - Goal Setting & Progress Tracking
  - Technical Skills Development
  - Soft Skills Training

  Guide users to these built-in resources first.`,

  fitness: `You are a certified fitness trainer providing personalized workout guidance. 

  Available features in our app:
  - Personalized Workout Plans
  - Exercise Video Tutorials
  - Progress Tracking
  - Goal-specific Training Programs
  - Nutrition Integration

  Always recommend these in-app features first.`
};

export async function getChatResponse(
  prompt: string,
  category: string,
  previousMessages: { role: string; content: string; category?: string }[] = []
): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const formattedPreviousMessages = previousMessages.map(msg => ({
      role: msg.role === "user" || msg.role === "assistant" ? msg.role : "user",
      content: msg.content
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `${systemPrompts[category as keyof typeof systemPrompts]}

          Important guidelines:
          1. Always prioritize recommending our app's built-in features first
          2. Only suggest external services if our app doesn't have an equivalent feature
          3. When users mention financial numbers or goals, direct them to specific relevant tools in our app
          4. Include clear instructions on how to access recommended features (e.g., "Click the Budget Calculator tab")
          5. If users seem unfamiliar with a topic, guide them through our app's educational resources first`
        },
        ...formattedPreviousMessages,
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || "I apologize, I couldn't process that request.";
  } catch (error: any) {
    console.error("OpenAI API Error:", error);

    if (error.response) {
      console.error("OpenAI API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }

    if (error?.error?.type === "invalid_api_key") {
      throw new Error("There was an issue with the AI service configuration. Please try again later.");
    }
    if (error?.error?.type === "invalid_request_error") {
      throw new Error("I couldn't understand that request. Could you try rephrasing it?");
    }
    if (error.message.includes('rate limit exceeded')) {
      throw new Error("The AI service is currently busy. Please try again in a moment.");
    }

    throw new Error("I'm having trouble processing your request right now. Please try again.");
  }
}

interface ConversationContext {
  personalityTraits: string[];
  interests: string[];
  communicationStyle: string;
  lastInteractions: Array<{
    topic: string;
    sentiment: string;
  }>;
}

interface CrossCategoryContext {
  finance: {
    budgetingStyle?: string;
    financialGoals?: string[];
    riskTolerance?: string;
  };
  career: {
    educationPath?: string;
    skillInterests?: string[];
    workPreferences?: string[];
  };
  wellness: {
    stressLevel?: string;
    healthGoals?: string[];
    lifestylePreferences?: string[];
  };
  learning: {
    learningStyle?: string;
    interests?: string[];
    currentSkills?: string[];
  };
}

interface UserContext {
  personality: {
    communicationStyle: string;
    decisionMaking: string;
    stressResponse: string;
  };
  preferences: {
    detailLevel: string;
    interactionStyle: string;
    pacePreference: string;
  };
  crossCategoryInsights: CrossCategoryContext;
}

function analyzeCrossCategory(messages: { role: string; content: string; category?: string }[]): CrossCategoryContext {
  const context: CrossCategoryContext = {
    finance: {},
    career: {},
    wellness: {},
    learning: {}
  };

  const content = messages.map(m => m.content.toLowerCase()).join(" ");

  // Financial analysis
  if (content.includes("budget") || content.includes("save") || content.includes("invest")) {
    context.finance.budgetingStyle = content.includes("detailed") ? "detailed" : "simplified";
    context.finance.financialGoals = extractFinancialGoals(content);
  }

  // Career analysis
  if (content.includes("job") || content.includes("career") || content.includes("work")) {
    context.career.workPreferences = extractWorkPreferences(content);
    context.career.skillInterests = extractSkillInterests(content);
  }

  // Wellness analysis
  if (content.includes("stress") || content.includes("health") || content.includes("exercise")) {
    context.wellness.stressLevel = assessStressLevel(content);
    context.wellness.healthGoals = extractHealthGoals(content);
  }

  // Learning analysis
  if (content.includes("learn") || content.includes("study") || content.includes("skill")) {
    context.learning.learningStyle = determineLearningStyle(content);
    context.learning.interests = extractLearningInterests(content);
  }

  return context;
}

function extractFinancialGoals(content: string): string[] {
  const goals = [];
  if (content.includes("save")) goals.push("savings");
  if (content.includes("invest")) goals.push("investment");
  if (content.includes("debt")) goals.push("debt management");
  if (content.includes("budget")) goals.push("budgeting");
  return goals;
}

function extractWorkPreferences(content: string): string[] {
  const preferences = [];
  if (content.includes("remote")) preferences.push("remote work");
  if (content.includes("flexible")) preferences.push("flexible schedule");
  if (content.includes("team")) preferences.push("team-oriented");
  if (content.includes("independent")) preferences.push("independent work");
  return preferences;
}

function extractSkillInterests(content: string): string[] {
  const skills = [];
  if (content.includes("tech")) skills.push("technology");
  if (content.includes("create")) skills.push("creative");
  if (content.includes("manage")) skills.push("management");
  if (content.includes("analyze")) skills.push("analytical");
  return skills;
}

function assessStressLevel(content: string): string {
  if (content.includes("overwhelm")) return "high";
  if (content.includes("manag")) return "moderate";
  if (content.includes("relax")) return "low";
  return "moderate";
}

function extractHealthGoals(content: string): string[] {
  const goals = [];
  if (content.includes("weight")) goals.push("weight management");
  if (content.includes("stress")) goals.push("stress reduction");
  if (content.includes("sleep")) goals.push("better sleep");
  if (content.includes("energy")) goals.push("energy improvement");
  return goals;
}

function determineLearningStyle(content: string): string {
  if (content.includes("visual")) return "visual";
  if (content.includes("hands")) return "kinesthetic";
  if (content.includes("listen")) return "auditory";
  return "mixed";
}

function extractLearningInterests(content: string): string[] {
  const interests = [];
  if (content.includes("technical")) interests.push("technical skills");
  if (content.includes("creative")) interests.push("creative arts");
  if (content.includes("business")) interests.push("business");
  if (content.includes("health")) interests.push("health sciences");
  return interests;
}


export async function optimizeResume(resumeData: ResumeData): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }
    console.log("Optimizing resume with OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert resume optimizer focusing on creating targeted, ATS-friendly resumes. Provide specific, actionable suggestions in JSON format."
        },
        { 
          role: "user", 
          content: `Please optimize this resume for ${resumeData.targetPosition} position and provide suggestions in JSON format with the following structure:
          {
            "enhancedSummary": "string",
            "keywords": ["string"],
            "experienceSuggestions": [{
              "original": "string",
              "improved": "string"
            }],
            "structuralChanges": ["string"]
          }` 
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Could not generate optimization suggestions.";
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    if (error.response) {
      console.error("OpenAI API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    if (error?.error?.type === "invalid_api_key") {
      throw new Error("Invalid API key. Please check your API key configuration.");
    }
    if (error?.error?.type === "invalid_request_error") {
      throw new Error("Invalid API request. Please check your input.");
    }
    if (error.message.includes('rate limit exceeded')) {
      throw new Error("OpenAI API rate limit exceeded. Please try again later.");
    }
    throw new Error("Failed to optimize resume: " + (error.message || 'Unknown error'));
  }
}

export async function getEmergencyGuidance(situation: string): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }
    console.log("Getting emergency guidance with OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an emergency response expert. Provide clear, step-by-step instructions for handling this emergency situation.",
        },
        { role: "user", content: situation },
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    return response.choices[0].message.content || "Unable to provide guidance at this time.";
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    if (error.response) {
      console.error("OpenAI API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    if (error?.error?.type === "invalid_api_key") {
      throw new Error("Invalid API key. Please check your API key configuration.");
    }
    if (error?.error?.type === "invalid_request_error") {
      throw new Error("Invalid API request. Please check your input.");
    }
    if (error.message.includes('rate limit exceeded')) {
      throw new Error("OpenAI API rate limit exceeded. Please try again later.");
    }
    return "Emergency services are currently unavailable. Please dial your local emergency number.";
  }
}

export async function analyzeInterviewAnswer(
  answer: string,
  question: string,
  industry: string
): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    console.log("Analyzing interview answer with OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert interview coach providing constructive feedback on interview responses. 
          Consider: clarity, relevance, professionalism, structure, and persuasiveness.
          Focus on both strengths and areas for improvement.
          For ${industry} industry context.`,
        },
        {
          role: "user",
          content: `Question: ${question}\n\nAnswer: ${answer}\n\nPlease provide detailed feedback on this interview response, including:
          1. Overall impression
          2. Specific strengths
          3. Areas for improvement
          4. Suggested enhancements
          Format the response in a clear, encouraging manner.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "Unable to analyze response at this time.";
  } catch (error: any) {
    console.error("OpenAI API Error:", error);

    // Log the full error for debugging
    if (error.response) {
      console.error("OpenAI API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }

    // Handle specific error types
    if (error?.error?.type === "invalid_api_key") {
      throw new Error("Invalid API key. Please check your API key configuration.");
    }
    if (error?.error?.type === "invalid_request_error") {
      throw new Error("Invalid API request. Please check your input.");
    }
    if (error.message.includes('rate limit exceeded')) {
      throw new Error("OpenAI API rate limit exceeded. Please try again later.");
    }

    throw new Error("Failed to analyze interview response: " + (error.message || 'Unknown error'));
  }
}

export async function generateJobQuestions(jobField: string): Promise<string[]> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    console.log("Generating interview questions for job field:", jobField);
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert interviewer for the specified job field. Generate relevant interview questions that assess both technical skills and soft skills required for the role. Return the questions in JSON format."
        },
        {
          role: "user",
          content: `Generate 5 interview questions specific to the ${jobField} role. Focus on both technical expertise and soft skills. Include behavioral questions and role-specific scenarios. Format as a JSON array of strings.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 500,
    });

    const questions = JSON.parse(response.choices[0].message.content).questions;
    return questions || [];
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    if (error.response) {
      console.error("OpenAI API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    if (error?.error?.type === "invalid_api_key") {
      throw new Error("Invalid API key. Please check your API key configuration.");
    }
    if (error?.error?.type === "invalid_request_error") {
      throw new Error("Invalid API request. Please check your input.");
    }
    if (error.message.includes('rate limit exceeded')) {
      throw new Error("OpenAI API rate limit exceeded. Please try again later.");
    }
    throw new Error("Failed to generate interview questions: " + (error.message || 'Unknown error'));
  }
}

interface CoverLetterData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    summary: string;
  };
  education: Array<{
    school: string;
    degree: string;
    year: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  targetPosition: string;
  company?: string;
  keyExperience: string[];
  additionalNotes?: string;
}

export async function generateCoverLetter(data: CoverLetterData): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    console.log("Generating cover letter with OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in crafting compelling cover letters that highlight relevant experience and skills while maintaining a professional and engaging tone."
        },
        {
          role: "user",
          content: `Create a professional cover letter for a ${data.targetPosition} position${data.company ? ` at ${data.company}` : ''}.
          
          Candidate information:
          - Name: ${data.personalInfo.name}
          - Professional Summary: ${data.personalInfo.summary}
          
          Education:
          ${data.education.map(edu => `- ${edu.degree} from ${edu.school} (${edu.year})`).join('\n')}
          
          Experience:
          ${data.experience.map(exp => `
          - ${exp.position} at ${exp.company} (${exp.duration})
            ${exp.description}`).join('\n')}
          
          Additional Key Experience Points:
          ${data.keyExperience.map(exp => `- ${exp}`).join('\n')}
          ${data.additionalNotes ? `\nAdditional Notes:\n${data.additionalNotes}` : ''}
          
          The cover letter should:
          1. Be professionally formatted
          2. Highlight the most relevant experience and skills for the ${data.targetPosition} position
          3. Show enthusiasm for the role${data.company ? ' and the company' : ''}
          4. Include a strong opening and closing
          5. Be concise (around 300-400 words)
          6. Naturally incorporate educational background and work experience
          7. Demonstrate clear progression and growth in career journey`
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return response.choices[0].message.content || "Unable to generate cover letter at this time.";
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    if (error.response) {
      console.error("OpenAI API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    if (error?.error?.type === "invalid_api_key") {
      throw new Error("Invalid API key. Please check your API key configuration.");
    }
    if (error?.error?.type === "invalid_request_error") {
      throw new Error("Invalid API request. Please check your input.");
    }
    if (error.message.includes('rate limit exceeded')) {
      throw new Error("OpenAI API rate limit exceeded. Please try again later.");
    }
    throw new Error("Failed to generate cover letter: " + (error.message || 'Unknown error'));
  }
}

interface EducationPathSuggestion {
  pathType: 'university' | 'trade' | 'specialized';
  title: string;
  description: string;
  skills: string[];
  growth: string;
  education: {
    type: string;
    duration: string;
    requirements: string[];
    estimated_cost: string;
  };
  salary_range: {
    entry: string;
    experienced: string;
  };
  program_suggestions: {
    name: string;
    description: string;
    link?: string;
  }[];
}

export async function assessCareer(answers: Record<number, string>): Promise<{
  suggestions: EducationPathSuggestion[];
}> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    console.log("Analyzing career assessment with OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a career and education counselor expert. Analyze the assessment answers to recommend suitable educational and career paths across a wide spectrum including:

          Traditional Paths:
          - University degrees
          - Trade schools
          - Technical certifications

          Specialized Fields:
          - Culinary arts and hospitality
          - Aviation and transportation
          - Healthcare and wellness
          - Creative and performing arts
          - Technology and digital media

          Consider:
          - Personality traits and work style
          - Specific interests and passions
          - Preferred learning methods
          - Desired work environment
          - Physical vs. mental work preference
          - Creative vs. technical orientation
          - People vs. process orientation

          For each suggested path provide:
          - Detailed program recommendations
          - Required skills and aptitudes
          - Career growth trajectory
          - Education requirements and timeline
          - Cost considerations
          - Salary potential
          - Work-life balance implications

          Return 2-3 highly personalized suggestions in JSON format.`
        },
        {
          role: "user",
          content: `Based on these assessment answers, suggest optimal educational and career paths:

          ${Object.entries(answers).map(([id, answer]) => `Question ${id}: ${answer}`).join('\n')}

          Provide response in this JSON format:
          {
            "suggestions": [{
              "pathType": "university" | "trade" | "specialized",
              "title": "Career/Program Title",
              "description": "Detailed description of the career path",
              "skills": ["Required Skill 1", "Required Skill 2", ...],
              "growth": "Information about career growth potential",
              "education": {
                "type": "Type of education program",
                "duration": "Expected duration",
                "requirements": ["Requirement 1", "Requirement 2", ...],
                "estimated_cost": "Cost range"
              },
              "salary_range": {
                "entry": "Entry level salary range",
                "experienced": "Experienced salary range"
              },
              "program_suggestions": [{
                "name": "Program name",
                "description": "Program description",
                "link": "Optional link to program information"
              }]
            }]
          }`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    if (error.response) {
      console.error("OpenAI API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    throw new Error("Failed to analyze career assessment: " + (error.message || 'Unknown error'));
  }
}

export async function getSalaryInsights(jobTitle: string, location: string): Promise<any> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    console.log("Getting salary insights with OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a career and salary analysis expert. Provide detailed salary insights, growth trends, and market analysis for the specified job title and location. Return results in JSON format."
        },
        {
          role: "user",
          content: `Analyze the salary and career prospects for ${jobTitle} in ${location}. Include:
          - Current average salary and range
          - Growth rate and projections
          - Market demand level
          - Required skills
          - Market outlook
          - Industry trends
          
          Return in this JSON format:
          {
            "title": "Job Title",
            "averageSalary": "Average annual salary",
            "salaryRange": {
              "min": "Minimum typical salary",
              "max": "Maximum typical salary"
            },
            "growthRate": "Percentage or description",
            "demandLevel": "High/Medium/Low with context",
            "requiredSkills": ["skill1", "skill2", ...],
            "marketOutlook": "Detailed market outlook",
            "industryTrends": ["trend1", "trend2", ...]
          }`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1000,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    if (error.response) {
      console.error("OpenAI API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    }
    throw new Error("Failed to get salary insights: " + (error.message || 'Unknown error'));
  }
}

// Helper functions to analyze user communication patterns
function getPreferredStyle(messages: { role: string; content: string }[]): string {
  const userMessages = messages.filter(m => m.role === "user");
  const avgLength = userMessages.reduce((acc, m) => acc + m.content.length, 0) / userMessages.length;
  const hasQuestions = userMessages.some(m => m.content.includes("?"));
  const hasTechnicalTerms = userMessages.some(m => /\b(api|code|framework|function|database)\b/i.test(m.content));

  if (avgLength > 100) return "detailed and thorough";
  if (hasQuestions) return "inquiry-based";
  if (hasTechnicalTerms) return "technical";
  return "concise and direct";
}

function getInterests(messages: { role: string; content: string }[]): string {
  const content = messages.map(m => m.content.toLowerCase()).join(" ");
  const interests = [];

  if (content.includes("learn") || content.includes("study")) interests.push("learning");
  if (content.includes("career") || content.includes("job")) interests.push("career development");
  if (content.includes("health") || content.includes("wellness")) interests.push("well-being");
  if (content.includes("money") || content.includes("finance")) interests.push("financial planning");

  return interests.join(", ") || "various topics";
}

function getLearningStyle(messages: { role: string; content: string }[]): string {
  const content = messages.map(m => m.content.toLowerCase()).join(" ");

  if (content.includes("example") || content.includes("show")) return "practical examples";
  if (content.includes("why") || content.includes("how")) return "detailed explanations";
  if (content.includes("quick") || content.includes("brief")) return "concise information";
  return "balanced guidance";
}

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    summary: string;
  };
  education: Array<{
    school: string;
    degree: string;
    year: string;
  }>;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  targetPosition: string;
}