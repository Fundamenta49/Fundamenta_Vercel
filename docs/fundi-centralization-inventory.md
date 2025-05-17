# Fundi Centralization: AI Coach Inventory

## Introduction
This document provides a comprehensive inventory of all AI coaches and assistants in the Fundamenta platform that will be consolidated into the central Fundi AI assistant.

## AI Coach Components

### Core Coach Components
These components represent the primary coach interfaces:

1. **Career Coach**
   - Component: `career-coach-pop-out.tsx`
   - Category: `CAREER_CATEGORY`
   - Description: Professional guidance for career journeys
   - Implementation: Using `ChatRedirect` to Fundi
   - Current status: Already directed to Fundi

2. **Finance Advisor**
   - Component: `finance-advisor-pop-out.tsx`
   - Category: `FINANCE_CATEGORY`
   - Description: Personalized financial advice and guidance
   - Implementation: Using `ChatInterface` directly
   - Current status: Needs migration to use `ChatRedirect`

3. **Learning Coach**
   - Component: `learning-coach-pop-out.tsx`
   - Category: `LEARNING_CATEGORY`
   - Description: Assistance with educational content and learning paths
   - Implementation: Not yet analyzed

4. **Wellness Coach**
   - Component: `wellness-coach-pop-out.tsx`
   - Category: `WELLNESS_CATEGORY`
   - Description: Guidance for mental and physical wellbeing
   - Implementation: Not yet analyzed

5. **Emergency Assistant**
   - Component: `emergency-ai-pop-out.tsx`
   - Category: `EMERGENCY_CATEGORY`
   - Description: Critical guidance in emergency situations
   - Implementation: Not yet analyzed
   
6. **Cooking Expert**
   - Related to `COOKING_CATEGORY` 
   - Description: Guidance on cooking and meal planning
   - Implementation: Not yet located as dedicated component

7. **Fitness Coach**
   - Related to `FITNESS_CATEGORY` 
   - Description: Workout guidance and fitness advice
   - Implementation: Not yet located as dedicated component

### Specialized Assistant Components
More specialized assistants focused on specific tasks:

1. **Repair Assistant**
   - Component: `repair-assistant.tsx`
   - Description: Help with repairing household items
   - Implementation: Needs analysis

2. **Cooking Guide**
   - Component: `cooking-guide.tsx`
   - Description: Specialized cooking guidance
   - Implementation: Needs analysis

3. **Legal Rights Guide**
   - Component: `legal-rights-guide.tsx`
   - Description: Guidance on legal matters
   - Implementation: Needs analysis

4. **Emergency Guide**
   - Component: `emergency-guide.tsx`
   - Description: Emergency assistance
   - Implementation: Needs analysis

## Redirection System

Fundi centralization leverages a redirection mechanism:
- `ChatRedirect` is used to redirect specialized AIs to Fundi
- Currently implemented for the Career Coach
- Other coaches still use direct `ChatInterface` implementation
- All coaches should be migrated to use `ChatRedirect`

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

1. Complete analysis of remaining coach components
2. Extract user intents supported by each coach
3. Map all coach functionalities to Fundi orchestrator
4. Create migration plan for each component
5. Implement unified knowledge base for all domains