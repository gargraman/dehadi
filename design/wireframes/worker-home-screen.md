# Worker Home Screen - Wireframe

## Overview
The main screen for workers when they open the app. Displays personalized job recommendations and key actions.

## Layout Structure

```
┌─────────────────────────────────┐
│  🏠 HireConnect      💬 🧑‍💼 ⚙️ │
├─────────────────────────────────┤
│                                 │
│  👋 Hi, [Worker Name]           │
│  Welcome back!                  │
│                                 │
├─────────────────────────────────┤
│  📍 Current Location            │
│  [Map showing nearby jobs]      │
│                                 │
│  📈 2 Active Applications      │
│  💰 ₹4,500 Earned this month   │
│                                 │
├─────────────────────────────────┤
│  🔍 Quick Search                │
│  [Search Bar with Microphone]   │
│                                 │
├─────────────────────────────────┤
│  💼 Recommended Jobs            │
│  ┌─────────────────────────────┐ │
│  │ Mason Work - ₹500/day       │ │
│  │ 🕐 2 hours ago              │ │
│  │ 📍 1.2 km away              │ │
│  │ [APPLY]                     │ │
│  └─────────────────────────────┘ │
│  ┌─────────────────────────────┐ │
│  │ Electrician - ₹700/day      │ │
│  │ 🕐 4 hours ago              │ │
│  │ 📍 2.5 km away              │ │
│  │ [APPLY]                     │ │
│  └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [🏠] [🔍] [📍] [💬] [👤]       │
└─────────────────────────────────┘
```

## Key Elements

### Header
- App title/branding with simple icon
- Notification bell icon
- Profile avatar/settings icon

### Main Content
- Greeting section with worker's name
- Location display with map visualization
- Quick stats (active applications, earnings)
- Search functionality with voice input
- Job recommendations cards

### Navigation
- Bottom navigation bar with 5 main icons:
  - 🏠 Home (current page)
  - 🔍 Search
  - 📍 Nearby
  - 💬 Messages
  - 👤 Profile

## Accessibility Features
- Large, tappable elements (48px minimum)
- High contrast color scheme
- Clear, large text
- Simple, intuitive icons
- Voice input capability

## Interaction Flows
- Tapping a job card leads to job details page
- Tapping "APPLY" initiates application process
- Tapping location allows location change
- Microphone icon enables voice search