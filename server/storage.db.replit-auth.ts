// Add this to the top of your storage.db.ts file, after other imports
import { UpsertUser } from "./storage.js";

// Then add this method to your DatabaseStorage class:

async upsertUser(userData: UpsertUser): Promise<User> {
  if (!userData.id) {
    throw new ValidationError("User ID is required for upsert operation");
  }

  try {
    // Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userData.id));

    if (existingUser) {
      // Update the existing user
      const [updatedUser] = await db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userData.id))
        .returning();
      
      return updatedUser;
    } else {
      // Create a new user
      const [newUser] = await db
        .insert(users)
        .values({
          ...userData,
          name: userData.firstName || "User", // Default name based on firstName
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      
      return newUser;
    }
  } catch (error) {
    throw new Error(`Failed to upsert user: ${error.message}`);
  }
}