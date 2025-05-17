# Fundi Centralization: AI Coach Inventory

## Introduction
This document provides a comprehensive inventory of all AI coaches and assistants in the Fundamenta platform that will be consolidated into the central Fundi AI assistant.

## Migration Progress

### Completed Migrations
The following components have been migrated to use `ChatRedirect` to Fundi:

1. **Career Coach** (was already implemented)
2. **Wellness Coach** (was already implemented)
3. **Learning Coach** ✓ (migrated)
4. **Finance Advisor** ✓ (migrated)
5. **Emergency Assistant** ✓ (migrated)

## AI Coach Components

### Core Coach Components
These components represent the primary coach interfaces:

1. **Career Coach**
   - Component: `career-coach-pop-out.tsx`
   - Category: `CAREER_CATEGORY`
   - Description: Professional guidance for career journeys
   - Implementation: Using `ChatRedirect` to Fundi
   - Current status: ✓ Using Fundi redirection

2. **Finance Advisor**
   - Component: `finance-advisor-pop-out.tsx`
   - Category: `FINANCE_CATEGORY`
   - Description: Personalized financial advice and guidance
   - Implementation: Updated to use `ChatRedirect`
   - Current status: ✓ Using Fundi redirection

3. **Learning Coach**
   - Component: `learning-coach-pop-out.tsx`
   - Category: `LEARNING_CATEGORY`
   - Description: Assistance with educational content and learning paths
   - Implementation: Updated to use `ChatRedirect`
   - Current status: ✓ Using Fundi redirection

4. **Wellness Coach**
   - Component: `wellness-coach-pop-out.tsx`
   - Category: `WELLNESS_CATEGORY`
   - Description: Guidance for mental and physical wellbeing
   - Implementation: Using `ChatRedirect` to Fundi
   - Current status: ✓ Using Fundi redirection

5. **Emergency Assistant**
   - Component: `emergency-ai-pop-out.tsx`
   - Category: `EMERGENCY_CATEGORY`
   - Description: Critical guidance in emergency situations
   - Implementation: Updated to use `ChatRedirect`
   - Current status: ✓ Using Fundi redirection
   
6. **Cooking Expert**
   - Related to `COOKING_CATEGORY` 
   - Description: Guidance on cooking and meal planning
   - Implementation: Not yet located as dedicated component
   - Current status: Pending investigation

7. **Fitness Coach**
   - Related to `FITNESS_CATEGORY` 
   - Description: Workout guidance and fitness advice
   - Implementation: Not yet located as dedicated component
   - Current status: Pending investigation

### Specialized Assistant Components
More specialized assistants focused on specific tasks:

1. **Repair Assistant**
   - Component: `repair-assistant.tsx`
   - Description: Help with repairing household items
   - Implementation: Needs analysis
   - Current status: Pending investigation

2. **Cooking Guide**
   - Component: `cooking-guide.tsx`
   - Description: Specialized cooking guidance
   - Implementation: Needs analysis
   - Current status: Pending investigation

3. **Legal Rights Guide**
   - Component: `legal-rights-guide.tsx`
   - Description: Guidance on legal matters
   - Implementation: Needs analysis
   - Current status: Pending investigation

4. **Emergency Guide**
   - Component: `emergency-guide.tsx`
   - Description: Emergency assistance
   - Implementation: Needs analysis
   - Current status: Pending investigation

## Redirection System

Fundi centralization leverages a redirection mechanism:
- `ChatRedirect` is used to redirect specialized AIs to Fundi
- All primary coach components now use this redirection
- The component passes the appropriate category to maintain context relevance
- This allows Fundi to understand the user's context and provide domain-specific assistance

## Orchestration System

Fundi orchestrates interactions through:
1. **AI Event System** (`ai-event-system.ts`)
   - Manages AI actions and processing
   - Maintains state for AI responses
   - Controls processing of actions

2. **Fundi Interactions Service** (`fundi-interactions-service.ts`)
   - Processes different types of events
   - Creates contextual responses based on user activities
   - Manages notifications and guidance

3. **Fundi Personality Adapter** (`fundi-personality-adapter.tsx`)
   - Adapts Fundi's appearance and personality
   - Responds to conversation context
   - Simulates learning and adaptation to user preferences

## Category System 
The platform uses a category-based approach to AI assistance:
- `EMERGENCY_CATEGORY` ('emergency')
- `FINANCE_CATEGORY` ('finance')
- `CAREER_CATEGORY` ('career')
- `WELLNESS_CATEGORY` ('wellness')
- `LEARNING_CATEGORY` ('learning')
- `COOKING_CATEGORY` ('cooking')
- `FITNESS_CATEGORY` ('fitness')
- `GENERAL_CATEGORY` ('general')

Each category has:
- Specific colors
- Dedicated advisor images and names
- Specialized knowledge context

## Next Steps

1. Complete analysis of remaining specialized assistant components
2. Address any remaining places where `ChatInterface` is directly used instead of using `ChatRedirect`
3. Extract user intents supported by each coach to ensure Fundi can handle all scenarios
4. Create a unified knowledge base that Fundi can access for all domains
5. Ensure Fundi has access to all the specialized functionality of the individual coaches