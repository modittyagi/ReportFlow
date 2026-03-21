import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export default function MetaCallback() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    
    if (code) {
      const exchangeToken = async () => {
        try {
          const response = await fetch(
            `https://graph.facebook.com/v18.0/oauth/access_token?` +
            `client_id=${import.meta.env.VITE_META_APP_ID}&` +
            `client_secret=${import.meta.env.META_APP_SECRET}&` +
            `redirect_uri=${window.location.origin}/clients/${id}/callback/meta&` +
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
                .eq('id', id)
            }
          }
        } catch (err) {
          console.error('Meta OAuth error:', err)
        }
        
        navigate(`/clients/${id}`)
      }
      
      exchangeToken()
    }
  }, [id])
  
  return <div className="p-8 text-center">Connecting to Meta Ads...</div>
}
