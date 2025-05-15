# Fundamenta Code Standards

## Database and Storage Layer Standards

### 1. Error Handling

**Requirement:** All code that interacts with the database must implement proper error handling using custom error classes.

#### Custom Error Classes
```typescript
// Custom error classes for better error handling
class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
```

#### Try/Catch Pattern
```typescript
try {
  // Database operation
} catch (error) {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    throw error; // Re-throw domain-specific errors
  }
  throw new Error(`Failed to perform operation: ${error.message}`);
}
```

### 2. Input Validation

**Requirement:** All method parameters must be validated before any database operations.

#### ID Validation
```typescript
if (!Number.isInteger(id) || id <= 0) {
  throw new ValidationError(`Invalid ID: ${id}`);
}
```

#### String Content Validation
```typescript
if (!content?.trim()) {
  throw new ValidationError("Content cannot be empty");
}
```

#### Relationship Validation
```typescript
if (mentorId === studentId) {
  throw new ValidationError("Mentor and student IDs cannot be the same");
}
```

### 3. Entity Verification

**Requirement:** Before creating relationships between entities, verify that all referenced entities exist.

```typescript
// Verify entity exists before operation
const entityExists = await this.getEntity(entityId);
if (!entityExists) {
  throw new NotFoundError(`Entity ${entityId} not found`);
}
```

### 4. Database Transaction Usage

**Requirement:** Any operation that involves multiple database mutations must use a transaction.

```typescript
return await db.transaction(async (tx) => {
  // Step 1
  await tx.operation1(...);
  
  // Step 2
  await tx.operation2(...);
  
  return result;
});
```

### 5. Query Limits

**Requirement:** All queries that return multiple records must include a reasonable limit.

```typescript
return await db
  .select()
  .from(table)
  .where(eq(table.field, value))
  .limit(100); // Prevent excessive data fetching
```

### 6. Consistent Return Types

**Requirement:** Methods must return consistent types, with comprehensive null/undefined handling.

```typescript
// For single entity returns
return entity || undefined; // NOT null

// For checking if operation succeeded
return result.length > 0; // NOT Boolean(result)
```

### 7. Descriptive Error Messages

**Requirement:** Error messages must be descriptive and include context about the failure.

```typescript
throw new Error(`Failed to update user ${id}: ${error.message}`);
```

## Example Implementation

```typescript
async getUser(id: number): Promise<User | undefined> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new ValidationError(`Invalid userId: ${id}`);
  }

  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  } catch (error) {
    throw new Error(`Failed to fetch user ${id}: ${error.message}`);
  }
}
```

## Frontend Standards

### 1. Form Validation

**Requirement:** All forms must validate inputs before submission.

```typescript
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(13, "Must be at least 13 years old")
});
```

### 2. Loading States

**Requirement:** All asynchronous operations must show loading states.

```tsx
{isLoading ? (
  <Skeleton className="h-10 w-full" />
) : (
  <DataDisplay data={data} />
)}
```

### 3. Error Feedback

**Requirement:** All errors must be displayed to the user with actionable guidance.

```tsx
{error && (
  <Alert variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>
      {error.message || "An unexpected error occurred. Please try again."}
    </AlertDescription>
  </Alert>
)}
```

## API Route Standards

### 1. Request Validation

**Requirement:** All API routes must validate request data before processing.

```typescript
const schema = z.object({
  userId: z.number().int().positive(),
  content: z.string().min(1)
});

try {
  const validatedData = schema.parse(req.body);
  // Process valid data
} catch (error) {
  return res.status(400).json({ 
    error: "Validation failed", 
    details: error.errors 
  });
}
```

### 2. Proper Status Codes

**Requirement:** API responses must use appropriate HTTP status codes.

- 200: Success
- 201: Successfully created
- 400: Bad request (validation error)
- 401: Unauthorized (authentication required)
- 403: Forbidden (insufficient permissions)
- 404: Resource not found
- 500: Server error

### 3. Consistent Response Format

**Requirement:** API responses must follow a consistent format.

#### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ]
}
```