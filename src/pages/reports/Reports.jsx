import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/ui/Card'
import { FileText, Search, Download, Trash2, Eye, TrendingUp, Clock, Menu, X } from 'lucide-react'

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

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  )
}

function ReportCard({ report, onDelete }) {
  const formattedDate = new Date(report.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
  
  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return formattedDate
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {report.clients?.logo_url ? (
            <img src={report.clients.logo_url} alt={report.clients.name} className="w-12 h-12 rounded-xl object-contain bg-gray-50 p-1.5" />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-brand-100 to-brand-200 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-brand-600" />
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 truncate">{report.clients?.name || 'Unknown Client'}</h3>
              {report.pdf_url && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                  PDF Ready
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {timeAgo(report.created_at)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {report.pdf_url && (
            <a
              href={report.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              View
            </a>
          )}
          <button
            onClick={() => onDelete(report.id)}
            className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete report"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Card>
  )
}

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [timeFilter, setTimeFilter] = useState('all')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetchReports()
  }, [user.id])

  const fetchReports = async () => {
    const { data } = await supabase
      .from('reports')
      .select('*, clients(name, logo_url)')
      .order('created_at', { ascending: false })
    setReports(data || [])
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      await supabase.from('reports').delete().eq('id', id)
      fetchReports()
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.clients?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (timeFilter === 'all') return matchesSearch
    
    const reportDate = new Date(report.created_at)
    const now = new Date()
    
    if (timeFilter === 'week') {
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000)
      return matchesSearch && reportDate >= weekAgo
    }
    
    if (timeFilter === 'month') {
      const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      return matchesSearch && reportDate >= monthAgo
    }
    
    return matchesSearch
  })

  const thisMonthCount = reports.filter(r => {
    const reportDate = new Date(r.created_at)
    const now = new Date()
    return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear()
  }).length

  const pdfCount = reports.filter(r => r.pdf_url).length

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-brand-600">ReportFlow</h1>
          <div className="hidden lg:flex gap-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-gray-100">Dashboard</Link>
            <Link to="/clients" className="text-gray-600 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-gray-100">Clients</Link>
            <Link to="/reports" className="text-brand-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-100">Reports</Link>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Reports</h2>
            <p className="text-gray-500 text-sm mt-1">{reports.length} total reports</p>
          </div>
          
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full sm:w-56 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">Filter:</span>
          <FilterButton active={timeFilter === 'all'} onClick={() => setTimeFilter('all')}>All</FilterButton>
          <FilterButton active={timeFilter === 'week'} onClick={() => setTimeFilter('week')}>This Week</FilterButton>
          <FilterButton active={timeFilter === 'month'} onClick={() => setTimeFilter('month')}>This Month</FilterButton>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard icon={FileText} label="Total" value={reports.length} color="bg-blue-500" />
          <StatCard icon={Clock} label="This Month" value={thisMonthCount} color="bg-purple-500" />
          <StatCard icon={Download} label="With PDF" value={pdfCount} color="bg-emerald-500" />
          <StatCard icon={TrendingUp} label="This Week" value={reports.filter(r => new Date(r.created_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} color="bg-orange-500" />
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : filteredReports.length === 0 ? (
          <Card>
            <div className="text-center py-8 sm:py-12">
              <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No reports found</h3>
              <p className="text-gray-500 mb-4 text-sm">
                {searchQuery || timeFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Go to a client page to generate your first report'}
              </p>
              {!searchQuery && timeFilter === 'all' && (
                <Link
                  to="/clients"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
                >
                  Go to Clients
                </Link>
              )}
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
