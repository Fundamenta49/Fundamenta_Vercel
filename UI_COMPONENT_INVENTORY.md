# UI Component Inventory

## Overview

This document catalogs the current UI components across the Fundamenta platform, identifying which ones need standardization based on the ActiveYou Yoga section design.

## Core Component Types

### 1. Navigation Components

| Component | Location | Status | Priority |
|-----------|----------|--------|----------|
| Main Sidebar | App-wide | Needs standardization | High |
| Narrow Sidebar | `/src/components/narrow-sidebar.css` | Needs review | Medium |
| Tab Navigation | `/src/components/ui/tabs.tsx` | ✓ Uses design system | Low |
| Mobile Menu | App-wide | Needs standardization | High |

### 2. Card Components

| Component | Location | Status | Priority |
|-----------|----------|--------|----------|
| Section Cards | Various sections | Inconsistent styling | High |
| Resource Cards | Financial/Wellness | Inconsistent styling | Medium |
| Achievement Cards | Engagement | Need standardization | Medium |
| Activity Cards | Various | Inconsistent margins/spacing | High |

### 3. Dialog/Modal Components

| Component | Location | Status | Priority |
|-----------|----------|--------|----------|
| Full Screen Dialog | Various | Off-screen issues on mobile | Critical |
| Privacy Consent | `/src/components/privacy/PrivacyConsentModal.tsx` | Needs alignment with design system | Medium |
| Standard Alerts | `/src/components/ui/alert.tsx` | ✓ Uses design system | Low |
| Content Warnings | Emergency section | Needs standardization | Medium |

### 4. Form Elements

| Component | Location | Status | Priority |
|-----------|----------|--------|----------|
| Text Inputs | `/src/components/ui/input.tsx` | ✓ Uses design system | Low |
| Checkboxes | `/src/components/ui/checkbox.tsx` | ✓ Uses design system | Low |
| Radio Groups | Various forms | Inconsistent styling | Medium |
| Dropdowns | Various forms | Positioning issues | High |
| Text Areas | Various forms | Inconsistent sizing | Medium |

### 5. Buttons

| Component | Location | Status | Priority |
|-----------|----------|--------|----------|
| Primary Buttons | `/src/components/ui/button.tsx` | ✓ Uses design system | Low |
| Icon Buttons | Various | Inconsistent sizing | Medium |
| Toggle Buttons | Various | Inconsistent styling | Medium |
| Action Buttons | Various | Inconsistent colors | High |

### 6. Layout Components

| Component | Location | Status | Priority |
|-----------|----------|--------|----------|
| Section Headers | Various | Inconsistent styling | High |
| Content Wrappers | Various | Inconsistent padding | High |
| Grid Layouts | Various | Inconsistent breakpoints | Medium |
| Spacing | App-wide | Inconsistent values | High |

## Section-Specific Components

### 1. Yoga Section (Reference Design)

| Component | Notes |
|-----------|-------|
| Activity Cards | Clear visual hierarchy, consistent padding |
| Progress Indicators | Clean, minimalist design |
| Video Players | Consistently styled, good responsive behavior |
| Section Navigation | Intuitive tab-based design |
| Instructions | Clear typography with proper spacing |

### 2. Financial Section

| Component | Status | Priority |
|-----------|--------|----------|
| Calculator UI | Needs standardization | Medium |
| Result Cards | Inconsistent with design system | High |
| Information Boxes | Needs consistent styling | Medium |
| Progress Steps | Needs alignment with Yoga style | Medium |

### 3. Emergency Section

| Component | Status | Priority |
|-----------|--------|----------|
| Warning Boxes | `/src/components/ui/emergency-resources.tsx` | Medium |
| Checklists | Needs standardization | Medium |
| Resource Listings | Needs consistent styling | Medium |
| Contact Cards | Needs consistent layout | Low |

### 4. Career Section

| Component | Status | Priority |
|-----------|--------|----------|
| Resume Builder | Needs standardization | High |
| Skill Cards | Inconsistent styling | Medium |
| Progress Trackers | Needs consistency with Yoga style | Medium |
| Job Listings | Needs consistent layout | Medium |

### 5. Learning Path

| Component | Status | Priority |
|-----------|--------|----------|
| Pathway Builder | `/src/components/mypath/PathwayBuilder.tsx` | High |
| Assignment Dashboard | `/src/components/mypath/AssignmentDashboard.tsx` | Medium |
| Progress Indicators | Needs standardization | Medium |
| Achievement Cards | Needs consistency | Medium |

## Common Issues Identified

1. **Inconsistent Spacing**
   - Different margin/padding values between sections
   - Inconsistent component spacing within the same section

2. **Color Application Issues**
   - Inconsistent application of section colors
   - Some components don't use the design system color tokens

3. **Typography Inconsistencies**
   - Mixed use of font weights
   - Inconsistent heading hierarchies
   - Varying text sizes for similar components

4. **Responsiveness Problems**
   - Popouts positioning improperly on mobile
   - Inconsistent breakpoint usage
   - Text overlap on smaller screens

5. **Dialog/Modal Issues**
   - Inconsistent header/close button positioning
   - Varying padding across different dialogs
   - Some dialogs missing proper mobile optimization

## Next Steps

1. Create Git branches for section-by-section migrations
2. Implement standardized versions of highest priority components
3. Create visual regression tests for each section
4. Document component replacements in a migration guide
