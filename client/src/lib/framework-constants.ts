/**
 * Educational frameworks constants file
 * Contains definitions for SEL and Project LIFE frameworks
 */

// SEL (Social-Emotional Learning) Framework - CASEL competencies
export const selCompetencies = {
  SELF_AWARENESS: "self_awareness",
  SELF_MANAGEMENT: "self_management",
  SOCIAL_AWARENESS: "social_awareness",
  RELATIONSHIP_SKILLS: "relationship_skills",
  RESPONSIBLE_DECISION_MAKING: "responsible_decision_making",
} as const;

// Project LIFE Framework - Chafee Foster Care Independence Program domains
export const lifeDomains = {
  EDUCATION_TRAINING: "education_training",
  EMPLOYMENT: "employment", 
  FINANCIAL_LITERACY: "financial_literacy",
  HOUSING: "housing",
  HEALTH: "health",
  PERSONAL_SOCIAL: "personal_social",
} as const;

// Skill levels for content classification
export const skillLevels = {
  FOUNDATIONAL: "foundational",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

/**
 * Helper functions for framework integration
 */

// Format SEL competency name for display
export function formatSELCompetency(competency: keyof typeof selCompetencies): string {
  // Convert snake_case to Title Case with spaces
  return competency
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Format Project LIFE domain for display
export function formatLIFEDomain(domain: keyof typeof lifeDomains): string {
  // Convert snake_case to Title Case with spaces
  return domain
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Get a color for SEL competency
export function getSELCompetencyColor(competency: keyof typeof selCompetencies): string {
  const colors = {
    SELF_AWARENESS: "bg-indigo-100 text-indigo-800",
    SELF_MANAGEMENT: "bg-blue-100 text-blue-800",
    SOCIAL_AWARENESS: "bg-purple-100 text-purple-800",
    RELATIONSHIP_SKILLS: "bg-pink-100 text-pink-800",
    RESPONSIBLE_DECISION_MAKING: "bg-violet-100 text-violet-800",
  };
  
  return colors[competency] || "bg-gray-100 text-gray-800";
}

// Get a color for Project LIFE domain
export function getLIFEDomainColor(domain: keyof typeof lifeDomains): string {
  const colors = {
    EDUCATION_TRAINING: "bg-emerald-100 text-emerald-800",
    EMPLOYMENT: "bg-cyan-100 text-cyan-800", 
    FINANCIAL_LITERACY: "bg-teal-100 text-teal-800",
    HOUSING: "bg-amber-100 text-amber-800",
    HEALTH: "bg-rose-100 text-rose-800",
    PERSONAL_SOCIAL: "bg-fuchsia-100 text-fuchsia-800",
  };
  
  return colors[domain] || "bg-gray-100 text-gray-800";
}