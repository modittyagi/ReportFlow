import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { generateReport } from '../../utils/reportGenerator'
import { CheckCircle, FileText, Loader2, X, Sparkles, BarChart3, Users, TrendingUp, MousePointer } from 'lucide-react'
import { toast } from 'sonner'
import { demoClients, demoMetaData, demoGA4Data } from '../../utils/demoData'

function DemoBanner() {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium text-sm sm:text-base">Demo Preview Mode</span>
        </div>
        <span className="text-xs sm:text-sm opacity-90">Sample data to showcase report features</span>
      </div>
    </div>
  )
}

function DemoPreviewModal({ isOpen, onClose }) {
  if (!isOpen) return null
  
  const demoMeta = demoMetaData
  const demoGA4 = demoGA4Data
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl shadow-xl my-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 p-2">
          <X className="w-6 h-6" />
        </button>
        
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Demo Report Preview</h2>
          </div>
          <p className="text-gray-600">See what reports look like with sample data from Meta Ads and Google Analytics.</p>
        </div>
        
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800">This is a preview with sample data. Connect your real accounts to generate actual reports.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Meta Ads Performance
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Total Spend</p>
                <p className="text-2xl font-bold text-blue-600">${demoMeta.totalSpend.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Impressions</p>
                <p className="text-2xl font-bold text-purple-600">{(demoMeta.totalImpressions / 1000).toFixed(0)}K</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Conversions</p>
                <p className="text-2xl font-bold text-green-600">{demoMeta.totalConversions}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Avg ROAS</p>
                <p className="text-2xl font-bold text-orange-600">{demoMeta.averageRoas}x</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Google Analytics 4
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Users</p>
                <p className="text-2xl font-bold text-green-600">{(demoGA4.overview.users / 1000).toFixed(1)}K</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Sessions</p>
                <p className="text-2xl font-bold text-blue-600">{(demoGA4.overview.sessions / 1000).toFixed(1)}K</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-purple-600">{demoGA4.overview.bounceRate}%</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Conversions</p>
                <p className="text-2xl font-bold text-orange-600">{demoGA4.conversions.total}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t flex justify-end">
          <Button onClick={onClose}>Close Preview</Button>
        </div>
      </div>
    </div>
  )
}

function SuccessModal({ isOpen, onClose, reportId, onViewReport, onGoToReports }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6 text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Report Generated!</h3>
        <p className="text-gray-500 mb-6">Your report has been created successfully.</p>
        <div className="space-y-3">
          <Button onClick={onViewReport} className="w-full">
            <FileText className="w-4 h-4 mr-2" />
            View Report
          </Button>
          <Button variant="secondary" onClick={onGoToReports} className="w-full">View All Reports</Button>
        </div>
      </div>
    </div>
  )
}

export default function ClientDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [client, setClient] = useState(null)
  const [metaConnected, setMetaConnected] = useState(false)
  const [ga4Connected, setGa4Connected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [successModal, setSuccessModal] = useState({ open: false, reportId: null })
  const [showDemo, setShowDemo] = useState(false)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => { fetchClient() }, [id])

  const fetchClient = async () => {
    if (id.startsWith('demo-')) {
      const demoClient = demoClients.find(c => c.id === id)
      if (demoClient) {
        setClient(demoClient)
        setMetaConnected(true)
        setGa4Connected(true)
        setIsDemo(true)
        setLoading(false)
        return
      }
    }
    
    const { data } = await supabase.from('clients').select('*').eq('id', id).single()
    setClient(data)
    setMetaConnected(!!data?.meta_ad_account_id)
    setGa4Connected(!!data?.ga4_property_id)
    setLoading(false)
  }

  const connectMeta = () => {
    toast.info('Meta Ads integration coming soon! Try the demo preview.')
    setShowDemo(true)
  }

  const connectGA4 = () => {
    toast.info('Google Analytics integration coming soon! Try the demo preview.')
    setShowDemo(true)
  }

  const handleGenerateReport = async () => {
    if (!metaConnected && !ga4Connected) {
      toast.warning('Connect a data source or try the demo preview')
      setShowDemo(true)
      return
    }
    
    setGenerating(true)
    try {
      const report = await generateReport(id, user.id)
      setSuccessModal({ open: true, reportId: report.id })
    } catch (err) {
      toast.error('Failed to generate report')
      setGenerating(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!client) return <div className="p-8 text-center">Client not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {isDemo && <DemoBanner />}
      
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/clients" className="text-gray-600 hover:text-brand-600">← Back</Link>
            <h1 className="text-xl font-bold text-gray-900">{client.name}</h1>
            {isDemo && <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Demo</span>}
          </div>
        </div>
      </nav>
      
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Data Source Connections</h2>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Meta Ads</h3>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">Coming Soon</span>
                </div>
                <p className="text-sm text-gray-500">{metaConnected ? 'Connected' : 'Connect your Facebook/Meta ad account'}</p>
              </div>
              <button onClick={connectMeta} className={`px-4 py-2 rounded-lg ${metaConnected ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {metaConnected ? 'Connected' : 'Connect'}
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">Google Analytics 4</h3>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">Coming Soon</span>
                </div>
                <p className="text-sm text-gray-500">{ga4Connected ? 'Connected' : 'Connect your GA4 property'}</p>
              </div>
              <button onClick={connectGA4} className={`px-4 py-2 rounded-lg ${ga4Connected ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {ga4Connected ? 'Connected' : 'Connect'}
              </button>
            </div>
          </div>
        </Card>
        
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Generate Report</h2>
          <p className="text-gray-600 mb-4">Generate a branded PDF report with marketing data.</p>
          <button
            onClick={handleGenerateReport}
            disabled={generating || (!metaConnected && !ga4Connected)}
            className="w-full py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
          >
            {generating && <Loader2 className="w-4 h-4 animate-spin" />}
            {generating ? 'Generating...' : 'Generate PDF Report'}
          </button>
        </Card>
        
        <button
          onClick={() => setShowDemo(true)}
          className="w-full py-4 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 hover:border-purple-500 hover:bg-purple-50 flex flex-col items-center justify-center gap-2"
        >
          <Sparkles className="w-6 h-6" />
          <span className="font-medium">Try Demo Preview</span>
          <span className="text-sm text-gray-500">See what reports look like with sample data</span>
        </button>
      </main>

      <SuccessModal 
        isOpen={successModal.open}
        onClose={() => setSuccessModal({ open: false, reportId: null })}
        onViewReport={() => navigate(`/reports/${successModal.reportId}`)}
        onGoToReports={() => navigate('/reports')}
      />
      
      <DemoPreviewModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </div>
  )
}
