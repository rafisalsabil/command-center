Build a real-time monitoring dashboard for AI customer service agents that displays on a TV screen in a team room.

## PROJECT OVERVIEW
Create a full-screen web dashboard that monitors 5 AI customer service agents (one per client) and displays their performance metrics, API health, and sends multi-channel alerts when issues occur.

## CORE FEATURES

### 1. AGENT STATUS GRID (Top Section)
- Display 5 agent cards in a responsive grid
- Each card shows:
  - Client name (e.g., "Client A", "Client B", etc.)
  - Status indicator: Green (healthy), Yellow (warning), Red (critical)
  - Current active conversations count
  - Last heartbeat timestamp
  - Quick stats: uptime %, success rate %
- Cards should have subtle animations and glow effect based on status
- Click on a card to see detailed logs

### 2. API HEALTH MONITOR (Center-Left Panel)
- List of API integrations per agent showing:
  - API endpoint name
  - Status badge (operational/degraded/down)
  - Average response time (with color coding: <1s green, 1-3s yellow, >3s red)
  - Failed calls in last hour
  - Mini sparkline chart showing response time trend
- Auto-refresh every 10 seconds

### 3. LIVE ACTIVITY FEED (Center-Right Panel)
- Real-time scrolling feed of events
- Each event shows:
  - Timestamp
  - Client/Agent name
  - Event type (API Failure, Slow Response, Error, Recovery, etc.)
  - Severity indicator (color-coded)
  - Brief description
- Auto-scroll with pause on hover
- Filter buttons at top: All, Critical, High, Medium, Info

### 4. PERFORMANCE METRICS (Bottom Section)
- 3 charts side by side:
  - Line chart: Response times over last 24 hours (all agents)
  - Bar chart: Success rate % per agent
  - Donut chart: Total conversations handled today by agent
- Time range selector: Last hour / 6 hours / 24 hours

### 5. ALERT BANNER (Top of Screen)
- Hidden by default
- When alert triggers:
  - Slides down from top with animation
  - Shows: severity icon, message, affected agent, timestamp
  - Color matches severity (red/yellow/orange)
  - "Acknowledge" button to dismiss
  - Plays sound for critical alerts (optional toggle)
- Multiple alerts stack vertically

## ALERT SEVERITY SYSTEM

Define 4 severity levels with different behaviors:

**CRITICAL (Red):**
- Triggers: API complete failure, agent offline, auth errors
- UI: Full-width red banner, pulsing animation, sound alert
- Simulated channels: Email + WhatsApp + Discord + On-screen

**HIGH (Yellow):**
- Triggers: API degraded (>3s), error rate >10%, high load
- UI: Yellow banner, no sound
- Simulated channels: Discord + On-screen + Email

**MEDIUM (Orange):**
- Triggers: Isolated failures, slow response (2-3s)
- UI: Orange indicator in activity feed
- Simulated channels: Discord + On-screen

**LOW (Blue):**
- Triggers: Informational events, restarts, milestones
- UI: Blue entry in activity feed only
- Simulated channels: On-screen only

## ALERT NOTIFICATION PANEL
- Add a sidebar (accessible via icon in top-right) showing:
  - Log of all alerts sent
  - Which channels were notified
  - Timestamp and status (sent/failed)
  - Acknowledgment history
- For MVP, simulate sending notifications (show toast: "Alert sent to WhatsApp, Discord, Email")

## TECHNICAL REQUIREMENTS

**Data Simulation:**
- Create mock data that simulates real-time updates
- Use setInterval to randomly generate events every 5-30 seconds
- Simulate API response times, failures, recoveries
- Each agent should have different performance characteristics
- Store metrics history (last 24 hours) in state



**Tech Stack:**
- React with TypeScript
- Recharts for data visualization
- Tailwind CSS for styling
- Lucide React for icons
- Use React hooks for state management
- WebSocket simulation with setInterval for real-time updates

## SAMPLE DATA STRUCTURE
```typescript
interface Agent {
  id: string;
  clientName: string;
  status: 'healthy' | 'warning' | 'critical';
  activeConversations: number;
  lastHeartbeat: Date;
  uptime: number;
  successRate: number;
  apis: APIIntegration[];
}

interface APIIntegration {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime: number;
  failedCalls: number;
  responseHistory: number[];
}

interface Alert {
  id: string;
  timestamp: Date;
  severity: 'critical' | 'high' | 'medium' | 'low';
  agentId: string;
  type: string;
  message: string;
  channels: string[];
  acknowledged: boolean;
}
```

## INITIAL SCREEN CONTENT
- Show 5 agents with varying statuses (3 healthy, 1 warning, 1 critical)
- Populate with sample historical data
- Start event simulation immediately on load
- Display welcome message: "HERA Agent Monitoring Dashboard - Live"

## ADDING FEATURES FOR MVP
- Settings panel: toggle sound, adjust refresh rate, theme switcher
- Export logs/metrics to CSV
- Keyboard shortcuts (F11 for fullscreen, Space to pause updates)
- Connection status indicator (simulated)

Build this as a single-page application that looks professional and is ready to display on a TV screen in the HERA working room.