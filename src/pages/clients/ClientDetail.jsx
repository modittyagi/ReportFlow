import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { generateReport } from '../../utils/reportGenerator'
import { CheckCircle, FileText, Loader2, X } from 'lucide-react'

function SuccessModal({ isOpen, onClose, reportId, onViewReport, onGoToReports }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6 text-center relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Report Generated!</h3>
        <p className="text-gray-500 mb-6">Your report has been created successfully with all the latest data.</p>
        <div className="space-y-3">
          <Button onClick={onViewReport} className="w-full">
            <FileText className="w-4 h-4 mr-2" />
            View Report Details
          </Button>
          <Button variant="secondary" onClick={onGoToReports} className="w-full">
            View All Reports
          </Button>
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

  useEffect(() => {
    fetchClient()
  }, [id])

  const fetchClient = async () => {
    const { data } = await supabase.from('clients').select('*').eq('id', id).single()
    setClient(data)
    setMetaConnected(!!data?.meta_ad_account_id)
    setGa4Connected(!!data?.ga4_property_id)
    setLoading(false)
  }

  const connectMeta = async () => {
    const appId = import.meta.env.VITE_META_APP_ID
    const redirectUri = `${window.location.origin}/auth/callback/meta`
    const scope = 'ads_read,ads_management'
    window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${id}`
  }

  const connectGA4 = async () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const redirectUri = `${window.location.origin}/auth/callback/ga4`
    const scope = 'https://www.googleapis.com/auth/analytics.readonly'
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&state=${id}`
  }

  const handleGenerateReport = async () => {
    if (!metaConnected && !ga4Connected) {
      alert('Please connect at least one data source first')
      return
    }
    
    setGenerating(true)
    try {
      const report = await generateReport(id, user.id)
      setSuccessModal({ open: true, reportId: report.id })
    } catch (err) {
      console.error(err)
      alert('Error generating report')
      setGenerating(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!client) return <div className="p-8">Client not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/clients" className="text-gray-600 hover:text-brand-600">← Back</Link>
            <h1 className="text-xl font-bold text-gray-900">{client.name}</h1>
          </div>
          <div className="flex gap-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-brand-600">Dashboard</Link>
            <Link to="/clients" className="text-gray-600 hover:text-brand-600">Clients</Link>
            <Link to="/reports" className="text-gray-600 hover:text-brand-600">Reports</Link>
          </div>
        </div>
      </nav>
      
      <main className="max-w-4xl mx-auto py-8 px-6">
        <Card className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Data Source Connections</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Meta Ads</h3>
                <p className="text-sm text-gray-500">
                  {metaConnected ? 'Connected - Pulling spend, impressions, clicks, CTR, ROAS' : 'Not connected'}
                </p>
              </div>
              <button
                onClick={connectMeta}
                className={`px-4 py-2 rounded-lg ${metaConnected ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {metaConnected ? 'Reconnect' : 'Connect'}
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Google Analytics 4</h3>
                <p className="text-sm text-gray-500">
                  {ga4Connected ? 'Connected - Pulling sessions, users, bounce rate, conversions' : 'Not connected'}
                </p>
              </div>
              <button
                onClick={connectGA4}
                className={`px-4 py-2 rounded-lg ${ga4Connected ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {ga4Connected ? 'Reconnect' : 'Connect'}
              </button>
            </div>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-lg font-semibold mb-4">Generate Report</h2>
          <p className="text-gray-600 mb-4">
            Generate a branded PDF report with the last 30 days of data from your connected sources.
          </p>
          <button
            onClick={handleGenerateReport}
            disabled={generating || (!metaConnected && !ga4Connected)}
            className="w-full py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            {generating && <Loader2 className="w-4 h-4 animate-spin" />}
            {generating ? 'Generating...' : 'Generate PDF Report'}
          </button>
        </Card>
      </main>

      <SuccessModal 
        isOpen={successModal.open}
        onClose={() => setSuccessModal({ open: false, reportId: null })}
        reportId={successModal.reportId}
        onViewReport={() => navigate(`/reports/${successModal.reportId}`)}
        onGoToReports={() => navigate('/reports')}
      />
    </div>
  )
}
