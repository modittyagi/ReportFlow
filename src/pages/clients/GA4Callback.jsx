import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function GA4Callback() {
  const navigate = useNavigate()
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const clientId = params.get('state')
    
    if (code && clientId) {
      const exchangeToken = async () => {
        try {
          const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
              client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
              redirect_uri: `${window.location.origin}/auth/callback/ga4`,
              grant_type: 'authorization_code',
              code
            })
          })
          
          const data = await response.json()
          
          if (data.access_token) {
            const properties = await fetch(
              'https://analyticsadmin.googleapis.com/v1beta/accountSummaries',
              { headers: { Authorization: `Bearer ${data.access_token}` } }
            )
            const propsData = await properties.json()
            
            const firstProperty = propsData.accountSummaries
              ?.flatMap(a => a.propertySummaries || [])
              [0]
            
            if (firstProperty) {
              await supabase
                .from('clients')
                .update({
                  ga4_access_token: data.access_token,
                  ga4_property_id: firstProperty.property.split('/')[1]
                })
                .eq('id', clientId)
            }
          }
        } catch (err) {
          console.error('GA4 OAuth error:', err)
        }
        
        window.location.href = `/clients/${clientId}`
      }
      
      exchangeToken()
    }
  }, [])
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Connecting to Google Analytics...</p>
      </div>
    </div>
  )
}
