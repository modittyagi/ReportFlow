import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function generatePDF({ client, metaData, ga4Data, reportId }) {
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #1f2937; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
        .logos { display: flex; gap: 40px; align-items: center; }
        .logo-placeholder { font-weight: bold; font-size: 18px; color: #0ea5e9; }
        .client-name { font-size: 24px; font-weight: bold; }
        .report-title { text-align: center; margin-bottom: 30px; }
        .report-title h1 { font-size: 28px; margin-bottom: 8px; }
        .report-title p { color: #6b7280; }
        .section { margin-bottom: 40px; }
        .section h2 { font-size: 20px; margin-bottom: 16px; color: #0ea5e9; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; margin-bottom: 20px; }
        .metric-card { background: #f9fafb; padding: 16px; border-radius: 8px; }
        .metric-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
        .metric-value { font-size: 24px; font-weight: bold; color: #1f2937; }
        .no-data { color: #9ca3af; font-style: italic; }
        .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background: #f9fafb; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logos">
          <div class="logo-placeholder">${client.agencies?.name || 'Agency'}</div>
          <span style="font-size: 24px; color: #d1d5db;">→</span>
          <div class="logo-placeholder">${client.name}</div>
        </div>
      </div>
      
      <div class="report-title">
        <h1>Performance Report</h1>
        <p>${reportDate} | Last 30 Days</p>
      </div>
      
      ${metaData ? `
        <div class="section">
          <h2>Meta Ads Performance</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">Total Spend</div>
              <div class="metric-value">$${metaData.spend.toLocaleString()}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Impressions</div>
              <div class="metric-value">${metaData.impressions.toLocaleString()}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Clicks</div>
              <div class="metric-value">${metaData.clicks.toLocaleString()}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">CTR</div>
              <div class="metric-value">${metaData.ctr}%</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">ROAS</div>
              <div class="metric-value">${metaData.roas}x</div>
            </div>
          </div>
        </div>
      ` : '<p class="no-data">No Meta Ads data available</p>'}
      
      ${ga4Data ? `
        <div class="section">
          <h2>Google Analytics 4 Performance</h2>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">Sessions</div>
              <div class="metric-value">${ga4Data.sessions.toLocaleString()}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Users</div>
              <div class="metric-value">${ga4Data.users.toLocaleString()}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Bounce Rate</div>
              <div class="metric-value">${ga4Data.bounceRate}%</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Conversions</div>
              <div class="metric-value">${ga4Data.conversions.toLocaleString()}</div>
            </div>
          </div>
        </div>
      ` : '<p class="no-data">No GA4 data available</p>'}
      
      <div class="footer">
        <p>Powered by ReportFlow</p>
      </div>
    </body>
    </html>
  `
  
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  
  const printWindow = window.open('', '_blank')
  printWindow.document.write(html)
  printWindow.document.close()
  
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const canvas = await html2canvas(printWindow.document.body, { scale: 2, useCORS: true })
  const imgData = canvas.toDataURL('image/png')
  
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
  printWindow.close()
  URL.revokeObjectURL(url)
  
  return pdf.output('blob')
}
