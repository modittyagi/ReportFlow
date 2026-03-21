import { supabase } from '../lib/supabase'
import { generatePDF } from './pdfGenerator'

export async function generateReport(clientId, agencyId) {
  const { data: client } = await supabase.from('clients').select('*, agencies(*)').eq('id', clientId).single()
  
  if (!client) throw new Error('Client not found')
  
  let metaData = null
  let ga4Data = null
  
  if (client.meta_ad_account_id) {
    metaData = await fetchMetaData(client.meta_ad_account_id, client.meta_access_token)
  }
  
  if (client.ga4_property_id) {
    ga4Data = await fetchGA4Data(client.ga4_property_id, client.ga4_access_token)
  }
  
  const { data: reportRecord } = await supabase
    .from('reports')
    .insert({
      client_id: clientId,
      agency_id: agencyId,
      meta_data: metaData,
      ga4_data: ga4Data,
      generated_at: new Date().toISOString()
    })
    .select()
    .single()
  
  const pdfBlob = await generatePDF({
    client,
    metaData,
    ga4Data,
    reportId: reportRecord.id
  })
  
  const fileName = `reports/${agencyId}/${clientId}-${Date.now()}.pdf`
  const { error: uploadError } = await supabase.storage
    .from('reports')
    .upload(fileName, pdfBlob, { contentType: 'application/pdf' })
  
  if (!uploadError) {
    const { data: { publicUrl } } = supabase.storage
      .from('reports')
      .getPublicUrl(fileName)
    
    await supabase
      .from('reports')
      .update({ pdf_url: publicUrl })
      .eq('id', reportRecord.id)
  }
  
  return reportRecord
}

async function fetchMetaData(adAccountId, accessToken) {
  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  try {
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
        roas: totals.spend > 0 ? (revenue / parseFloat(totals.spend)).toFixed(2) : 0,
        daily: data.data.map(d => ({
          date: d.date_start,
          spend: parseFloat(d.spend || 0),
          impressions: parseInt(d.impressions || 0),
          clicks: parseInt(d.clicks || 0)
        }))
      }
    }
  } catch (err) {
    console.error('Meta API error:', err)
  }
  
  return null
}

async function fetchGA4Data(propertyId, accessToken) {
  const endDate = new Date().toISOString().split('T')[0]
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  try {
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
          ],
          dimensions: [{ name: 'date' }]
        })
      }
    )
    
    const data = await response.json()
    
    if (data.rows) {
      const totals = {
        sessions: 0,
        users: 0,
        bounceRate: 0,
        conversions: 0
      }
      
      const daily = data.rows.map(row => {
        totals.sessions += parseInt(row.metricValues[0].value)
        totals.users += parseInt(row.metricValues[1].value)
        totals.bounceRate += parseFloat(row.metricValues[2].value)
        totals.conversions += parseInt(row.metricValues[3].value)
        
        return {
          date: row.dimensionValues[0].value,
          sessions: parseInt(row.metricValues[0].value),
          users: parseInt(row.metricValues[1].value),
          bounceRate: parseFloat(row.metricValues[2].value),
          conversions: parseInt(row.metricValues[3].value)
        }
      })
      
      totals.bounceRate = (totals.bounceRate / data.rows.length).toFixed(2)
      
      return { ...totals, daily }
    }
  } catch (err) {
    console.error('GA4 API error:', err)
  }
  
  return null
}
