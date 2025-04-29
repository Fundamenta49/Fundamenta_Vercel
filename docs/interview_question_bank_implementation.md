# Interview Question Bank Implementation Plan

## Overview
This document outlines a plan to create a comprehensive database-driven interview question system that reduces reliance on AI generation for common interview scenarios. The system will use a tiered approach to deliver relevant questions while falling back to AI only when necessary.

## Database Schema

### Tables

#### `industries` Table
```sql
CREATE TABLE industries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `question_categories` Table
```sql
CREATE TABLE question_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `experience_levels` Table
```sql
CREATE TABLE experience_levels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `questions` Table
```sql
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  industry_id INTEGER REFERENCES industries(id),
  category_id INTEGER REFERENCES question_categories(id),
  experience_level_id INTEGER REFERENCES experience_levels(id),
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_template BOOLEAN DEFAULT FALSE,
  template_variables JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `sample_answers` Table
```sql
CREATE TABLE sample_answers (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id),
  answer_text TEXT NOT NULL,
  is_template BOOLEAN DEFAULT FALSE,
  template_variables JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `tips` Table
```sql
CREATE TABLE tips (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id),
  tip_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `companies` Table
```sql
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry_id INTEGER REFERENCES industries(id),
  description TEXT,
  culture_keywords JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `company_specific_questions` Table
```sql
CREATE TABLE company_specific_questions (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id),
  question_id INTEGER REFERENCES questions(id),
  relevance_score FLOAT DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `positions` Table
```sql
CREATE TABLE positions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  industry_id INTEGER REFERENCES industries(id),
  description TEXT,
  keywords JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### `position_specific_questions` Table
```sql
CREATE TABLE position_specific_questions (
  id SERIAL PRIMARY KEY,
  position_id INTEGER REFERENCES positions(id),
  question_id INTEGER REFERENCES questions(id),
  relevance_score FLOAT DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Implementation Strategies

### 1. Tiered Question Service

Create a service that follows this workflow:
1. **Tier 1**: Check for exact matches in the database
   - Direct company + position matches
   - Industry + position type matches
2. **Tier 2**: Use templated questions with variable substitution
   - Replace {COMPANY_NAME}, {POSITION}, {INDUSTRY} in templates
3. **Tier 3**: Fall back to AI generation for unique scenarios
   - Only when confidence of database matches is below threshold

### 2. Question Templates System

Template examples:
- "What interests you about working at {COMPANY_NAME}?"
- "How would you handle {CHALLENGE} as a {POSITION} at {COMPANY_NAME}?"
- "What experience do you have with {TECHNOLOGY} that's relevant to this {POSITION} role?"

### 3. Data Population Strategy

1. **Initial Seed Data**:
   - Populate with common questions from resources like Glassdoor, Indeed
   - Add industry-standard questions for each field
   - Include basic templates for customization

2. **Progressive Enhancement**:
   - Analyze and store successful AI-generated questions
   - Regularly update the database with new question patterns
   - Add company-specific information for major employers

3. **User Feedback Loop**:
   - Allow rating of questions for relevance
   - Track which questions lead to most practice time
   - Use this data to improve question quality

## API Design

### Primary Endpoints

1. **GET /api/questions/search**
   - Parameters: `industry`, `position`, `company`, `difficulty`, `category`
   - Returns: Array of matching questions with tips and sample answers

2. **GET /api/companies/{id}/questions**
   - Returns: Questions specifically associated with a company

3. **GET /api/positions/{id}/questions**
   - Returns: Questions specifically associated with a position

4. **POST /api/questions/generate**
   - Parameters: `industry`, `position`, `company`, `preferAI` (boolean)
   - Returns: Either database questions or AI-generated ones based on preference

## Frontend Integration

1. **Cache Strategy**:
   - Cache common industries and positions
   - Store recently used questions for quick access

2. **UI Enhancements**:
   - Add indicator showing source (database vs AI)
   - Allow users to refresh/regenerate if not satisfied
   - Show different visual treatments for various question tiers

3. **Offline Support**:
   - Download relevant question sets for offline practice
   - Sync new questions when connection is restored

## Performance Considerations

1. **Indexing Strategy**:
   - Index on common search combinations
   - Consider full-text search for question content

2. **Caching Layer**:
   - Implement Redis caching for common queries
   - Set appropriate TTL for different question types

3. **Query Optimization**:
   - Use pagination for large result sets
   - Implement efficient joins when retrieving related data

## Future Expansions

1. **ML-Based Matching**:
   - Train model to better match questions to specific scenarios
   - Use user feedback to improve recommendations

2. **Interview Session Recording**:
   - Save question sets used for specific interview preparation
   - Allow users to revisit and continue practice

3. **Peer Learning**:
   - Anonymous sharing of effective answers
   - Collaborative rating of question relevance by industry

## Implementation Timeline

1. **Phase 1: Database Setup** (2-3 weeks)
   - Create schema
   - Set up migrations
   - Seed with initial data

2. **Phase 2: Basic Service Layer** (3-4 weeks)
   - Implement tiered question retrieval
   - Create template processing
   - Build basic API endpoints

3. **Phase 3: Frontend Integration** (2-3 weeks)
   - Update UI to work with new data source
   - Add source indicators
   - Implement caching

4. **Phase 4: Optimization & Expansion** (Ongoing)
   - Performance tuning
   - Regular data updates
   - Implementation of advanced features