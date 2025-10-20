import type { Alert } from '../types/index';
import { AlertCircle, AlertTriangle, X, Volume2, VolumeX } from 'lucide-react';
import './AlertBanner.css';

interface AlertBannerProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function AlertBanner({ alerts, onAcknowledge, soundEnabled, onToggleSound }: AlertBannerProps) {
  if (alerts.length === 0) return null;

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle size={32} />;
      case 'high':
        return <AlertTriangle size={32} />;
      default:
        return <AlertTriangle size={28} />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="alert-banner-container">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`alert-banner alert-banner--${alert.severity} slide-down`}
        >
          <div className="alert-banner__icon">
            {getAlertIcon(alert.severity)}
          </div>
          <div className="alert-banner__content">
            <div className="alert-banner__header">
              <span className="alert-banner__type">{alert.type}</span>
              <span className="alert-banner__time">{formatTime(alert.timestamp)}</span>
            </div>
            <div className="alert-banner__message">{alert.message}</div>
            <div className="alert-banner__channels">
              <span className="alert-banner__channels-label">Notified via:</span>
              {alert.channels.map((channel, index) => (
                <span key={index} className="alert-banner__channel">
                  {channel}
                </span>
              ))}
            </div>
          </div>
          <div className="alert-banner__actions">
            <button
              className="alert-banner__sound-toggle"
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute alerts' : 'Unmute alerts'}
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              className="alert-banner__acknowledge"
              onClick={() => onAcknowledge(alert.id)}
            >
              <X size={20} />
              <span>Acknowledge</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
