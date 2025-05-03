/**
 * Schema Verification Tool for Engagement System
 * 
 * This script verifies that the schema definitions align with the database
 * implementation and storage methods by checking table structures and field names.
 * 
 * Run with: node verify-engagement-schema.js
 */

import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import chalk from 'chalk'; // For colored console output
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname equivalent for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tables to verify
const ENGAGEMENT_TABLES = [
  'user_engagement',
  'user_achievements',
  'user_activities'
];

// Connect to database (uses environment variables)
async function connectToDatabase() {
  // Check that we have a DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error(chalk.red('Missing DATABASE_URL environment variable'));
    console.error(chalk.yellow('This script needs to connect to the database to verify schema.'));
    process.exit(1);
  }

  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL 
  });
  
  try {
    // Test connection
    const result = await pool.query('SELECT NOW()');
    console.log(chalk.green('✓ Connected to database successfully'));
    return pool;
  } catch (err) {
    console.error(chalk.red(`Database connection error: ${err.message}`));
    process.exit(1);
  }
}

// Extract schema definitions from code
function extractSchemaFromCode() {
  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'shared', 'schema.ts');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Extract table definitions
    const tables = {};
    
    // Find the user_engagement table definition
    const userEngagementMatch = schemaContent.match(/export const userEngagement = pgTable\("user_engagement", \{([\s\S]*?)\}\);/);
    if (userEngagementMatch) {
      const fields = userEngagementMatch[1].trim().split('\n').map(line => {
        // Extract field name and type
        const match = line.trim().match(/([^:]+):\s*([^,]+),?/);
        if (match) {
          return { 
            name: match[1].trim(),
            codeDefinition: match[2].trim() 
          };
        }
        return null;
      }).filter(Boolean);
      
      tables.user_engagement = fields;
    }
    
    // Find the user_achievements table definition
    const achievementsMatch = schemaContent.match(/export const userAchievements = pgTable\("user_achievements", \{([\s\S]*?)\}\);/);
    if (achievementsMatch) {
      const fields = achievementsMatch[1].trim().split('\n').map(line => {
        // Extract field name and type
        const match = line.trim().match(/([^:]+):\s*([^,]+),?/);
        if (match) {
          return { 
            name: match[1].trim(),
            codeDefinition: match[2].trim() 
          };
        }
        return null;
      }).filter(Boolean);
      
      tables.user_achievements = fields;
    }
    
    // Find the user_activities table definition
    const activitiesMatch = schemaContent.match(/export const userActivities = pgTable\("user_activities", \{([\s\S]*?)\}\);/);
    if (activitiesMatch) {
      const fields = activitiesMatch[1].trim().split('\n').map(line => {
        // Extract field name and type
        const match = line.trim().match(/([^:]+):\s*([^,]+),?/);
        if (match) {
          return { 
            name: match[1].trim(),
            codeDefinition: match[2].trim() 
          };
        }
        return null;
      }).filter(Boolean);
      
      tables.user_activities = fields;
    }
    
    return tables;
  } catch (err) {
    console.error(chalk.red(`Error reading schema file: ${err.message}`));
    return {};
  }
}

// Get database table structure
async function getTableStructure(pool, tableName) {
  try {
    const query = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position;
    `;
    
    const result = await pool.query(query, [tableName]);
    
    return result.rows.map(row => ({
      name: row.column_name,
      type: row.data_type,
      nullable: row.is_nullable === 'YES'
    }));
  } catch (err) {
    console.error(chalk.red(`Error getting structure for table ${tableName}: ${err.message}`));
    return null;
  }
}

// Check if table exists
async function checkTableExists(pool, tableName) {
  try {
    const query = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = $1
      );
    `;
    
    const result = await pool.query(query, [tableName]);
    return result.rows[0].exists;
  } catch (err) {
    console.error(chalk.red(`Error checking if table ${tableName} exists: ${err.message}`));
    return false;
  }
}

// Verify implementation functions
async function verifyStorageImplementation() {
  try {
    // Read the storage file
    const storagePath = path.join(process.cwd(), 'server', 'storage.ts');
    const storageContent = fs.readFileSync(storagePath, 'utf8');
    
    // Define engagement functions to check
    const engagementFunctions = [
      'getUserEngagement',
      'createUserEngagement',
      'updateUserEngagement',
      'checkInUser',
      'getStreak',
      'checkStreakAchievements',
      'recordUserActivity',
      'getUserActivities',
      'getUserAchievements',
      'addUserAchievement'
    ];
    
    // Check each function
    const results = {};
    
    for (const funcName of engagementFunctions) {
      const functionRegex = new RegExp(`async ${funcName}\\s*\\([^)]*\\)\\s*:\\s*[^{]*{`, 'i');
      const exists = functionRegex.test(storageContent);
      
      results[funcName] = exists;
    }
    
    return results;
  } catch (err) {
    console.error(chalk.red(`Error verifying storage implementation: ${err.message}`));
    return {};
  }
}

// Main function
async function main() {
  console.log(chalk.blue.bold('🔍 Verifying Engagement Schema'));
  console.log(chalk.blue('===============================\n'));
  
  // Extract schema definitions from code
  console.log(chalk.cyan('Extracting schema definitions from code...'));
  const codeSchema = extractSchemaFromCode();
  
  for (const [tableName, fields] of Object.entries(codeSchema)) {
    console.log(chalk.green(`✓ Found schema definition for ${tableName} with ${fields.length} fields`));
  }
  console.log('');
  
  // Connect to database
  console.log(chalk.cyan('Connecting to database...'));
  const pool = await connectToDatabase();
  console.log('');
  
  // Verify tables exist
  console.log(chalk.cyan('Verifying tables exist in database...'));
  
  for (const tableName of ENGAGEMENT_TABLES) {
    const exists = await checkTableExists(pool, tableName);
    
    if (exists) {
      console.log(chalk.green(`✓ Table ${tableName} exists`));
      
      // Get db structure and compare to code
      const dbStructure = await getTableStructure(pool, tableName);
      
      if (dbStructure && codeSchema[tableName]) {
        // Convert code schema field names to snake_case for comparison
        const codeFieldNames = codeSchema[tableName].map(field => {
          // This is a simple camelCase to snake_case conversion
          // It only works for field names without complex conversions
          return field.name.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        });
        
        const dbFieldNames = dbStructure.map(field => field.name);
        
        // Compare field counts
        if (codeFieldNames.length !== dbFieldNames.length) {
          console.log(chalk.yellow(`⚠️  Field count mismatch for ${tableName}:`));
          console.log(chalk.yellow(`   Code schema: ${codeFieldNames.length} fields`));
          console.log(chalk.yellow(`   Database: ${dbFieldNames.length} fields`));
        }
        
        // Find missing fields
        const missingInDb = codeFieldNames.filter(field => !dbFieldNames.includes(field));
        const missingInCode = dbFieldNames.filter(field => !codeFieldNames.includes(field));
        
        if (missingInDb.length > 0) {
          console.log(chalk.red(`✗ Fields defined in code but missing in database for ${tableName}:`));
          missingInDb.forEach(field => console.log(chalk.red(`  - ${field}`)));
        }
        
        if (missingInCode.length > 0) {
          console.log(chalk.yellow(`⚠️  Fields in database but not defined in code for ${tableName}:`));
          missingInCode.forEach(field => console.log(chalk.yellow(`  - ${field}`)));
        }
        
        if (missingInDb.length === 0 && missingInCode.length === 0) {
          console.log(chalk.green(`✓ Field names in code match database for ${tableName}`));
        }
      }
    } else {
      console.log(chalk.red(`✗ Table ${tableName} does not exist in database`));
    }
  }
  console.log('');
  
  // Verify storage implementation
  console.log(chalk.cyan('Verifying storage implementation...'));
  const implResults = await verifyStorageImplementation();
  
  const missingFunctions = [];
  
  for (const [funcName, exists] of Object.entries(implResults)) {
    if (exists) {
      console.log(chalk.green(`✓ Function ${funcName} is implemented`));
    } else {
      console.log(chalk.red(`✗ Function ${funcName} is NOT implemented`));
      missingFunctions.push(funcName);
    }
  }
  console.log('');
  
  // Summary
  console.log(chalk.blue.bold('📊 Verification Summary:'));
  
  if (Object.keys(codeSchema).length === ENGAGEMENT_TABLES.length && missingFunctions.length === 0) {
    console.log(chalk.green.bold('✓ Schema verification successful!'));
    console.log(chalk.green('✓ All required tables are defined in code'));
    console.log(chalk.green('✓ All storage functions are implemented'));
  } else {
    console.log(chalk.yellow('⚠️  Schema verification completed with issues:'));
    
    if (Object.keys(codeSchema).length < ENGAGEMENT_TABLES.length) {
      console.log(chalk.yellow(`⚠️  Missing schema definitions for some tables`));
    }
    
    if (missingFunctions.length > 0) {
      console.log(chalk.yellow(`⚠️  Missing implementations for ${missingFunctions.length} functions`));
    }
  }
  
  // Close database connection
  await pool.end();
}

// Run the main function
main().catch(err => {
  console.error(chalk.red('Error:', err));
});