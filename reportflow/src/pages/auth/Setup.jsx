import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export default function Setup() {
  const [agencyName, setAgencyName] = useState('')
  const [logo, setLogo] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('logos')
      .upload(fileName, file)
    
    if (error) {
      alert('Error uploading logo')
      return
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(fileName)
    
    setLogo(publicUrl)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase
      .from('agencies')
      .update({ name: agencyName, logo_url: logo })
      .eq('id', user.id)
    
    if (error) {
      alert('Error saving agency: ' + error.message)
    } else {
      navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Set Up Your Agency</h1>
          <p className="mt-2 text-gray-600">Tell us about your agency</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Agency Name</label>
            <input
              type="text"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Agency Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="mt-1 w-full"
            />
            {logo && <img src={logo} alt="Logo preview" className="mt-2 h-16 object-contain" />}
          </div>
          
          <button
            type="submit"
            disabled={loading || !agencyName}
            className="w-full py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 font-medium"
          >
            {loading ? 'Saving...' : 'Complete Setup'}
          </button>
        </form>
      </div>
    </div>
  )
}
