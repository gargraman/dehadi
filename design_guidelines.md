# Design Guidelines: Dehadi.co.in Worker Marketplace Platform

## Design Approach

**Selected Approach**: Design System-Based with Material Design 3 principles, heavily customized for accessibility, low-literacy users, and multilingual support.

**Rationale**: This is a utility-focused platform where efficiency, learnability, and accessibility are paramount. The target users (daily-wage workers) require maximum clarity, large touch targets, and icon-first navigation. Material Design 3 provides a solid foundation for content-rich applications with strong visual feedback, which we'll adapt for Indian market needs.

**Key Design Principles**:
1. **Accessibility First**: Every interaction optimized for users with 0-3 months smartphone experience
2. **Visual Clarity**: High contrast, outdoor-readable interface for construction/field workers
3. **Cultural Relevance**: Colors and patterns appropriate for Indian market context
4. **Functional Efficiency**: Minimal cognitive load, maximum task completion speed

---

## Core Design Elements

### A. Color Palette

**Light Mode** (Primary for outdoor visibility):
- **Primary Brand**: 260 85% 45% (Deep professional blue - trust and stability)
- **Primary Container**: 260 90% 92% (Light blue background for cards)
- **Secondary**: 35 75% 50% (Warm orange - action and energy)
- **Error**: 0 85% 45% (Clear red for warnings)
- **Success**: 145 65% 40% (Green for confirmations)
- **Surface**: 0 0% 98% (Near-white backgrounds)
- **Surface Container**: 0 0% 95% (Card backgrounds)
- **On Surface**: 0 0% 15% (Primary text - high contrast)

**Dark Mode** (For evening/indoor use):
- **Primary**: 260 85% 65% (Brighter blue for dark backgrounds)
- **Primary Container**: 260 50% 20% (Subtle dark blue containers)
- **Surface**: 260 10% 8% (Deep blue-tinted dark)
- **Surface Container**: 260 8% 12% (Card backgrounds)
- **On Surface**: 0 0% 95% (Light text)

**Functional Colors**:
- **Job Posted**: 200 70% 50% (Teal - new opportunities)
- **Application Pending**: 45 90% 55% (Amber - in progress)
- **Hired/Completed**: 145 65% 40% (Green - success)
- **Wage Indicator High**: 145 50% 45% (Indicates above-average pay)
- **Wage Indicator Low**: 0 0% 50% (Neutral gray for standard pay)

### B. Typography

**Primary Font Family**: Inter (via Google Fonts) - excellent multilingual support including Devanagari
**Regional Language Support**: Noto Sans Devanagari, Noto Sans Bengali, Noto Sans Tamil (loaded dynamically based on language selection)

**Type Scale**:
- **Hero/Display**: 36px/700 (large job titles, profile headers)
- **Heading 1**: 28px/600 (section headers, main navigation)
- **Heading 2**: 22px/600 (card titles, secondary navigation)
- **Body Large**: 18px/500 (primary content for readability)
- **Body**: 16px/400 (standard text, descriptions)
- **Label**: 14px/600 (buttons, badges, metadata)
- **Caption**: 12px/400 (timestamps, helper text)

**Accessibility Notes**: Minimum body text 16px for low-literacy users. All interactive elements use 18px+ labels with 600 weight for clarity.

### C. Layout System

**Spacing Primitives** (Tailwind units):
- **Core rhythm**: 4, 8, 16, 24, 32 (p-4, m-8, gap-16, etc.)
- **Component spacing**: Use 16 and 24 as primary (p-4/p-6)
- **Section spacing**: Use 32 and 48 for vertical rhythm (py-8/py-12)
- **Touch targets**: Minimum 48px (h-12) for all interactive elements

**Grid System**:
- **Mobile**: Single column, full-width cards with 16px gutters
- **Tablet**: 2-column grid for job/worker cards
- **Desktop**: Max 3-column grid, never exceed 1280px container width

**Safe Zones**: 
- 16px minimum margin on mobile edges
- 24px padding within cards/containers
- 48x48px minimum tap area with 8px spacing between targets

### D. Component Library

**Navigation**:
- Bottom navigation bar (mobile) with 5 primary icons: Home, Search, Location (Nearby), Messages, Profile
- Each icon 28x28px with text label below (12px)
- Active state: Primary color fill, 3px bottom indicator bar
- Badge indicators for notifications (red dot, 8px diameter)

**Cards**:
- Job Cards: Elevated surface (2dp shadow), rounded-2xl corners, 16px padding
  - Job title (22px/600), employer name (14px/400), location with pin icon, wage badge (prominent, top-right)
  - Skills tags (rounded-full, 12px text, secondary color background)
  - Distance indicator with walking icon + "2.3 km away"
  - Apply button (full-width, primary color)
  
- Worker Profile Cards: Similar structure
  - Profile photo (64x64px rounded-full, top-left)
  - Name + verification badge, rating stars (★★★★☆), experience years
  - Skills (max 3 visible, "+2 more" link)
  - Hourly/daily rate badge, availability status (green dot = available)

**Forms**:
- Single-field-per-screen for onboarding (progressive disclosure)
- Large input fields (56px height, 18px text)
- Icon prefixes (phone icon, location pin, etc.)
- Dropdown with large touch targets (56px each option)
- Image-based selectors for skills (icon + label cards, 96x96px)

**Voice Interface Elements**:
- Floating action button (FAB) with microphone icon, 56x56px
- Pulsing animation during listening (scale 1.0 to 1.1, 0.8s repeat)
- Voice feedback overlay: semi-transparent dark background, transcription text in white 24px
- Language selector: flag icons + native script labels (हिंदी, বাংলা, தமிழ்)

**Messaging**:
- Chat bubbles: sender (primary color, right-aligned), receiver (gray, left-aligned)
- Avatar thumbnails (32x32px) on receiver messages
- Document/image attachments: preview cards with download icon
- Timestamp (12px, gray, below bubble)

**Data Displays**:
- Stats Cards: Large number (36px/700), label below (14px/400), icon left (24x24px)
- Progress bars for profile completion: 8px height, rounded-full, primary color fill
- Rating stars: 20px each, filled/outline combination
- Wage comparison meter: horizontal bar with marker showing position in range

**Overlays/Modals**:
- Bottom sheets for filters/actions (rounded-t-3xl, slides up)
- Full-screen modals for job details/applications
- Filter panel: checkbox lists with 48px row height, clear visual selection (primary color check)

### E. Animations & Micro-interactions

**Use Sparingly**:
- Page transitions: 200ms ease-out slide
- Button press: Scale 0.95 on touch, 100ms
- Voice FAB: Pulsing scale animation during active listening only
- Loading states: Skeleton screens (gray pulse), never spinners
- Success confirmations: Single green checkmark scale-in (300ms)

**No Animations For**:
- Card reveals/list items
- Hover states (touch-first design)
- Decorative effects

---

## Accessibility & Multilingual Specifications

**Icon Strategy**:
- Use Material Icons (via CDN) for universal symbols
- Job categories: construction (helmet), plumbing (wrench), electrical (bolt), painting (brush)
- Actions: search (magnifying glass), location (pin), apply (hand-raise), message (chat)
- All icons 24x24px minimum, 28x28px for primary navigation

**Voice Interface**:
- Microphone FAB positioned bottom-right (16px from edges)
- Voice search overlay shows: "Listening..." header, waveform animation, transcribed text in real-time
- Support Hindi voice input: "मुझे पास के प्लंबर की नौकरी चाहिए" → auto-translates and searches

**Language Switcher**:
- Globe icon in top app bar (right side)
- Bottom sheet with language cards: flag + native script + English name
- Instant language switch, no reload required
- Persist selection in localStorage

**Dark Mode**:
- Auto-toggle based on system preference
- Manual override switch in profile settings
- Consistent implementation: all inputs, cards, forms use surface-container colors
- Text fields: dark background (260 8% 12%), light text, visible borders (1px, 40% opacity)

---

## Images & Visual Assets

**Hero Images**: 
- **Landing Page**: Full-width hero (768px height mobile, 600px desktop) showing diverse workers (mason, electrician, woman carpenter) on construction site, bright natural lighting
- Overlay: 50% dark gradient bottom-to-top for text readability
- Hero text white, centered, with blurred-background outline buttons

**Profile Photos**:
- Worker avatars: 128x128px upload, cropped to circular
- Placeholder: User icon on primary-container background
- Verification badge: Small green checkmark overlay (20x20px, bottom-right)

**Job Category Images**:
- Icon-illustration hybrid cards for skill selection
- Each 120x120px: simple line illustration + solid color background
- Construction (orange), Electrical (yellow), Plumbing (blue), Painting (green)

**Empty States**:
- Illustrations (not photos) for "No jobs found", "No messages yet"
- Simple 2-color line art, 200x200px, centered with explanatory text below

**Trust Indicators**:
- Employer verification: Building icon badge
- Worker verification: ID card icon badge  
- Safety certified: Hard hat icon badge
- All 24x24px, subtle gray when unverified, primary color when verified

---

## Platform-Specific Considerations

**Mobile PWA (Primary)**:
- Installable prompt after 2 visits
- Offline-first: Job listings cached, "View Offline" label for saved jobs
- Share API integration: Share job via WhatsApp (primary channel in India)
- Location permissions: Request with clear explanation overlay + Hindi translation

**Web Dashboard (Employers/Admin)**:
- Sidebar navigation (240px width) with collapsible on tablet
- Data tables: Alternating row backgrounds, sticky headers, 48px row height
- Multi-select with checkbox column (24x24px)
- Export buttons: CSV/PDF download with clear icons

**NGO/CSC Portal**:
- "Assisted Mode" toggle: Larger text (20px base), step-by-step wizard UI
- Bulk upload: Drag-drop zone with visual feedback (primary-container background on dragover)
- Progress tracking: Linear stepper component showing registration stages

---

This design system balances professional credibility with maximum accessibility, ensuring daily-wage workers with limited digital experience can confidently navigate the platform while maintaining visual quality that builds trust with employers and partners.