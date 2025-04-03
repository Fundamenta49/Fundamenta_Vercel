# Design System Cheatsheet

## Color System
| Section | Color | Hex Code | Usage |
|---------|-------|----------|-------|
| Emergency | Red | `#b91c1c` | Emergency guides, warnings |
| Financial | Blue | `#3b82f6` | Financial tools, calculators |
| Wellness | Green | `#10b981` | Nutrition, fitness, mental health |
| Career | Purple | `#8b5cf6` | Resume builder, career guidance |
| Learning | Yellow | `#f59e0b` | Educational content, tutorials |

## Component Quick Reference

### Cards
```tsx
<Card style={{ borderColor: sectionColor }}>
  <CardHeader className="pb-2">
    <CardTitle style={{ color: sectionColor }}>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Dialogs
```tsx
<FullScreenDialog>
  <FullScreenDialogTrigger>{trigger}</FullScreenDialogTrigger>
  <FullScreenDialogContent themeColor={sectionColor}>
    <FullScreenDialogHeader>
      <FullScreenDialogTitle style={{ color: sectionColor }}>
        Title
      </FullScreenDialogTitle>
    </FullScreenDialogHeader>
    <FullScreenDialogBody>Content</FullScreenDialogBody>
  </FullScreenDialogContent>
</FullScreenDialog>
```

### Section Headers
```tsx
<div className="pb-4 mb-6 border-b" style={{ borderColor: sectionColor }}>
  <div className="flex items-center">
    <span style={{ color: sectionColor }}>{icon}</span>
    <h2 className="text-2xl font-bold" style={{ color: sectionColor }}>
      {title}
    </h2>
  </div>
</div>
```

### Video Player
```tsx
<VideoPlayerDialog
  videoId="youtube-id-here"
  trigger={<Button>Watch Video</Button>}
  title="Video Title"
/>
```

### Warning Box (Emergency Only)
```tsx
<div 
  className="rounded-md p-4 my-4 flex items-start space-x-3"
  style={{ 
    backgroundColor: "#b91c1c10",
    borderColor: "#b91c1c",
    borderWidth: "1px" 
  }}
>
  <AlertTriangle color="#b91c1c" />
  <div style={{ color: "#b91c1c" }}>Warning message</div>
</div>
```

### Checklist
```tsx
<div className="flex items-start space-x-3">
  <Checkbox 
    id="item-id" 
    style={{ 
      borderColor: isChecked ? sectionColor : undefined,
      backgroundColor: isChecked ? sectionColor : undefined 
    }}
  />
  <Label htmlFor="item-id">Checklist item</Label>
</div>
```

### Tabs
```tsx
<Tabs defaultValue="tab1">
  <TabsList 
    className="grid grid-cols-3"
    style={{ backgroundColor: `${sectionColor}80` }}
  >
    <TabsTrigger 
      value="tab1" 
      className="text-white"
      style={{ 
        backgroundColor: `${sectionColor}80`,
        '--active-bg': sectionColor 
      }}
    >
      Tab 1
    </TabsTrigger>
    {/* More tabs */}
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  {/* More tab content */}
</Tabs>
```

## Spacing Reference
- **xs:** 0.5rem (8px) - Tiny elements, icon padding
- **sm:** 0.75rem (12px) - Small gaps, compact padding
- **md:** 1rem (16px) - Standard spacing, padding, gaps
- **lg:** 1.5rem (24px) - Card padding, section spacing
- **xl:** 2rem (32px) - Large section padding, margins

## Typography Scale
- **xs:** 0.75rem (12px) - Fine print, captions
- **sm:** 0.875rem (14px) - Secondary text
- **base:** 1rem (16px) - Body text
- **lg:** 1.125rem (18px) - Emphasis text
- **xl:** 1.25rem (20px) - Small headings
- **2xl:** 1.5rem (24px) - Card headings
- **3xl:** 1.875rem (30px) - Page headings

## Dialog Implementation Checklist
- ✓ Proper spacing after swipe indicator
- ✓ Menu button positioned correctly at z-index: 50
- ✓ Consistent header structure with section color
- ✓ Appropriate content padding in the body
- ✓ Ensure no content overlaps with swipe indicator

## Menu Button Pattern
```tsx
<div className="absolute top-4 right-4 z-50">
  <button 
    className="p-2 rounded-md"
    style={{ 
      backgroundColor: `${sectionColor}10`,
      pointerEvents: "auto" 
    }}
  >
    <Menu style={{ color: sectionColor }} />
  </button>
</div>
```