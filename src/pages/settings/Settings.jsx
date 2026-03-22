import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { Building2, CalendarClock, User, Upload, LogOut, Menu, X } from 'lucide-react'
import { toast } from 'sonner'

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

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
        active ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}

function SectionHeader({ icon: Icon, title, description }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="p-2 bg-brand-100 rounded-lg">
        <Icon className="w-5 h-5 text-brand-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
    </div>
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-brand-600' : 'bg-gray-300'}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      </div>
    </label>
  )
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [agency, setAgency] = useState({ name: '', logo_url: '' })
  const [schedule, setSchedule] = useState({ day: 'monday', time: '09:00', enabled: false })
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, signOut } = useAuth()

  useEffect(() => {
    fetchData()
  }, [user.id])

  const fetchData = async () => {
    const { data: agencyData } = await supabase.from('agencies').select('*').eq('id', user.id).single()
    if (agencyData) setAgency(agencyData)
    
    const { data: clientData } = await supabase.from('clients').select('id, name').eq('agency_id', user.id)
    setClients(clientData || [])
    
    const { data: scheduleData } = await supabase
      .from('schedules')
      .select('*')
      .eq('agency_id', user.id)
      .single()
    if (scheduleData) {
      setSchedule({
        day: scheduleData.day,
        time: scheduleData.time,
        enabled: scheduleData.enabled,
        client_id: scheduleData.client_id
      })
      setSelectedClient(scheduleData.client_id || '')
    }
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-logo.${fileExt}`
      
      const { error: uploadError } = await supabase.storage.from('logos').upload(fileName, file, { upsert: true })
      if (uploadError) throw uploadError
      
      const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(fileName)
      setAgency({ ...agency, logo_url: publicUrl })
      
      const { error: updateError } = await supabase.from('agencies').update({ logo_url: publicUrl }).eq('id', user.id)
      if (updateError) throw updateError
      
      toast.success('Logo updated successfully')
    } catch (err) {
      console.error('Failed to upload logo:', err)
      toast.error('Failed to upload logo')
    }
  }

  const handleAgencyUpdate = async () => {
    try {
      const { error } = await supabase.from('agencies').update({ name: agency.name }).eq('id', user.id)
      if (error) throw error
      toast.success('Agency profile updated')
    } catch (err) {
      console.error('Failed to update agency:', err)
      toast.error('Failed to save changes')
    }
  }

  const handleScheduleUpdate = async () => {
    try {
      const { error } = await supabase.from('schedules').upsert({
        agency_id: user.id,
        client_id: selectedClient || null,
        day: schedule.day,
        time: schedule.time,
        enabled: schedule.enabled
      }, { onConflict: 'agency_id' })
      
      if (error) throw error
      toast.success('Schedule updated successfully')
    } catch (err) {
      console.error('Failed to update schedule:', err)
      toast.error('Failed to save schedule')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-bold text-brand-600">ReportFlow</h1>
          <div className="hidden lg:flex gap-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-gray-100">Dashboard</Link>
            <Link to="/clients" className="text-gray-600 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-gray-100">Clients</Link>
            <Link to="/reports" className="text-gray-600 hover:text-brand-600 px-3 py-2 rounded-lg hover:bg-gray-100">Reports</Link>
            <Link to="/settings" className="text-brand-600 font-medium px-3 py-2 rounded-lg hover:bg-gray-100">Settings</Link>
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
      
      <main className="max-w-4xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Settings</h2>
        
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-white p-2 rounded-xl border border-gray-200">
          <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={Building2} label="Profile" />
          <button
            onClick={() => toast.info('Schedule Reports coming soon!')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-gray-400 cursor-not-allowed"
            disabled
          >
            <CalendarClock className="w-4 h-4" />
            <span className="hidden sm:inline">Schedule</span>
            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">Soon</span>
          </button>
          <TabButton active={activeTab === 'account'} onClick={() => setActiveTab('account')} icon={User} label="Account" />
        </div>
        
        {activeTab === 'profile' && (
          <Card>
            <SectionHeader 
              icon={Building2} 
              title="Agency Profile" 
              description="Manage your agency information and branding"
            />
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agency Logo</label>
                <div className="flex items-center gap-6">
                  {agency.logo_url ? (
                    <div className="relative">
                      <img src={agency.logo_url} alt="Logo" className="w-20 h-20 object-contain rounded-xl border border-gray-200" />
                      <label className="absolute -bottom-2 -right-2 p-1.5 bg-brand-600 text-white rounded-full cursor-pointer hover:bg-brand-700 transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="sr-only" />
                      </label>
                    </div>
                  ) : (
                    <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition-colors">
                      <Upload className="w-6 h-6 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">Upload</span>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="sr-only" />
                    </label>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Upload your agency logo</p>
                    <p className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>
              
              <div className="max-w-md">
                <Input
                  label="Agency Name"
                  value={agency.name}
                  onChange={(e) => setAgency({ ...agency, name: e.target.value })}
                  placeholder="Enter agency name"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <Button onClick={handleAgencyUpdate}>Save Changes</Button>
              </div>
            </div>
          </Card>
        )}
        
        {activeTab === 'schedule' && (
          <Card>
            <SectionHeader 
              icon={CalendarClock} 
              title="Scheduled Reports" 
              description="Set up automatic weekly report delivery to your clients"
            />
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <Toggle 
                  checked={schedule.enabled} 
                  onChange={(e) => setSchedule({ ...schedule, enabled: e.target.checked })} 
                  label="Enable auto-delivery"
                />
              </div>
              
              {schedule.enabled && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Client</label>
                      <select
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-black"
                      >
                        <option value="">Select a client</option>
                        {clients.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Day</label>
                      <select
                        value={schedule.day}
                        onChange={(e) => setSchedule({ ...schedule, day: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white text-black"
                      >
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
                          <option key={day} value={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="max-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Time</label>
                    <input
                      type="time"
                      value={schedule.time}
                      onChange={(e) => setSchedule({ ...schedule, time: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-black"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4">
                <Button onClick={handleScheduleUpdate}>Save Schedule</Button>
              </div>
            </div>
          </Card>
        )}
        
        {activeTab === 'account' && (
          <Card>
            <SectionHeader 
              icon={User} 
              title="Account" 
              description="Manage your account settings"
            />
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-3">Sign out</p>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-2.5 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
