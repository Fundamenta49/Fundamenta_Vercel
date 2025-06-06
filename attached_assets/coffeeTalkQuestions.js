const questions = [
  {
    "questionId": "Q1",
    "category": "wellbeing",
    "text": "Have you felt genuinely happy or in good spirits lately?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "At no time",
        "description": "You didn\u2019t experience this at all",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Some of the time",
        "description": "You felt this occasionally",
        "severity": "low"
      },
      {
        "value": 2,
        "label": "Less than half the time",
        "description": "You felt this sometimes",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "More than half the time",
        "description": "You felt this often",
        "severity": "moderate"
      },
      {
        "value": 4,
        "label": "Most of the time",
        "description": "You felt this regularly",
        "severity": "low"
      },
      {
        "value": 5,
        "label": "All of the time",
        "description": "You felt this nearly every day",
        "severity": "none"
      }
    ],
    "displayFormat": {
      "prefix": "What\u2019s been going well lately?",
      "style": "calm-blue",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q2",
    "category": "wellbeing",
    "text": "Have you had moments where you felt peaceful or at ease?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "At no time",
        "description": "You didn\u2019t experience this at all",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Some of the time",
        "description": "You felt this occasionally",
        "severity": "low"
      },
      {
        "value": 2,
        "label": "Less than half the time",
        "description": "You felt this sometimes",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "More than half the time",
        "description": "You felt this often",
        "severity": "moderate"
      },
      {
        "value": 4,
        "label": "Most of the time",
        "description": "You felt this regularly",
        "severity": "low"
      },
      {
        "value": 5,
        "label": "All of the time",
        "description": "You felt this nearly every day",
        "severity": "none"
      }
    ],
    "displayFormat": {
      "prefix": "What\u2019s been going well lately?",
      "style": "calm-blue",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q3",
    "category": "wellbeing",
    "text": "Have you felt energized or ready to take on the day?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "At no time",
        "description": "You didn\u2019t experience this at all",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Some of the time",
        "description": "You felt this occasionally",
        "severity": "low"
      },
      {
        "value": 2,
        "label": "Less than half the time",
        "description": "You felt this sometimes",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "More than half the time",
        "description": "You felt this often",
        "severity": "moderate"
      },
      {
        "value": 4,
        "label": "Most of the time",
        "description": "You felt this regularly",
        "severity": "low"
      },
      {
        "value": 5,
        "label": "All of the time",
        "description": "You felt this nearly every day",
        "severity": "none"
      }
    ],
    "displayFormat": {
      "prefix": "What\u2019s been going well lately?",
      "style": "calm-blue",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q4",
    "category": "wellbeing",
    "text": "Have you been waking up feeling recharged and rested?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "At no time",
        "description": "You didn\u2019t experience this at all",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Some of the time",
        "description": "You felt this occasionally",
        "severity": "low"
      },
      {
        "value": 2,
        "label": "Less than half the time",
        "description": "You felt this sometimes",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "More than half the time",
        "description": "You felt this often",
        "severity": "moderate"
      },
      {
        "value": 4,
        "label": "Most of the time",
        "description": "You felt this regularly",
        "severity": "low"
      },
      {
        "value": 5,
        "label": "All of the time",
        "description": "You felt this nearly every day",
        "severity": "none"
      }
    ],
    "displayFormat": {
      "prefix": "What\u2019s been going well lately?",
      "style": "calm-blue",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q5",
    "category": "wellbeing",
    "text": "Have you had things in your day that made you curious or excited?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "At no time",
        "description": "You didn\u2019t experience this at all",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Some of the time",
        "description": "You felt this occasionally",
        "severity": "low"
      },
      {
        "value": 2,
        "label": "Less than half the time",
        "description": "You felt this sometimes",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "More than half the time",
        "description": "You felt this often",
        "severity": "moderate"
      },
      {
        "value": 4,
        "label": "Most of the time",
        "description": "You felt this regularly",
        "severity": "low"
      },
      {
        "value": 5,
        "label": "All of the time",
        "description": "You felt this nearly every day",
        "severity": "none"
      }
    ],
    "displayFormat": {
      "prefix": "What\u2019s been going well lately?",
      "style": "calm-blue",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q6",
    "category": "depression",
    "text": "Have you found yourself not enjoying the things you usually care about?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "Not at all",
        "description": "This hasn\u2019t been an issue",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Several days",
        "description": "You\u2019ve felt this occasionally",
        "severity": "mild"
      },
      {
        "value": 2,
        "label": "More than half the days",
        "description": "You\u2019ve felt this often",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "Nearly every day",
        "description": "You\u2019ve felt this most days",
        "severity": "severe"
      }
    ],
    "displayFormat": {
      "prefix": "Let\u2019s check in on your emotional state...",
      "style": "neutral-gray",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q7",
    "category": "depression",
    "text": "Have you been feeling low or emotionally stuck lately?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "Not at all",
        "description": "This hasn\u2019t been an issue",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Several days",
        "description": "You\u2019ve felt this occasionally",
        "severity": "mild"
      },
      {
        "value": 2,
        "label": "More than half the days",
        "description": "You\u2019ve felt this often",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "Nearly every day",
        "description": "You\u2019ve felt this most days",
        "severity": "severe"
      }
    ],
    "displayFormat": {
      "prefix": "Let\u2019s check in on your emotional state...",
      "style": "neutral-gray",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q8",
    "category": "depression",
    "text": "Have you been having trouble sleeping or sleeping way more than usual?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "Not at all",
        "description": "This hasn\u2019t been an issue",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Several days",
        "description": "You\u2019ve felt this occasionally",
        "severity": "mild"
      },
      {
        "value": 2,
        "label": "More than half the days",
        "description": "You\u2019ve felt this often",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "Nearly every day",
        "description": "You\u2019ve felt this most days",
        "severity": "severe"
      }
    ],
    "displayFormat": {
      "prefix": "Let\u2019s check in on your emotional state...",
      "style": "neutral-gray",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q9",
    "category": "depression",
    "text": "Have you been feeling drained or low-energy lately?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "Not at all",
        "description": "This hasn\u2019t been an issue",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Several days",
        "description": "You\u2019ve felt this occasionally",
        "severity": "mild"
      },
      {
        "value": 2,
        "label": "More than half the days",
        "description": "You\u2019ve felt this often",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "Nearly every day",
        "description": "You\u2019ve felt this most days",
        "severity": "severe"
      }
    ],
    "displayFormat": {
      "prefix": "Let\u2019s check in on your emotional state...",
      "style": "neutral-gray",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q10",
    "category": "depression",
    "text": "Have you noticed changes in your appetite, like eating too little or too much?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "Not at all",
        "description": "This hasn\u2019t been an issue",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Several days",
        "description": "You\u2019ve felt this occasionally",
        "severity": "mild"
      },
      {
        "value": 2,
        "label": "More than half the days",
        "description": "You\u2019ve felt this often",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "Nearly every day",
        "description": "You\u2019ve felt this most days",
        "severity": "severe"
      }
    ],
    "displayFormat": {
      "prefix": "Let\u2019s check in on your emotional state...",
      "style": "neutral-gray",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q11",
    "category": "depression",
    "text": "Have you been feeling down on yourself or struggling with self-worth?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "Not at all",
        "description": "This hasn\u2019t been an issue",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Several days",
        "description": "You\u2019ve felt this occasionally",
        "severity": "mild"
      },
      {
        "value": 2,
        "label": "More than half the days",
        "description": "You\u2019ve felt this often",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "Nearly every day",
        "description": "You\u2019ve felt this most days",
        "severity": "severe"
      }
    ],
    "displayFormat": {
      "prefix": "Let\u2019s check in on your emotional state...",
      "style": "neutral-gray",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q12",
    "category": "depression",
    "text": "Have you had a hard time focusing on simple things, like reading or watching something?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "Not at all",
        "description": "This hasn\u2019t been an issue",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Several days",
        "description": "You\u2019ve felt this occasionally",
        "severity": "mild"
      },
      {
        "value": 2,
        "label": "More than half the days",
        "description": "You\u2019ve felt this often",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "Nearly every day",
        "description": "You\u2019ve felt this most days",
        "severity": "severe"
      }
    ],
    "displayFormat": {
      "prefix": "Let\u2019s check in on your emotional state...",
      "style": "neutral-gray",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q13",
    "category": "depression",
    "text": "Have you felt noticeably slowed down\u2014or super restless and unable to sit still?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "Not at all",
        "description": "This hasn\u2019t been an issue",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Several days",
        "description": "You\u2019ve felt this occasionally",
        "severity": "mild"
      },
      {
        "value": 2,
        "label": "More than half the days",
        "description": "You\u2019ve felt this often",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "Nearly every day",
        "description": "You\u2019ve felt this most days",
        "severity": "severe"
      }
    ],
    "displayFormat": {
      "prefix": "Let\u2019s check in on your emotional state...",
      "style": "neutral-gray",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q14",
    "category": "depression",
    "text": "Have dark thoughts about hurting yourself or feeling like giving up shown up recently?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "Not at all",
        "description": "This hasn\u2019t been an issue",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Several days",
        "description": "You\u2019ve felt this occasionally",
        "severity": "mild"
      },
      {
        "value": 2,
        "label": "More than half the days",
        "description": "You\u2019ve felt this often",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "Nearly every day",
        "description": "You\u2019ve felt this most days",
        "severity": "severe"
      }
    ],
    "displayFormat": {
      "prefix": "Let\u2019s check in on your emotional state...",
      "style": "neutral-gray",
      "showAlert": true,
      "alertContent": "If you\u2019re experiencing these thoughts, please reach out to someone you trust or a mental health professional."
    }
  },
  {
    "questionId": "Q15",
    "category": "anxiety",
    "text": "Have you felt nervous or like something\u2019s been buzzing under the surface?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "Not at all",
        "description": "This hasn\u2019t been an issue",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Several days",
        "description": "You\u2019ve felt this occasionally",
        "severity": "mild"
      },
      {
        "value": 2,
        "label": "More than half the days",
        "description": "You\u2019ve felt this often",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "Nearly every day",
        "description": "You\u2019ve felt this most days",
        "severity": "severe"
      }
    ],
    "displayFormat": {
      "prefix": "Let\u2019s explore how stress or worry may be showing up...",
      "style": "soft-orange",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q16",
    "category": "anxiety",
    "text": "Have your worries been hard to quiet or control lately?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "Not at all",
        "description": "This hasn\u2019t been an issue",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Several days",
        "description": "You\u2019ve felt this occasionally",
        "severity": "mild"
      },
      {
        "value": 2,
        "label": "More than half the days",
        "description": "You\u2019ve felt this often",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "Nearly every day",
        "description": "You\u2019ve felt this most days",
        "severity": "severe"
      }
    ],
    "displayFormat": {
      "prefix": "Let\u2019s explore how stress or worry may be showing up...",
      "style": "soft-orange",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q17",
    "category": "anxiety",
    "text": "Have you caught yourself worrying about a bunch of different things all at once?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "Not at all",
        "description": "This hasn\u2019t been an issue",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Several days",
        "description": "You\u2019ve felt this occasionally",
        "severity": "mild"
      },
      {
        "value": 2,
        "label": "More than half the days",
        "description": "You\u2019ve felt this often",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "Nearly every day",
        "description": "You\u2019ve felt this most days",
        "severity": "severe"
      }
    ],
    "displayFormat": {
      "prefix": "Let\u2019s explore how stress or worry may be showing up...",
      "style": "soft-orange",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q18",
    "category": "anxiety",
    "text": "Have you found it tough to fully relax or slow your mind down?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "Not at all",
        "description": "This hasn\u2019t been an issue",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Several days",
        "description": "You\u2019ve felt this occasionally",
        "severity": "mild"
      },
      {
        "value": 2,
        "label": "More than half the days",
        "description": "You\u2019ve felt this often",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "Nearly every day",
        "description": "You\u2019ve felt this most days",
        "severity": "severe"
      }
    ],
    "displayFormat": {
      "prefix": "Let\u2019s explore how stress or worry may be showing up...",
      "style": "soft-orange",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q19",
    "category": "anxiety",
    "text": "Have you felt so restless or jumpy that staying still is hard?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "Not at all",
        "description": "This hasn\u2019t been an issue",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Several days",
        "description": "You\u2019ve felt this occasionally",
        "severity": "mild"
      },
      {
        "value": 2,
        "label": "More than half the days",
        "description": "You\u2019ve felt this often",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "Nearly every day",
        "description": "You\u2019ve felt this most days",
        "severity": "severe"
      }
    ],
    "displayFormat": {
      "prefix": "Let\u2019s explore how stress or worry may be showing up...",
      "style": "soft-orange",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q20",
    "category": "anxiety",
    "text": "Have you felt extra irritable or like little things are setting you off?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "Not at all",
        "description": "This hasn\u2019t been an issue",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Several days",
        "description": "You\u2019ve felt this occasionally",
        "severity": "mild"
      },
      {
        "value": 2,
        "label": "More than half the days",
        "description": "You\u2019ve felt this often",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "Nearly every day",
        "description": "You\u2019ve felt this most days",
        "severity": "severe"
      }
    ],
    "displayFormat": {
      "prefix": "Let\u2019s explore how stress or worry may be showing up...",
      "style": "soft-orange",
      "showAlert": false,
      "alertContent": ""
    }
  },
  {
    "questionId": "Q21",
    "category": "anxiety",
    "text": "Have you had a sense that something bad might happen, even without a clear reason?",
    "timeFrame": "The past two weeks",
    "responseOptions": [
      {
        "value": 0,
        "label": "Not at all",
        "description": "This hasn\u2019t been an issue",
        "severity": "none"
      },
      {
        "value": 1,
        "label": "Several days",
        "description": "You\u2019ve felt this occasionally",
        "severity": "mild"
      },
      {
        "value": 2,
        "label": "More than half the days",
        "description": "You\u2019ve felt this often",
        "severity": "moderate"
      },
      {
        "value": 3,
        "label": "Nearly every day",
        "description": "You\u2019ve felt this most days",
        "severity": "severe"
      }
    ],
    "displayFormat": {
      "prefix": "Let\u2019s explore how stress or worry may be showing up...",
      "style": "soft-orange",
      "showAlert": false,
      "alertContent": ""
    }
  }
];