# Disclaimer Implementation Guide

This document provides guidelines and examples for implementing the layered disclaimer system in Fundamenta.

## Overview

Fundamenta uses a comprehensive, layered approach to disclaimers that provides legal protection while maintaining a positive user experience. The system includes:

1. **Global Foundation** - One-time acceptance for Terms of Service and Privacy Policy
2. **Contextual Disclaimers** - Section-specific notices that appear in relevant areas
3. **In-Context Micro-Disclaimers** - Visual indicators and language patterns that naturally convey limitations
4. **AI Response Engineering** - Natural integration of limitations in AI responses
5. **Crisis Detection & Response** - Automated identification and response to potential crisis situations

## Components Available

The following components are available for use across the application:

### 1. Standard Disclaimer

A consistent, styled disclaimer component with different severity levels and display options.

```tsx
import { StandardDisclaimer } from "@/components/ui/standard-disclaimer";

// Basic usage
<StandardDisclaimer category="health" />

// With custom display behavior
<StandardDisclaimer 
  category="finance" 
  severity="warning" 
  display="first_visit" 
  onAcknowledge={() => console.log("User acknowledged")} 
/>
```

### 2. Emergency Resources

A component displaying crisis resources with different display formats.

```tsx
import { EmergencyResources } from "@/components/ui/emergency-resources";

// As a card
<EmergencyResources category="mental_health" />

// As an inline element
<EmergencyResources 
  category="domestic_violence" 
  display="inline" 
  limit={2} 
/>

// As a banner
<EmergencyResources 
  category="substance_abuse" 
  display="banner" 
/>
```

### 3. Professional Resources

A component for suggesting professional services related to different topics.

```tsx
import { ProfessionalResources } from "@/components/ui/professional-resources";

// Grid layout (default)
<ProfessionalResources category="mental_health" />

// List layout
<ProfessionalResources 
  category="finance" 
  display="list" 
  title="Financial Professionals" 
/>

// Compact layout
<ProfessionalResources 
  category="legal" 
  display="compact" 
  showTitle={false} 
/>
```

## Implementation Patterns

### Health & Wellness Pages

```tsx
// At the top of wellness assessment pages
<StandardDisclaimer 
  category="health" 
  severity="info" 
  display="first_visit" 
/>

// At the bottom of health recommendation pages
<ProfessionalResources 
  category="health" 
  limit={3} 
  title="Consult with Healthcare Professionals" 
/>
```

### Financial Tools

```tsx
// At the top of financial calculators
<StandardDisclaimer 
  category="finance" 
  severity="info" 
  display="always" 
/>

// When displaying investment information
<div className="mb-4">
  <h3>Investment Strategies</h3>
  <p>Educational content here...</p>
  
  <StandardDisclaimer 
    category="finance" 
    display="always" 
    className="mt-2" 
  />
</div>
```

### Legal Information

```tsx
// For employment rights information
<StandardDisclaimer 
  category="legal" 
  severity="warning" 
  display="always" 
/>

// For domestic violence resources, include emergency resources
<div className="space-y-4">
  <StandardDisclaimer 
    category="legal" 
    severity="warning" 
    display="always" 
  />
  
  <EmergencyResources 
    category="domestic_violence" 
    display="banner" 
  />
  
  {/* Content here */}
  
  <ProfessionalResources 
    category="legal" 
    display="list" 
  />
</div>
```

## Crisis Detection in AI Responses

The Fundi AI system automatically detects potential crisis situations in user messages and provides appropriate emergency resource information. This is implemented in the AI response pipeline and does not require additional code in the frontend.

The system detects:
- Suicidal ideation
- Self-harm
- Domestic violence
- Substance abuse emergencies

## Disclaimer Injection in AI Responses

The system automatically detects the topic of conversation and naturally incorporates appropriate limitations and disclaimers into Fundi's responses. This happens by:

1. Detecting topics in user messages
2. Adding topic-specific disclaimer guidance to the AI system prompt
3. Ensuring AI responses include natural qualifiers and appropriate limitations

This creates responses that maintain a helpful, natural tone while communicating important limitations.

## Best Practices

1. **Be Consistent** - Use the standard components to maintain consistency across the application
2. **Context Matters** - Use the most appropriate disclaimer category and severity for each situation
3. **Don't Overdo It** - Use `display="first_visit"` when appropriate to avoid disclaimer fatigue
4. **Layer Appropriately** - Combine different disclaimer types based on content sensitivity
5. **Test with Users** - Regularly review how users interact with disclaimers and adjust as needed

## Examples in Production

### Wellness Assessment

```tsx
<div className="space-y-6">
  <StandardDisclaimer 
    category="health" 
    severity="info" 
    display="first_visit" 
  />
  
  {/* Assessment content */}
  
  <div className="mt-8 border-t pt-4">
    <div className="text-sm text-gray-500">
      This assessment is provided for educational purposes only. 
      It is not a diagnostic tool.
    </div>
    
    <div className="mt-4">
      <ProfessionalResources 
        category="mental_health" 
        display="compact" 
        limit={3} 
      />
    </div>
  </div>
</div>
```

### Emergency Page

```tsx
<div className="space-y-6">
  <StandardDisclaimer 
    category="health" 
    severity="alert" 
    display="always" 
  />
  
  <EmergencyResources 
    category="mental_health" 
    display="modal" 
  />
  
  {/* Emergency resources content */}
</div>
```