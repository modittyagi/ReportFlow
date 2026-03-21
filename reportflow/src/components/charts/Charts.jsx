import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function MetaChart({ data }) {
  if (!data || data.length === 0) return null
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="spend" stroke="#0ea5e9" strokeWidth={2} name="Spend ($)" />
        <Line type="monotone" dataKey="impressions" stroke="#8b5cf6" strokeWidth={2} name="Impressions" />
        <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} name="Clicks" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function GA4Chart({ data }) {
  if (!data || data.length === 0) return null
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="sessions" stroke="#0ea5e9" strokeWidth={2} name="Sessions" />
        <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} name="Users" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function MetricCard({ title, value, subtext, color = 'text-gray-900' }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </div>
  )
}
