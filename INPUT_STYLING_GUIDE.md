# Input Styling Guide for Consistent UI

## Core Input Styling

To ensure consistent input styling across the application, always use one of these approaches:

### Option 1: Use shadcn/ui Components (Preferred)

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// In your component:
<div className="space-y-2">
  <Label htmlFor="my-input">Input Label</Label>
  <Input 
    id="my-input" 
    placeholder="Placeholder text"
  />
</div>
```

### Option 2: For Custom Input Elements

If you need custom input elements, use these consistent style tokens:

```tsx
<input
  type="text"
  className="w-full px-3 py-2 border border-input rounded-md font-sans text-base bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
  placeholder="Placeholder text"
/>
```

## Typography for Inputs

- Use `font-sans` for all inputs to ensure consistent typography
- Use `text-base` (16px) for input text to ensure readability and consistency
- Labels should use `text-sm font-medium text-foreground` for consistency

## Accessibility Considerations

- Always pair inputs with labels using the `htmlFor` attribute
- Include proper focus states with `focus:outline-none focus:ring-2 focus:ring-ring`
- Maintain sufficient color contrast for input text and borders

## Implementation Strategy

1. Identify all direct input element usage in the codebase
2. Replace direct input elements with shadcn/ui `Input` components
3. For any custom inputs that can't use the shadcn component, use the consistent class list above
