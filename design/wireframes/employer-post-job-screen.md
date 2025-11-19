# Employer Job Posting Screen - Wireframe

## Overview
Screen where employers can post a new job with all necessary details.

## Layout Structure

```
┌─────────────────────────────────┐
│  ✏️ Post New Job      ← 👤 ⚙️   │
├─────────────────────────────────┤
│  🏗️ Job Title                   │
│  [Enter job title eg: Mason]    │
│                                 │
│  📍 Location                    │
│  [Select from map/toggle GPS]   │
│                                 │
│  💰 Payment                     │
│  ┌─────────────┬───────────────┐ │
│  │ ₹ Amount    │ /             │ │
│  │ [500]       │ [day ▼]       │ │
│  └─────────────┴───────────────┘ │
│                                 │
│  👥 Number of Workers           │
│  [1 ▼]                          │
│                                 │
│  🧰 Required Skills             │
│  [Select skills: Mason, etc.]   │
│                                 │
│  🕐 Work Schedule               │
│  ┌─────────────┬───────────────┐ │
│  │ Start Date  │ Duration      │ │
│  │ [Today ▼]   │ [1 week ▼]    │ │
│  └─────────────┴───────────────┘ │
│                                 │
│  📝 Description                 │
│  [Enter job details...]         │
│                                 │
├─────────────────────────────────┤
│  [POST JOB]                     │
│  [SAVE AS DRAFT]                │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📊] [📋] [💬] [👤]       │
└─────────────────────────────────┘
```

## Key Elements

### Header
- Clear title "Post New Job"
- Back button to return to dashboard

### Job Details Sections
- Job title input field
- Location selector with map integration
- Payment configuration (amount and type)
- Number of workers needed
- Required skills selector
- Work schedule details
- Job description text area

### Action Buttons
- Primary "POST JOB" button
- Secondary "SAVE AS DRAFT" option

### Navigation
- Bottom navigation for context

## Accessibility Features
- Large, clear input fields
- Intuitive form layout
- Clear labels with icons
- Sufficient spacing between elements
- Large action buttons

## Interaction Flows
- Tapping location opens map selector
- Tapping skill selector opens skill list
- Tapping date/duration opens calendar
- Tapping "POST JOB" creates the job listing
- Tapping "SAVE AS DRAFT" saves for later