import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function GA4Callback() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    
    if (code) {
      const exchangeToken = async () => {
        try {
          const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
              client_secret: import.meta.env.GOOGLE_CLIENT_SECRET,
              redirect_uri: `${window.location.origin}/clients/${id}/callback/ga4`,
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
                .eq('id', id)
            }
          }
        } catch (err) {
          console.error('GA4 OAuth error:', err)
        }
        
        navigate(`/clients/${id}`)
      }
      
      exchangeToken()
    }
  }, [id])
  
  return <div className="p-8 text-center">Connecting to Google Analytics...</div>
}
