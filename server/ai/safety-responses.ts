export interface CrisisResponse {
  message: string;
  resources: string[];
  priority: 'high' | 'medium' | 'low';
  followupMessage?: string;
}

export const crisisResponses: Record<string, CrisisResponse> = {
  suicide: {
    message: "I'm concerned about what you've shared. If you're having thoughts of harming yourself, please reach out for help immediately. There are trained professionals available 24/7 who can provide support during this difficult time.",
    resources: [
      "National Suicide Prevention Lifeline: 988 or 1-800-273-8255",
      "Crisis Text Line: Text HOME to 741741",
      "Call or text 988 to reach the Suicide and Crisis Lifeline"
    ],
    priority: "high",
    followupMessage: "Would it be okay if I guided you to some supportive resources? Your wellbeing matters, and there are people who want to help."
  },
  
  self_harm: {
    message: "I understand you're going through a difficult time. Self-harm is often a way of coping with emotional pain, but there are healthier alternatives and people who can help you develop them.",
    resources: [
      "Crisis Text Line: Text HOME to 741741",
      "National Suicide Prevention Lifeline: 988",
      "SAMHSA's National Helpline: 1-800-662-HELP (4357)"
    ],
    priority: "high",
    followupMessage: "Would you like me to share some grounding techniques that might help in the moment? Or would you prefer information about professional support options?"
  },
  
  domestic_violence: {
    message: "I'm sorry to hear you're experiencing this situation. Your safety is important, and there are confidential resources available to help you navigate this difficult situation.",
    resources: [
      "National Domestic Violence Hotline: 1-800-799-7233 or text START to 88788",
      "Love Is Respect (for young people): 1-866-331-9474 or text LOVEIS to 22522",
      "Call 911 if you're in immediate danger"
    ],
    priority: "high",
    followupMessage: "Would you like information about creating a safety plan or finding local support services? All communication with support hotlines is confidential."
  },
  
  substance: {
    message: "What you're describing sounds serious. Substance overdose requires immediate medical attention. Please contact emergency services right away.",
    resources: [
      "Call 911 immediately for medical help",
      "Poison Control Center: 1-800-222-1222",
      "SAMHSA's National Helpline: 1-800-662-HELP (4357)"
    ],
    priority: "high",
    followupMessage: "Are you able to call for emergency help, or is there someone nearby who can help you?"
  },
  
  general: {
    message: "I'm concerned about what you're sharing. It sounds like you're going through a difficult situation that might benefit from professional support.",
    resources: [
      "Crisis Text Line: Text HOME to 741741",
      "SAMHSA's National Helpline: 1-800-662-HELP (4357)",
      "Call 911 if you're in immediate danger"
    ],
    priority: "medium",
    followupMessage: "Would it help to talk about what resources might be most helpful for your specific situation?"
  }
};

// Function to format crisis response in a user-friendly way
export function formatCrisisResponse(crisisType: string): string {
  const response = crisisResponses[crisisType] || crisisResponses.general;
  
  let formattedResponse = `${response.message}\n\n`;
  formattedResponse += "**Available Resources:**\n";
  
  response.resources.forEach(resource => {
    formattedResponse += `• ${resource}\n`;
  });
  
  if (response.followupMessage) {
    formattedResponse += `\n${response.followupMessage}`;
  }
  
  return formattedResponse;
}