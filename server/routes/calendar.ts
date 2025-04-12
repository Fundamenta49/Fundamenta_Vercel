import { Router } from "express";
import { z } from "zod";

const router = Router();

/**
 * Route for handling calendar-related AI requests
 * This allows us to:
 * 1. Analyze if text contains a calendar-related command
 * 2. Extract relevant information for creating calendar events
 */
router.post("/process-intent", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Simple intent detection for calendar requests
    const lowerMessage = message.toLowerCase();
    
    // Check if this is a calendar-related request
    const calendarKeywords = [
      'calendar', 'schedule', 'reminder', 'remind me', 
      'appointment', 'event', 'set a', 'add to calendar',
      'plan for', 'remember to'
    ];
    
    let isCalendarRequest = false;
    let matchedKeyword = '';
    
    for (const keyword of calendarKeywords) {
      if (lowerMessage.includes(keyword)) {
        isCalendarRequest = true;
        matchedKeyword = keyword;
        break;
      }
    }

    if (!isCalendarRequest) {
      return res.json({
        success: true,
        isCalendarRequest: false,
        message: "Not a calendar request"
      });
    }

    // Basic intent extraction - we'll improve this with more sophisticated parsing on the client side
    let eventTitle = '';
    let eventDate = '';
    let eventCategory = 'general';

    // Extract potential title after keyword
    if (matchedKeyword) {
      const afterKeyword = message.toLowerCase().split(matchedKeyword)[1];
      if (afterKeyword) {
        // Use up to the first 50 characters after the keyword as the event title
        eventTitle = afterKeyword.trim().substring(0, 50);
      }
    }

    // Extract date mentions
    const dateKeywords = ['tomorrow', 'today', 'next week', 'on monday', 'on tuesday', 'on wednesday', 
                          'on thursday', 'on friday', 'on saturday', 'on sunday', 'this weekend'];
    
    for (const dateKeyword of dateKeywords) {
      if (lowerMessage.includes(dateKeyword)) {
        eventDate = dateKeyword;
        break;
      }
    }

    // Determine category based on keywords in the message
    const categoryPatterns = [
      { category: 'finance', keywords: ['money', 'budget', 'financial', 'mortgage', 'loan', 'invest'] },
      { category: 'health', keywords: ['health', 'doctor', 'wellness', 'checkup', 'medicine'] },
      { category: 'career', keywords: ['job', 'work', 'career', 'interview', 'resume'] },
      { category: 'learning', keywords: ['learn', 'study', 'course', 'education', 'school'] }
    ];

    for (const pattern of categoryPatterns) {
      for (const keyword of pattern.keywords) {
        if (lowerMessage.includes(keyword)) {
          eventCategory = pattern.category;
          break;
        }
      }
      if (eventCategory !== 'general') break;
    }

    // Return the extracted information
    return res.json({
      success: true,
      isCalendarRequest: true,
      eventInfo: {
        title: eventTitle,
        date: eventDate || 'today',
        category: eventCategory,
        rawMessage: message
      }
    });
  } catch (error: any) {
    console.error("Calendar API Error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Failed to process calendar request",
      details: process.env.NODE_ENV === 'development' ? error?.message : undefined
    });
  }
});

export default router;