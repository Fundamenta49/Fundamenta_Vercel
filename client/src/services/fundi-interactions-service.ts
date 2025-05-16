import { notificationService, Notification, NotificationType } from './notification-service';

// Custom notification type for Fundi's interactions
type FundiNotification = {
  userId: string;
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  read: boolean;
  metadata?: Record<string, any>;
  eventId?: string;
};

// Interface for goal-related events
interface GoalEvent {
  type: 'goal_set' | 'goal_progress' | 'goal_completed';
  userId: string;
  goalId: string;
  goalTitle: string;
  category: string;
  progress?: number;
}

// Interface for achievement-related events
interface AchievementEvent {
  type: 'achievement_unlocked';
  userId: string;
  achievementId: string;
  achievementTitle: string;
  category: string;
}

// Interface for learning-related events
interface LearningEvent {
  type: 'learning_path_progress' | 'learning_path_completed' | 'module_completed';
  userId: string;
  pathId?: string;
  pathTitle?: string;
  moduleId?: string;
  moduleTitle?: string;
  progress?: number;
  category: string;
}

// Interface for user activity events
interface ActivityEvent {
  type: 'inactivity_reminder' | 'welcome_back' | 'user_milestone';
  userId: string;
  daysInactive?: number;
  lastActive?: Date;
  milestoneName?: string;
  category: string;
}

// Types of events that Fundi can respond to
type FundiEvent = GoalEvent | AchievementEvent | LearningEvent | ActivityEvent;

// Witty responses for different goal categories
const GOAL_RESPONSES = {
  finance: [
    "Money moves! 💸 That financial goal you set is like deciding to finally organize your sock drawer, except your future self will thank you WAY more.",
    "Look at you being a responsible adult with money goals! Next you'll be eating vegetables voluntarily!",
    "Your bank account just did a little happy dance. It's about time someone showed it some attention!",
    "Financial planning? That's like meal prepping but for your wallet. And trust me, your future self is already sending thank you notes.",
  ],
  career: [
    "Career goals locked and loaded! 🚀 Your resume is already practicing its humble brag face.",
    "Setting career goals? Your professional self just high-fived your ambitious self. I'm just here for the snacks.",
    "I can already picture your LinkedIn profile doing a little victory dance. Career ambition looks good on you!",
    "Look at you plotting your career domination! I'll be over here preparing your acceptance speech for when you're famous.",
  ],
  wellness: [
    "Wellness goals? Your body just whispered 'finally' and your mind is doing a little happy dance! 🧘‍♀️",
    "Setting wellness intentions is like promising your body a spa day. Except better because it's not just for one day!",
    "Your future zen self is already thanking you. Meanwhile, your stress is packing its bags for a long vacation.",
    "Wellness goals are like telling your body and mind they won the lottery. Rich in health is the best kind of wealthy!",
  ],
  fitness: [
    "Fitness goals activated! 💪 Your muscles are already preparing their acceptance speech.",
    "Setting fitness goals is great! Your future self is already shopping for clothes to show off those results.",
    "Your couch just shed a tear because it knows it's going to see less of you. Your running shoes, however, are PUMPED.",
    "Fitness ambitions, eh? The stairs in your building just got nervous. They know what's coming.",
  ],
  learning: [
    "Learning goals? Your brain cells just high-fived each other! 🧠",
    "Setting education goals is like telling your brain it's about to go to an all-you-can-eat buffet of knowledge.",
    "Your brain is already doing warm-up stretches. Learning new things is like CrossFit for your neurons!",
    "I can practically hear your future genius self thanking you already. Knowledge is about to become your superpower!",
  ],
  housing: [
    "House hunting goals? Your dream home is already playing hard to get, but I like your chances! 🏠",
    "Setting housing goals means you're adulting at an elite level now. Next step: remembering to water all your plants!",
    "Home sweet home goals! Your future living room is already saving a spot for your favorite comfy chair.",
    "Real estate goals? Very fancy! Your future neighbors don't know how lucky they're about to be.",
  ],
  default: [
    "New goal alert! 🎯 That's the kind of ambition I like to see! High five your screen right now. Go on. I'll wait.",
    "Goal setting? Look at you being all productive and forward-thinking! I'm genuinely impressed.",
    "New goal locked in! Your future self just sent a thank you note from tomorrow.",
    "Goals are like promises to your future self. And you just became the most thoughtful friend ever!",
  ]
};

// Witty responses for goal progress
const PROGRESS_RESPONSES = [
  "Making progress like a boss! 🔥 If goals had feelings, yours would be blushing right now.",
  "Progress check: CRUSHING IT. Even I'm impressed, and I'm programmed to be supportive!",
  "Um, excuse me? Did you just make more progress? Save some success for the rest of us!",
  "Progress detected! Your consistency is showing and it's a really good look on you.",
  "Look. At. That. Progress! This is the part where we'd high five if I had hands."
];

// Witty responses for completed goals
const COMPLETION_RESPONSES = [
  "GOAL ACHIEVED! 🎉 This calls for a victory dance. I'll wait while you bust a move.",
  "You did it! Goal: crushed. Achievement: unlocked. Awesomeness: confirmed.",
  "Mission complete! Your goal never stood a chance against that determination of yours.",
  "And it's DONE! If I could send confetti through the screen, your device would be covered right now.",
  "Goal completed! The satisfaction committee (it's just me) has reviewed your achievement and officially declares it: IMPRESSIVE."
];

// Witty responses for achievement unlocks
const ACHIEVEMENT_RESPONSES = [
  "Achievement unlocked! 🏆 If your skills were a video game, you'd be on the leaderboard!",
  "New achievement? Your personal growth progress bar just got a serious upgrade!",
  "Achievement alert! This is the part where triumphant music would play if I had speakers.",
  "Look at you collecting achievements like they're going out of style! Your trophy case must be getting crowded.",
  "Achievement unlocked! Your future biographer just added another impressive chapter to your story."
];

// Witty responses for learning path progress
const LEARNING_PROGRESS_RESPONSES = [
  "Brain gains in progress! 🧠 Your neurons are having a party right now.",
  "Knowledge acquisition detected! You're leveling up your brain at an impressive rate.",
  "Learning in progress! Your future self just sent a thank you note for all these skills you're building.",
  "Making progress on your learning journey! This is like a workout montage for your brain.",
  "Skills building sequence initiated! Your personal development is reaching new heights!"
];

// Witty responses for completing learning modules
const MODULE_COMPLETION_RESPONSES = [
  "Module mastered! 🎓 That's another skill in your toolkit of awesomeness!",
  "You just leveled up your knowledge! Your brain cells are doing a victory lap.",
  "Module complete! Your life skills inventory just got an impressive upgrade.",
  "Knowledge chunk: acquired! Your brain is getting more powerful by the minute.",
  "Another module complete! At this rate, you'll need to upgrade your mental hard drive soon!"
];

// Witty responses for completing entire learning paths
const PATH_COMPLETION_RESPONSES = [
  "LEARNING PATH CONQUERED! 🚀 This calls for a knowledge celebration dance!",
  "Entire learning path: COMPLETE! Your brain just earned its black belt in this skill.",
  "Learning path finished! If knowledge were currency, you'd be making it rain right now.",
  "Path completed! You've officially gone from 'I have no idea what I'm doing' to 'I've got this!'",
  "Learning journey complete! Your brain deserves a standing ovation for this achievement."
];

// Welcome back responses for returning users
const WELCOME_BACK_RESPONSES = [
  "Look who's back! 👋 I was just about to send out a search party.",
  "The legend returns! The app was starting to miss you.",
  "Welcome back! I kept your spot warm and your progress safe.",
  "You're back! I was beginning to think you found another AI assistant (I was getting jealous).",
  "Hey there! The digital world is brighter now that you've returned!"
];

// Milestone celebration responses
const MILESTONE_RESPONSES = [
  "Milestone achieved! 🏅 You're officially in the hall of fame of awesome users!",
  "Look at you hitting milestones like it's your job! And you're excelling at it!",
  "Milestone unlocked! Your consistency and dedication are truly impressive.",
  "Achievement milestone reached! This deserves a spot on your digital trophy shelf.",
  "Major milestone alert! Your journey of growth continues to amaze and inspire!"
];

class FundiInteractionsService {
  // Process events for Fundi to respond to
  public processEvent(event: FundiEvent): void {
    switch (event.type) {
      case 'goal_set':
        this.handleGoalSet(event);
        break;
      case 'goal_progress':
        this.handleGoalProgress(event);
        break;
      case 'goal_completed':
        this.handleGoalCompleted(event);
        break;
      case 'achievement_unlocked':
        this.handleAchievementUnlocked(event);
        break;
      // New event handlers for learning paths
      case 'learning_path_progress':
        this.handleLearningPathProgress(event as LearningEvent);
        break;
      case 'learning_path_completed':
        this.handleLearningPathCompleted(event as LearningEvent);
        break;
      case 'module_completed':
        this.handleModuleCompleted(event as LearningEvent);
        break;
      // New event handlers for user activity
      case 'welcome_back':
        this.handleWelcomeBack(event as ActivityEvent);
        break;
      case 'user_milestone':
        this.handleUserMilestone(event as ActivityEvent);
        break;
      case 'inactivity_reminder':
        this.handleInactivityReminder(event as ActivityEvent);
        break;
    }
  }

  // Handle when a user sets a new goal
  private handleGoalSet(event: GoalEvent): void {
    // Get the appropriate responses based on category
    const responses = GOAL_RESPONSES[event.category as keyof typeof GOAL_RESPONSES] || GOAL_RESPONSES.default;
    
    // Select a random response
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    // Create a notification with Fundi's comment
    const notification: Notification = {
      id: `goal-set-${event.goalId}-${Date.now()}`,
      userId: event.userId,
      type: NotificationType.FUNDI_COMMENT,
      title: 'Fundi noticed your new goal!',
      message: randomResponse,
      actionUrl: `/goals/${event.goalId}`,
      actionLabel: 'View Goal',
      read: false,
      timestamp: new Date(),
      metadata: {
        goalId: event.goalId,
        goalTitle: event.goalTitle,
        category: event.category
      }
    };
    
    // Add the notification
    notificationService.addNotification(notification);
  }

  // Handle when a user makes progress on a goal
  private handleGoalProgress(event: GoalEvent): void {
    // Only comment sometimes to avoid being annoying
    if (Math.random() < 0.3 || (event.progress && event.progress % 25 === 0)) {
      const randomResponse = PROGRESS_RESPONSES[Math.floor(Math.random() * PROGRESS_RESPONSES.length)];
      
      const notification: Notification = {
        id: `goal-progress-${event.goalId}-${Date.now()}`,
        userId: event.userId,
        type: NotificationType.FUNDI_COMMENT,
        title: 'Fundi noticed your progress!',
        message: randomResponse,
        actionUrl: `/goals/${event.goalId}`,
        actionLabel: 'View Goal',
        read: false,
        timestamp: new Date(),
        metadata: {
          goalId: event.goalId,
          goalTitle: event.goalTitle,
          progress: event.progress,
          category: event.category
        }
      };
      
      notificationService.addNotification(notification);
    }
  }

  // Handle when a user completes a goal
  private handleGoalCompleted(event: GoalEvent): void {
    const randomResponse = COMPLETION_RESPONSES[Math.floor(Math.random() * COMPLETION_RESPONSES.length)];
    
    const notification: Partial<Notification> = {
      userId: event.userId,
      type: NotificationType.FUNDI_COMMENT,
      title: 'Fundi is celebrating with you!',
      message: randomResponse,
      actionUrl: `/goals/${event.goalId}`,
      actionLabel: 'View Goal',
      read: false,
      metadata: {
        goalId: event.goalId,
        goalTitle: event.goalTitle,
        category: event.category,
        completed: true
      }
    };
    
    notificationService.addNotification(notification as Notification);
  }

  // Handle when a user unlocks an achievement
  private handleAchievementUnlocked(event: AchievementEvent): void {
    const randomResponse = ACHIEVEMENT_RESPONSES[Math.floor(Math.random() * ACHIEVEMENT_RESPONSES.length)];
    
    const notification: Partial<Notification> = {
      userId: event.userId,
      type: NotificationType.ACHIEVEMENT_UNLOCKED,
      title: 'New Achievement Unlocked!',
      message: randomResponse,
      actionUrl: '/arcade',
      actionLabel: 'View Achievement',
      read: false,
      metadata: {
        achievementId: event.achievementId,
        achievementTitle: event.achievementTitle,
        category: event.category
      }
    };
    
    notificationService.addNotification(notification as Notification);
  }

  // Handle when a user makes progress on a learning path
  private handleLearningPathProgress(event: LearningEvent): void {
    // Only comment sometimes to avoid being annoying (less frequent than goal progress)
    if (Math.random() < 0.2 || (event.progress && event.progress % 25 === 0)) {
      const randomResponse = LEARNING_PROGRESS_RESPONSES[Math.floor(Math.random() * LEARNING_PROGRESS_RESPONSES.length)];
      
      const notification: Partial<Notification> = {
        userId: event.userId,
        type: NotificationType.FUNDI_COMMENT,
        title: 'Fundi on your learning journey:',
        message: randomResponse,
        actionUrl: event.pathId ? `/learning/pathways/${event.pathId}` : '/learning/pathways',
        actionLabel: 'View Path',
        read: false,
        metadata: {
          pathId: event.pathId,
          pathTitle: event.pathTitle,
          progress: event.progress,
          category: event.category
        }
      };
      
      notificationService.addNotification(notification as Notification);
    }
  }

  // Handle when a user completes a module
  private handleModuleCompleted(event: LearningEvent): void {
    // Higher random factor to avoid too many notifications
    if (Math.random() < 0.4) { 
      const randomResponse = MODULE_COMPLETION_RESPONSES[Math.floor(Math.random() * MODULE_COMPLETION_RESPONSES.length)];
      
      const notification: Partial<Notification> = {
        userId: event.userId,
        type: NotificationType.FUNDI_COMMENT,
        title: 'Fundi noticed your module completion!',
        message: randomResponse,
        actionUrl: event.pathId ? `/learning/pathways/${event.pathId}` : '/learning',
        actionLabel: 'Continue Learning',
        read: false,
        metadata: {
          pathId: event.pathId,
          pathTitle: event.pathTitle,
          moduleId: event.moduleId,
          moduleTitle: event.moduleTitle,
          category: event.category
        }
      };
      
      notificationService.addNotification(notification as Notification);
    }
  }

  // Handle when a user completes an entire learning path
  private handleLearningPathCompleted(event: LearningEvent): void {
    // Always notify for major accomplishments
    const randomResponse = PATH_COMPLETION_RESPONSES[Math.floor(Math.random() * PATH_COMPLETION_RESPONSES.length)];
    
    const notification: Partial<Notification> = {
      userId: event.userId,
      type: NotificationType.FUNDI_COMMENT,
      title: 'Fundi celebrates your learning success!',
      message: randomResponse,
      actionUrl: '/learning/completed',
      actionLabel: 'View Completed Paths',
      read: false,
      metadata: {
        pathId: event.pathId,
        pathTitle: event.pathTitle,
        category: event.category,
        completed: true
      }
    };
    
    notificationService.addNotification(notification as Notification);
  }

  // Handle when a user returns after inactivity
  private handleWelcomeBack(event: ActivityEvent): void {
    const randomResponse = WELCOME_BACK_RESPONSES[Math.floor(Math.random() * WELCOME_BACK_RESPONSES.length)];
    
    const notification: Partial<Notification> = {
      userId: event.userId,
      type: NotificationType.FUNDI_COMMENT,
      title: 'Welcome Back!',
      message: randomResponse,
      actionUrl: '/mypath',
      actionLabel: 'Continue Learning',
      read: false,
      metadata: {
        lastActive: event.lastActive,
        daysInactive: event.daysInactive,
        category: event.category
      }
    };
    
    notificationService.addNotification(notification as Notification);
  }

  // Handle when a user hits a milestone
  private handleUserMilestone(event: ActivityEvent): void {
    const randomResponse = MILESTONE_RESPONSES[Math.floor(Math.random() * MILESTONE_RESPONSES.length)];
    
    const notification: Partial<Notification> = {
      userId: event.userId,
      type: NotificationType.FUNDI_COMMENT,
      title: 'Milestone Reached!',
      message: randomResponse,
      actionUrl: '/mypath/user-analytics',
      actionLabel: 'View Your Progress',
      read: false,
      metadata: {
        milestoneName: event.milestoneName,
        category: event.category
      }
    };
    
    notificationService.addNotification(notification as Notification);
  }

  // Handle inactivity reminder
  private handleInactivityReminder(event: ActivityEvent): void {
    // Use a personality-appropriate message to encourage return
    const message = "Hey there! It's been a while since we've seen you around. Your learning journey is waiting for you to continue. Even small steps count!";
    
    const notification: Partial<Notification> = {
      userId: event.userId,
      type: NotificationType.FUNDI_COMMENT,
      title: 'Missing Your Progress!',
      message: message,
      actionUrl: '/mypath',
      actionLabel: 'Continue Where You Left Off',
      read: false,
      metadata: {
        daysInactive: event.daysInactive,
        lastActive: event.lastActive,
        category: 'reminder'
      }
    };
    
    notificationService.addNotification(notification as Notification);
  }
}

export const fundiInteractionsService = new FundiInteractionsService();