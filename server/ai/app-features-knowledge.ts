/**
 * Comprehensive knowledge base of all app features for Fundi
 * This file contains detailed descriptions of all app features, capabilities, and functionality
 * that Fundi should be knowledgeable about to provide accurate and enthusiastic guidance.
 */

export const appFeaturesKnowledge = `
# Fundamenta App - Complete Feature Knowledge Base

## Special Features

### Smart Calendar (Calendar integration)
Fundi can help users manage their schedule and set up calendar events directly from conversations.

- **Calendar Event Creation**: Fundi can understand and process natural language requests to create calendar events.
  * Users can ask Fundi to add events to their calendar
  * Supports various event types: appointments, meetings, reminders, classes, etc.
  * Extracts date, time, and event details from conversation
  * Example requests:
    - "Add a doctor's appointment to my calendar for next Tuesday at 3pm"
    - "Schedule a job interview on the 15th at 10am"
    - "Put dance recital on my calendar for the 22nd"
    - "Set a tax lesson for the 30th"

- **Event Customization**:
  * Users can specify if events should repeat (one-time, daily, weekly, etc.)
  * Events are categorized automatically (health, finance, career, learning, general)
  * Includes time-specific details when provided

### Arcade Learning Center
Fundi should be familiar with the Arcade learning center, a gamified educational area of the platform:

- **Arcade Games**: Educational games that teach life skills in an engaging format
  * **Financial Fitness**: Mini-games that teach budgeting, saving, and investing concepts
  * **Career Quest**: Interactive challenges that build job interview and workplace skills
  * **Cooking Challenge**: Time-based games that teach meal preparation and recipe execution
  * **Health Hero**: Games focused on nutrition knowledge and fitness technique mastery
  * **Adulting 101**: Simulations of real-life scenarios like apartment hunting and car buying

- **Arcade Scoring System**:
  * Points awarded for game completion and knowledge demonstration
  * Leaderboards showing progress compared to other users
  * Skill badges unlocked for mastering specific competencies
  * Experience levels that track overall Arcade progress

- **Learning Pathways**:
  * Structured sequences of games that build knowledge progressively
  * Adaptive difficulty based on user performance
  * Skill tree visualization showing knowledge connections
  * Pre and post-assessments to measure learning gains

## Main Feature Categories

### 1. Finance Coach
Our financial tools suite helps users make informed financial decisions, learn money management principles, and reach their financial goals:

- **Budget Planner** (/finance/budget-planner): A comprehensive budgeting tool that helps users:
  * Create custom spending categories
  * Track income and expenses
  * Visualize spending patterns with beautiful charts
  * Set and monitor financial goals
  * Receive personalized saving recommendations
  * Get alerts for unusual spending patterns
  * Export financial reports

- **Investment Tracker** (/finance/investment-tracker): A powerful investment monitoring platform that:
  * Connects to brokerage accounts (with proper authentication)
  * Visualizes portfolio allocation and performance
  * Provides diversification recommendations
  * Offers educational content about investment types
  * Features historical performance analysis
  * Includes risk assessment tools

- **Mortgage Calculator** (/finance/mortgage-calculator): An advanced home buying calculator that:
  * Compares different loan scenarios side-by-side
  * Visualizes amortization schedules
  * Calculates total interest paid over the loan life
  * Provides refinancing analysis
  * Includes property tax and insurance estimates
  * Shows detailed monthly payment breakdowns
  * Offers affordability assessment based on income

- **Loan Comparison Tool** (/finance/loan-comparison): A comprehensive loan analyzer that:
  * Compares up to 5 different loan options simultaneously
  * Calculates true cost of loans including all fees
  * Visualizes payment schedules over time
  * Includes early payoff calculators
  * Provides refinancing recommendations
  * Offers credit score impact information

- **Retirement Calculator** (/finance/retirement-calculator): A future planning tool that:
  * Projects retirement savings based on current contributions
  * Accounts for inflation and expected returns
  * Visualizes retirement income streams
  * Provides Social Security benefit estimates
  * Includes healthcare cost projections
  * Offers "what-if" scenario planning
  * Provides recommended savings rates

- **Debt Payoff Planner** (/finance/debt-payoff-planner): A debt elimination strategy tool that:
  * Compares snowball vs. avalanche payoff methods
  * Creates custom debt elimination schedules
  * Calculates interest savings for various strategies
  * Tracks payoff progress with visual indicators
  * Generates motivation milestones
  * Offers refinancing recommendations when beneficial

### 2. Career Coach
Our career development suite helps users advance professionally and navigate their job search effectively:

- **Resume Builder** (/career/resume-builder): A state-of-the-art resume creation tool that:
  * Offers multiple ATS-friendly templates
  * Provides AI-powered content suggestions
  * Highlights skills gaps based on target jobs
  * Includes keyword optimization for job descriptions
  * Features real-time formatting and design
  * Allows unlimited versions for different applications
  * Supports PDF, Word, and plain text exports

- **Interview Preparation** (/career/interview-prep): A comprehensive interview practice platform that:
  * Contains industry-specific question libraries
  * Provides model answers and response frameworks
  * Offers feedback on practice responses
  * Includes company-specific interview preparation
  * Features behavioral and technical interview sections
  * Provides salary negotiation guidance
  * Offers pre-interview research templates

- **Job Search Strategies** (/career/job-search): A job hunting assistant that:
  * Provides personalized job search plans
  * Offers application tracking systems
  * Includes networking strategies and templates
  * Features industry-specific search tactics
  * Provides guidance on applicant tracking systems
  * Offers job market analytics and trends
  * Includes follow-up templates and timing recommendations

- **Networking Tools** (/career/networking): A professional connection builder that:
  * Provides networking conversation starters
  * Offers templates for outreach messages
  * Includes follow-up scheduling and reminders
  * Features relationship tracking systems
  * Provides industry-specific networking guidance
  * Offers event preparation checklists
  * Includes social media optimization tips

- **Professional Development** (/career/professional-development): A career growth platform that:
  * Provides skill gap analysis
  * Recommends courses and certifications
  * Includes promotion preparation guidance
  * Features salary research and negotiation tactics
  * Offers personal branding strategies
  * Provides mentorship connection guidance
  * Includes leadership development resources

### 3. Wellness Coach
Our mental and emotional wellness tools provide support, guidance, and resources for overall wellbeing:

- **Comprehensive Wellness Assessment** (/wellness?section=assessment): An integrated assessment system that:
  * Combines mental and physical health evaluations
  * Provides personalized wellness recommendations
  * Generates custom wellness pathways based on results
  * Features clinically validated assessment tools
  * Tracks wellness progress over time
  * Offers adaptive support based on assessment scores
  * Includes detailed explanations of results

- **Mental Health Assessments** (/wellness?section=assessment): A suite of clinically validated assessment tools that:
  * Uses evidence-based screening instruments endorsed by leading health organizations
  * Provides personalized recommendations based on assessment results
  * Includes safety resources and guidance for seeking professional help when needed
  * Features regular reassessment options to track progress over time
  * Offers integrated wellness pathways based on results
  * Provides educational content about mental health conditions
  * Includes private results storage with optional security features

- **PHQ-9 Assessment** (/wellness?section=assessment?tool=phq9): A clinical depression screening tool that:
  * Uses the Patient Health Questionnaire-9, a validated clinical instrument from NIH
  * Assesses depression symptoms over the past two weeks
  * Provides a severity score from 0-27 (minimal, mild, moderate, moderately severe, severe)
  * Offers specific recommendations based on score results
  * Includes safety planning for high-risk scores
  * Features follow-up recommendations appropriate to severity level
  * Provides self-care steps customized to assessment results

- **GAD-7 Assessment** (/wellness?section=assessment?tool=gad7): An anxiety screening tool that:
  * Uses the Generalized Anxiety Disorder-7, a validated clinical instrument
  * Measures anxiety symptoms over the past two weeks
  * Provides severity scoring (minimal, mild, moderate, severe)
  * Offers specialized anxiety management techniques based on results
  * Includes guidance for when to seek professional support
  * Features educational content about anxiety management
  * Provides personalized coping strategies

- **PSS Assessment** (/wellness?section=assessment?tool=pss): A stress evaluation tool that:
  * Uses the Perceived Stress Scale, a widely validated instrument
  * Measures subjective stress perceptions and coping ability
  * Provides normalized scoring compared to population averages
  * Offers stress reduction techniques tailored to results
  * Includes guided stress management exercises
  * Features stress trigger identification support
  * Provides resilience-building recommendations

- **WEMWBS Assessment** (/wellness?section=assessment?tool=wemwbs): A wellbeing measurement tool that:
  * Uses the Warwick-Edinburgh Mental Wellbeing Scale
  * Focuses on positive aspects of mental health and functioning
  * Provides a holistic view of emotional and psychological wellbeing
  * Offers strategies to enhance positive mental health
  * Includes tracking of wellbeing improvements over time
  * Features celebration of strengths and positive attributes
  * Provides balance to problem-focused assessments

- **PAVS Assessment** (/wellness?section=assessment?tool=pavs): A physical activity evaluation tool that:
  * Uses the Physical Activity Vital Sign clinical assessment
  * Measures days per week and minutes per day of physical activity
  * Evaluates activity intensity (light, moderate, vigorous, mixed)
  * Categorizes activity levels (inactive, insufficient, active)
  * Provides specific recommendations based on current activity level
  * Features actionable steps to improve physical activity
  * Includes educational content about activity benefits

- **Wellness Integration** (/wellness?section=integration): A holistic wellness platform that:
  * Combines mental and physical health data from assessments
  * Creates personalized wellness pathways based on user profiles
  * Provides integrated recommendations addressing multiple health domains
  * Features adaptive content based on user progress
  * Offers specialized support for various wellness needs
  * Includes connection between physical and mental health domains
  * Provides coordinated wellness tracking across domains

- **Stress Management** (/wellness?section=stress-management): A comprehensive stress reduction platform that:
  * Offers guided breathing exercises
  * Provides progressive muscle relaxation techniques
  * Features cognitive reframing tools
  * Includes stress trigger identification
  * Offers personalized stress management plans
  * Provides workplace stress strategies
  * Features relaxation audio sessions

- **Sleep Tracker** (/wellness?section=sleep): A sleep improvement system that:
  * Tracks sleep duration and quality
  * Provides sleep hygiene recommendations
  * Offers bedtime routine suggestions
  * Features gentle wake-up guidance
  * Includes sleep environment optimization
  * Provides sleep pattern analysis
  * Offers relaxing sleep sounds

- **Mindfulness Practice** (/wellness?section=mindfulness): A meditation and mindfulness platform that:
  * Provides guided meditation sessions of various lengths
  * Offers specialized meditation for anxiety, focus, and sleep
  * Includes mindful breathing exercises
  * Features body scan meditation guidance
  * Provides mindfulness for specific situations (work, travel)
  * Offers progressive courses from beginner to advanced
  * Includes mindful walking and eating guidance

- **Mental Health Resources** (/wellness?section=mental-health): A supportive resource center that:
  * Provides educational content about common mental health conditions
  * Offers self-assessment tools
  * Includes coping strategy libraries
  * Features crisis resource directories
  * Provides guidance on supporting others
  * Offers workplace mental health resources
  * Includes professional help-seeking guidance

- **Psychological Frameworks** (/wellness?section=frameworks): Evidence-based psychological approaches that:
  * Incorporates CBT (Cognitive Behavioral Therapy) techniques for identifying thought patterns
  * Integrates ACT (Acceptance and Commitment Therapy) principles for values-based living
  * Includes MBSR (Mindfulness-Based Stress Reduction) practices for present-moment awareness
  * Features APA Resilience Framework elements for building psychological strength
  * Offers structured self-help exercises based on clinical approaches
  * Provides simplified explanations of complex psychological concepts
  * Adapts therapeutic techniques for everyday application

- **Neurodiversity Support** (/wellness?section=neurodiversity): Specialized resources that:
  * Provides content tailored for neurodivergent users (ADHD, autism spectrum, etc.)
  * Features modular, card-based learning to minimize cognitive overwhelm
  * Offers self-paced navigation to accommodate different processing speeds
  * Includes visual interfaces with gamified elements for enhanced engagement
  * Provides minimal required text per action to reduce cognitive load
  * Features adaptive UI options for different sensory preferences
  * Offers specialized guidance for executive functioning challenges

- **Wellness Journal** (/wellness?section=journal): A therapeutic writing platform that:
  * Provides guided journaling prompts
  * Offers mood tracking and analysis
  * Includes gratitude practice exercises
  * Features reflection tools and templates
  * Provides thought pattern analysis
  * Offers goal setting and tracking
  * Includes progress visualization

### 4. Fitness Coach (ActiveYou)
Our physical wellness tools help users stay active, build strength, and maintain healthy habits:

- **ActiveYou Enhanced** (/active?section=activeyou): A comprehensive fitness ecosystem that:
  * Integrates all fitness features in one easy-to-navigate interface
  * Provides personalized recommendations based on PAVS assessment results
  * Adapts content based on user fitness level and goals
  * Features quick access to most-used workout types
  * Includes progress tracking across all activity types
  * Offers personalized daily activity recommendations
  * Provides seamless integration with wellness assessments

- **Running & Walking** (/active?section=runner): A comprehensive running platform that:
  * Tracks running routes and distances using geolocation
  * Analyzes pace, cadence, and elevation changes
  * Provides guided running workouts for all levels
  * Features personalized training plans
  * Offers audio coaching during runs
  * Includes achievement badges and milestones
  * Provides detailed post-run analytics

- **HIIT Workouts** (/active?section=hiit): A high-intensity interval training system that:
  * Offers timed workouts with visual and audio cues
  * Provides multiple difficulty levels for all fitness abilities
  * Features equipment-free exercise options
  * Includes customizable work/rest intervals
  * Offers specialized routines (cardio, strength, core, full-body)
  * Provides calorie burn estimates
  * Features progress tracking across workouts

- **Stretching Routines** (/active?section=stretch): A flexibility enhancement platform that:
  * Provides guided stretching sequences for different body areas
  * Offers pre and post-workout stretching routines
  * Includes timed holds with visual guides
  * Features progressive flexibility programs
  * Provides mobility assessments
  * Offers specialized routines for injury prevention
  * Includes sport-specific flexibility training

- **Workout Planner** (/active?section=coach): A personalized exercise platform that:
  * Creates custom workout routines based on goals
  * Adapts plans to available equipment
  * Provides proper form guidance with videos
  * Includes progressive overload tracking
  * Offers workout variety recommendations
  * Features recovery and rest day guidance
  * Provides workout scheduling and reminders

- **Exercise Library** (/active?section=coach): A comprehensive movement database that:
  * Contains over 1,000 exercises with video demonstrations
  * Categorizes movements by muscle group and equipment
  * Provides form cues and safety guidance
  * Includes modification options for all fitness levels
  * Features progressive variations for advancement
  * Offers alternative exercise suggestions
  * Includes specialized sections for rehabilitation

- **Nutrition Tracker** (/active?section=nutrition): A nutritional guidance system that:
  * Tracks macro and micronutrient intake
  * Provides meal timing recommendations
  * Offers hydration monitoring
  * Includes recipe suggestions based on goals
  * Features pre/post-workout nutrition guidance
  * Provides supplement information
  * Offers personalized eating plans

- **Fitness Progress Tracking** (/active?section=progress): A comprehensive measurement system that:
  * Tracks body measurements and composition
  * Records strength and endurance improvements
  * Provides visual progress with charts and graphs
  * Includes milestone celebration features
  * Offers plateau-breaking suggestions
  * Features comparative analysis over time
  * Provides goal recalibration guidance
  
- **Yoga Practice** (/active?section=yoga): A complete yoga instruction platform that:
  * Offers yoga poses for all levels from beginner to advanced
  * Provides detailed instructions and video demonstrations
  * Features guided yoga sequences and flows
  * Includes breathing exercises and meditation components
  * Offers specialized yoga for stress relief, flexibility, and strength
  * Tracks yoga practice progress 
  * Provides pose modifications for different abilities

- **Meditation Sessions** (/active?section=meditation): A guided meditation platform that:
  * Provides various meditation styles and techniques
  * Features sessions of different durations
  * Includes specialized meditations for focus, sleep, and anxiety
  * Offers breathing exercises and relaxation techniques
  * Provides progress tracking for meditation practice
  * Features calming background sounds and music
  * Offers voice-guided sessions for different experience levels

- **Weight Training** (/active?section=weightlifting): A strength-building system that:
  * Provides weightlifting routines based on goals and experience
  * Features proper form demonstrations and safety guidance
  * Includes progressive overload principles
  * Offers equipment-based workout variations
  * Tracks strength gains and progress
  * Provides rest and recovery recommendations
  * Features specialized programs for different goals

- **Active Fitness Tracker** (/active?section=tracker): A real-time activity platform that:
  * Connects with wearable devices
  * Tracks steps, distance, and calories
  * Provides movement reminders
  * Offers active minute challenges
  * Includes heart rate zone guidance
  * Features recovery tracking
  * Provides weekly activity reports

- **Advanced Yoga Analysis** (/active?section=yoga-analysis): A specialized yoga tool that:
  * Analyzes and provides feedback on yoga poses
  * Offers detailed progression tracking
  * Provides advanced pose analysis
  * Includes specialized yoga for experienced practitioners
  * Features comprehensive breathing technique instruction
  * Offers yoga philosophy education
  * Provides advanced practice tracking for serious yoga students

### 5. Cooking Coach
Our culinary tools help users develop cooking skills, plan meals, and enjoy healthier food choices:

- **Recipe Finder** (/cooking/recipe-finder): A comprehensive recipe platform that:
  * Contains thousands of recipes searchable by ingredients
  * Filters by dietary preferences and restrictions
  * Includes nutritional information for all recipes
  * Provides cooking time and difficulty ratings
  * Offers seasonal and trending recipe collections
  * Features user ratings and reviews
  * Includes recipe saving and favorites

- **Meal Planner** (/cooking/meal-planner): A weekly meal organization tool that:
  * Creates balanced meal plans based on preferences
  * Generates shopping lists automatically
  * Provides meal prep guidance
  * Includes budget-friendly options
  * Features batch cooking recommendations
  * Offers leftover repurposing ideas
  * Provides nutrition balancing across meals

- **Grocery List** (/cooking/grocery-list): A shopping assistant that:
  * Organizes items by store section
  * Estimates costs for budget planning
  * Tracks frequently purchased items
  * Includes pantry inventory management
  * Offers sale item notifications
  * Provides ingredient substitution suggestions
  * Features shared lists for households

- **Nutrition Calculator** (/cooking/nutrition-calculator): A food analysis tool that:
  * Calculates nutritional content of custom meals
  * Provides portion size guidance
  * Offers healthier alternative suggestions
  * Includes restaurant meal analysis
  * Features label reading education
  * Provides special dietary guidance
  * Offers nutrient deficiency prevention information

- **Cooking Techniques** (/cooking/techniques): A culinary skill development platform that:
  * Provides video demonstrations of cooking methods
  * Offers knife skills and food preparation guidance
  * Includes equipment usage tutorials
  * Features food safety education
  * Provides ingredient knowledge
  * Offers flavor pairing guidance
  * Includes cooking troubleshooting help

### 6. Learning Coach
Our educational tools help users acquire new skills, study effectively, and achieve learning goals:

- **Course Library** (/learning/courses): An extensive educational library that:
  * Offers courses on practical life skills
  * Provides structured learning paths
  * Includes quizzes and knowledge checks
  * Features downloadable resources
  * Offers completion certificates
  * Provides learning time estimates
  * Includes progress tracking

- **Study Tools** (/learning/study): A comprehensive study platform that:
  * Provides note-taking templates
  * Offers spaced repetition flashcards
  * Includes concentration techniques
  * Features memory enhancement methods
  * Provides learning style assessment
  * Offers time management strategies
  * Includes study schedule creators

- **Progress Tracking** (/learning/progress): A learning measurement system that:
  * Tracks course completion
  * Visualizes skill development
  * Provides learning streak incentives
  * Includes knowledge retention checks
  * Features personalized learning recommendations
  * Offers challenge level adjustments
  * Provides learning goal setting

- **Specialized Courses**:
  * **Vehicle Maintenance** (/learning/courses/vehicle-maintenance): Car care essentials and cost-saving repairs
  * **Home Maintenance** (/learning/courses/home-maintenance): DIY home repair and maintenance fundamentals
  * **Cooking Basics** (/learning/courses/cooking-basics): Essential cooking techniques and kitchen knowledge
  * **Health & Wellness** (/learning/courses/health-wellness): Fundamental health education and wellness practices
  * **Economics** (/learning/courses/economics): Personal and practical economic principles
  * **Critical Thinking** (/learning/courses/critical-thinking): Logical reasoning and analytical skills
  * **Conflict Resolution** (/learning/courses/conflict-resolution): Effective communication and problem-solving
  * **Decision Making** (/learning/courses/decision-making): Frameworks for better choices and reduced bias
  * **Time Management** (/learning/courses/time-management): Productivity systems and priority setting
  * **Coping with Failure** (/learning/courses/coping-with-failure): Resilience building and growth mindset
  * **Conversation Skills** (/learning/courses/conversation-skills): Effective communication techniques
  * **Forming Positive Habits** (/learning/courses/forming-positive-habits): Behavior change methods
  * **Utilities Guide** (/learning/courses/utilities-guide): Setting up and managing home utilities
  * **Shopping Buddy** (/learning/courses/shopping-buddy): Smart consumer decisions and money-saving

### 7. Home Maintenance Tools

- **PicFix Smart Repair Assistant** (/learning/courses/repair-assistant): Our revolutionary AI-powered repair tool that:
  * Analyzes photos of broken household items
  * Provides specific diagnosis of problems
  * Offers step-by-step repair instructions
  * Shows parts needed with cost estimates
  * Recommends nearby stores with parts availability
  * Includes tool requirements and safety guidelines
  * Rates repair difficulty and time requirements
  * Provides visual guidance for complex repairs
  * Offers professional referrals for complicated issues
  * Works on appliances, furniture, plumbing, and more

- **Home Maintenance Guide** (/learning/courses/home-maintenance): A comprehensive home care platform that:
  * Provides seasonal maintenance checklists
  * Offers preventative maintenance schedules
  * Includes home system educational content
  * Features troubleshooting decision trees
  * Provides DIY vs. professional guidance
  * Offers cost estimation tools
  * Includes home improvement project planners

### 8. Emergency Resources

- **First Aid Guide** (/emergency/first-aid): A comprehensive emergency response platform that:
  * Provides clear instructions for common emergencies
  * Includes illustrated step-by-step guides
  * Features emergency preparation checklists
  * Offers situational decision support
  * Includes CPR and basic life support guidance
  * Provides natural disaster protocols
  * Features location-based emergency service information

- **Emergency Contacts** (/emergency/contacts): A safety preparation tool that:
  * Stores important emergency numbers
  * Provides quick-access emergency services
  * Includes hospital and urgent care locators
  * Features emergency notification systems
  * Provides medical information storage
  * Offers emergency communication templates
  * Includes international emergency guidance

## Special Features & Educational Framework

- **Fundi AI Assistant**: Our intelligent conversational assistant that:
  * Provides personalized guidance across all platform areas
  * Offers contextual suggestions based on user activity
  * Remembers user preferences and history
  * Connects users to relevant tools and resources
  * Answers questions with helpful, accurate information
  * Provides encouragement and motivation
  * Adapts communication style to user preferences

- **Learning Assessment System**: Our comprehensive assessment framework that:
  * Uses clinically validated tools like PHQ-9 and PAVS
  * Provides personalized learning paths based on assessment results
  * Creates adaptive content recommendations based on skill levels
  * Tracks progress across multiple domains
  * Offers insights on areas for improvement
  * Features regular reassessment opportunities
  * Provides holistic views of user capabilities

- **Social-Emotional Learning Framework**: Our educational foundation that tags content with:
  * Self-awareness competencies (recognizing emotions, strengths, limitations)
  * Self-management skills (regulating emotions, managing stress, self-discipline)
  * Social awareness capabilities (empathy, respect for others, perspective-taking)
  * Relationship skills (communication, teamwork, conflict resolution)
  * Responsible decision-making (ethical choices, safety considerations, well-being)

- **Skill Level Classification**: Our content organization system that categorizes material as:
  * Foundational (essential knowledge for beginners)
  * Intermediate (advancing skills for those with basic understanding)
  * Advanced (complex concepts for experienced learners)

- **Safety & Escalation Protocols**: Our user protection system that:
  * Includes automated flagging for high-risk assessment results
  * Provides crisis resource overlays with emergency contact information
  * Offers clear guidance for when to seek professional help
  * Features private journaling with optional locked mode for privacy
  * Includes appropriate crisis resources (Suicide Prevention Lifeline, text lines, local services)
  * Maintains appropriate boundaries between educational content and clinical intervention
  * Provides clear disclaimers about the non-diagnostic nature of platform tools

- **Why Fundamenta** (/why-fundamenta): Platform mission, vision, and background

- **Partner Program** (/partner): Information about partnership opportunities

- **Privacy Center** (/privacy): Data practices and privacy controls

- **Invite System** (/invite): Tools to invite friends and family

- **Settings** (/settings): Application preferences and account controls

- **Help Center** (/help): Support resources and application guidance
`;

// Export a function that returns the knowledge base with any dynamic content updated
export function getAppFeaturesKnowledge(): string {
  // Currently returns the static knowledge base, but could be extended to include dynamic content
  return appFeaturesKnowledge;
}