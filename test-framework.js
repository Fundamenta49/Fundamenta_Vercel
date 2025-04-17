// Simple test script for educational frameworks

// Import framework constants and utility functions
import { selCompetencies, lifeDomains, skillLevels, 
  formatSELCompetency, formatLIFEDomain, 
  getSELCompetencyColor, getLIFEDomainColor 
} from './client/src/lib/framework-constants.js';

import {
  calculateFrameworkProgress,
  identifyFrameworkGaps
} from './client/src/lib/learning-progress.js';

// Testing framework constants
console.log('===== TESTING FRAMEWORK CONSTANTS =====');
console.log('SEL Competencies count:', Object.keys(selCompetencies).length);
console.log('Expected: 5');
console.log('LIFE Domains count:', Object.keys(lifeDomains).length);
console.log('Expected: 6');
console.log('Skill Levels count:', Object.keys(skillLevels).length);
console.log('Expected: 3');

// Testing formatters
console.log('\n===== TESTING FORMATTERS =====');
console.log('Format SEL SELF_AWARENESS:', formatSELCompetency('SELF_AWARENESS'));
console.log('Expected: Self Awareness');
console.log('Format LIFE FINANCIAL_LITERACY:', formatLIFEDomain('FINANCIAL_LITERACY'));
console.log('Expected: Financial Literacy');

// Testing color functions
console.log('\n===== TESTING COLOR FUNCTIONS =====');
console.log('Color for SELF_AWARENESS:', getSELCompetencyColor('SELF_AWARENESS').includes('indigo'));
console.log('Expected: true');
console.log('Color for FINANCIAL_LITERACY:', getLIFEDomainColor('FINANCIAL_LITERACY').includes('teal'));
console.log('Expected: true');

// Test data for progress calculation
const testModules = [
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

const completedModules = [
  { ...testModules[0], complete: true }
];

// Testing progress calculation
console.log('\n===== TESTING PROGRESS CALCULATION =====');
const progress = calculateFrameworkProgress(completedModules, testModules);
console.log('SELF_AWARENESS progress:', progress.sel.SELF_AWARENESS);
console.log('Expected: 100');
console.log('FINANCIAL_LITERACY progress:', progress.projectLife.FINANCIAL_LITERACY);
console.log('Expected: 100');
console.log('EMPLOYMENT progress:', progress.projectLife.EMPLOYMENT);
console.log('Expected: 0');

// Testing gap identification
console.log('\n===== TESTING GAP IDENTIFICATION =====');
const gaps = identifyFrameworkGaps(completedModules, testModules);
console.log('SEL gaps count:', gaps.selGaps.length);
console.log('Expected: 2');
console.log('LIFE gaps count:', gaps.lifeGaps.length);
console.log('Expected: 2');

console.log('\n===== ALL TESTS COMPLETE =====');