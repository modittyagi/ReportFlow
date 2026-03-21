import { useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function MetaCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const clientId = params.get('state')
    
    if (code && clientId) {
      const exchangeToken = async () => {
        try {
          const response = await fetch(
            `https://graph.facebook.com/v18.0/oauth/access_token?` +
            `client_id=${import.meta.env.VITE_META_APP_ID}&` +
            `client_secret=${import.meta.env.VITE_META_APP_SECRET}&` +
            `redirect_uri=${window.location.origin}/auth/callback/meta&` +
            `code=${code}`
          )
          
          const data = await response.json()
          
          if (data.access_token) {
            const adAccounts = await fetch(
              `https://graph.facebook.com/v18.0/me/adaccounts?` +
              `fields=id,name&access_token=${data.access_token}`
            )
            const accountsData = await adAccounts.json()
            
            if (accountsData.data && accountsData.data.length > 0) {
              await supabase
                .from('clients')
                .update({
                  meta_access_token: data.access_token,
                  meta_ad_account_id: accountsData.data[0].id
                })
                .eq('id', clientId)
            }
          }
        } catch (err) {
          console.error('Meta OAuth error:', err)
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
        <p className="text-gray-600">Connecting to Meta Ads...</p>
      </div>
    </div>
  )
}
