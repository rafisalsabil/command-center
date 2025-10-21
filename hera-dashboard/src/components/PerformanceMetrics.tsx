import type { Agent, MetricDataPoint } from '../types/index';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import './PerformanceMetrics.css';

interface PerformanceMetricsProps {
  agents: Agent[];
  historicalData: MetricDataPoint[];
}

const AGENT_COLORS = [
  '#5347CE', // Primary purple
  '#887CFD', // Light purple
  '#4896FE', // Blue
  '#16C8C7', // Turquoise
  '#8B5CF6'  // Violet
];

export default function PerformanceMetrics({ agents, historicalData }: PerformanceMetricsProps) {
  const successRateData = agents.map(agent => ({
    name: agent.clientName,
    successRate: agent.successRate
  }));

  const conversationsData = agents.map((agent, index) => ({
    name: agent.clientName,
    value: agent.totalConversationsToday,
    color: AGENT_COLORS[index]
  }));

  const totalConversations = conversationsData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="performance-metrics">
      <div className="metric-chart-card">
        <h3 className="metric-chart-card__title">Response Time Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-border)" />
            <XAxis
              dataKey="timestamp"
              stroke="var(--text-secondary)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="var(--text-secondary)"
              style={{ fontSize: '12px' }}
              label={{ value: 'ms', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--bg-border)',
                borderRadius: '8px',
                color: 'var(--text-primary)'
              }}
            />
            {agents.map((agent, index) => (
              <Line
                key={agent.id}
                type="monotone"
                dataKey={agent.clientName}
                stroke={AGENT_COLORS[index]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <div className="chart-legend">
          {agents.map((agent, index) => (
            <div key={agent.id} className="legend-item">
              <div
                className="legend-item__color"
                style={{ backgroundColor: AGENT_COLORS[index] }}
              />
              <span className="legend-item__name">{agent.clientName}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="metric-chart-card">
        <h3 className="metric-chart-card__title">Success Rate by Agent</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={successRateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-border)" />
            <XAxis
              dataKey="name"
              stroke="var(--text-secondary)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="var(--text-secondary)"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
              label={{ value: '%', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--bg-border)',
                borderRadius: '8px',
                color: 'var(--text-primary)'
              }}
            />
            <Bar dataKey="successRate" radius={[8, 8, 0, 0]}>
              {successRateData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={AGENT_COLORS[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="metric-chart-card">
        <h3 className="metric-chart-card__title">Total Conversations Today</h3>
        <div className="donut-chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={conversationsData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {conversationsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--bg-border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-chart-center">
            <div className="donut-chart-total">{totalConversations}</div>
            <div className="donut-chart-label">Total</div>
          </div>
        </div>
        <div className="chart-legend">
          {conversationsData.map((item, index) => (
            <div key={index} className="legend-item-inline">
              <div
                className="legend-item__color"
                style={{ backgroundColor: item.color }}
              />
              <span className="legend-item__name">{item.name}</span>
              <span className="legend-item__value">({item.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
