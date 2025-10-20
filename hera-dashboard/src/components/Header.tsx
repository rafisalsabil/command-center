import { Bell, Settings } from 'lucide-react';
import './Header.css';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  lastUpdated: Date;
  unreadAlertsCount: number;
}

export default function Header({ onOpenNotifications, onOpenSettings, lastUpdated, unreadAlertsCount }: HeaderProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <header className="header">
      <div className="header__left">
        <div className="header__logo">
          <div className="header__logo-icon">H</div>
          <span className="header__logo-text">HERA Monitoring</span>
        </div>
      </div>

      <div className="header__center">
        <h1 className="header__title">Agent Performance Dashboard</h1>
        <div className="header__subtitle">
          <span className="header__status-indicator" />
          <span>Live - Last updated: {formatTime(lastUpdated)}</span>
        </div>
      </div>

      <div className="header__right">
        <button
          className="header__icon-button"
          onClick={onOpenNotifications}
          title="Notifications"
        >
          <Bell size={20} />
          {unreadAlertsCount > 0 && (
            <span className="header__badge">{unreadAlertsCount}</span>
          )}
        </button>
        <button
          className="header__icon-button"
          onClick={onOpenSettings}
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}
