# Learning Paths Improvement Plan

*Created: April 17, 2025*

This document outlines a prioritized action plan to enhance the Learning Paths system in Fundamenta. The plan is designed for implementation by a solo developer, with each phase building on previous work.

## Overview of Current System

The current Learning Paths implementation in Fundamenta features:

- Structured paths with multiple modules (e.g., Financial Literacy, Cooking Skills)
- Category-based organization (finance, wellness, career, etc.)
- Basic progress tracking
- Quiz-based assessments
- Learning coach integration via AI

## Prioritized Improvement Plan

### Phase 1: Foundation (Weeks 1-2)

#### 1. Server-Side Progress Persistence
**Goal:** Create a robust database-backed progress tracking system.

**Technical implementation:**
```typescript
// Add to shared/schema.ts
export const learningProgress = pgTable("learning_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  pathwayId: text("pathway_id").notNull(),
  moduleId: text("module_id").notNull(), 
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  lastAccessedAt: timestamp("last_accessed_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Add to shared/schema.ts
export const insertLearningProgressSchema = createInsertSchema(learningProgress)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type InsertLearningProgressType = z.infer<typeof insertLearningProgressSchema>;
export type SelectLearningProgressType = typeof learningProgress.$inferSelect;
```

**API Endpoints:**
1. Update `/api/learning/track-progress` endpoint:
   ```typescript
   router.post('/track-progress', async (req: Request, res: Response) => {
     try {
       const { userId, pathwayId, moduleId, completed } = req.body;
       
       // First, check if a record already exists
       const existingProgress = await db.query.learningProgress.findFirst({
         where: and(
           eq(learningProgress.userId, userId),
           eq(learningProgress.pathwayId, pathwayId),
           eq(learningProgress.moduleId, moduleId)
         )
       });
       
       if (existingProgress) {
         // Update existing record
         await db.update(learningProgress)
           .set({ 
             completed,
             completedAt: completed ? new Date() : null,
             lastAccessedAt: new Date(),
             updatedAt: new Date()
           })
           .where(eq(learningProgress.id, existingProgress.id));
       } else {
         // Create new record
         await db.insert(learningProgress).values({
           userId,
           pathwayId,
           moduleId,
           completed,
           completedAt: completed ? new Date() : null,
           lastAccessedAt: new Date()
         });
       }
       
       res.json({ success: true });
     } catch (error) {
       console.error('Error tracking progress:', error);
       res.status(500).json({ error: 'Failed to track progress' });
     }
   });
   ```

2. Create endpoint to fetch user progress:
   ```typescript
   router.get('/progress/:userId', async (req: Request, res: Response) => {
     try {
       const userId = parseInt(req.params.userId);
       
       const progress = await db.query.learningProgress.findMany({
         where: eq(learningProgress.userId, userId),
         orderBy: [desc(learningProgress.lastAccessedAt)]
       });
       
       // Group by pathway for easier frontend consumption
       const groupedProgress = progress.reduce((acc, item) => {
         if (!acc[item.pathwayId]) {
           acc[item.pathwayId] = [];
         }
         acc[item.pathwayId].push(item);
         return acc;
       }, {} as Record<string, SelectLearningProgressType[]>);
       
       res.json(groupedProgress);
     } catch (error) {
       console.error('Error fetching progress:', error);
       res.status(500).json({ error: 'Failed to fetch learning progress' });
     }
   });
   ```

3. Update frontend components to use API:
   - Modify the pathways page to fetch and display real progress
   - Update module completion logic to call the tracking endpoint
   - Add loading states while fetching data

### Phase 2: User Experience (Weeks 3-4)

#### 2. Spaced Repetition System
**Goal:** Implement a system to help users review and retain knowledge.

**Technical implementation:**
1. Extend the learning progress schema:
   ```typescript
   // Add to shared/schema.ts in learningProgress table
   repetitionData: jsonb("repetition_data").default({
     interval: 1, // days
     repetitions: 0,
     easeFactor: 2.5,
     nextReviewDate: null
   }),
   ```

2. Create a spaced repetition algorithm:
   ```typescript
   // server/services/spaced-repetition.ts
   
   interface RepetitionData {
     interval: number;
     repetitions: number;
     easeFactor: number;
     nextReviewDate: Date | null;
   }
   
   export function calculateNextReview(
     currentData: RepetitionData,
     quality: number // 0-5 rating of recall quality
   ): RepetitionData {
     // Implementation of SM-2 algorithm
     const newData = { ...currentData };
     
     if (quality >= 3) {
       // Successful recall
       if (newData.repetitions === 0) {
         newData.interval = 1;
       } else if (newData.repetitions === 1) {
         newData.interval = 6;
       } else {
         newData.interval = Math.round(newData.interval * newData.easeFactor);
       }
       newData.repetitions += 1;
     } else {
       // Failed recall
       newData.repetitions = 0;
       newData.interval = 1;
     }
     
     // Update ease factor
     newData.easeFactor = Math.max(
       1.3,
       newData.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
     );
     
     // Calculate next review date
     const nextDate = new Date();
     nextDate.setDate(nextDate.getDate() + newData.interval);
     newData.nextReviewDate = nextDate;
     
     return newData;
   }
   ```

3. Create "Daily Review" component:
   - Add a review section to the dashboard
   - Fetch content due for review based on nextReviewDate
   - Present flashcard-style questions from completed modules
   - Update spaced repetition data based on user performance

#### 3. Enhanced Analytics Dashboard
**Goal:** Provide users with insights about their learning journey.

**Technical implementation:**
1. Create analytics data endpoints:
   ```typescript
   router.get('/analytics/:userId', async (req: Request, res: Response) => {
     try {
       const userId = parseInt(req.params.userId);
       
       // Fetch all progress data
       const progress = await db.query.learningProgress.findMany({
         where: eq(learningProgress.userId, userId)
       });
       
       // Calculate metrics
       const totalModules = progress.length;
       const completedModules = progress.filter(p => p.completed).length;
       const completionRate = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
       
       // Get completion by category
       const pathwayProgress = {}; // Calculate per-pathway completion
       
       // Time-based analytics
       const moduleCompletionDates = progress
         .filter(p => p.completedAt)
         .map(p => p.completedAt);
         
       // Sort dates and calculate streaks, learning velocity, etc.
       
       res.json({
         totalModules,
         completedModules,
         completionRate,
         pathwayProgress,
         // Other metrics
       });
     } catch (error) {
       console.error('Error fetching analytics:', error);
       res.status(500).json({ error: 'Failed to generate analytics' });
     }
   });
   ```

2. Create analytics dashboard component:
   - Add graphs for progress over time
   - Create a heatmap calendar showing activity
   - Display pathway completion rates
   - Show strongest/weakest areas based on quiz performance

### Phase 3: Content Enhancement (Weeks 5-6)

#### 4. Module Prerequisites System
**Goal:** Create a structured learning experience with module dependencies.

**Technical implementation:**
1. Update the pathway data structure:
   ```typescript
   // Add prerequisites to module type
   interface Module {
     id: string;
     title: string;
     description: string;
     path: string;
     prerequisites: string[]; // IDs of required modules
     complete: boolean;
   }
   ```

2. Update UI to respect prerequisites:
   - Show locked/unlocked status based on prerequisites
   - Add visual cues to explain why content is locked
   - Create a pathway visualization showing dependencies

#### 5. Basic Personalized Recommendations
**Goal:** Suggest relevant learning content based on user behavior and preferences.

**Technical implementation:**
1. Create recommendation engine:
   ```typescript
   // server/services/recommendation-engine.ts
   
   export async function generateRecommendations(
     userId: number,
     completedModules: string[],
     quizPerformance: Record<string, number>,
     interests: string[]
   ) {
     const prompt = `
       Generate personalized learning recommendations for a user with the following profile:
       - Completed modules: ${completedModules.join(', ')}
       - Quiz performance: ${Object.entries(quizPerformance).map(([quiz, score]) => `${quiz}: ${score}%`).join(', ')}
       - Stated interests: ${interests.join(', ')}
       
       Based on this information, recommend:
       1. The next most appropriate learning pathway(s) to pursue
       2. Specific modules that address knowledge gaps
       3. Resources that align with their interests
       
       Format your response as a JSON object with this structure:
       {
         "pathwayRecommendations": [{ "id": string, "reason": string }],
         "moduleRecommendations": [{ "id": string, "reason": string }],
         "resourceRecommendations": [{ "title": string, "url": string, "reason": string }]
       }
     `;
     
     // Use OpenAI to generate recommendations
     const response = await openai.chat.completions.create({
       model: "gpt-4o",
       messages: [
         {
           role: "system",
           content: "You are an expert educational advisor who provides personalized learning recommendations."
         },
         {
           role: "user",
           content: prompt
         }
       ],
       response_format: { type: "json_object" }
     });
     
     return JSON.parse(response.choices[0].message.content);
   }
   ```

2. Create recommendation API endpoint:
   ```typescript
   router.get('/recommendations/:userId', async (req: Request, res: Response) => {
     try {
       const userId = parseInt(req.params.userId);
       
       // Fetch user data necessary for recommendations
       const progress = await db.query.learningProgress.findMany({
         where: eq(learningProgress.userId, userId)
       });
       
       const completedModules = progress
         .filter(p => p.completed)
         .map(p => p.moduleId);
         
       // Get quiz performance data
       const quizPerformance = {}; // Fetch from quiz results table
       
       // Get user interests
       const userInfo = await db.query.userInfo.findFirst({
         where: eq(userInfo.userId, userId)
       });
       
       const interests = userInfo?.interests?.split(',') || [];
       
       // Generate recommendations
       const recommendations = await generateRecommendations(
         userId,
         completedModules,
         quizPerformance,
         interests
       );
       
       res.json(recommendations);
     } catch (error) {
       console.error('Error generating recommendations:', error);
       res.status(500).json({ error: 'Failed to generate recommendations' });
     }
   });
   ```

3. Add "Recommended for You" section to the dashboard

### Phase 4: Future Growth (Week 7+)

#### 6. Multi-modal Content Integration
**Goal:** Support different learning styles with varied content formats.

**Technical implementation:**
1. Update module content structure:
   ```typescript
   interface ModuleContentItem {
     type: 'text' | 'video' | 'audio' | 'interactive';
     title: string;
     content: string; // Text content or URL to resource
     duration?: number; // In minutes
     transcript?: string; // For video/audio content
   }
   
   interface Module {
     // existing fields
     contentItems: ModuleContentItem[];
   }
   ```

2. Create components for different content types:
   - Video player with progress tracking
   - Audio player with progress tracking
   - Interactive exercises

#### 7. Practice Projects
**Goal:** Reinforce learning with practical application projects.

**Technical implementation:**
1. Create project structure:
   ```typescript
   interface Project {
     id: string;
     title: string;
     description: string;
     relatedPathwayId: string;
     relatedModuleIds: string[];
     difficulty: 'beginner' | 'intermediate' | 'advanced';
     estimatedTime: number; // In minutes
     instructions: string;
     resources: Resource[];
     submissionGuidelines: string;
     rubric: {
       criteria: string;
       maxPoints: number;
     }[];
   }
   ```

2. Create project submission system:
   - Allow users to submit project work
   - Provide self-assessment against rubric
   - Store project submissions in the database

## Technical Considerations

### Database Migrations
- Plan for safe migrations when adding new tables/fields
- Use database transactions to ensure data integrity
- Create backup routines before major schema changes

### Reusable Components
- Build flexible UI components that can be reused across features
- Create a consistent pattern for data fetching and state management

### Monitoring and Analytics
- Add telemetry to understand feature usage
- Monitor performance metrics
- Track user engagement with new features

## Future Considerations

As the system matures, consider these longer-term improvements:

1. **Social Learning Features**
   - Study groups
   - Peer reviews of projects
   - Content sharing between users

2. **Gamification Elements**
   - Achievement badges
   - Learning streaks
   - Reward systems

3. **Advanced Personalization**
   - Machine learning-based content recommendations
   - Adaptive difficulty based on performance
   - Personalized learning paths

## Revision History

- Initial plan created: April 17, 2025