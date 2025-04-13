import { 
  userGuidePrompt, 
  quickGuideInstructions, 
  contextualGuidance, 
  userGuideContent 
} from '../ai/user-guide-content';

/**
 * Service that provides user guide functionality for Fundi
 */
export class UserGuideService {
  /**
   * Get user-friendly guidance for a specific feature
   * @param featureId The ID of the feature to get guidance for
   * @returns Simple instructions for using the feature
   */
  getFeatureGuidance(featureId: string): string {
    // Look up feature in the quick guide instructions
    if (featureId in quickGuideInstructions) {
      return quickGuideInstructions[featureId];
    }
    
    // Fallback response if feature ID is not found
    return "I don't have specific guidance for this feature yet, but I'm here to help! Ask me anything about how to use it, and I'll do my best to assist you.";
  }

  /**
   * Get contextual guidance based on user's current activity
   * @param context The current user context (e.g., 'first-visit', 'budget-creation')
   * @returns Contextual guidance appropriate for the user's situation
   */
  getContextualGuidance(context: string): string {
    // Look up context in the contextual guidance
    if (context in contextualGuidance) {
      return contextualGuidance[context];
    }
    
    // Fallback response if context is not found
    return "I'm here to help you with whatever you're working on. Just let me know what you'd like assistance with!";
  }

  /**
   * Generate a simple guided tour for a specific section
   * @param sectionId The ID of the section to generate a tour for
   * @returns Array of tour steps with user-friendly explanations
   */
  generateSectionTour(sectionId: string): { title: string; content: string }[] {
    // This would be expanded with real implementation based on section IDs
    // For now, we'll return some sample tour steps
    switch (sectionId) {
      case 'budget-planner':
        return [
          {
            title: "Welcome to the Budget Planner",
            content: "This tool helps you track your income and expenses to get a clear picture of your finances."
          },
          {
            title: "Adding Income",
            content: "Start by adding your income sources using the + button in the Income section."
          },
          {
            title: "Adding Expenses",
            content: "Next, add your regular expenses by category. Be as detailed as you want."
          },
          {
            title: "Budget Summary",
            content: "The summary chart shows your spending by category, helping you identify areas to save."
          }
        ];
      case 'finance-dashboard':
        return [
          {
            title: "Your Financial Overview",
            content: "The dashboard shows a snapshot of your current financial health."
          },
          {
            title: "Quick Actions",
            content: "Use these buttons to quickly access the tools you use most often."
          },
          {
            title: "Financial Insights",
            content: "These cards highlight important trends and suggestions for improving your finances."
          }
        ];
      default:
        // Generic tour for any section
        return [
          {
            title: "Welcome!",
            content: "I'll help you get familiar with this section. Tap Next to continue."
          },
          {
            title: "Key Features",
            content: "Look around to see the main tools and information available here."
          },
          {
            title: "Need Help?",
            content: "Just tap on me anytime you have questions or need guidance!"
          }
        ];
    }
  }

  /**
   * Generate response to a "How do I..." question
   * @param question The user's question
   * @param currentSection The section the user is currently in
   * @returns User-friendly answer to the question
   */
  answerHowToQuestion(question: string, currentSection: string): string {
    // In a real implementation, this would use AI to generate contextual answers
    // For now, we'll provide some sample responses based on keywords
    
    if (question.includes('budget') || currentSection === 'budget-planner') {
      return "To set up your budget, start by clicking the 'Add Income' button to enter your income sources. Then use 'Add Expense' to add your regular expenses by category. The system will automatically calculate your balance and show where your money is going.";
    }
    
    if (question.includes('invest') || currentSection === 'investment-tracker') {
      return "To track your investments, first click 'Add Investment Account' and enter the details of where your money is invested. You can then update the values regularly to see your growth over time. The charts will show your portfolio allocation and performance history.";
    }
    
    if (question.includes('resume') || currentSection === 'resume-builder') {
      return "To create a resume, first select a template that matches your style. Then fill in your personal details, work history, education, and skills. You can preview your resume at any time, and when you're happy with it, download it as a PDF or share it directly with employers.";
    }
    
    // Default response if no specific answer is available
    return "I'd be happy to help with that! Could you give me a bit more detail about what you're trying to do, and I'll walk you through the steps.";
  }

  /**
   * Simplify complex information for user understanding
   * @param complexInfo The complex information to simplify
   * @returns User-friendly version of the information
   */
  simplifyForUser(complexInfo: string): string {
    // In a real implementation, this would use AI to simplify complex text
    // For now, we'll just return a placeholder
    return `Here's that information in simpler terms: 
    
    ${complexInfo.length > 100 ? complexInfo.substring(0, 100) + '...' : complexInfo}
    
    I've simplified this to focus on what matters most. Is there a specific part you'd like me to explain further?`;
  }

  /**
   * Get user guide content for integration with AI prompts
   * @returns The complete user guide content as a string
   */
  getFullGuideContent(): string {
    return userGuideContent;
  }
}

export const userGuideService = new UserGuideService();