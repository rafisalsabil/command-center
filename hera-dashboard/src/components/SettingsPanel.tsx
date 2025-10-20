import { X, Volume2, VolumeX, Maximize, Download } from 'lucide-react';
import './SettingsPanel.css';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  refreshRate: number;
  onRefreshRateChange: (rate: number) => void;
}

export default function SettingsPanel({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
  refreshRate,
  onRefreshRateChange
}: SettingsPanelProps) {
  if (!isOpen) return null;

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleExportLogs = () => {
    // Simulated export functionality
    const timestamp = new Date().toISOString().split('T')[0];
    alert(`Logs exported as hera-logs-${timestamp}.csv`);
  };

  return (
    <>
      <div className="settings-panel-overlay" onClick={onClose} />
      <div className="settings-panel">
        <div className="settings-panel__header">
          <h2>Settings</h2>
          <button className="settings-panel__close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="settings-panel__content">
          <div className="settings-section">
            <h3 className="settings-section__title">Audio</h3>
            <div className="settings-item">
              <div className="settings-item__info">
                <div className="settings-item__label">Alert Sounds</div>
                <div className="settings-item__description">
                  Play sound notifications for critical alerts
                </div>
              </div>
              <button
                className={`settings-toggle ${soundEnabled ? 'settings-toggle--active' : ''}`}
                onClick={onToggleSound}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                <span>{soundEnabled ? 'On' : 'Off'}</span>
              </button>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="settings-section__title">Display</h3>
            <div className="settings-item">
              <div className="settings-item__info">
                <div className="settings-item__label">Refresh Rate</div>
                <div className="settings-item__description">
                  How often data updates (seconds)
                </div>
              </div>
              <select
                className="settings-select"
                value={refreshRate}
                onChange={(e) => onRefreshRateChange(Number(e.target.value))}
              >
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="settings-section__title">Actions</h3>
            <button className="settings-action-button" onClick={handleFullscreen}>
              <Maximize size={20} />
              <span>Toggle Fullscreen</span>
              <span className="settings-action-button__shortcut">F11</span>
            </button>
            <button className="settings-action-button" onClick={handleExportLogs}>
              <Download size={20} />
              <span>Export Logs to CSV</span>
            </button>
          </div>

          <div className="settings-section">
            <h3 className="settings-section__title">Keyboard Shortcuts</h3>
            <div className="shortcuts-list">
              <div className="shortcut-item">
                <span className="shortcut-key">F11</span>
                <span className="shortcut-description">Toggle fullscreen</span>
              </div>
              <div className="shortcut-item">
                <span className="shortcut-key">Space</span>
                <span className="shortcut-description">Pause/resume updates</span>
              </div>
              <div className="shortcut-item">
                <span className="shortcut-key">Esc</span>
                <span className="shortcut-description">Dismiss alerts</span>
              </div>
            </div>
          </div>

          <div className="settings-footer">
            <p className="settings-footer__version">HERA Dashboard v1.0.0</p>
            <p className="settings-footer__info">Monitoring 5 AI Customer Service Agents</p>
          </div>
        </div>
      </div>
    </>
  );
}
