# Employer Job Applications Screen - Wireframe

## Overview
Screen where employers can review and manage job applications from workers.

## Layout Structure

```
┌─────────────────────────────────┐
│  📋 Applications      👤 ⚙️     │
├─────────────────────────────────┤
│  🏗️ Mason Work - ₹500/day      │
│  Status: Open (4 applications)  │
│  ← [Switch Job ▼]              │
│                                 │
├─────────────────────────────────┤
│  📋 Applications                │
│  ┌─────────────────────────────┐ │
│  │ 👨‍💼 Raj Kumar              │ │
│  │ ⭐ 4.2 (15 jobs completed)   │ │
│  │ 💬 "Experienced mason..."   │ │
│  │ [ACCEPT] [REJECT]           │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │ 👨‍💼 Amit Sharma            │ │
│  │ ⭐ 4.5 (8 jobs completed)    │ │
│  │ 💬 "I have 5 years exper..."│ │
│  │ [ACCEPT] [REJECT]           │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │ 👨‍💼 Sunil Patel            │ │
│  │ ⭐ 3.9 (22 jobs completed)   │ │
│  │ 💬 "Available immediately"  │ │
│  │ [ACCEPT] [REJECT]           │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │ 👨‍💼 Vikash Yadav           │ │
│  │ ⭐ 4.0 (12 jobs completed)   │ │
│  │ 💬 "Skilled in brick work"  │ │
│  │ [ACCEPT] [REJECT]           │ │
│  └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📊] [📋] [💬] [👤]       │
└─────────────────────────────────┘
```

## Key Elements

### Header
- Clear job identification
- Status indicator
- Job switching dropdown
- Profile and settings icons

### Application List
- List of applicants for the selected job
- Each applicant shows:
  - Name and rating
  - Brief description of experience
  - Action buttons (Accept/Reject)

### Navigation
- Bottom navigation with all sections

## Accessibility Features
- Large, clear names and information
- High contrast for text
- Sufficient spacing between application cards
- Large action buttons
- Simple decision-making interface

## Interaction Flows
- Tapping "ACCEPT" assigns the worker to the job
- Tapping "REJECT" declines the application
- Selecting different job updates the application list
- Tapping profile goes to settings