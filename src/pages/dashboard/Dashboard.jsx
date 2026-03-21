import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/ui/Card'
import { Users, FileText, Plus, TrendingUp, ArrowRight, Building2, Menu, X } from 'lucide-react'
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
    <Link to={href} className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg font-medium transition-all ${primary ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-300 hover:text-brand-600'}`}>
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  )
}

function ActivityChart({ data }) {
  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Activity</h3>
        <span className="text-sm text-gray-500">Last 6 months</span>
      </div>
      <div className="h-40 sm:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
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

function MobileNav({ isOpen, onClose }) {
  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/clients', label: 'Clients' },
    { to: '/reports', label: 'Reports' },
    { to: '/settings', label: 'Settings' },
  ]
  
  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? 'visible' : 'invisible'}`}>
      <div className={`absolute inset-0 bg-black/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-brand-600">Menu</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="block px-4 py-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({ clients: 0, reports: 0, thisMonth: 0 })
  const [recentReports, setRecentReports] = useState([])
  const [clients, setClients] = useState([])
  const [chartData, setChartData] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-brand-600">ReportFlow</h1>
          <div className="hidden lg:flex gap-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-gray-100">Dashboard</Link>
            <Link to="/clients" className="text-gray-600 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-gray-100">Clients</Link>
            <Link to="/reports" className="text-gray-600 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-gray-100">Reports</Link>
            <Link to="/settings" className="text-gray-600 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-gray-100">Settings</Link>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </nav>
      
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <main className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome back</h2>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">{today}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <StatCard icon={Building2} label="Total Clients" value={stats.clients} color="bg-gradient-to-br from-blue-500 to-blue-600" href="/clients" />
          <StatCard icon={FileText} label="Total Reports" value={stats.reports} color="bg-gradient-to-br from-emerald-500 to-emerald-600" href="/reports" />
          <StatCard icon={TrendingUp} label="This Month" value={stats.thisMonth} color="bg-gradient-to-br from-purple-500 to-purple-600" href="/reports" />
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
          <QuickAction icon={Plus} label="New Client" href="/clients" primary />
          <QuickAction icon={FileText} label="Create Report" href="/reports" />
          <QuickAction icon={Users} label="View All Clients" href="/clients" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
          <ActivityChart data={chartData} />
          
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Reports</h3>
              <Link to="/reports" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
            </div>
            {recentReports.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No reports yet</p>
                <Link to="/clients" className="text-brand-600 text-sm font-medium mt-2 inline-block">Create your first client</Link>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Top Clients</h3>
              <Link to="/clients" className="text-sm text-brand-600 hover:text-brand-700 font-medium">View all</Link>
            </div>
            {clients.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No clients yet</p>
                <Link to="/clients" className="text-brand-600 text-sm font-medium mt-2 inline-block">Add your first client</Link>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
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
