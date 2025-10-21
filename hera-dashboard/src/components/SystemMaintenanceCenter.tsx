import { useState } from 'react';
import { Server, Radio, Database, Inbox, Shield } from 'lucide-react';
import type { Agent } from '../types/index';
import './SystemMaintenanceCenter.css';

interface SystemMaintenanceCenterProps {
  agents: Agent[];
}

type TabType = 'apis' | 'channels' | 'database' | 'infrastructure' | 'queues' | 'security';

interface ChannelStatus {
  name: string;
  status: 'connected' | 'degraded' | 'disconnected';
  syncLag: number;
  inboundQueue: number;
  outboundQueue: number;
  rateLimit: { current: number; max: number };
  lastSync: Date;
}

interface DatabaseStatus {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  connections: { active: number; max: number };
  queryTime: number;
  replicationLag: number;
  diskUsage: number;
}

interface InfrastructureStatus {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  cpu: number;
  memory: number;
  disk: number;
  network: 'up' | 'degraded' | 'down';
}

interface QueueStatus {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  depth: number;
  processingRate: number;
  deadLetterQueue: number;
}

interface SecurityStatus {
  name: string;
  status: 'valid' | 'warning' | 'expired';
  type: 'ssl_cert' | 'api_key' | 'auth' | 'compliance';
  expiresIn: number | null;
  details: string;
}

// Mock data generators
function generateChannelStatus(): ChannelStatus[] {
  const channels = ['WhatsApp', 'Facebook Messenger', 'Instagram DM', 'Email', 'Live Chat', 'Telegram', 'LINE', 'SMS'];

  return channels.map(channel => {
    const status = Math.random() > 0.15 ? 'connected' : Math.random() > 0.5 ? 'degraded' : 'disconnected';
    return {
      name: channel,
      status,
      syncLag: status === 'connected' ? Math.round(50 + Math.random() * 300) :
               status === 'degraded' ? Math.round(1000 + Math.random() * 2000) : 0,
      inboundQueue: Math.floor(Math.random() * 50),
      outboundQueue: Math.floor(Math.random() * 20),
      rateLimit: {
        current: Math.floor(Math.random() * 800),
        max: 1000
      },
      lastSync: new Date(Date.now() - Math.random() * 60000)
    };
  });
}

function generateDatabaseStatus(): DatabaseStatus[] {
  const databases = ['PostgreSQL Primary', 'PostgreSQL Replica', 'Redis Cache'];

  return databases.map(db => {
    const connectionPct = Math.random();
    const status = connectionPct < 0.7 ? 'healthy' : connectionPct < 0.85 ? 'warning' : 'critical';

    return {
      name: db,
      status,
      connections: {
        active: Math.floor(connectionPct * 100),
        max: 100
      },
      queryTime: Math.round(10 + Math.random() * 200),
      replicationLag: db.includes('Replica') ? Math.round(Math.random() * 500) : 0,
      diskUsage: Math.round(50 + Math.random() * 40)
    };
  });
}

function generateInfrastructureStatus(): InfrastructureStatus[] {
  const servers = ['App Server 01', 'App Server 02', 'Worker Node 01', 'Load Balancer'];

  return servers.map(server => {
    const cpu = Math.round(20 + Math.random() * 70);
    const memory = Math.round(30 + Math.random() * 60);
    const disk = Math.round(40 + Math.random() * 50);
    const status = cpu > 85 || memory > 85 || disk > 90 ? 'critical' :
                   cpu > 70 || memory > 70 || disk > 80 ? 'warning' : 'healthy';

    return {
      name: server,
      status,
      cpu,
      memory,
      disk,
      network: Math.random() > 0.1 ? 'up' : 'degraded'
    };
  });
}

function generateQueueStatus(): QueueStatus[] {
  const queues = ['Conversation Queue', 'Email Queue', 'Notification Queue', 'Analytics Queue'];

  return queues.map(queue => {
    const depth = Math.floor(Math.random() * 200);
    const status = depth > 150 ? 'critical' : depth > 100 ? 'warning' : 'healthy';

    return {
      name: queue,
      status,
      depth,
      processingRate: Math.floor(20 + Math.random() * 80),
      deadLetterQueue: Math.floor(Math.random() * 10)
    };
  });
}

function generateSecurityStatus(): SecurityStatus[] {
  return [
    {
      name: 'SSL Certificate (*.hera-ai.com)',
      status: 'valid',
      type: 'ssl_cert',
      expiresIn: 45,
      details: 'Expires in 45 days'
    },
    {
      name: 'WhatsApp API Key',
      status: 'warning',
      type: 'api_key',
      expiresIn: 15,
      details: 'Expires in 15 days'
    },
    {
      name: 'OAuth Tokens',
      status: 'valid',
      type: 'auth',
      expiresIn: 90,
      details: 'Auto-refresh enabled'
    },
    {
      name: 'GDPR Compliance Check',
      status: 'valid',
      type: 'compliance',
      expiresIn: null,
      details: 'Last audit: 5 days ago'
    },
    {
      name: 'Failed Login Monitor',
      status: 'valid',
      type: 'auth',
      expiresIn: null,
      details: '12 attempts blocked today'
    }
  ];
}

export default function SystemMaintenanceCenter({ agents }: SystemMaintenanceCenterProps) {
  const [activeTab, setActiveTab] = useState<TabType>('apis');

  const channels = generateChannelStatus();
  const databases = generateDatabaseStatus();
  const infrastructure = generateInfrastructureStatus();
  const queues = generateQueueStatus();
  const security = generateSecurityStatus();

  const tabs = [
    { id: 'apis' as TabType, label: 'API Services', icon: Radio, count: agents.reduce((acc, a) => acc + a.apis.length, 0) },
    { id: 'channels' as TabType, label: 'Channels', icon: Radio, count: channels.length },
    { id: 'database' as TabType, label: 'Database', icon: Database, count: databases.length },
    { id: 'infrastructure' as TabType, label: 'Infrastructure', icon: Server, count: infrastructure.length },
    { id: 'queues' as TabType, label: 'Queues', icon: Inbox, count: queues.length },
    { id: 'security' as TabType, label: 'Security', icon: Shield, count: security.length }
  ];

  const formatTimeSince = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <div className="system-maintenance-center">
      <div className="maintenance-header">
        <h2 className="maintenance-title">System Maintenance Center</h2>
      </div>

      <div className="maintenance-tabs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'tab-button--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={18} />
              <span className="tab-label">{tab.label}</span>
              <span className="tab-count">{tab.count}</span>
            </button>
          );
        })}
      </div>

      <div className="maintenance-content">
        {/* API Services Tab */}
        {activeTab === 'apis' && (
          <div className="tab-content">
            {agents.map(agent =>
              agent.apis.map((api, index) => (
                <div key={`${agent.id}-${index}`} className="status-item">
                  <div className="status-item__header">
                    <div className="status-item__info">
                      <h4 className="status-item__name">{api.name}</h4>
                      <span className="status-item__client">{agent.clientName}</span>
                    </div>
                    <span className={`status-badge status-badge--${api.status}`}>
                      {api.status}
                    </span>
                  </div>
                  <div className="status-item__metrics">
                    <div className="metric">
                      <span className="metric__label">Response Time</span>
                      <span className={`metric__value metric__value--${api.responseTime > 3000 ? 'critical' : api.responseTime > 1000 ? 'warning' : 'healthy'}`}>
                        {api.responseTime}ms
                      </span>
                    </div>
                    <div className="metric">
                      <span className="metric__label">Failed Calls (1h)</span>
                      <span className="metric__value">{api.failedCalls}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Channels Tab */}
        {activeTab === 'channels' && (
          <div className="tab-content">
            {channels.map((channel, index) => (
              <div key={index} className="status-item">
                <div className="status-item__header">
                  <div className="status-item__info">
                    <h4 className="status-item__name">{channel.name}</h4>
                    <span className="status-item__client">{formatTimeSince(channel.lastSync)}</span>
                  </div>
                  <span className={`status-badge status-badge--${channel.status}`}>
                    {channel.status}
                  </span>
                </div>
                <div className="status-item__metrics">
                  <div className="metric">
                    <span className="metric__label">Sync Lag</span>
                    <span className={`metric__value metric__value--${channel.syncLag > 2000 ? 'critical' : channel.syncLag > 1000 ? 'warning' : 'healthy'}`}>
                      {channel.syncLag}ms
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric__label">↑ Queue</span>
                    <span className="metric__value">{channel.inboundQueue}</span>
                  </div>
                  <div className="metric">
                    <span className="metric__label">↓ Queue</span>
                    <span className="metric__value">{channel.outboundQueue}</span>
                  </div>
                  <div className="metric">
                    <span className="metric__label">Rate Limit</span>
                    <span className="metric__value">{channel.rateLimit.current}/{channel.rateLimit.max}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Database Tab */}
        {activeTab === 'database' && (
          <div className="tab-content">
            {databases.map((db, index) => (
              <div key={index} className="status-item">
                <div className="status-item__header">
                  <div className="status-item__info">
                    <h4 className="status-item__name">{db.name}</h4>
                  </div>
                  <span className={`status-badge status-badge--${db.status}`}>
                    {db.status}
                  </span>
                </div>
                <div className="status-item__metrics">
                  <div className="metric">
                    <span className="metric__label">Connections</span>
                    <span className={`metric__value metric__value--${db.connections.active > 85 ? 'critical' : db.connections.active > 70 ? 'warning' : 'healthy'}`}>
                      {db.connections.active}/{db.connections.max}
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric__label">Query Time</span>
                    <span className="metric__value">{db.queryTime}ms</span>
                  </div>
                  {db.replicationLag > 0 && (
                    <div className="metric">
                      <span className="metric__label">Replication Lag</span>
                      <span className="metric__value">{db.replicationLag}ms</span>
                    </div>
                  )}
                  <div className="metric">
                    <span className="metric__label">Disk Usage</span>
                    <span className={`metric__value metric__value--${db.diskUsage > 90 ? 'critical' : db.diskUsage > 80 ? 'warning' : 'healthy'}`}>
                      {db.diskUsage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Infrastructure Tab */}
        {activeTab === 'infrastructure' && (
          <div className="tab-content">
            {infrastructure.map((server, index) => (
              <div key={index} className="status-item">
                <div className="status-item__header">
                  <div className="status-item__info">
                    <h4 className="status-item__name">{server.name}</h4>
                  </div>
                  <span className={`status-badge status-badge--${server.status}`}>
                    {server.status}
                  </span>
                </div>
                <div className="status-item__metrics">
                  <div className="metric">
                    <span className="metric__label">CPU</span>
                    <span className={`metric__value metric__value--${server.cpu > 85 ? 'critical' : server.cpu > 70 ? 'warning' : 'healthy'}`}>
                      {server.cpu}%
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric__label">Memory</span>
                    <span className={`metric__value metric__value--${server.memory > 85 ? 'critical' : server.memory > 70 ? 'warning' : 'healthy'}`}>
                      {server.memory}%
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric__label">Disk</span>
                    <span className={`metric__value metric__value--${server.disk > 90 ? 'critical' : server.disk > 80 ? 'warning' : 'healthy'}`}>
                      {server.disk}%
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric__label">Network</span>
                    <span className={`metric__value metric__value--${server.network === 'up' ? 'healthy' : 'warning'}`}>
                      {server.network}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Queues Tab */}
        {activeTab === 'queues' && (
          <div className="tab-content">
            {queues.map((queue, index) => (
              <div key={index} className="status-item">
                <div className="status-item__header">
                  <div className="status-item__info">
                    <h4 className="status-item__name">{queue.name}</h4>
                  </div>
                  <span className={`status-badge status-badge--${queue.status}`}>
                    {queue.status}
                  </span>
                </div>
                <div className="status-item__metrics">
                  <div className="metric">
                    <span className="metric__label">Depth</span>
                    <span className={`metric__value metric__value--${queue.depth > 150 ? 'critical' : queue.depth > 100 ? 'warning' : 'healthy'}`}>
                      {queue.depth}
                    </span>
                  </div>
                  <div className="metric">
                    <span className="metric__label">Processing Rate</span>
                    <span className="metric__value">{queue.processingRate}/min</span>
                  </div>
                  <div className="metric">
                    <span className="metric__label">Dead Letter Q</span>
                    <span className={`metric__value ${queue.deadLetterQueue > 0 ? 'metric__value--warning' : ''}`}>
                      {queue.deadLetterQueue}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="tab-content">
            {security.map((item, index) => (
              <div key={index} className="status-item">
                <div className="status-item__header">
                  <div className="status-item__info">
                    <h4 className="status-item__name">{item.name}</h4>
                    <span className="status-item__client">{item.details}</span>
                  </div>
                  <span className={`status-badge status-badge--${item.status === 'valid' ? 'healthy' : item.status === 'warning' ? 'warning' : 'critical'}`}>
                    {item.status}
                  </span>
                </div>
                {item.expiresIn !== null && (
                  <div className="status-item__metrics">
                    <div className="metric">
                      <span className="metric__label">Expires In</span>
                      <span className={`metric__value metric__value--${item.expiresIn < 30 ? 'warning' : 'healthy'}`}>
                        {item.expiresIn} days
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
