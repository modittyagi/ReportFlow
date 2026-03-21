import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/ui/Card'
import { Users, FileText, Plus, TrendingUp, Calendar, ArrowRight, Building2, Search, BarChart3 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function StatCard({ icon: Icon, label, value, color, href }) {
  return (
    <Link to={href} className="group">
      <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
      </Card>
    </Link>
  )
}

function QuickAction({ icon: Icon, label, href, primary = false }) {
  return (
    <Link to={href} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${primary ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-300 hover:text-brand-600'}`}>
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  )
}

function ActivityChart({ data }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
        <span className="text-sm text-gray-500">Last 6 months</span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              cursor={{ fill: '#f3f4f6' }}
            />
            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({ clients: 0, reports: 0, thisMonth: 0 })
  const [recentReports, setRecentReports] = useState([])
  const [clients, setClients] = useState([])
  const [chartData, setChartData] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      const { data: clientsData } = await supabase.from('clients').select('id, name').eq('agency_id', user.id)
      const { data: reportsData } = await supabase.from('reports').select('id, created_at, client_id')
      
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      
      const thisMonthReports = reportsData?.filter(r => new Date(r.created_at) >= startOfMonth) || []

      const monthlyData = []
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
        const count = reportsData?.filter(r => {
          const date = new Date(r.created_at)
          return date >= d && date <= nextMonth
        }).length || 0
        monthlyData.push({
          month: d.toLocaleDateString('en-US', { month: 'short' }),
          count
        })
      }

      setStats({ 
        clients: clientsData?.length || 0, 
        reports: reportsData?.length || 0,
        thisMonth: thisMonthReports.length
      })
      setClients(clientsData?.slice(0, 4) || [])
      setRecentReports(reportsData?.slice(-5).reverse() || [])
      setChartData(monthlyData)
    }
    fetchData()
  }, [user.id])

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-brand-600">ReportFlow</h1>
          <div className="flex gap-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-brand-600">Dashboard</Link>
            <Link to="/clients" className="text-gray-600 hover:text-brand-600">Clients</Link>
            <Link to="/reports" className="text-gray-600 hover:text-brand-600">Reports</Link>
            <Link to="/settings" className="text-gray-600 hover:text-brand-600">Settings</Link>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-gray-500 mt-1">{today}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard icon={Building2} label="Total Clients" value={stats.clients} color="bg-gradient-to-br from-blue-500 to-blue-600" href="/clients" />
          <StatCard icon={FileText} label="Total Reports" value={stats.reports} color="bg-gradient-to-br from-emerald-500 to-emerald-600" href="/reports" />
          <StatCard icon={TrendingUp} label="This Month" value={stats.thisMonth} color="bg-gradient-to-br from-purple-500 to-purple-600" href="/reports" />
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <QuickAction icon={Plus} label="New Client" href="/clients" primary />
          <QuickAction icon={FileText} label="Create Report" href="/reports" />
          <QuickAction icon={Users} label="View All Clients" href="/clients" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ActivityChart data={chartData} />
          
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Reports</h3>
              <Link to="/reports" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
            </div>
            {recentReports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No reports yet</p>
                <Link to="/clients" className="text-brand-600 text-sm font-medium mt-2 inline-block">Create your first client</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <Link key={report.id} to={`/reports?id=${report.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <FileText className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Report</p>
                        <p className="text-xs text-gray-500">{new Date(report.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-600" />
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Clients</h3>
              <Link to="/clients" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
            </div>
            {clients.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No clients yet</p>
                <Link to="/clients" className="text-brand-600 text-sm font-medium mt-2 inline-block">Add your first client</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {clients.map((client, idx) => (
                  <Link key={client.id} to={`/clients?id=${client.id}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-brand-600">{client.name?.charAt(0).toUpperCase() || 'C'}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{client.name}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-600" />
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
