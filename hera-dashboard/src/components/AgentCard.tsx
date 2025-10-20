import type { Agent } from '../types/index';
import { Activity, Clock, TrendingUp } from 'lucide-react';
import './AgentCard.css';

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
}

export default function AgentCard({ agent, onClick }: AgentCardProps) {
  const getStatusColor = () => {
    switch (agent.status) {
      case 'healthy':
        return 'var(--color-turquoise)';
      case 'warning':
        return 'var(--color-warning)';
      case 'critical':
        return 'var(--color-error)';
      default:
        return 'var(--text-secondary)';
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className={`agent-card agent-card--${agent.status}`} onClick={onClick}>
      <div className="agent-card__header">
        <div className="agent-card__status-indicator">
          <div
            className={`status-dot status-dot--${agent.status}`}
            style={{ backgroundColor: getStatusColor() }}
          />
          {agent.status === 'critical' && <div className="status-dot__ripple" />}
        </div>
        <h3 className="agent-card__title">{agent.clientName}</h3>
      </div>

      <div className="agent-card__metrics">
        <div className="metric">
          <div className="metric__icon">
            <Activity size={20} />
          </div>
          <div className="metric__content">
            <div className="metric__value">{agent.activeConversations}</div>
            <div className="metric__label">Active Conversations</div>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric-item">
            <div className="metric-item__label">Uptime</div>
            <div className="metric-item__value">{agent.uptime.toFixed(1)}%</div>
          </div>
          <div className="metric-item">
            <div className="metric-item__label">Success Rate</div>
            <div className="metric-item__value">{agent.successRate.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      <div className="agent-card__footer">
        <div className="agent-card__heartbeat">
          <Clock size={14} />
          <span>Last heartbeat: {getTimeAgo(agent.lastHeartbeat)}</span>
        </div>
        <button className="agent-card__details-btn">
          <TrendingUp size={14} />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
}
