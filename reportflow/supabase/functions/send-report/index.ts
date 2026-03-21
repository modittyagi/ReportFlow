import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const META_APP_SECRET = Deno.env.get('META_APP_SECRET')
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET')

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  )
  
  const now = new Date()
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
  const currentTime = now.toTimeString().slice(0, 5)
  
  const { data: schedules } = await supabase
    .from('schedules')
    .select('*, agencies(*), clients(*)')
    .eq('enabled', true)
    .eq('day', currentDay)
    .eq('time', currentTime)
  
  for (const schedule of schedules || []) {
    if (!schedule.client_id) continue
    
    try {
      const client = schedule.clients
      const agency = schedule.agencies
      
      let metaData = null
      let ga4Data = null
      
      if (client.meta_ad_account_id && client.meta_access_token) {
        metaData = await fetchMetaData(client.meta_ad_account_id, client.meta_access_token)
      }
      
      if (client.ga4_property_id && client.ga4_access_token) {
        ga4Data = await fetchGA4Data(client.ga4_property_id, client.ga4_access_token)
      }
      
      const { data: reportRecord } = await supabase
        .from('reports')
        .insert({
          client_id: client.id,
          agency_id: agency.id,
          meta_data: metaData,
          ga4_data: ga4Data,
          generated_at: new Date().toISOString()
        })
        .select()
        .single()
      
      const pdfContent = generatePDFContent(client, agency, metaData, ga4Data)
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'ReportFlow <reports@yourdomain.com>',
          to: client.email || 'client@example.com',
          subject: `${client.name} - Monthly Performance Report`,
          html: pdfContent
        })
      })
      
      await supabase
        .from('schedules')
        .update({ last_run: new Date().toISOString() })
        .eq('id', schedule.id)
      
    } catch (err) {
      console.error('Error processing schedule:', err)
    }
  }
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})

async function fetchMetaData(adAccountId, accessToken) {
  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  const response = await fetch(
    `https://graph.facebook.com/v18.0/act_${adAccountId}/insights?` +
    `fields=spend,impressions,clicks,ctr,actions&` +
    `time_range={'since':'${startDate}','until':'${endDate}'}&` +
    `access_token=${accessToken}`
  )
  
  const data = await response.json()
  
  if (data.data && data.data.length > 0) {
    const totals = data.data[0]
    const revenue = parseFloat(totals.actions?.find(a => a.action_type === 'purchase')?.value || 0)
    
    return {
      spend: parseFloat(totals.spend || 0),
      impressions: parseInt(totals.impressions || 0),
      clicks: parseInt(totals.clicks || 0),
      ctr: parseFloat(totals.ctr || 0),
      roas: totals.spend > 0 ? (revenue / parseFloat(totals.spend)).toFixed(2) : 0
    }
  }
  
  return null
}

async function fetchGA4Data(propertyId, accessToken) {
  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'sessions' },
          { name: 'totalUsers' },
          { name: 'bounceRate' },
          { name: 'conversions' }
        ]
      })
    }
  )
  
  const data = await response.json()
  
  if (data.rows) {
    let sessions = 0, users = 0, bounceRate = 0, conversions = 0
    
    data.rows.forEach(row => {
      sessions += parseInt(row.metricValues[0].value)
      users += parseInt(row.metricValues[1].value)
      bounceRate += parseFloat(row.metricValues[2].value)
      conversions += parseInt(row.metricValues[3].value)
    })
    
    return {
      sessions,
      users,
      bounceRate: (bounceRate / data.rows.length).toFixed(2),
      conversions
    }
  }
  
  return null
}

function generatePDFContent(client, agency, metaData, ga4Data) {
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .agency-name { font-size: 24px; font-weight: bold; color: #0ea5e9; }
        .client-name { font-size: 20px; font-weight: bold; }
        h1 { font-size: 28px; text-align: center; margin-bottom: 8px; }
        .subtitle { text-align: center; color: #666; margin-bottom: 40px; }
        .section { margin-bottom: 40px; }
        .section h2 { color: #0ea5e9; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
        .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .metric { background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center; }
        .metric-label { color: #666; font-size: 14px; }
        .metric-value { font-size: 28px; font-weight: bold; margin-top: 8px; }
        .footer { text-align: center; margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #999; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="agency-name">${agency.name}</div>
        <div class="client-name">${client.name}</div>
      </div>
      
      <h1>Performance Report</h1>
      <p class="subtitle">${reportDate} | Last 30 Days</p>
      
      ${metaData ? `
        <div class="section">
          <h2>Meta Ads</h2>
          <div class="metrics">
            <div class="metric">
              <div class="metric-label">Spend</div>
              <div class="metric-value">$${metaData.spend.toLocaleString()}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Impressions</div>
              <div class="metric-value">${(metaData.impressions / 1000).toFixed(1)}K</div>
            </div>
            <div class="metric">
              <div class="metric-label">ROAS</div>
              <div class="metric-value">${metaData.roas}x</div>
            </div>
          </div>
        </div>
      ` : ''}
      
      ${ga4Data ? `
        <div class="section">
          <h2>Google Analytics</h2>
          <div class="metrics">
            <div class="metric">
              <div class="metric-label">Sessions</div>
              <div class="metric-value">${ga4Data.sessions.toLocaleString()}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Users</div>
              <div class="metric-value">${ga4Data.users.toLocaleString()}</div>
            </div>
            <div class="metric">
              <div class="metric-label">Conversions</div>
              <div class="metric-value">${ga4Data.conversions}</div>
            </div>
          </div>
        </div>
      ` : ''}
      
      <div class="footer">
        <p>Powered by ReportFlow</p>
      </div>
    </body>
    </html>
  `
}
