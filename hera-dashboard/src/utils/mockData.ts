import type { Agent, APIIntegration, Alert, ActivityEvent, MetricDataPoint, AgentStatus, AlertSeverity, EventType } from '../types/index';

const CLIENT_NAMES = ['Citroen', 'Biomedika', 'Sunlife', 'Bank BTN', 'Indomobil'];
const API_NAMES = [
  'Payment Gateway',
  'CRM Integration',
  'Email Service',
  'SMS Provider',
  'Analytics API',
  'Authentication Service'
];

const EVENT_TEMPLATES = [
  { type: 'api_failure' as EventType, severity: 'critical' as AlertSeverity, desc: 'API endpoint timeout' },
  { type: 'slow_response' as EventType, severity: 'medium' as AlertSeverity, desc: 'Response time degraded' },
  { type: 'error' as EventType, severity: 'high' as AlertSeverity, desc: 'Error rate spike detected' },
  { type: 'recovery' as EventType, severity: 'low' as AlertSeverity, desc: 'Service recovered successfully' },
  { type: 'restart' as EventType, severity: 'medium' as AlertSeverity, desc: 'Agent restarted' },
  { type: 'milestone' as EventType, severity: 'low' as AlertSeverity, desc: 'Processed 1000 conversations' }
];

export function generateAPIIntegration(): APIIntegration {
  const baseResponseTime = 200 + Math.random() * 300;
  const isHealthy = Math.random() > 0.3;
  const isDegraded = !isHealthy && Math.random() > 0.5;

  return {
    name: API_NAMES[Math.floor(Math.random() * API_NAMES.length)],
    status: isHealthy ? 'operational' : isDegraded ? 'degraded' : 'down',
    responseTime: Math.round(isHealthy ? baseResponseTime : baseResponseTime * 2),
    failedCalls: isHealthy ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 20) + 5,
    responseHistory: Array.from({ length: 20 }, () => Math.round(baseResponseTime + (Math.random() - 0.5) * 100))
  };
}

export function generateAgent(id: string, index: number): Agent {
  const statusValues: AgentStatus[] = ['healthy', 'warning', 'critical'];
  const statusWeights = [0.6, 0.3, 0.1]; // 60% healthy, 30% warning, 10% critical

  const random = Math.random();
  let status: AgentStatus = 'healthy';
  let cumulative = 0;
  for (let i = 0; i < statusWeights.length; i++) {
    cumulative += statusWeights[i];
    if (random < cumulative) {
      status = statusValues[i];
      break;
    }
  }

  const apis = Array.from({ length: 3 + Math.floor(Math.random() * 3) }, () => generateAPIIntegration());

  return {
    id,
    clientName: CLIENT_NAMES[index],
    status,
    activeConversations: Math.floor(Math.random() * 50) + 5,
    lastHeartbeat: new Date(Date.now() - Math.random() * 300000), // Last 5 minutes
    uptime: 95 + Math.random() * 4.9, // 95-99.9%
    successRate: status === 'healthy' ? 95 + Math.random() * 4 : status === 'warning' ? 85 + Math.random() * 10 : 70 + Math.random() * 15,
    apis,
    totalConversationsToday: Math.floor(Math.random() * 500) + 100
  };
}

export function generateInitialAgents(): Agent[] {
  return Array.from({ length: 5 }, (_, i) => generateAgent(`agent-${i + 1}`, i));
}

export function generateAlert(agent: Agent): Alert {
  const severities: AlertSeverity[] = ['critical', 'high', 'medium', 'low'];
  const severity = agent.status === 'critical' ? 'critical' : agent.status === 'warning' ? 'high' : severities[Math.floor(Math.random() * severities.length)];

  const channels = severity === 'critical'
    ? ['Email', 'WhatsApp', 'Discord', 'On-screen']
    : severity === 'high'
    ? ['Discord', 'On-screen', 'Email']
    : severity === 'medium'
    ? ['Discord', 'On-screen']
    : ['On-screen'];

  const messages = {
    critical: [
      `${agent.clientName} agent is offline`,
      `${agent.clientName} API complete failure`,
      `${agent.clientName} authentication error`
    ],
    high: [
      `${agent.clientName} API degraded - response time >3s`,
      `${agent.clientName} error rate >10%`,
      `${agent.clientName} high load detected`
    ],
    medium: [
      `${agent.clientName} isolated API failure`,
      `${agent.clientName} slow response detected`
    ],
    low: [
      `${agent.clientName} agent restarted`,
      `${agent.clientName} milestone reached`
    ]
  };

  return {
    id: `alert-${Date.now()}-${Math.random()}`,
    timestamp: new Date(),
    severity,
    agentId: agent.id,
    type: severity === 'critical' ? 'System Failure' : severity === 'high' ? 'Performance Issue' : 'Information',
    message: messages[severity][Math.floor(Math.random() * messages[severity].length)],
    channels,
    acknowledged: false
  };
}

export function generateActivityEvent(agent: Agent): ActivityEvent {
  const template = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];

  return {
    id: `event-${Date.now()}-${Math.random()}`,
    timestamp: new Date(),
    agentId: agent.id,
    clientName: agent.clientName,
    eventType: template.type,
    severity: template.severity,
    description: template.desc
  };
}

export function generateHistoricalMetrics(agents: Agent[]): MetricDataPoint[] {
  const now = Date.now();
  const points: MetricDataPoint[] = [];

  // Generate data points for the last 24 hours
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now - i * 60 * 60 * 1000);
    const point: MetricDataPoint = {
      timestamp: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };

    agents.forEach((agent) => {
      const baseResponseTime = 200 + Math.random() * 300;
      point[agent.clientName] = Math.round(baseResponseTime);
    });

    points.push(point);
  }

  return points;
}

export function updateAgentStatus(agent: Agent): Agent {
  // Simulate random status changes
  const shouldChange = Math.random() < 0.1; // 10% chance of status change

  if (!shouldChange) {
    return {
      ...agent,
      activeConversations: Math.max(0, agent.activeConversations + Math.floor((Math.random() - 0.5) * 5)),
      lastHeartbeat: new Date()
    };
  }

  const statuses: AgentStatus[] = ['healthy', 'warning', 'critical'];
  const newStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    ...agent,
    status: newStatus,
    activeConversations: Math.max(0, agent.activeConversations + Math.floor((Math.random() - 0.5) * 5)),
    lastHeartbeat: new Date(),
    successRate: newStatus === 'healthy' ? 95 + Math.random() * 4 : newStatus === 'warning' ? 85 + Math.random() * 10 : 70 + Math.random() * 15,
    apis: agent.apis.map(api => {
      const shouldUpdateApi = Math.random() < 0.3;
      if (!shouldUpdateApi) return api;

      return {
        ...api,
        responseTime: Math.round(200 + Math.random() * 500),
        failedCalls: Math.floor(Math.random() * 15),
        status: Math.random() > 0.3 ? 'operational' : Math.random() > 0.5 ? 'degraded' : 'down'
      };
    })
  };
}

export function shouldGenerateAlert(agent: Agent): boolean {
  // Critical agents have higher chance of alerts
  const chance = agent.status === 'critical' ? 0.3 : agent.status === 'warning' ? 0.15 : 0.05;
  return Math.random() < chance;
}

export function shouldGenerateEvent(): boolean {
  return Math.random() < 0.4; // 40% chance per interval
}
