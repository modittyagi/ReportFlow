import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Setup from './pages/auth/Setup'
import Dashboard from './pages/dashboard/Dashboard'
import Clients from './pages/clients/Clients'
import ClientDetail from './pages/clients/ClientDetail'
import MetaCallback from './pages/clients/MetaCallback'
import GA4Callback from './pages/clients/GA4Callback'
import Reports from './pages/reports/Reports'
import Settings from './pages/settings/Settings'

function InitialLoader({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 1500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 bg-white z-[200] flex items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: [
              "0 25px 50px -12px rgba(59, 130, 246, 0.25)",
              "0 25px 50px -12px rgba(147, 51, 234, 0.35)",
              "0 25px 50px -12px rgba(59, 130, 246, 0.25)"
            ]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.svg 
            className="w-12 h-12 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </motion.svg>
        </motion.div>
        <motion.p 
          className="text-center mt-6 text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ReportFlow
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!user) return <Navigate to="/login" />
  
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (user) return <Navigate to="/dashboard" />
  
  return children
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const { loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      setLoaded(true)
    }
  }, [loading])

  const handleLoadComplete = () => {
    setInitialLoad(false)
  }

  return (
    <>
      <AnimatePresence>
        {initialLoad && <InitialLoader onComplete={handleLoadComplete} />}
      </AnimatePresence>
      
      <AnimatePresence>
        {!initialLoad && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Routes>
              <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/setup" element={<Setup />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
              <Route path="/clients/:id" element={<ProtectedRoute><ClientDetail /></ProtectedRoute>} />
              <Route path="/auth/callback/meta" element={<MetaCallback />} />
              <Route path="/auth/callback/ga4" element={<GA4Callback />} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
