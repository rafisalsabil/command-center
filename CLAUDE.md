# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HERA Agent Monitoring Dashboard - A real-time monitoring dashboard for AI customer service agents designed to display on a TV screen in team rooms. Monitors 5 AI agents (one per client) with performance metrics, API health tracking, and multi-channel alerting system.

## Development Commands

All commands should be run from the `hera-dashboard/` directory:

```bash
# Install dependencies
npm install

# Start development server (opens on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Architecture

### State Management Pattern
The application uses React hooks for state management with a centralized state in `App.tsx`. Key state includes:
- `agents`: Array of agent status objects updated via `setInterval` simulation
- `alerts`: Active alerts that appear in the banner (auto-acknowledge removes them)
- `activityEvents`: Rolling history of events (max 50 items)
- `notificationLogs`: Alert delivery history (max 50 items)
- `historicalData`: Metrics for charts (rolling window)

The simulation engine runs in a `useEffect` hook with configurable `refreshRate` (default 10 seconds), calling utility functions from `utils/mockData.ts` to update agent statuses and generate events.

### Component Hierarchy
```
App.tsx
├── AlertBanner (top overlay, shows up to 3 alerts)
├── Header (navigation, last updated time, notification/settings icons)
├── AgentCard × 5 (status cards in grid)
├── APIHealthMonitor (left panel, shows all agents' API integrations)
├── ActivityFeed (right panel, scrolling event stream)
├── PerformanceMetrics (bottom charts: response time, success rate, conversations)
├── NotificationPanel (slide-out sidebar)
└── SettingsPanel (slide-out sidebar)
```

### Type System
All TypeScript interfaces are centralized in `src/types/index.ts`:
- `Agent`: Core agent data structure with nested `APIIntegration[]`
- `Alert`: Alert/notification with severity and multi-channel delivery
- `ActivityEvent`: Feed items with timestamp and severity
- `NotificationLog`: Delivery tracking for alerts

### Data Simulation Logic (`utils/mockData.ts`)
- `generateInitialAgents()`: Creates 5 agents with varying initial statuses
- `updateAgentStatus()`: Randomly mutates agent state (conversations, API response times, status)
- `shouldGenerateAlert()`: Probabilistic alert triggering based on agent health
- `generateAlert()`: Creates alert with severity-based channel routing
- `generateActivityEvent()`: Creates feed events
- `generateHistoricalMetrics()`: Initial chart data

Alert severity determines notification channels:
- **Critical**: Email + WhatsApp + Discord + On-screen (sound alert)
- **High**: Discord + On-screen + Email
- **Medium**: Discord + On-screen
- **Low**: On-screen only

### Styling Architecture
- CSS modules per component (e.g., `AgentCard.css`, `ActivityFeed.css`)
- Global theme variables in `src/index.css` using CSS custom properties
- TV-optimized layout for 1920x1080 displays
- BEM naming convention for CSS classes
- Color scheme: Purple/blue accents (`--color-primary: #5347CE`, `--color-turquoise: #16C8C7`)

## Keyboard Shortcuts
Implemented in `App.tsx` useEffect:
- **Space**: Pause/resume real-time updates (toggles `isPaused` state)
- **Escape**: Dismiss all active alerts
- **F11**: Fullscreen mode (browser native)

## Common Modifications

### Adding/Removing Agents
Edit the `CLIENT_NAMES` array in `src/utils/mockData.ts`. The system auto-generates agent data based on array length.

### Changing Alert Logic
Modify `shouldGenerateAlert()` and `generateAlert()` in `src/utils/mockData.ts`. Alert severity thresholds:
- Critical: status === 'critical' OR any API down
- High: status === 'warning' OR slow APIs (>3s)
- Medium/Low: Random events

### Adjusting Refresh Rate
Default is 10 seconds in `App.tsx`. Users can change via Settings Panel (5-30 second range).

### Customizing Theme Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --color-primary: #5347CE;
  --color-turquoise: #16C8C7;
  --status-healthy: #16C8C7;
  --status-warning: #FFB84D;
  --status-critical: #FF4D4D;
}
```

## Technology Stack
- **React 19** with TypeScript
- **Vite 7** for build tooling and dev server
- **Recharts** for data visualization (LineChart, BarChart, PieChart)
- **Lucide React** for icons
- **ESLint** with TypeScript and React rules

## Important Implementation Details

### Real-Time Update Mechanism
The simulation uses `setInterval` with dependency on `[agents, refreshRate, isPaused, soundEnabled]`. When agents state updates, the effect re-registers to avoid stale closures.

### Event History Management
Both `activityEvents` and `notificationLogs` use `.slice(0, 50)` to prevent unbounded memory growth. Historical chart data has a fixed rolling window.

### Sound Alerts
Currently logs to console (`console.log('🔊 Critical alert sound played')`). To implement real audio, add HTML5 Audio API in the alert generation block in `App.tsx:76-79`.

### Panel State Management
Notification and Settings panels use boolean state (`notificationPanelOpen`, `settingsPanelOpen`). Panels slide in from the right with CSS transitions defined in their respective stylesheets.

## Development Tips

- The mock data generator creates realistic variations - don't expect perfectly stable metrics
- Alert generation is probabilistic; you may see clusters or gaps
- Status glow effects use CSS `box-shadow` animations with opacity transitions
- API health sparklines in `APIHealthMonitor` use inline SVG generated by Recharts
- Activity feed auto-scrolls unless hovered (CSS `overflow: auto` with `scroll-behavior: smooth`)
