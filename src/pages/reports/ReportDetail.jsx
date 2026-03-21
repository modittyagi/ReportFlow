import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import Card from '../../components/ui/Card'
import { ArrowLeft, Download, TrendingUp, TrendingDown, DollarSign, Eye, Users, MousePointer, Activity } from 'lucide-react'

export default function ReportDetail() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReport()
  }, [id])

  const fetchReport = async () => {
    const { data: reportData } = await supabase
      .from('reports')
      .select('*, clients(name)')
      .eq('id', id)
      .single()
    
    setReport(reportData)
    if (reportData?.client_id) {
      const { data: clientData } = await supabase
        .from('clients')
        .select('name, website')
        .eq('id', reportData.client_id)
        .single()
      setClient(clientData)
    }
    setLoading(false)
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>
  if (!report) return <div className="p-8 text-center">Report not found</div>

  const meta = report.meta_data
  const ga4 = report.ga4_data
  const generatedDate = new Date(report.generated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link to="/reports" className="flex items-center gap-2 text-gray-600 hover:text-brand-600">
            <ArrowLeft className="w-5 h-5" />
            Back to Reports
          </Link>
          {report.pdf_url && (
            <a
              href={report.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </a>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{client?.name || 'Client'}</h1>
          <p className="text-gray-500">Generated on {generatedDate}</p>
        </div>

        {/* Meta Ads Data */}
        {meta && (
          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Meta Ads Performance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <MetricCard label="Spend" value={`$${meta.spend.toFixed(2)}`} />
              <MetricCard label="Impressions" value={meta.impressions.toLocaleString()} />
              <MetricCard label="Clicks" value={meta.clicks.toLocaleString()} />
              <MetricCard label="CTR" value={`${meta.ctr}%`} />
              <MetricCard label="ROAS" value={meta.roas} highlight />
            </div>
            
            {meta.daily && meta.daily.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Daily Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Date</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-600">Spend</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-600">Impressions</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-600">Clicks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {meta.daily.slice(-7).map((day, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 text-gray-900">{day.date}</td>
                          <td className="px-3 py-2 text-right">${day.spend.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right">{day.impressions.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right">{day.clicks.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* GA4 Data */}
        {ga4 && (
          <Card className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Google Analytics 4
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard label="Sessions" value={ga4.sessions?.toLocaleString() || 0} icon={MousePointer} />
              <MetricCard label="Users" value={ga4.users?.toLocaleString() || 0} icon={Users} />
              <MetricCard label="Bounce Rate" value={`${ga4.bounceRate}%`} />
              <MetricCard label="Conversions" value={ga4.conversions?.toLocaleString() || 0} highlight />
            </div>
            
            {ga4.daily && ga4.daily.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Daily Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-600">Date</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-600">Sessions</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-600">Users</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-600">Bounce Rate</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-600">Conversions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {ga4.daily.slice(-7).map((day, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2 text-gray-900">{day.date}</td>
                          <td className="px-3 py-2 text-right">{day.sessions.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right">{day.users.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right">{day.bounceRate}%</td>
                          <td className="px-3 py-2 text-right">{day.conversions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>
        )}

        {!meta && !ga4 && (
          <Card>
            <div className="text-center py-12">
              <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-500">This report was generated but no analytics data was found.</p>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}

function MetricCard({ label, value, highlight, icon: Icon }) {
  return (
    <div className={`p-4 rounded-xl ${highlight ? 'bg-brand-50 border border-brand-200' : 'bg-gray-50'}`}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-xl font-bold ${highlight ? 'text-brand-600' : 'text-gray-900'}`}>{value}</p>
    </div>
  )
}