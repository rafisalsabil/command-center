import { X } from 'lucide-react';
import type { Agent } from '../types/index';
import './AgentDetailModal.css';

interface AgentDetailModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ConversationLog {
  id: string;
  timestamp: Date;
  customerMessage: string;
  agentResponse: string;
  duration: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

interface ErrorLog {
  id: string;
  timestamp: Date;
  errorType: string;
  message: string;
  stackTrace: string;
}

interface APICallLog {
  id: string;
  timestamp: Date;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
}

// Mock data generators
function generateConversationLogs(count: number): ConversationLog[] {
  const sentiments: ('positive' | 'neutral' | 'negative')[] = ['positive', 'neutral', 'negative'];
  const messages = [
    { customer: 'How can I track my order?', agent: 'I can help you track your order. Please provide your order number.' },
    { customer: 'What are your business hours?', agent: 'We are open Monday to Friday, 9 AM to 6 PM.' },
    { customer: 'I need to reset my password', agent: 'I will send you a password reset link to your email.' },
    { customer: 'Can I change my delivery address?', agent: 'Yes, I can update your delivery address. What is the new address?' },
    { customer: 'When will my refund be processed?', agent: 'Refunds typically take 5-7 business days to process.' }
  ];

  return Array.from({ length: count }, (_, i) => {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    return {
      id: `conv-${i}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 2),
      customerMessage: msg.customer,
      agentResponse: msg.agent,
      duration: Math.round(30 + Math.random() * 120),
      sentiment: sentiments[Math.floor(Math.random() * sentiments.length)]
    };
  }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function generateErrorLogs(count: number): ErrorLog[] {
  const errorTypes = ['TimeoutError', 'ValidationError', 'AuthenticationError', 'NetworkError', 'DatabaseError'];
  const messages = [
    'Request timeout after 30 seconds',
    'Invalid input parameters',
    'Failed to authenticate user',
    'Network connection lost',
    'Database query failed'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `error-${i}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000),
    errorType: errorTypes[Math.floor(Math.random() * errorTypes.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    stackTrace: `at processRequest (agent.js:${Math.floor(Math.random() * 500)})\nat handleResponse (api.js:${Math.floor(Math.random() * 300)})`
  })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function generateAPICallLogs(count: number): APICallLog[] {
  const endpoints = ['/api/users', '/api/orders', '/api/products', '/api/auth', '/api/payments'];
  const methods = ['GET', 'POST', 'PUT', 'DELETE'];
  const statusCodes = [200, 201, 400, 401, 404, 500, 503];

  return Array.from({ length: count }, (_, i) => ({
    id: `api-${i}`,
    timestamp: new Date(Date.now() - Math.random() * 86400000),
    endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
    method: methods[Math.floor(Math.random() * methods.length)],
    statusCode: statusCodes[Math.floor(Math.random() * statusCodes.length)],
    responseTime: Math.round(50 + Math.random() * 500)
  })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export default function AgentDetailModal({ agent, isOpen, onClose }: AgentDetailModalProps) {
  if (!isOpen || !agent) return null;

  const conversationLogs = generateConversationLogs(50);
  const errorLogs = generateErrorLogs(20);
  const apiCallLogs = generateAPICallLogs(30);

  const formatTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{agent.clientName} - Agent Details</h2>
            <div className="modal-subtitle">
              <span className={`status-badge status-badge--${agent.status}`}>
                {agent.status.toUpperCase()}
              </span>
              <span className="modal-subtitle-text">
                Uptime: {agent.uptime}% | Success Rate: {agent.successRate}%
              </span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Agent Configuration */}
          <section className="detail-section">
            <h3 className="section-title">Agent Configuration</h3>
            <div className="config-grid">
              <div className="config-item">
                <span className="config-label">Agent ID:</span>
                <span className="config-value">{agent.id}</span>
              </div>
              <div className="config-item">
                <span className="config-label">Active Conversations:</span>
                <span className="config-value">{agent.activeConversations}</span>
              </div>
              <div className="config-item">
                <span className="config-label">Last Heartbeat:</span>
                <span className="config-value">{formatTime(agent.lastHeartbeat)}</span>
              </div>
              <div className="config-item">
                <span className="config-label">Total Conversations Today:</span>
                <span className="config-value">{agent.totalConversationsToday}</span>
              </div>
            </div>
          </section>

          {/* API Health Details */}
          <section className="detail-section">
            <h3 className="section-title">API Integrations</h3>
            <div className="table-container">
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>API Name</th>
                    <th>Status</th>
                    <th>Response Time</th>
                    <th>Failed Calls (1h)</th>
                  </tr>
                </thead>
                <tbody>
                  {agent.apis.map((api, index) => (
                    <tr key={index}>
                      <td>{api.name}</td>
                      <td>
                        <span className={`api-status api-status--${api.status}`}>
                          {api.status}
                        </span>
                      </td>
                      <td className={`response-time response-time--${api.responseTime > 3000 ? 'slow' : api.responseTime > 1000 ? 'medium' : 'fast'}`}>
                        {api.responseTime}ms
                      </td>
                      <td>{api.failedCalls}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recent Conversation Logs */}
          <section className="detail-section">
            <h3 className="section-title">Recent Conversation Logs (Last 50)</h3>
            <div className="logs-container">
              {conversationLogs.map((log) => (
                <div key={log.id} className="log-item conversation-log">
                  <div className="log-header">
                    <span className="log-timestamp">{formatTime(log.timestamp)}</span>
                    <span className={`sentiment-badge sentiment-badge--${log.sentiment}`}>
                      {log.sentiment}
                    </span>
                    <span className="log-duration">{log.duration}s</span>
                  </div>
                  <div className="log-message">
                    <strong>Customer:</strong> {log.customerMessage}
                  </div>
                  <div className="log-message log-message--response">
                    <strong>Agent:</strong> {log.agentResponse}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Error Logs */}
          <section className="detail-section">
            <h3 className="section-title">Error Logs</h3>
            <div className="logs-container">
              {errorLogs.map((log) => (
                <div key={log.id} className="log-item error-log">
                  <div className="log-header">
                    <span className="log-timestamp">{formatTime(log.timestamp)}</span>
                    <span className="error-type">{log.errorType}</span>
                  </div>
                  <div className="log-message error-message">{log.message}</div>
                  <details className="stack-trace">
                    <summary>Stack Trace</summary>
                    <pre>{log.stackTrace}</pre>
                  </details>
                </div>
              ))}
            </div>
          </section>

          {/* API Call History */}
          <section className="detail-section">
            <h3 className="section-title">API Call History</h3>
            <div className="table-container">
              <table className="detail-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Method</th>
                    <th>Endpoint</th>
                    <th>Status Code</th>
                    <th>Response Time</th>
                  </tr>
                </thead>
                <tbody>
                  {apiCallLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{formatTime(log.timestamp)}</td>
                      <td>
                        <span className={`method-badge method-badge--${log.method.toLowerCase()}`}>
                          {log.method}
                        </span>
                      </td>
                      <td className="endpoint-cell">{log.endpoint}</td>
                      <td>
                        <span className={`status-code status-code--${log.statusCode >= 500 ? 'error' : log.statusCode >= 400 ? 'warning' : 'success'}`}>
                          {log.statusCode}
                        </span>
                      </td>
                      <td>{log.responseTime}ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
