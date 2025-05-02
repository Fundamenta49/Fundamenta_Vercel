import { db } from "../../db";
import { addAgeVerificationFields } from "./add-age-verification-fields";

// A central function to run all migrations
export async function runMigrations() {
  console.log("Running database migrations...");
  
  try {
    // Run the age verification fields migration
    await addAgeVerificationFields();
    
    console.log("Database migrations completed successfully");
  } catch (error) {
    console.error("Database migrations failed:", error);
    throw error;
  }
}

// Export individual migrations for specific use cases
export {
  addAgeVerificationFields
};