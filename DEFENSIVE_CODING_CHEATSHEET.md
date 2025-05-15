# Fundamenta Defensive Coding Cheatsheet

## Quick Patterns

### 1. Input Validation Pattern
```typescript
if (!Number.isInteger(id) || id <= 0) {
  throw new ValidationError(`Invalid ID: ${id}`);
}

if (!content?.trim()) {
  throw new ValidationError("Content cannot be empty");
}
```

### 2. Try/Catch Pattern
```typescript
try {
  // Database operation
} catch (error) {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    throw error; // Re-throw domain-specific errors
  }
  throw new Error(`Failed to operation_name: ${error.message}`);
}
```

### 3. Entity Verification Pattern
```typescript
const entityExists = await this.getEntity(entityId);
if (!entityExists) {
  throw new NotFoundError(`Entity ${entityId} not found`);
}
```

### 4. Transaction Pattern
```typescript
return await db.transaction(async (tx) => {
  // First operation
  await tx.operation1(...);
  
  // Second operation
  return await tx.operation2(...);
});
```

### 5. Query Limit Pattern
```typescript
return await db
  .select()
  .from(table)
  .where(eq(table.field, value))
  .limit(100); // Prevent excessive data fetching
```

## Method Template

```typescript
async methodName(param1: Type1, param2: Type2): Promise<ReturnType> {
  // 1. Validate inputs
  if (!isValidParam1(param1)) {
    throw new ValidationError(`Invalid param1: ${param1}`);
  }
  if (!isValidParam2(param2)) {
    throw new ValidationError(`Invalid param2: ${param2}`);
  }

  try {
    // 2. Verify entities exist if needed
    const entityExists = await this.checkEntityExists(entityId);
    if (!entityExists) {
      throw new NotFoundError(`Entity ${entityId} not found`);
    }

    // 3. Perform operation, using transaction if multiple steps
    if (needsTransaction) {
      return await db.transaction(async (tx) => {
        // Multiple operations within transaction
        return result;
      });
    } else {
      // Single operation
      const result = await db
        .operation()
        .from(table)
        .where(condition)
        .limit(100);
      return result;
    }
  } catch (error) {
    // 4. Handle errors appropriately
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }
    throw new Error(`Failed to perform methodName: ${error.message}`);
  }
}
```

## Common Validation Checks

### Numeric Checks
- `Number.isInteger(value)`
- `value > 0`
- `value >= 0`
- `value >= min && value <= max`

### String Checks
- `value?.trim()` (non-empty after trimming)
- `value.match(/regex/)` (pattern matching)
- `value.length >= minLength && value.length <= maxLength`

### Object Checks
- `Object.keys(obj).length > 0` (non-empty object)
- `Object.hasOwnProperty('key')` (has required property)

### Array Checks
- `Array.isArray(value) && value.length > 0` (non-empty array)
- `value.every(item => isValidItem(item))` (all items valid)

## Common Error Types

```typescript
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

class DuplicateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DuplicateError";
  }
}

class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}
```