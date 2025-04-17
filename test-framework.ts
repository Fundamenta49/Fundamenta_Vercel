// Simple test script for educational frameworks

// Define types for our test
type SELCompetency = 'SELF_AWARENESS' | 'SELF_MANAGEMENT' | 'SOCIAL_AWARENESS' | 'RELATIONSHIP_SKILLS' | 'RESPONSIBLE_DECISION_MAKING';
type LIFEDomain = 'EDUCATION_TRAINING' | 'EMPLOYMENT' | 'FINANCIAL_LITERACY' | 'HOUSING' | 'HEALTH' | 'PERSONAL_SOCIAL';
type SkillLevel = 'FOUNDATIONAL' | 'INTERMEDIATE' | 'ADVANCED';

interface LearningModule {
  id: string;
  title: string;
  path: string;
  complete: boolean;
  selCompetencies?: SELCompetency[];
  lifeDomains?: LIFEDomain[];
  skillLevel?: SkillLevel;
}

interface FrameworkProgress {
  sel: Record<SELCompetency, number>;
  projectLife: Record<LIFEDomain, number>;
}

// Define and test framework constants
console.log('===== TESTING FRAMEWORK CONSTANTS =====');

const selCompetencies = {
  SELF_AWARENESS: "self_awareness",
  SELF_MANAGEMENT: "self_management",
  SOCIAL_AWARENESS: "social_awareness",
  RELATIONSHIP_SKILLS: "relationship_skills",
  RESPONSIBLE_DECISION_MAKING: "responsible_decision_making",
} as const;

const lifeDomains = {
  EDUCATION_TRAINING: "education_training",
  EMPLOYMENT: "employment", 
  FINANCIAL_LITERACY: "financial_literacy",
  HOUSING: "housing",
  HEALTH: "health",
  PERSONAL_SOCIAL: "personal_social",
} as const;

const skillLevels = {
  FOUNDATIONAL: "foundational",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

console.log('SEL Competencies count:', Object.keys(selCompetencies).length);
console.log('Expected: 5, Result:', Object.keys(selCompetencies).length === 5 ? 'PASS' : 'FAIL');

console.log('LIFE Domains count:', Object.keys(lifeDomains).length);
console.log('Expected: 6, Result:', Object.keys(lifeDomains).length === 6 ? 'PASS' : 'FAIL');

console.log('Skill Levels count:', Object.keys(skillLevels).length);
console.log('Expected: 3, Result:', Object.keys(skillLevels).length === 3 ? 'PASS' : 'FAIL');

// Testing formatters
console.log('\n===== TESTING FORMATTERS =====');

function formatSELCompetency(competency: SELCompetency): string {
  return competency
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatLIFEDomain(domain: LIFEDomain): string {
  return domain
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

console.log('Format SELF_AWARENESS:', formatSELCompetency('SELF_AWARENESS'));
console.log('Expected: Self Awareness, Result:', formatSELCompetency('SELF_AWARENESS') === 'Self Awareness' ? 'PASS' : 'FAIL');

console.log('Format FINANCIAL_LITERACY:', formatLIFEDomain('FINANCIAL_LITERACY'));
console.log('Expected: Financial Literacy, Result:', formatLIFEDomain('FINANCIAL_LITERACY') === 'Financial Literacy' ? 'PASS' : 'FAIL');

// Test data for progress calculation
const testModules: LearningModule[] = [
  {
    id: 'module1',
    title: 'Module 1',
    path: '/module1',
    complete: false,
    selCompetencies: ['SELF_AWARENESS', 'SELF_MANAGEMENT'],
    lifeDomains: ['FINANCIAL_LITERACY'],
    skillLevel: 'FOUNDATIONAL'
  },
  {
    id: 'module2',
    title: 'Module 2',
    path: '/module2',
    complete: false,
    selCompetencies: ['SOCIAL_AWARENESS', 'RELATIONSHIP_SKILLS'],
    lifeDomains: ['EMPLOYMENT'],
    skillLevel: 'INTERMEDIATE'
  }
];

const completedModules: LearningModule[] = [
  { ...testModules[0], complete: true }
];

// Testing progress calculation
console.log('\n===== TESTING PROGRESS CALCULATION =====');

function calculateFrameworkProgress(
  completedModules: LearningModule[],
  allModules: LearningModule[]
): FrameworkProgress {
  // Initialize coverage tracking objects
  const selModules: Record<SELCompetency, { total: number, completed: number }> = 
    {} as Record<SELCompetency, { total: number, completed: number }>;
    
  const lifeModules: Record<LIFEDomain, { total: number, completed: number }> = 
    {} as Record<LIFEDomain, { total: number, completed: number }>;
  
  // Initialize records for all competencies and domains
  Object.keys(selCompetencies).forEach(comp => {
    selModules[comp as SELCompetency] = { total: 0, completed: 0 };
  });
  
  Object.keys(lifeDomains).forEach(domain => {
    lifeModules[domain as LIFEDomain] = { total: 0, completed: 0 };
  });
  
  // Process all modules to count totals for each framework element
  allModules.forEach(module => {
    const isCompleted = completedModules.some(m => m.id === module.id);
    
    // Count SEL competencies
    module.selCompetencies?.forEach(comp => {
      selModules[comp].total++;
      if (isCompleted) {
        selModules[comp].completed++;
      }
    });
    
    // Count Project LIFE domains
    module.lifeDomains?.forEach(domain => {
      lifeModules[domain].total++;
      if (isCompleted) {
        lifeModules[domain].completed++;
      }
    });
  });
  
  // Convert to percentage values
  const selProgress = Object.entries(selModules).reduce((acc, [key, value]) => {
    acc[key as SELCompetency] = value.total > 0 
      ? Math.round((value.completed / value.total) * 100) 
      : 0;
    return acc;
  }, {} as Record<SELCompetency, number>);
  
  const projectLifeProgress = Object.entries(lifeModules).reduce((acc, [key, value]) => {
    acc[key as LIFEDomain] = value.total > 0 
      ? Math.round((value.completed / value.total) * 100) 
      : 0;
    return acc;
  }, {} as Record<LIFEDomain, number>);
  
  return {
    sel: selProgress,
    projectLife: projectLifeProgress
  };
}

const progress = calculateFrameworkProgress(completedModules, testModules);
console.log('SELF_AWARENESS progress:', progress.sel.SELF_AWARENESS);
console.log('Expected: 100, Result:', progress.sel.SELF_AWARENESS === 100 ? 'PASS' : 'FAIL');

console.log('FINANCIAL_LITERACY progress:', progress.projectLife.FINANCIAL_LITERACY);
console.log('Expected: 100, Result:', progress.projectLife.FINANCIAL_LITERACY === 100 ? 'PASS' : 'FAIL');

console.log('EMPLOYMENT progress:', progress.projectLife.EMPLOYMENT);
console.log('Expected: 0, Result:', progress.projectLife.EMPLOYMENT === 0 ? 'PASS' : 'FAIL');

// Testing gap identification
console.log('\n===== TESTING GAP IDENTIFICATION =====');

function identifyFrameworkGaps(
  completedModules: LearningModule[],
  allModules: LearningModule[]
): {
  selGaps: SELCompetency[],
  lifeGaps: LIFEDomain[]
} {
  // Track competency coverage
  const selCoverage: Record<SELCompetency, number> = {} as Record<SELCompetency, number>;
  const lifeCoverage: Record<LIFEDomain, number> = {} as Record<LIFEDomain, number>;
  
  // Initialize all competencies and domains with zero
  Object.keys(selCompetencies).forEach(key => {
    selCoverage[key as SELCompetency] = 0;
  });
  
  Object.keys(lifeDomains).forEach(key => {
    lifeCoverage[key as LIFEDomain] = 0;
  });
  
  // Count completed modules for each competency/domain
  completedModules.forEach(module => {
    module.selCompetencies?.forEach(comp => {
      selCoverage[comp]++;
    });
    
    module.lifeDomains?.forEach(domain => {
      lifeCoverage[domain]++;
    });
  });
  
  // Identify gaps (areas with lowest coverage)
  const selGaps = Object.entries(selCoverage)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 2)
    .map(([key]) => key as SELCompetency);
    
  const lifeGaps = Object.entries(lifeCoverage)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 2)
    .map(([key]) => key as LIFEDomain);
    
  return { selGaps, lifeGaps };
}

const gaps = identifyFrameworkGaps(completedModules, testModules);
console.log('SEL gaps count:', gaps.selGaps.length);
console.log('Expected: 2, Result:', gaps.selGaps.length === 2 ? 'PASS' : 'FAIL');

console.log('LIFE gaps count:', gaps.lifeGaps.length);
console.log('Expected: 2, Result:', gaps.lifeGaps.length === 2 ? 'PASS' : 'FAIL');

console.log('\n===== ALL TESTS COMPLETE =====');