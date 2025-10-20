# HERA Agent Monitoring Dashboard

A real-time monitoring dashboard for AI customer service agents, designed to display on a TV screen in team rooms.

## Features

### Core Functionality
- **5 Agent Status Cards** - Real-time status, active conversations, uptime, and success rates
- **API Health Monitor** - Track API integrations with response times and sparkline charts
- **Live Activity Feed** - Scrolling feed of events with severity filtering
- **Performance Charts** - Response time trends, success rates, and conversation distribution
- **Multi-Channel Alerts** - Critical, high, medium, and low severity notifications
- **Notification Panel** - Complete alert history and notification logs
- **Settings Panel** - Configure sound, refresh rate, and keyboard shortcuts

### Real-Time Simulation
- Automatic data updates every 10 seconds (configurable)
- Random event generation simulating real agent behavior
- Status changes, API failures, and performance fluctuations
- Alert generation based on agent health and performance

### Design Features
- TV-optimized layout (1920x1080)
- Dark theme with purple/blue accent colors
- Smooth animations and transitions
- Status indicators with glow effects
- Responsive design for different screen sizes

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the project directory:
\`\`\`bash
cd hera-dashboard
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open your browser to [http://localhost:5173](http://localhost:5173)

### Building for Production

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Usage

### Keyboard Shortcuts
- **Space** - Pause/resume real-time updates
- **F11** - Toggle fullscreen mode
- **Esc** - Dismiss all active alerts

### Settings
Click the settings icon in the header to:
- Toggle alert sounds on/off
- Adjust data refresh rate (5-30 seconds)
- Export logs to CSV
- Access keyboard shortcuts reference

### Notifications
Click the bell icon in the header to view:
- Recent alerts with severity levels
- Notification channels used (Email, WhatsApp, Discord, etc.)
- Complete notification log history
- Acknowledgment status

## Architecture

### Components
- **Header** - Navigation and status bar
- **AgentCard** - Individual agent status display
- **APIHealthMonitor** - API integration health panel
- **ActivityFeed** - Real-time event stream
- **PerformanceMetrics** - Data visualization charts
- **AlertBanner** - Alert notification system
- **NotificationPanel** - Alert history sidebar
- **SettingsPanel** - Configuration panel

### Data Layer
- TypeScript interfaces for type safety
- Mock data generator with realistic patterns
- Real-time update simulation using setInterval
- State management with React hooks

### Styling
- CSS custom properties for theming
- BEM naming convention
- Responsive breakpoints for different screen sizes
- Animation keyframes for smooth transitions

## Alert Severity Levels

### Critical (Red)
- Agent offline, API complete failure, authentication errors
- Channels: Email + WhatsApp + Discord + On-screen
- Sound alert + pulsing animation

### High (Yellow)
- API degraded (>3s), error rate >10%, high load
- Channels: Discord + On-screen + Email
- No sound alert

### Medium (Orange)
- Isolated failures, slow response (2-3s)
- Channels: Discord + On-screen
- Activity feed indicator only

### Low (Blue)
- Informational events, restarts, milestones
- Channels: On-screen only
- Activity feed indicator only

## Customization

### Modifying Agent Count
Edit \`src/utils/mockData.ts\`:
\`\`\`typescript
const CLIENT_NAMES = ['Client A', 'Client B', 'Client C', 'Client D', 'Client E'];
// Add or remove clients as needed
\`\`\`

### Adjusting Colors
Edit CSS variables in \`src/index.css\`:
\`\`\`css
:root {
  --color-primary: #5347CE;
  --color-turquoise: #16C8C7;
  /* ... */
}
\`\`\`

### Changing Refresh Rates
Default refresh rate can be modified in \`src/App.tsx\`:
\`\`\`typescript
const [refreshRate, setRefreshRate] = useState(10); // seconds
\`\`\`

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **CSS Custom Properties** - Theming system

## Performance Optimization

- Component memoization for expensive renders
- Efficient state updates with React hooks
- Debounced event handlers
- Limited history retention (50 items max)
- Lazy loading for panel components

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Optimized for modern browsers with CSS Grid and Custom Properties support.

## License

MIT

## Credits

Built with Claude Code for the HERA AI Customer Service team.
