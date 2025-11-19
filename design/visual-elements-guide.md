# UI/UX Visual Elements Guide

## Icon System for HireConnect

This guide defines the icons and visual elements to be used throughout the HireConnect application to ensure consistency and ease of use for non-tech users.

### Core Action Icons

#### Navigation Icons
- 🏠 Home: Main dashboard/index screen
- 🔍 Search: Job search functionality
- 📍 Nearby: Location-based job discovery
- 💬 Messages: Communication between users
- 👤 Profile: User account and settings

#### Job-Related Icons
- 💼 Job: General job listing or detail
- 🧰 Skills: Required skills or user's skills
- 💰 Payment: Wage information, payment process
- 📍 Location: Job location or user location
- ⏰ Time: Work schedule or posting time
- 👥 Workers: Number of workers needed or assigned
- 📋 Applications: Job applications or applications list
- 🏢 Company: Employer information

#### Status Icons
- ✅ Open: Job is open for applications
- 🔄 In Progress: Job is currently being worked on
- 💳 Awaiting Payment: Job completed, awaiting payment
- ✅ Paid: Payment has been processed
- ✅ Completed: Job fully completed
- ❌ Cancelled: Job has been cancelled

### Color Palette

#### Primary Colors
- Primary Blue: #1E88E5 (for primary actions and important highlights)
- Secondary Gray: #757575 (for secondary actions and less important elements)
- Success Green: #4CAF50 (for positive actions and confirmations)
- Warning Orange: #FF9800 (for caution, pending states)
- Error Red: #F44336 (for errors and negative actions)

#### Background Colors
- Primary Background: #FFFFFF (white for main content areas)
- Secondary Background: #F5F5F5 (light gray for card backgrounds)
- Surface: #FAFAFA (for elevated surfaces like cards)

### Typography

#### Font Sizes
- Headings (H1): 24px (for main page titles)
- Headings (H2): 20px (for section titles)
- Headings (H3): 18px (for subsection titles)
- Body: 16px (for main content text, minimum for readability)
- Small: 14px (for secondary information)
- Caption: 12px (for least important information)

#### Text Weights
- Bold: 600 (for headings and important actions)
- Medium: 500 (for secondary headings)
- Regular: 400 (for body text)

### Button Styles

#### Primary Button
- Background: Primary Blue (#1E88E5)
- Text: White (#FFFFFF)
- Border: None
- Size: Minimum 48px height
- Shape: Rounded rectangle (8px radius)
- Shadow: Subtle elevation (2px)

#### Secondary Button
- Background: Transparent
- Text: Primary Blue (#1E88E5)
- Border: 1px solid Primary Blue (#1E88E5)
- Size: Minimum 48px height
- Shape: Rounded rectangle (8px radius)

#### Icon Button
- Size: 48px x 48px
- Background: Transparent or light gray
- Icon: 24px
- For navigation and quick actions

### Card Design

#### Job Cards
- Background: Secondary Background (#F5F5F5)
- Border radius: 12px
- Padding: 16px
- Elevation: 2px shadow
- Touchable area: Full card should be tappable

#### Profile Cards
- Background: Surface (#FAFAFA)
- Border radius: 12px
- Padding: 16px
- Content organization with clear hierarchy

### Image Guidelines

#### Work Type Images
- Masonry Work: 🏗️ (building/construction image)
- Electrician: ⚡ (electrical tools image)
- Plumbing: 🚰 (pipes/faucet image)
- Painting: 🎨 (paint brush/roller image)
- Driver: 🚗 (vehicle image)
- Cleaning: 🧹 (cleaning tools image)

#### Placeholder Images
- Use simple, recognizable illustrations
- Maintain consistent style
- Avoid complex or abstract imagery
- Include alt text for accessibility

### Accessibility Guidelines

#### Touch Target Sizes
- Minimum size: 48x48 pixels for all tappable elements
- Minimum size: 24x24 pixels for icons within larger touch targets

#### Contrast Ratios
- Text on background: Minimum 4.5:1 ratio
- Icon on background: Minimum 3:1 ratio
- Large text (18px+): Minimum 3:1 ratio

#### Visual Feedback
- Press state: Reduce opacity to 80% or add active state styling
- Focus state: Visible border or highlight for accessibility
- Loading states: Clear indication of ongoing processes

### Layout Principles

#### Spacing System
- Use multiples of 4px for consistent spacing:
  - 4px: Between small elements
  - 8px: Between related elements
  - 16px: Between sections
  - 24px: Between major components
  - 32px: For margins and major separations

#### Grid System
- Use 12-column responsive grid
- Maintain consistent gutters (16px)
- Card-based layout for content organization
- Mobile-first approach (single column, then expand)

### Animation and Feedback

#### Micro-interactions
- Button press: Subtle scale or opacity change
- Loading: Clear indicator (spinner or progress bar)
- Navigation: Smooth transition (300ms duration)
- Success: Checkmark animation or positive confirmation
- Error: Clear visual indication with descriptive text