import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { Plus, Search, Users, ExternalLink, Trash2, Settings, Building2, X, Upload, Menu, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { demoClients } from '../../utils/demoData'

function MobileNav({ isOpen, onClose }) {
  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/clients', label: 'Clients' },
    { to: '/reports', label: 'Reports' },
    { to: '/settings', label: 'Settings' },
  ]
  
  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? 'visible' : 'invisible'}`}>
      <div className={`absolute inset-0 bg-black/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div className={`absolute right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-brand-600">Menu</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClose}
              className="block px-4 py-3 rounded-lg hover:bg-gray-100 font-medium text-gray-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
}

function ClientModal({ isOpen, onClose, onSuccess, userId }) {
  const [formData, setFormData] = useState({ name: '', website: '', logo_url: '' })
  const [loading, setLoading] = useState(false)

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      
      const { error } = await supabase.storage.from('client-logos').upload(fileName, file)
      if (error) throw error
      
      const { data: { publicUrl } } = supabase.storage.from('client-logos').getPublicUrl(fileName)
      setFormData({ ...formData, logo_url: publicUrl })
    } catch (err) {
      console.error('Failed to upload logo:', err)
      toast.error('Failed to upload logo')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { error } = await supabase.from('clients').insert({
        ...formData,
        agency_id: userId
      })
      
      if (error) throw error
      
      setFormData({ name: '', website: '', logo_url: '' })
      toast.success('Client added successfully')
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Failed to create client:', err)
      toast.error('Failed to create client')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add New Client</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Client Logo</label>
            <div className="flex items-center gap-4">
              {formData.logo_url ? (
                <div className="relative">
                  <img src={formData.logo_url} alt="Preview" className="w-16 h-16 rounded-xl object-contain border border-gray-200" />
                  <label className="absolute -bottom-1 -right-1 p-1 bg-brand-600 text-white rounded-full cursor-pointer hover:bg-brand-700 transition-colors">
                    <Upload className="w-3 h-3" />
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="sr-only" />
                  </label>
                </div>
              ) : (
                <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="sr-only" />
                </label>
              )}
              <p className="text-sm text-gray-500">Upload logo (optional)</p>
            </div>
          </div>
          
          <Input
            label="Client Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Acme Corp"
            required
          />
          
          <Input
            label="Website"
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://example.com"
          />
          
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" loading={loading} className="flex-1">Add Client</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Clients() {
  const [clients, setClients] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetchClients()
  }, [user.id])

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('agency_id', user.id)
      
      if (error) throw error
      setClients(data || [])
    } catch (err) {
      console.error('Failed to fetch clients:', err)
      toast.error('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      try {
        const { error } = await supabase.from('clients').delete().eq('id', id)
        if (error) throw error
        toast.success('Client deleted successfully')
        fetchClients()
      } catch (err) {
        console.error('Failed to delete client:', err)
        toast.error('Failed to delete client')
      }
    }
  }

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.website?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-brand-600">ReportFlow</h1>
          <div className="hidden lg:flex gap-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-gray-100">Dashboard</Link>
            <Link to="/clients" className="text-brand-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-100">Clients</Link>
            <Link to="/reports" className="text-gray-600 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-gray-100">Reports</Link>
            <Link to="/settings" className="text-gray-600 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-gray-100">Settings</Link>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </nav>
      
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      <main className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Clients</h2>
            <p className="text-gray-500 text-sm mt-1">{clients.length} total clients</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full sm:w-56 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Client</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCard icon={Users} label="Total Clients" value={clients.length} color="bg-blue-500" />
          <StatCard icon={Building2} label="With Websites" value={clients.filter(c => c.website).length} color="bg-emerald-500" />
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : filteredClients.length === 0 ? (
          <Card>
            <div className="text-center py-8 sm:py-12">
              <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No clients found</h3>
              <p className="text-gray-500 mb-4 text-sm">
                {searchQuery ? 'Try a different search term' : 'Get started by adding your first client'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Client
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <>
          {!searchQuery && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Demo Clients</h3>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">Try it out</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">Preview reports with sample data - no integration needed!</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {demoClients.map((client) => (
                  <Card key={client.id} className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-xl font-bold text-white">
                          {client.name[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{client.name}</h3>
                          <span className="text-sm text-purple-600">Demo Client</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Demo</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      {client.meta_connected && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">Meta ✓</span>}
                      {client.ga4_connected && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">GA4 ✓</span>}
                    </div>
                    <Link
                      to={`/clients/${client.id}`}
                      className="flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 text-sm font-medium"
                    >
                      <Sparkles className="w-4 h-4" />
                      View Demo
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Clients</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {client.logo_url ? (
                      <img src={client.logo_url} alt={client.name} className="w-12 h-12 rounded-xl object-contain bg-gray-50 p-1" />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-100 to-brand-200 rounded-xl flex items-center justify-center text-xl font-bold text-brand-600">
                        {client.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{client.name}</h3>
                      {client.website ? (
                        <a 
                          href={client.website} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-brand-600 hover:underline flex items-center gap-1"
                        >
                          {client.website.replace(/^https?:\/\//, '').substring(0, 20)}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">No website</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link
                    to={`/clients/${client.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium"
                  >
                    <Settings className="w-4 h-4" />
                    Manage
                  </Link>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete client"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
          </>
        )}
      </main>
      
      <ClientModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onSuccess={fetchClients}
        userId={user.id}
      />
    </div>
  )
}
