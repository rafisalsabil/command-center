# HERA Agent Monitoring Dashboard - UI/UX Specifications

## Design System & Brand Guidelines

### Typography

**Font Family:** SF Pro Display (fallback: Inter, system-ui)

**Font Weights:**
- Bold (700) - Headers, important metrics
- SemiBold (600) - Subheaders, labels
- Medium (500) - Body text, descriptions
- Regular (400) - Secondary text

**Font Sizes (TV Optimized)**
- Heading 1: 48px (Main title)
- Heading 2: 32px (Section headers)
- Heading 3: 24px (Card headers)
- Body Large: 20px (Primary metrics)
- Body: 16px (Standard text)
- Small: 14px (Timestamps, labels)
- Tiny: 12px (Meta information)

### Color Palette

Based on Nexus design reference:

**Primary Colors:**
- `#5347CE` - Primary purple (main brand color)
- `#887CFD` - Light purple (accents, hover states)
- `#4896FE` - Blue (informational, charts)
- `#16C8C7` - Turquoise (success, healthy status)

**Status Colors:**
- 🟢 Healthy/Success: `#16C8C7` (turquoise)
- 🟡 Warning: `#F59E0B` (amber)
- 🔴 Critical/Error: `#EF4444` (red)
- 🔵 Info: `#4896FE` (blue)

**Background Colors:**
- Primary Background: `#0F172A` (dark slate)
- Secondary Background: `#1E293B` (lighter slate)
- Card Background: `#1E293B` with subtle border
- Hover State: `#334155`

**Text Colors:**
- Primary Text: `#F8FAFC` (almost white)
- Secondary Text: `#94A3B8` (slate gray)
- Muted Text: `#64748B` (darker slate gray)

### Spacing System

- XXS: 4px
- XS: 8px
- SM: 12px
- MD: 16px
- LG: 24px
- XL: 32px
- 2XL: 48px
- 3XL: 64px

---

## Layout Structure

### Screen Dimensions

- **Target Resolution:** 1920x1080 (Full HD TV)
- **Aspect Ratio:** 16:9
- **Safe Zone Padding:** 32px on all sides

### Grid Layout

```
┌─────────────────────────────────────────────────────┐
│  Alert Banner (conditional)                         │
├─────────────────────────────────────────────────────┤
│  Header: Logo + Title + Date Range + Filters        │
├─────────────────────────────────────────────────────┤
│  Agent Status Grid (5 cards)                        │
│  [Card 1] [Card 2] [Card 3] [Card 4] [Card 5]      │
├──────────────────────────┬──────────────────────────┤
│                          │                          │
│  API Health Monitor      │  Live Activity Feed      │
│  (Left Panel)            │  (Right Panel)           │
│                          │                          │
├──────────────────────────┴──────────────────────────┤
│  Performance Metrics (3 charts)                     │
│  [Response Time] [Success Rate] [Conversations]     │
└─────────────────────────────────────────────────────┘
```

---

## Component Specifications

### 1. Header Bar

**Dimensions:**
- Height: 80px
- Background: `#1E293B`
- Border-bottom: 1px solid `#334155`

**Left Section:**
- Logo: HERA icon (40x40px) + "HERA Monitoring" text (24px SemiBold)

**Center Section:**
- Dashboard title: "Agent Performance Dashboard" (20px Medium)
- Last updated: Timestamp with auto-refresh indicator

**Right Section:**
- Date range selector (dropdown)
- Filter button (icon + text)
- Settings icon button

---

### 2. Alert Banner

**Dimensions:**
- Height: Auto (min 60px)
- Padding: 16px 32px
- Position: Slides down from top with animation
- Animation: 0.3s ease-out

**Critical Style:**
- Background: Linear gradient (`#EF4444` to `#DC2626`)
- Border-left: 6px solid `#991B1B`
- Pulsing animation: 2s infinite

**High Style:**
- Background: Linear gradient (`#F59E0B` to `#D97706`)
- Border-left: 6px solid `#B45309`

**Content:**
- Icon (32px) + Message (18px SemiBold) + Timestamp (14px)
- Acknowledge button (right side)
- Sound indicator toggle

---

### 3. Agent Status Card

**Dimensions:**
- Size: 360px x 200px
- Background: `#1E293B`
- Border-radius: 12px
- Border: 1px solid `#334155`
- Padding: 24px
- Box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)

**Hover Effect:**
- Transform: translateY(-4px)
- Box-shadow: 0 12px 24px rgba(83, 71, 206, 0.15)
- Border-color: `#5347CE`
- Transition: all 0.3s ease

**Layout:**
```
┌────────────────────────┐
│ [●] Client Name        │ ← Status dot (20px) + Name (20px SemiBold)
│                        │
│ Active: 12             │ ← Metric (32px Bold) + Label (14px)
│ Uptime: 99.8%          │
│                        │
│ Last Heartbeat:        │
│ 2 mins ago             │ ← Timestamp (14px, muted)
│                        │
│ [View Details →]       │ ← Link button
└────────────────────────┘
```

**Status Indicators:**
- Healthy: Solid turquoise circle (`#16C8C7`) with subtle glow
- Warning: Pulsing yellow circle (`#F59E0B`)
- Critical: Animated red circle (`#EF4444`) with ripple effect

---

### 4. API Health Monitor Panel

**Dimensions:**
- Width: 45% of center section width
- Background: `#1E293B`
- Border-radius: 12px
- Padding: 24px
- Max-height: 500px
- Overflow-y: auto with custom scrollbar

**Header:**
- Title: "API Health Status" (24px SemiBold)
- Refresh indicator (animated icon)

**API Item (each):**
- Height: 80px
- Margin-bottom: 12px
- Padding: 16px
- Background: `#0F172A`
- Border-radius: 8px
- Border-left: 4px solid (status color)

**Layout per item:**
```
┌────────────────────────────────┐
│ [Icon] API Name           [●]  │ ← Status badge
│ Response Time: 245ms           │ ← Metric + color coded
│ Failed: 2 in last hour         │
│ ━━━━━━━━━━━━━ [sparkline]     │ ← Mini chart
└────────────────────────────────┘
```

**Sparkline:**
- Height: 30px
- Color: Gradient based on performance
- Animate on data update

---

### 5. Live Activity Feed

**Dimensions:**
- Width: 45% of center section width
- Background: `#1E293B`
- Border-radius: 12px
- Padding: 24px
- Max-height: 500px

**Header:**
- Title: "Live Activity" (24px SemiBold)
- Filter chips: [All] [Critical] [High] [Medium] [Info]

**Feed Item (each):**
- Height: Auto (min 60px)
- Padding: 12px 16px
- Border-bottom: 1px solid `#334155`
- Animation: Slide in from right (0.3s ease)

**Layout per item:**
```
┌────────────────────────────────┐
│ [●] 10:45 AM | Client A       │ ← Time + Client
│ API Integration Failed         │ ← Event type (16px SemiBold)
│ Payment gateway timeout        │ ← Description (14px)
└────────────────────────────────┘
```

**Auto-scroll behavior:**
- New items appear at top
- Pause on hover
- Smooth scroll animation
- Max 50 items (older items removed)

---

### 6. Performance Metrics Charts

**Container:**
- Display: Grid (3 columns)
- Gap: 24px
- Padding: 24px

**Each Chart Card:**
- Background: `#1E293B`
- Border-radius: 12px
- Padding: 24px
- Height: 350px

**Chart 1: Response Time (Line Chart)**
- Title: "Response Time Trend" (20px SemiBold)
- X-axis: Time (last 24 hours)
- Y-axis: Milliseconds
- Lines: One per agent (different colors from palette)
- Gradient fill under line
- Interactive tooltip on hover
- Grid lines: `#334155`

**Chart 2: Success Rate (Bar Chart)**
- Title: "Success Rate by Agent" (20px SemiBold)
- X-axis: Agent names
- Y-axis: Percentage (0-100%)
- Bar colors: Gradient from `#5347CE` to `#887CFD`
- Show percentage label on top of each bar
- Target line at 95% (green dashed line)

**Chart 3: Conversations (Donut Chart)**
- Title: "Total Conversations Today" (20px SemiBold)
- Center: Total number (48px Bold)
- Segments: One per agent
- Colors: From color palette (purple, blue, turquoise shades)
- Legend: Below chart with agent names
- Interactive: Highlight segment on hover

---

## Animations & Transitions

### Page Load

1. Logo fades in (0.5s)
2. Header slides down (0.3s, delay 0.2s)
3. Agent cards fade in staggered (0.4s, delay 0.1s each)
4. Panels slide in from sides (0.5s, delay 0.5s)
5. Charts animate data (1s, delay 0.8s)

### Real-time Updates

- New activity feed item: Slide in from right (0.3s ease-out)
- Metric change: Number count-up animation (0.5s)
- Status change: Color transition with glow effect (0.4s)
- Chart update: Smooth data point transition (0.6s)

### Alert Animations

- Banner slide down: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Critical pulse: Scale 1 to 1.05, repeat (2s infinite)
- Dismiss: Slide up and fade out (0.3s)

### Hover States

- Card lift: translateY(-4px), duration 0.2s
- Button: Scale 1.05, duration 0.15s
- Icon: Rotate or bounce, duration 0.3s

---

## Data Visualization Guidelines

### Chart Color Usage

- Agent 1: `#5347CE` (primary purple)
- Agent 2: `#887CFD` (light purple)
- Agent 3: `#4896FE` (blue)
- Agent 4: `#16C8C7` (turquoise)
- Agent 5: `#8B5CF6` (violet)

### Chart Responsiveness

- Font sizes scale with container
- Minimum padding: 16px
- Axis labels: 12px minimum
- Legend items: 14px
- Tooltips: 14px with semi-transparent background

### Interactive Elements

- Hover: Show detailed tooltip
- Click: Drill down to detailed view
- Touch: Support for touch displays
- Keyboard: Tab navigation support

---

## Sound Design

### Alert Sounds

- **Critical:** Three ascending beeps (urgent)
- **High:** Two medium beeps (attention)
- **Medium:** Single soft beep (notification)
- **Info:** Subtle click (acknowledgment)

### Sound Settings

- Volume control: 0-100%
- Mute toggle in settings
- Test button for each sound
- Auto-mute during specific hours (configurable)

---

## Accessibility

### Color Contrast

- Text on dark background: Minimum 7:1 ratio
- Status indicators: Not relying on color alone (add icons)
- Color-blind friendly palette testing

### Keyboard Navigation

- Tab order: Logical flow through components
- Focus indicators: 2px solid `#5347CE` outline
- Shortcuts: Space (pause/play), F11 (fullscreen), Esc (dismiss alerts)

### Screen Readers

- ARIA labels on all interactive elements
- Live regions for activity feed updates
- Alert announcements for critical issues

---

## Responsive Behavior

### Large Display (TV - 1920x1080+)

- Default layout as described
- Font sizes optimized for viewing distance
- Maximum information density

### Medium Display (1280x720)

- Reduce padding by 25%
- Font sizes: -2px from defaults
- Stack performance charts 2+1

### Small Display (< 1280px)

- Single column layout
- Collapsible side panels
- Simplified charts

---

## UI/UX Best Practices for TV Display

1. **High Contrast:** Ensure all text is easily readable from 10 feet away
2. **Reduced Motion Option:** For users sensitive to animations
3. **Auto-dim:** Reduce brightness during off-peak hours
4. **No Hover Dependencies:** All info accessible without hover on touch displays
5. **Large Touch Targets:** Minimum 44x44px for interactive elements
6. **Loading States:** Skeleton screens instead of spinners
7. **Empty States:** Friendly messages with helpful illustrations
8. **Error States:** Clear, actionable error messages with recovery steps

---

## Implementation Notes

### CSS Variables Structure

```css
:root {
  /* Colors */
  --color-primary: #5347CE;
  --color-primary-light: #887CFD;
  --color-blue: #4896FE;
  --color-turquoise: #16C8C7;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #4896FE;
  
  /* Backgrounds */
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --bg-hover: #334155;
  
  /* Text */
  --text-primary: #F8FAFC;
  --text-secondary: #94A3B8;
  --text-muted: #64748B;
  
  /* Spacing */
  --space-xxs: 4px;
  --space-xs: 8px;
  --space-sm: 12px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
}
```

### Component Naming Convention

Use BEM (Block Element Modifier) methodology:
- Block: `agent-card`
- Element: `agent-card__title`
- Modifier: `agent-card--critical`

---

