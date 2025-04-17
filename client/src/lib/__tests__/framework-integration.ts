/**
 * Framework Integration Tests
 * 
 * This file contains tests for the SEL and Project LIFE framework integration.
 * It validates that our data structures and helper functions are working correctly.
 */

import { 
  selCompetencies, 
  lifeDomains, 
  skillLevels,
  formatSELCompetency,
  formatLIFEDomain,
  getSELCompetencyColor,
  getLIFEDomainColor
} from '../framework-constants';

import {
  SELCompetency,
  LIFEDomain,
  SkillLevel,
  LearningModule,
  calculateFrameworkProgress,
  identifyFrameworkGaps
} from '../learning-progress';

/**
 * Test the framework constants
 */
function testFrameworkConstants() {
  console.log('Testing framework constants...');
  
  // Test SEL competencies
  const selKeys = Object.keys(selCompetencies);
  console.assert(selKeys.length === 5, 'Should have 5 SEL competencies');
  console.assert(selKeys.includes('SELF_AWARENESS'), 'Should include SELF_AWARENESS');
  console.assert(selKeys.includes('SELF_MANAGEMENT'), 'Should include SELF_MANAGEMENT');
  console.assert(selKeys.includes('SOCIAL_AWARENESS'), 'Should include SOCIAL_AWARENESS');
  console.assert(selKeys.includes('RELATIONSHIP_SKILLS'), 'Should include RELATIONSHIP_SKILLS');
  console.assert(selKeys.includes('RESPONSIBLE_DECISION_MAKING'), 'Should include RESPONSIBLE_DECISION_MAKING');
  
  // Test Project LIFE domains
  const lifeKeys = Object.keys(lifeDomains);
  console.assert(lifeKeys.length === 6, 'Should have 6 LIFE domains');
  console.assert(lifeKeys.includes('EDUCATION_TRAINING'), 'Should include EDUCATION_TRAINING');
  console.assert(lifeKeys.includes('EMPLOYMENT'), 'Should include EMPLOYMENT');
  console.assert(lifeKeys.includes('FINANCIAL_LITERACY'), 'Should include FINANCIAL_LITERACY');
  console.assert(lifeKeys.includes('HOUSING'), 'Should include HOUSING');
  console.assert(lifeKeys.includes('HEALTH'), 'Should include HEALTH');
  console.assert(lifeKeys.includes('PERSONAL_SOCIAL'), 'Should include PERSONAL_SOCIAL');
  
  // Test skill levels
  const skillKeys = Object.keys(skillLevels);
  console.assert(skillKeys.length === 3, 'Should have 3 skill levels');
  console.assert(skillKeys.includes('FOUNDATIONAL'), 'Should include FOUNDATIONAL');
  console.assert(skillKeys.includes('INTERMEDIATE'), 'Should include INTERMEDIATE');
  console.assert(skillKeys.includes('ADVANCED'), 'Should include ADVANCED');
  
  console.log('Framework constants test passed!');
}

/**
 * Test the formatter functions
 */
function testFormatterFunctions() {
  console.log('Testing formatter functions...');
  
  // Test SEL competency formatter
  console.assert(
    formatSELCompetency('SELF_AWARENESS') === 'Self Awareness',
    'Should format SELF_AWARENESS correctly'
  );
  console.assert(
    formatSELCompetency('RESPONSIBLE_DECISION_MAKING') === 'Responsible Decision Making',
    'Should format RESPONSIBLE_DECISION_MAKING correctly'
  );
  
  // Test LIFE domain formatter
  console.assert(
    formatLIFEDomain('FINANCIAL_LITERACY') === 'Financial Literacy',
    'Should format FINANCIAL_LITERACY correctly'
  );
  console.assert(
    formatLIFEDomain('PERSONAL_SOCIAL') === 'Personal Social',
    'Should format PERSONAL_SOCIAL correctly'
  );
  
  // Test color functions
  console.assert(
    getSELCompetencyColor('SELF_AWARENESS').includes('indigo'),
    'SEL color should include the correct color name'
  );
  console.assert(
    getLIFEDomainColor('FINANCIAL_LITERACY').includes('teal'),
    'LIFE domain color should include the correct color name'
  );
  
  console.log('Formatter functions test passed!');
}

/**
 * Test framework progress calculation
 */
function testFrameworkProgress() {
  console.log('Testing framework progress calculation...');
  
  // Create test modules
  const allModules: LearningModule[] = [
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
    },
    {
      id: 'module3',
      title: 'Module 3',
      path: '/module3',
      complete: false,
      selCompetencies: ['RESPONSIBLE_DECISION_MAKING'],
      lifeDomains: ['EDUCATION_TRAINING', 'HEALTH'],
      skillLevel: 'ADVANCED'
    },
    {
      id: 'module4',
      title: 'Module 4',
      path: '/module4',
      complete: false,
      selCompetencies: ['SELF_AWARENESS'],
      lifeDomains: ['HOUSING', 'PERSONAL_SOCIAL'],
      skillLevel: 'INTERMEDIATE'
    }
  ];
  
  // Completed modules
  const completedModules: LearningModule[] = [
    { ...allModules[0], complete: true },
    { ...allModules[3], complete: true }
  ];
  
  // Calculate progress
  const progress = calculateFrameworkProgress(completedModules, allModules);
  
  // Test SEL competencies progress
  console.assert(
    progress.sel.SELF_AWARENESS === 100, 
    'SELF_AWARENESS should be 100% complete'
  );
  console.assert(
    progress.sel.SELF_MANAGEMENT === 100, 
    'SELF_MANAGEMENT should be 100% complete'
  );
  console.assert(
    progress.sel.SOCIAL_AWARENESS === 0, 
    'SOCIAL_AWARENESS should be 0% complete'
  );
  console.assert(
    progress.sel.RELATIONSHIP_SKILLS === 0, 
    'RELATIONSHIP_SKILLS should be 0% complete'
  );
  console.assert(
    progress.sel.RESPONSIBLE_DECISION_MAKING === 0, 
    'RESPONSIBLE_DECISION_MAKING should be 0% complete'
  );
  
  // Test LIFE domains progress
  console.assert(
    progress.projectLife.FINANCIAL_LITERACY === 100, 
    'FINANCIAL_LITERACY should be 100% complete'
  );
  console.assert(
    progress.projectLife.HOUSING === 100, 
    'HOUSING should be 100% complete'
  );
  console.assert(
    progress.projectLife.PERSONAL_SOCIAL === 100, 
    'PERSONAL_SOCIAL should be 100% complete'
  );
  console.assert(
    progress.projectLife.EMPLOYMENT === 0, 
    'EMPLOYMENT should be 0% complete'
  );
  console.assert(
    progress.projectLife.EDUCATION_TRAINING === 0, 
    'EDUCATION_TRAINING should be 0% complete'
  );
  console.assert(
    progress.projectLife.HEALTH === 0, 
    'HEALTH should be 0% complete'
  );
  
  console.log('Framework progress calculation test passed!');
}

/**
 * Test gap identification
 */
function testGapIdentification() {
  console.log('Testing gap identification...');
  
  // Create test modules
  const allModules: LearningModule[] = [
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
    },
    {
      id: 'module3',
      title: 'Module 3',
      path: '/module3',
      complete: false,
      selCompetencies: ['RESPONSIBLE_DECISION_MAKING'],
      lifeDomains: ['EDUCATION_TRAINING', 'HEALTH'],
      skillLevel: 'ADVANCED'
    },
    {
      id: 'module4',
      title: 'Module 4',
      path: '/module4',
      complete: false,
      selCompetencies: ['SELF_AWARENESS'],
      lifeDomains: ['HOUSING', 'PERSONAL_SOCIAL'],
      skillLevel: 'INTERMEDIATE'
    }
  ];
  
  // Completed modules (only completed the Self-Awareness module)
  const completedModules: LearningModule[] = [
    { ...allModules[0], complete: true }
  ];
  
  // Identify gaps
  const gaps = identifyFrameworkGaps(completedModules, allModules);
  
  // We should identify SOCIAL_AWARENESS, RELATIONSHIP_SKILLS, RESPONSIBLE_DECISION_MAKING as gaps
  // but the function returns only the top 2 gaps
  console.assert(
    gaps.selGaps.length === 2,
    'Should identify 2 SEL competency gaps'
  );
  
  // We should identify EMPLOYMENT, EDUCATION_TRAINING, HEALTH, HOUSING, PERSONAL_SOCIAL as gaps
  // but the function returns only the top 2 gaps
  console.assert(
    gaps.lifeGaps.length === 2,
    'Should identify 2 LIFE domain gaps'
  );
  
  console.log('Gap identification test passed!');
}

/**
 * Run all tests
 */
export function runFrameworkTests() {
  console.log('Running framework integration tests...');
  
  try {
    testFrameworkConstants();
    testFormatterFunctions();
    testFrameworkProgress();
    testGapIdentification();
    
    console.log('All framework integration tests passed!');
    return true;
  } catch (error) {
    console.error('Framework integration tests failed:', error);
    return false;
  }
}