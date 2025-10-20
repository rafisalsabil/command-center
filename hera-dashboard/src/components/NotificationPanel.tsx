import type { Alert, NotificationLog } from '../types/index';
import { X, Bell, Mail, MessageSquare, Monitor, Check, XCircle } from 'lucide-react';
import './NotificationPanel.css';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: Alert[];
  notificationLogs: NotificationLog[];
}

export default function NotificationPanel({ isOpen, onClose, alerts, notificationLogs }: NotificationPanelProps) {
  if (!isOpen) return null;

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case 'email':
        return <Mail size={16} />;
      case 'whatsapp':
        return <MessageSquare size={16} />;
      case 'discord':
        return <MessageSquare size={16} />;
      case 'on-screen':
        return <Monitor size={16} />;
      default:
        return <Bell size={16} />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="notification-panel-overlay" onClick={onClose} />
      <div className="notification-panel">
        <div className="notification-panel__header">
          <div className="notification-panel__title">
            <Bell size={24} />
            <h2>Alert Notifications</h2>
          </div>
          <button className="notification-panel__close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="notification-panel__content">
          <div className="notification-section">
            <h3 className="notification-section__title">Recent Alerts</h3>
            {alerts.length === 0 ? (
              <div className="notification-section__empty">
                <Bell size={32} />
                <p>No recent alerts</p>
              </div>
            ) : (
              <div className="notification-list">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`notification-item notification-item--${alert.severity}`}>
                    <div className="notification-item__header">
                      <span className="notification-item__severity">{alert.severity}</span>
                      <span className="notification-item__time">{formatTime(alert.timestamp)}</span>
                    </div>
                    <div className="notification-item__message">{alert.message}</div>
                    <div className="notification-item__channels">
                      {alert.channels.map((channel, index) => (
                        <div key={index} className="channel-badge">
                          {getChannelIcon(channel)}
                          <span>{channel}</span>
                        </div>
                      ))}
                    </div>
                    <div className="notification-item__status">
                      {alert.acknowledged ? (
                        <span className="status-acknowledged">
                          <Check size={14} />
                          Acknowledged
                        </span>
                      ) : (
                        <span className="status-pending">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="notification-section">
            <h3 className="notification-section__title">Notification Log</h3>
            {notificationLogs.length === 0 ? (
              <div className="notification-section__empty">
                <MessageSquare size={32} />
                <p>No notifications sent yet</p>
              </div>
            ) : (
              <div className="notification-list">
                {notificationLogs.map((log) => (
                  <div key={log.id} className="notification-log-item">
                    <div className="notification-log-item__header">
                      <span className="notification-log-item__time">{formatTime(log.timestamp)}</span>
                      {log.status === 'sent' ? (
                        <span className="notification-log-item__status notification-log-item__status--sent">
                          <Check size={14} />
                          Sent
                        </span>
                      ) : (
                        <span className="notification-log-item__status notification-log-item__status--failed">
                          <XCircle size={14} />
                          Failed
                        </span>
                      )}
                    </div>
                    <div className="notification-log-item__channels">
                      {log.channels.map((channel, index) => (
                        <span key={index} className="channel-tag">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
