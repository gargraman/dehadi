# Employer Dashboard Screen - Wireframe

## Overview
Main dashboard for employers showing their jobs, applications, and earnings.

## Layout Structure

```
┌─────────────────────────────────┐
│  🏢 Employer Hub    💬 👤 ⚙️    │
├─────────────────────────────────┤
│                                 │
│  👋 Hi, [Employer Name]         │
│  Welcome back!                  │
│                                 │
├─────────────────────────────────┤
│  📊 Quick Stats                 │
│  ┌─────────────┬───────────────┐ │
│  │ 💼 Active   │ 📋 Pending   │ │
│  │   Jobs      │   Apps       │ │
│  │   3         │   12         │ │
│  └─────────────┴───────────────┘ │
│  ┌─────────────┬───────────────┐ │
│  │ 👷 Workers  │ 💰 Spent     │ │
│  │   2         │   ₹15,000    │ │
│  └─────────────┴───────────────┘ │
│                                 │
├─────────────────────────────────┤
│  📍 Your Active Jobs            │
│  ┌─────────────────────────────┐ │
│  │ Mason Work - ₹500/day       │ │
│  │ Status: Open                │ │
│  │ 📋 4 applications           │ │
│  │ [VIEW] [EDIT]               │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │ Electrician - ₹700/day      │ │
│  │ Status: In Progress         │ │
│  │ 👷 Assigned: Raj Kumar      │ │
│  │ [VIEW] [EDIT]               │ │
│  └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│  [POST NEW JOB]                 │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📊] [📋] [💬] [👤]       │
└─────────────────────────────────┘
```

## Key Elements

### Header
- Employer hub title
- Message and profile icons

### Welcome Section
- Personalized greeting
- Clear, large text

### Quick Stats
- Four visual blocks showing key metrics
- Use of icons for quick recognition
- Simple numbers for easy understanding

### Active Jobs
- List of employer's active jobs
- Status indicators
- Application/worker counts
- Action buttons for each job

### Primary Action
- Large "POST NEW JOB" button

### Navigation
- Bottom navigation with 5 sections
- Dashboard icon highlighted (📊)

## Accessibility Features
- Large, easy-to-read numbers
- Clear visual hierarchy
- Sufficient contrast
- Large touch targets
- Icon-plus-text for clarity

## Interaction Flows
- Tapping "VIEW" on a job shows job details
- Tapping "EDIT" allows job modification
- Tapping "POST NEW JOB" opens job posting form
- Tapping profile icon opens settings