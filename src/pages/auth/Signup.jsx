import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

function triggerConfetti() {
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981']
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.6 },
    colors: colors
  })
}

function AnimatedBackground() {
  const { isDark } = useTheme()
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {!isDark && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50" />
      )}
      {isDark && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      )}
    </div>
  )
}

function FormInput({ label, type, value, onChange, placeholder, required, icon, minLength }) {
  const [showPassword, setShowPassword] = useState(false)
  const { isDark } = useTheme()
  const isPassword = type === 'password'
  
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={isPassword && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className={`w-full px-2.5 py-2 ${icon ? 'pl-8' : ''} ${isPassword ? 'pr-8' : ''} rounded-lg border text-sm transition-all ${
            isDark 
              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500' 
              : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'
          } focus:outline-none focus:ring-1 focus:ring-blue-500`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

function PasswordStrength({ password }) {
  const { isDark } = useTheme()
  
  const getStrength = () => {
    let strength = 0
    if (password.length >= 6) strength++
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }
  
  const strength = getStrength()
  const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']
  
  if (!password) return null
  
  return (
    <div className="mt-1">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength ? colors[strength - 1] : isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{labels[strength - 1] || 'Too short'}</p>
    </div>
  )
}

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const { isDark } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp(email, password)
      triggerConfetti()
      navigate('/setup')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <AnimatedBackground />
      
      <div className="w-full lg:w-[50%] flex items-center justify-end p-3 sm:p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`w-full max-w-xs sm:max-w-sm rounded-xl p-4 sm:p-5 shadow-lg border ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}
        >
          <div className="text-center mb-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ReportFlow</h1>
          </div>

          <div className="mb-3">
            <h2 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create account</h2>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>14-day free trial</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg">
                {error}
              </motion.div>
            )}
            
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@agency.com"
              required
              icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
            />
            
            <div>
              <FormInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                minLength={6}
                icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
              />
              <PasswordStrength password={password} />
            </div>

            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              By signing up, you agree to our <a href="#" className="text-blue-600 dark:text-blue-400">Terms</a> and <a href="#" className="text-blue-600 dark:text-blue-400">Privacy</a>
            </p>
            
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              onClick={triggerConfetti}
              className="w-full py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-1.5">
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  Creating...
                </span>
              ) : 'Create Account'}
            </motion.button>

            <div className={`relative ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <div className="absolute inset-0 flex items-center"><div className={`w-full border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`} /></div>
              <div className="relative flex justify-center text-xs"><span className={`px-2 ${isDark ? 'bg-gray-800 text-gray-500' : 'bg-white text-gray-400'}`}>or</span></div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-medium transition ${isDark ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Google
              </button>
              <button type="button" className={`flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-medium transition ${isDark ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </button>
            </div>
          </form>
          
          <div className={`mt-3 pt-3 border-t ${isDark ? 'border-gray-700' : 'border-gray-100'} text-center text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <span>Have account? </span>
            <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium">Sign in</Link>
          </div>
        </motion.div>
      </div>

      <div className="hidden lg:flex lg:w-[50%] relative z-10 flex-col justify-center items-center p-4 lg:p-6">
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="max-w-md text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Start Free Trial</h1>
          <p className="text-base text-gray-600 dark:text-gray-300 mb-6">Join hundreds of agencies using ReportFlow</p>
          
          <div className="space-y-2">
            {[
              { title: '14 days free', desc: 'No credit card required', color: 'blue' },
              { title: 'Instant setup', desc: 'Get started in minutes', color: 'green' },
              { title: 'Cancel anytime', desc: 'No commitments', color: 'purple' }
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-3 rounded-lg p-3 ${isDark ? 'bg-gray-800/80 border border-gray-700' : 'bg-white/80 border border-gray-200'}`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600' : item.color === 'green' ? 'bg-green-100 dark:bg-green-900/50 text-green-600' : 'bg-purple-100 dark:bg-purple-900/50 text-purple-600'}`}>
                  {item.color === 'blue' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  {item.color === 'green' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                  {item.color === 'purple' && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                </div>
                <div className="text-left">
                  <p className="text-gray-900 dark:text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
