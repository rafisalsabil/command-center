export type AgentStatus = 'healthy' | 'warning' | 'critical';
export type APIStatus = 'operational' | 'degraded' | 'down';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type EventType = 'api_failure' | 'slow_response' | 'error' | 'recovery' | 'restart' | 'milestone';

export interface APIIntegration {
  name: string;
  status: APIStatus;
  responseTime: number;
  failedCalls: number;
  responseHistory: number[];
}

export interface Agent {
  id: string;
  clientName: string;
  status: AgentStatus;
  activeConversations: number;
  lastHeartbeat: Date;
  uptime: number;
  successRate: number;
  apis: APIIntegration[];
  totalConversationsToday: number;
}

export interface Alert {
  id: string;
  timestamp: Date;
  severity: AlertSeverity;
  agentId: string;
  type: string;
  message: string;
  channels: string[];
  acknowledged: boolean;
}

export interface ActivityEvent {
  id: string;
  timestamp: Date;
  agentId: string;
  clientName: string;
  eventType: EventType;
  severity: AlertSeverity;
  description: string;
}

export interface MetricDataPoint {
  timestamp: string;
  [key: string]: number | string;
}

export interface NotificationLog {
  id: string;
  alertId: string;
  timestamp: Date;
  channels: string[];
  status: 'sent' | 'failed';
}
