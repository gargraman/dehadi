# Worker Job Search Screen - Wireframe

## Overview
Screen where workers can search and filter available jobs based on their preferences.

## Layout Structure

```
┌─────────────────────────────────┐
│  🔍 Search Jobs        🧑‍💼 ⚙️ │
├─────────────────────────────────┤
│  📍 Location                    │
│  [Current Location ▼]           │
│                                 │
│  ⚙️ Filters                     │
│  ┌─────────────┬───────────────┐ │
│  │ 🧰 Skills   │ 💰 Wage       │ │
│  │ ▼ Mason     │ ▼ ₹500+/day   │ │
│  └─────────────┴───────────────┘ │
│  ┌─────────────┬───────────────┐ │
│  │ 🕘 Time     │ 🕐 Duration   │ │
│  │ ▼ Full-time │ ▼ 1 week+     │ │
│  └─────────────┴───────────────┘ │
│                                 │
├─────────────────────────────────┤
│  📋 Sort By:                    │
│  [Most Recent ▼]                │
│                                 │
├─────────────────────────────────┤
│  💼 Search Results              │
│  ┌─────────────────────────────┐ │
│  │ Painting - ₹450/day         │ │
│  │ 🕐 30 min ago               │ │
│  │ 📍 800 m away               │ │
│  │ [VIEW]                      │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │ Plumbing - ₹600/day         │ │
│  │ 🕐 1 hour ago               │ │
│  │ 📍 1.5 km away              │ │
│  │ [VIEW]                      │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │ Construction - ₹550/day     │ │
│  │ 🕐 2 hours ago              │ │
│  │ 📍 2.2 km away              │ │
│  │ [VIEW]                      │ │
│  └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [🏠] [🔍] [📍] [💬] [👤]       │
└─────────────────────────────────┘
```

## Key Elements

### Header
- Search title with back button
- Profile/settings icons

### Filters Section
- Location selector with current location
- Filter options in pairs (Skills/Wage, Time/Duration)
- Each filter with clear visual indicator

### Sorting
- Sort by option with dropdown

### Results
- List of job cards with essential information
- "VIEW" button for each job

### Navigation
- Bottom navigation with 5 main sections

## Accessibility Features
- Large, easy-to-tap filter options
- Clear visual hierarchy
- Sufficient spacing between elements
- Large text labels
- Intuitive iconography

## Interaction Flows
- Tapping any filter opens selection options
- Tapping job card leads to job details
- Tapping "VIEW" button leads to job details
- Changing location refreshes results