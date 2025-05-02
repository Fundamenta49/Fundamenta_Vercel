/**
 * Database migration for adding legal compliance tables 
 * and updating the user table to support Terms of Service and data privacy
 */
import { pool } from '../../db';

export async function runLegalComplianceMigrations() {
  console.log('Starting legal compliance migrations...');
  
  try {
    // Add fields to users table for Terms of Service
    await addFieldsToUsersTable();
    
    // Create Terms of Service versions table
    await createTermsOfServiceTable();
    
    // Create Data Export Requests table
    await createDataExportRequestsTable();
    
    // Create Account Deletion Requests table
    await createAccountDeletionRequestsTable();
    
    console.log('Legal compliance migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error during legal compliance migrations:', error);
    return false;
  }
}

async function addFieldsToUsersTable() {
  console.log('Adding Terms of Service fields to users table...');
  
  try {
    // Check if columns already exist
    const checkResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'tos_accepted'
    `);
    
    if (checkResult.rows.length === 0) {
      // Add the terms of service columns
      await pool.query(`
        ALTER TABLE users
        ADD COLUMN tos_accepted BOOLEAN DEFAULT FALSE,
        ADD COLUMN tos_version INTEGER,
        ADD COLUMN tos_accepted_at TIMESTAMP,
        ADD COLUMN data_export_requested BOOLEAN DEFAULT FALSE,
        ADD COLUMN data_export_requested_at TIMESTAMP,
        ADD COLUMN account_deletion_requested BOOLEAN DEFAULT FALSE,
        ADD COLUMN account_deletion_requested_at TIMESTAMP
      `);
      console.log('Terms of Service fields added to users table successfully');
    } else {
      console.log('Terms of Service fields already exist in users table');
    }
  } catch (error) {
    console.error('Error adding fields to users table:', error);
    throw error;
  }
}

async function createTermsOfServiceTable() {
  console.log('Creating terms_of_service_versions table...');
  
  try {
    // Check if table already exists
    const checkResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'terms_of_service_versions'
    `);
    
    if (checkResult.rows.length === 0) {
      await pool.query(`
        CREATE TABLE terms_of_service_versions (
          id SERIAL PRIMARY KEY,
          version INTEGER NOT NULL UNIQUE,
          content TEXT NOT NULL,
          effective_date TIMESTAMP NOT NULL DEFAULT NOW(),
          is_current BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `);
      console.log('terms_of_service_versions table created successfully');
    } else {
      console.log('terms_of_service_versions table already exists');
    }
  } catch (error) {
    console.error('Error creating terms_of_service_versions table:', error);
    throw error;
  }
}

async function createDataExportRequestsTable() {
  console.log('Creating data_export_requests table...');
  
  try {
    // Check if table already exists
    const checkResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'data_export_requests'
    `);
    
    if (checkResult.rows.length === 0) {
      await pool.query(`
        CREATE TABLE data_export_requests (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          status TEXT NOT NULL DEFAULT 'pending',
          format TEXT NOT NULL DEFAULT 'json',
          requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
          completed_at TIMESTAMP,
          download_url TEXT,
          expires_at TIMESTAMP,
          meta_data JSONB DEFAULT '{}'
        )
      `);
      console.log('data_export_requests table created successfully');
    } else {
      console.log('data_export_requests table already exists');
    }
  } catch (error) {
    console.error('Error creating data_export_requests table:', error);
    throw error;
  }
}

async function createAccountDeletionRequestsTable() {
  console.log('Creating account_deletion_requests table...');
  
  try {
    // Check if table already exists
    const checkResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'account_deletion_requests'
    `);
    
    if (checkResult.rows.length === 0) {
      await pool.query(`
        CREATE TABLE account_deletion_requests (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          status TEXT NOT NULL DEFAULT 'pending',
          reason TEXT,
          requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
          scheduled_for TIMESTAMP,
          completed_at TIMESTAMP,
          meta_data JSONB DEFAULT '{}'
        )
      `);
      console.log('account_deletion_requests table created successfully');
    } else {
      console.log('account_deletion_requests table already exists');
    }
  } catch (error) {
    console.error('Error creating account_deletion_requests table:', error);
    throw error;
  }
}