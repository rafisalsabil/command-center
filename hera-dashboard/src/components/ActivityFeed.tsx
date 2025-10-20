import { useState } from 'react';
import type { ActivityEvent, AlertSeverity } from '../types/index';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import './ActivityFeed.css';

interface ActivityFeedProps {
  events: ActivityEvent[];
}

export default function ActivityFeed({ events }: ActivityFeedProps) {
  const [filter, setFilter] = useState<AlertSeverity | 'all'>('all');
  const [isPaused, setIsPaused] = useState(false);

  const filteredEvents = filter === 'all'
    ? events
    : events.filter(event => event.severity === filter);

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle size={16} />;
      case 'high':
        return <AlertTriangle size={16} />;
      case 'medium':
        return <AlertTriangle size={16} />;
      case 'low':
        return <Info size={16} />;
      default:
        return <CheckCircle size={16} />;
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return 'var(--color-error)';
      case 'high':
        return 'var(--color-warning)';
      case 'medium':
        return 'var(--color-warning)';
      case 'low':
        return 'var(--color-blue)';
      default:
        return 'var(--text-secondary)';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="activity-feed">
      <div className="activity-feed__header">
        <h2 className="activity-feed__title">Live Activity</h2>
        <div className="activity-feed__filters">
          <button
            className={`filter-chip ${filter === 'all' ? 'filter-chip--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-chip ${filter === 'critical' ? 'filter-chip--active' : ''}`}
            onClick={() => setFilter('critical')}
          >
            Critical
          </button>
          <button
            className={`filter-chip ${filter === 'high' ? 'filter-chip--active' : ''}`}
            onClick={() => setFilter('high')}
          >
            High
          </button>
          <button
            className={`filter-chip ${filter === 'medium' ? 'filter-chip--active' : ''}`}
            onClick={() => setFilter('medium')}
          >
            Medium
          </button>
          <button
            className={`filter-chip ${filter === 'low' ? 'filter-chip--active' : ''}`}
            onClick={() => setFilter('low')}
          >
            Info
          </button>
        </div>
      </div>

      <div
        className={`activity-feed__list ${isPaused ? 'activity-feed__list--paused' : ''}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {filteredEvents.length === 0 ? (
          <div className="activity-feed__empty">
            <Info size={32} />
            <p>No events to display</p>
          </div>
        ) : (
          filteredEvents.slice(0, 50).map((event, index) => (
            <div
              key={event.id}
              className="activity-item slide-in-right"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className="activity-item__indicator"
                style={{ color: getSeverityColor(event.severity) }}
              >
                {getSeverityIcon(event.severity)}
              </div>
              <div className="activity-item__content">
                <div className="activity-item__header">
                  <span className="activity-item__time">{formatTime(event.timestamp)}</span>
                  <span className="activity-item__separator">|</span>
                  <span className="activity-item__client">{event.clientName}</span>
                </div>
                <div className="activity-item__type">{event.eventType.replace('_', ' ').toUpperCase()}</div>
                <div className="activity-item__description">{event.description}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
