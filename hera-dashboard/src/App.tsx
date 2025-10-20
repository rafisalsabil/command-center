import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import AgentCard from './components/AgentCard';
import SystemMaintenanceCenter from './components/SystemMaintenanceCenter';
import ActivityFeed from './components/ActivityFeed';
import PerformanceMetrics from './components/PerformanceMetrics';
import AlertBanner from './components/AlertBanner';
import NotificationPanel from './components/NotificationPanel';
import SettingsPanel from './components/SettingsPanel';
import AgentDetailModal from './components/AgentDetailModal';
import type { Agent, Alert, ActivityEvent, NotificationLog, MetricDataPoint } from './types/index';
import {
  generateInitialAgents,
  generateHistoricalMetrics,
  updateAgentStatus,
  shouldGenerateAlert,
  shouldGenerateEvent,
  generateAlert,
  generateActivityEvent
} from './utils/mockData';
import './App.css';

function App() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>([]);
  const [historicalData, setHistoricalData] = useState<MetricDataPoint[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [refreshRate, setRefreshRate] = useState(10);
  const [isPaused, setIsPaused] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    const initialAgents = generateInitialAgents();
    setAgents(initialAgents);
    setHistoricalData(generateHistoricalMetrics(initialAgents));

    // Generate some initial activity events
    const initialEvents: ActivityEvent[] = [];
    initialAgents.forEach(agent => {
      if (Math.random() > 0.5) {
        initialEvents.push(generateActivityEvent(agent));
      }
    });
    setActivityEvents(initialEvents);
  }, []);

  // Real-time simulation
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setAgents(prevAgents => {
        const updatedAgents = prevAgents.map(updateAgentStatus);

        // Check if we should generate alerts
        // DISABLED: Alert notifications turned off
        // updatedAgents.forEach(agent => {
        //   if (shouldGenerateAlert(agent)) {
        //     const newAlert = generateAlert(agent);
        //     setAlerts(prev => [newAlert, ...prev]);

        //     // Simulate notification log
        //     const log: NotificationLog = {
        //       id: `log-${Date.now()}-${Math.random()}`,
        //       alertId: newAlert.id,
        //       timestamp: new Date(),
        //       channels: newAlert.channels,
        //       status: 'sent'
        //     };
        //     setNotificationLogs(prev => [log, ...prev].slice(0, 50));

        //     // Play sound for critical alerts
        //     if (soundEnabled && newAlert.severity === 'critical') {
        //       // In a real app, play actual sound here
        //       console.log('🔊 Critical alert sound played');
        //     }
        //   }
        // });

        // Generate activity events
        if (shouldGenerateEvent()) {
          const randomAgent = updatedAgents[Math.floor(Math.random() * updatedAgents.length)];
          const newEvent = generateActivityEvent(randomAgent);
          setActivityEvents(prev => [newEvent, ...prev].slice(0, 50));
        }

        return updatedAgents;
      });

      // Update historical metrics
      setHistoricalData(prev => {
        const newPoint: MetricDataPoint = {
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
        agents.forEach(agent => {
          newPoint[agent.clientName] = Math.round(200 + Math.random() * 300);
        });
        return [...prev.slice(1), newPoint];
      });

      setLastUpdated(new Date());
    }, refreshRate * 1000);

    return () => clearInterval(interval);
  }, [agents, refreshRate, isPaused, soundEnabled]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      } else if (e.key === 'Escape') {
        setAlerts([]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleAcknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  const handleViewAgentDetails = useCallback((agent: Agent) => {
    setSelectedAgent(agent);
    setDetailModalOpen(true);
  }, []);

  const unreadAlertsCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="app">
      <AlertBanner
        alerts={alerts.slice(0, 3)}
        onAcknowledge={handleAcknowledgeAlert}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
      />

      <Header
        onOpenNotifications={() => setNotificationPanelOpen(true)}
        onOpenSettings={() => setSettingsPanelOpen(true)}
        lastUpdated={lastUpdated}
        unreadAlertsCount={unreadAlertsCount}
      />

      <main className="main-content">
        <section className="agent-grid-section">
          <div className="agent-grid">
            {agents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onClick={() => handleViewAgentDetails(agent)}
              />
            ))}
          </div>
        </section>

        <section className="center-panels">
          <SystemMaintenanceCenter agents={agents} />
          <ActivityFeed events={activityEvents} />
        </section>

        <PerformanceMetrics agents={agents} historicalData={historicalData} />
      </main>

      <NotificationPanel
        isOpen={notificationPanelOpen}
        onClose={() => setNotificationPanelOpen(false)}
        alerts={alerts}
        notificationLogs={notificationLogs}
      />

      <SettingsPanel
        isOpen={settingsPanelOpen}
        onClose={() => setSettingsPanelOpen(false)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        refreshRate={refreshRate}
        onRefreshRateChange={setRefreshRate}
      />

      {isPaused && (
        <div className="pause-indicator">
          <div className="pause-indicator__content">
            ⏸️ Updates Paused - Press Space to Resume
          </div>
        </div>
      )}

      <AgentDetailModal
        agent={selectedAgent}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
      />
    </div>
  );
}

export default App;
