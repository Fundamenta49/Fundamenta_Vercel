export type EmergencyResourceCategory = 
  'global' | 
  'mental_health' | 
  'domestic_violence' | 
  'substance_abuse' | 
  'natural_disaster' | 
  'medical';

export interface EmergencyResource {
  name: string;
  contact: string;
  hours?: string;
  description: string;
  website?: string;
}

export const emergencyResources: Record<EmergencyResourceCategory, EmergencyResource[]> = {
  global: [
    {
      name: "Emergency Services",
      contact: "911",
      hours: "24/7",
      description: "For immediate life-threatening emergencies"
    }
  ],
  
  mental_health: [
    {
      name: "National Suicide Prevention Lifeline",
      contact: "988 or 1-800-273-8255",
      hours: "24/7",
      description: "Free and confidential support for people in distress",
      website: "https://suicidepreventionlifeline.org"
    },
    {
      name: "Crisis Text Line",
      contact: "Text HOME to 741741",
      hours: "24/7",
      description: "Free crisis counseling via text message",
      website: "https://www.crisistextline.org"
    },
    {
      name: "SAMHSA's National Helpline",
      contact: "1-800-662-4357",
      hours: "24/7",
      description: "Treatment referral and information service for mental health and substance use disorders",
      website: "https://www.samhsa.gov/find-help/national-helpline"
    }
  ],
  
  domestic_violence: [
    {
      name: "National Domestic Violence Hotline",
      contact: "1-800-799-7233 or text START to 88788",
      hours: "24/7",
      description: "Support, crisis intervention, and referral service for domestic violence",
      website: "https://www.thehotline.org"
    },
    {
      name: "National Sexual Assault Hotline",
      contact: "1-800-656-4673",
      hours: "24/7",
      description: "Free and confidential support for sexual assault survivors",
      website: "https://www.rainn.org"
    }
  ],
  
  substance_abuse: [
    {
      name: "SAMHSA's National Helpline",
      contact: "1-800-662-4357",
      hours: "24/7",
      description: "Treatment referral and information for substance use disorders",
      website: "https://www.samhsa.gov/find-help/national-helpline"
    },
    {
      name: "Alcohol Hotline",
      contact: "1-800-331-2900",
      hours: "24/7",
      description: "Support for alcohol abuse and addiction",
      website: "https://www.alcohol.org/help"
    }
  ],
  
  natural_disaster: [
    {
      name: "FEMA Helpline",
      contact: "1-800-621-3362",
      description: "Disaster assistance for natural disasters",
      website: "https://www.fema.gov"
    },
    {
      name: "American Red Cross",
      contact: "1-800-733-2767",
      description: "Disaster relief and emergency assistance",
      website: "https://www.redcross.org"
    }
  ],
  
  medical: [
    {
      name: "Poison Control Center",
      contact: "1-800-222-1222",
      hours: "24/7",
      description: "Emergency information for poisoning incidents",
      website: "https://www.poison.org"
    },
    {
      name: "CDC Info",
      contact: "1-800-232-4636",
      description: "Health information and referrals from the Centers for Disease Control",
      website: "https://www.cdc.gov"
    }
  ]
};