import type { Agent } from '../types/index';
import { Server, RefreshCw } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import './APIHealthMonitor.css';

interface APIHealthMonitorProps {
  agents: Agent[];
}

export default function APIHealthMonitor({ agents }: APIHealthMonitorProps) {
  const allAPIs = agents.flatMap(agent =>
    agent.apis.map(api => ({
      ...api,
      agentName: agent.clientName
    }))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'var(--color-turquoise)';
      case 'degraded':
        return 'var(--color-warning)';
      case 'down':
        return 'var(--color-error)';
      default:
        return 'var(--text-muted)';
    }
  };

  const getResponseTimeColor = (time: number) => {
    if (time < 1000) return 'var(--color-turquoise)';
    if (time < 3000) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  return (
    <div className="api-health-monitor">
      <div className="api-health-monitor__header">
        <h2 className="api-health-monitor__title">API Health Status</h2>
        <div className="api-health-monitor__refresh">
          <RefreshCw size={16} className="rotating" />
        </div>
      </div>

      <div className="api-health-monitor__list">
        {allAPIs.map((api, index) => (
          <div key={`${api.agentName}-${api.name}-${index}`} className="api-item">
            <div className="api-item__header">
              <div className="api-item__icon">
                <Server size={20} />
              </div>
              <div className="api-item__info">
                <div className="api-item__name">{api.name}</div>
                <div className="api-item__agent">{api.agentName}</div>
              </div>
              <div
                className="api-item__status-badge"
                style={{
                  backgroundColor: getStatusColor(api.status),
                  color: 'white'
                }}
              >
                {api.status}
              </div>
            </div>

            <div className="api-item__metrics">
              <div className="api-metric">
                <span className="api-metric__label">Response Time:</span>
                <span
                  className="api-metric__value"
                  style={{ color: getResponseTimeColor(api.responseTime) }}
                >
                  {api.responseTime}ms
                </span>
              </div>
              <div className="api-metric">
                <span className="api-metric__label">Failed calls (1h):</span>
                <span className="api-metric__value">{api.failedCalls}</span>
              </div>
            </div>

            <div className="api-item__sparkline">
              <ResponsiveContainer width="100%" height={30}>
                <LineChart data={api.responseHistory.map((value, i) => ({ value, index: i }))}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={getStatusColor(api.status)}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
