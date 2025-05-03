# Yoga Section Component Reference

This document provides a detailed analysis of the components used in the Yoga section, which will serve as the reference for standardizing UI/UX across the Fundamenta platform.

## Core Components

### 1. YogaGridInterface

**File**: `client/src/components/yoga-grid-interface.tsx`

**Key Styling Features**:
- iOS-inspired design with subtle gradients and shadows
- Consistent card styling with rounded corners (rounded-2xl)
- Card headers with proper padding (p-4 sm:p-6)
- Gradient bars for visual hierarchy
- Rounded pill-shaped filters
- Mobile-friendly horizontal scrolling sections

**Notable UI Elements**:
```jsx
// iOS-style gradient header bar
<div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

// Responsive card header
<CardHeader className="p-4 sm:p-6 border-b border-gray-100 bg-white">
  {/* Header content */}
</CardHeader>

// Pill-shaped filter tabs
<TabsList className="h-10 bg-gray-100 p-1 rounded-full w-full inline-flex">
  <TabsTrigger 
    value="all" 
    className="rounded-full text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm flex-1 min-w-[70px]"
  >
    All Poses
  </TabsTrigger>
  {/* More tabs */}
</TabsList>

// Mobile-friendly horizontal scrolling with desktop grid
<div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-x-auto pb-3 -mx-3 sm:mx-0 px-3 sm:px-0 hide-scrollbar">
  {/* Items */}
</div>
```

### 2. YogaGridMobile

**File**: `client/src/components/yoga-grid-mobile.tsx`

**Key Styling Features**:
- Ultra-minimal design with white/neutral backgrounds
- Subtle backdrop blur effects for iOS aesthetic
- Thin gradient accent lines (h-0.5 or h-1)
- Consistent sticky navigation handling
- Proper scrolling behavior with hidden scrollbars

**Notable UI Elements**:
```jsx
// Minimal container with backdrop blur
<div className="bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden shadow-sm border border-gray-100">
  {/* Thin gradient accent */}
  <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
  {/* Content */}
</div>

// Sticky header for scrolling lists
<div className="sticky top-0 z-10 px-5 sm:px-6 py-4 bg-white/95 backdrop-blur-xl border-b border-gray-50">
  {/* Filters */}
</div>

// Badge styling
<Badge className="bg-gray-50/80 backdrop-blur-sm text-gray-800 hover:bg-gray-100 border-0 shadow-sm px-3 py-1 rounded-full">
  <Award className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
  Level {currentLevelNum}
</Badge>
```

### 3. YogaPosePopout

**File**: `client/src/components/yoga-pose-popout.tsx`

**Key Styling Features**:
- Proper dialog positioning
- Consistent close button placement
- Elegant transitions and animations
- Appropriate z-index management
- Content scrolling with fixed header

**Notable UI Elements**:
```jsx
// Dialog content with fixed header
<DialogContent className="sm:max-w-[600px] p-0 max-h-[90vh] flex flex-col overflow-hidden">
  {/* Fixed header */}
  <div className="p-4 border-b sticky top-0 z-10 bg-white flex justify-between items-center">
    <DialogTitle>{pose.name}</DialogTitle>
    <DialogClose className="h-6 w-6 rounded-full hover:bg-gray-100 flex items-center justify-center">
      <X className="h-4 w-4" />
    </DialogClose>
  </div>
  
  {/* Scrollable content */}
  <div className="flex-1 overflow-y-auto p-4">
    {/* Content */}
  </div>
</DialogContent>
```

### 4. YogaVisionSimplified

**File**: `client/src/components/yoga-vision-simplified.tsx`

**Key Styling Features**:
- Clean button styling with rounded corners
- Consistent spacing and padding
- Proper image/video handling with consistent aspect ratios
- Subtle gradient overlays for text legibility

**Notable UI Elements**:
```jsx
// Clean rounded buttons with icons
<Button 
  onClick={handleWebcamCapture} 
  variant="default"
  size="sm"
  className="h-8 text-xs rounded-full px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
  disabled={isRecording}
>
  <Camera className="h-3 w-3 mr-1.5" />
  <span>Capture Photo</span>
</Button>

// Gradient overlay for text on images
<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-1 px-2">
  <p className="text-white text-xs font-medium">{title}</p>
</div>
```

## Design Patterns To Adopt

### 1. Card Pattern

```jsx
<Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
  {/* Optional accent line */}
  <div className="h-1.5 bg-gradient-to-r from-[sectionColor] via-[sectionColor]/70 to-[sectionColor]/50"></div>
  
  <CardHeader className="p-4 sm:p-6 border-b border-gray-100 bg-white">
    <CardTitle className="text-xl font-semibold text-gray-800">
      {title}
    </CardTitle>
    <CardDescription className="text-sm text-gray-500 mt-1">
      {description}
    </CardDescription>
  </CardHeader>
  
  <CardContent className="p-4 sm:p-6 bg-gray-50">
    {children}
  </CardContent>
</Card>
```

### 2. Navigation Pattern

```jsx
<Tabs defaultValue={defaultTab} className="w-full">
  <TabsList className="h-10 bg-gray-100 p-1 rounded-full w-full inline-flex">
    {tabs.map(tab => (
      <TabsTrigger 
        key={tab.value}
        value={tab.value} 
        className="rounded-full text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm flex-1 min-w-[70px]"
      >
        {tab.label}
      </TabsTrigger>
    ))}
  </TabsList>
  
  {tabs.map(tab => (
    <TabsContent key={tab.value} value={tab.value}>
      {tab.content}
    </TabsContent>
  ))}
</Tabs>
```

### 3. Search Pattern

```jsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
  <Input
    placeholder={placeholder}
    className="pl-9 border border-gray-200 rounded-full h-10 text-sm focus:ring-blue-200 focus:border-blue-300 shadow-sm"
    value={value}
    onChange={onChange}
  />
</div>
```

### 4. Mobile Scrolling Pattern

```jsx
<div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-x-auto pb-3 -mx-3 sm:mx-0 px-3 sm:px-0 hide-scrollbar">
  {items.map(item => (
    <div key={item.id} className="min-w-[240px] sm:min-w-0 flex-shrink-0 sm:flex-shrink-initial">
      {/* Card content */}
    </div>
  ))}
</div>
```

### 5. Dialog Pattern

```jsx
<Dialog>
  <DialogTrigger asChild>
    {trigger}
  </DialogTrigger>
  <DialogContent className="sm:max-w-[600px] p-0 max-h-[90vh] flex flex-col overflow-hidden">
    <div className="p-4 border-b sticky top-0 z-10 bg-white flex justify-between items-center">
      <DialogTitle>{title}</DialogTitle>
      <DialogClose className="h-6 w-6 rounded-full hover:bg-gray-100 flex items-center justify-center">
        <X className="h-4 w-4" />
      </DialogClose>
    </div>
    
    <div className="flex-1 overflow-y-auto p-4">
      {content}
    </div>
  </DialogContent>
</Dialog>
```

## CSS Utilities to Standardize

```css
/* Hide scrollbars but maintain functionality */
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Gradient text (rarely used but effective) */
.gradient-text {
  @apply bg-clip-text text-transparent bg-gradient-to-r;
}

/* iOS-style backdrop blur */
.ios-bg {
  @apply bg-white/90 backdrop-blur-xl;
}

/* Consistent card style */
.standard-card {
  @apply bg-white rounded-2xl shadow-sm border-0 overflow-hidden;
}

/* Pill button style */
.pill-button {
  @apply rounded-full text-xs font-medium px-4 h-8;
}
```

## Typography Standards

- **Headings**: Use font-heading class with appropriate sizes
  - h1: text-2xl font-semibold
  - h2: text-xl font-semibold
  - h3: text-lg font-medium
  
- **Body Text**: 
  - Regular: text-base text-gray-800
  - Small: text-sm text-gray-600
  - X-Small: text-xs text-gray-500

## Color Application Guide

- **Section Colors**: Apply to accents, not large backgrounds
- **Gradient Accents**: Use for visual hierarchy and separation
- **Text Colors**: Maintain contrast with appropriate gray scale
- **Background Colors**: Prefer white or very subtle gray

## Next Steps

1. Create a set of standardized components based on these patterns
2. Implement in a test branch
3. Verify mobile rendering and positioning
4. Create documentation with examples