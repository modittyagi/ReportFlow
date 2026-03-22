import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { fadeInUp, staggerContainer, staggerContainerFast } from '../lib/animations'
import { useTheme } from '../context/ThemeContext'

function triggerConfetti() {
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981']
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: colors
  })
}

function GradientOrbs() {
  const { isDark } = useTheme()
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div 
        className={`absolute -top-20 -left-20 w-64 h-64 md:w-96 md:h-96 rounded-full mix-blend-multiply filter blur-3xl ${isDark ? 'opacity-15' : 'opacity-30'}`}
        style={{ backgroundColor: '#60a5fa' }}
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div 
        className={`absolute -top-10 -right-20 w-64 h-64 md:w-96 md:h-96 rounded-full mix-blend-multiply filter blur-3xl ${isDark ? 'opacity-15' : 'opacity-30'}`}
        style={{ backgroundColor: '#a78bfa' }}
        animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
      />
      <motion.div 
        className={`absolute -bottom-20 left-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full mix-blend-multiply filter blur-3xl ${isDark ? 'opacity-10' : 'opacity-20'}`}
        style={{ backgroundColor: '#f472b6' }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
    </div>
  )
}

function DashboardMockup({ mouseX, mouseY }) {
  const springConfig = { stiffness: 50, damping: 20 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  return (
    <motion.div 
      className="mt-12 md:mt-20 relative px-2 sm:px-0"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div style={{ x, y }} className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-transparent to-transparent z-10 pointer-events-none" />
        <div className="bg-gray-900 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-2xl">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-4">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg sm:rounded-xl p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  AC
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Acme Corp</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Monthly Performance Report</p>
                </div>
              </div>
              <span className="px-2 py-1 sm:px-3 sm:py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs sm:text-sm font-medium rounded-full">This Month</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
              {[
                { label: 'Spend', value: '$12,450', change: '↑ 12%' },
                { label: 'ROAS', value: '4.2x', change: '↑ 8%' },
                { label: 'Sessions', value: '48.2K', change: '↑ 23%' },
                { label: 'Conv.', value: '892', change: '↑ 15%' }
              ].map((metric, i) => (
                <motion.div 
                  key={i}
                  className="bg-gray-50 dark:bg-gray-600 rounded-lg sm:rounded-xl p-2 sm:p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{metric.label}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">{metric.change}</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="h-32 sm:h-48 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg sm:rounded-xl flex items-center justify-center overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="flex items-end gap-1 sm:gap-2 h-20 sm:h-32 px-1">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <motion.div 
                    key={i} 
                    className="w-2 sm:w-6 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                    style={{ height: `${h}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 1.3 + i * 0.05, duration: 0.5 }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function IntegrationLogos() {
  const logos = [
    { name: 'Meta', icon: 'M', color: 'from-blue-600 to-blue-700' },
    { name: 'GA', icon: 'GA', color: 'from-yellow-500 to-orange-500' },
    { name: 'Slack', icon: 'S', color: 'from-purple-500 to-pink-500' },
    { name: 'HubSpot', icon: 'H', color: 'from-orange-500 to-red-500' },
    { name: 'Zapier', icon: 'Z', color: 'from-blue-500 to-cyan-500' },
    { name: 'Mailchimp', icon: 'MC', color: 'from-amber-500 to-yellow-500' }
  ]

  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-8 md:mb-12" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">Integrates With Your Stack</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">Connect with the tools you already use.</p>
        </motion.div>

        <motion.div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          {logos.map((logo, i) => (
            <motion.div key={logo.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ scale: 1.1, y: -5 }} className="flex flex-col items-center gap-2 touch-target">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${logo.color} rounded-xl sm:rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base md:text-lg shadow-lg`}>
                {logo.icon}
              </div>
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">{logo.name}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function PricingPreview() {
  const plans = [
    { name: 'Starter', price: '$29', features: ['5 Clients', '10 Reports/mo', 'PDF Export', 'Email Support'], popular: false },
    { name: 'Pro', price: '$79', features: ['25 Clients', 'Unlimited', 'Auto-Schedule', 'Custom Branding', 'Priority Support'], popular: true },
    { name: 'Agency', price: '$199', features: ['Unlimited', 'All Integrations', 'White Label', 'API Access'], popular: false }
  ]

  return (
    <section id="pricing" className="py-16 md:py-20 bg-gray-900 dark:bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-8 md:mb-16" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 md:mb-4">Simple Pricing</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto px-4">14-day free trial. No credit card required.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className={`relative bg-gray-800 rounded-2xl p-4 sm:p-6 md:p-8 border ${plan.popular ? 'border-blue-500 shadow-xl shadow-blue-500/20' : 'border-gray-700'}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white text-xs sm:text-sm font-semibold">Popular</div>}
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400 text-sm">/mo</span>
              </div>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={triggerConfetti} className={`w-full py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base touch-target ${plan.popular ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                Start Trial
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  
  return <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-[100]" style={{ scaleX }} />
}

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  
  return (
    <motion.button onClick={toggleTheme} className="p-2 sm:p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors touch-target" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} aria-label={isDark ? 'Light mode' : 'Dark mode'}>
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.svg key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
          </motion.svg>
        ) : (
          <motion.svg key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function MobileMenu({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 bottom-0 w-72 sm:w-80 bg-white dark:bg-gray-800 z-50 md:hidden shadow-2xl safe-area-bottom">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold">Menu</span>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 touch-target" aria-label="Close">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <nav className="space-y-2">
                {['Features', 'Pricing', 'How it Works'].map((item) => (
                  <a key={item} href={item === 'Features' ? '#features' : item === 'Pricing' ? '#pricing' : '#how-it-works'} onClick={onClose} className="block py-3 text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 touch-target rounded-lg px-4">{item}</a>
                ))}
                <hr className="border-gray-200 dark:border-gray-700 my-4" />
                <Link to="/login" onClick={onClose} className="block py-3 text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 touch-target rounded-lg px-4">Sign In</Link>
                <Link to="/signup" onClick={onClose} className="block w-full py-3 text-center bg-blue-600 text-white rounded-xl font-semibold mt-4">Get Started Free</Link>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function AnimatedNav({ scrolled }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  return (
    <>
      <motion.nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm py-2 sm:py-3' : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 py-3 sm:py-4'}`} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <motion.div className="flex items-center gap-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">ReportFlow</span>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition text-sm font-medium">Features</a>
            <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition text-sm font-medium">Pricing</a>
            <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition text-sm font-medium">How it Works</a>
            <Link to="/login" className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium text-sm">Sign In</Link>
            <ThemeToggle />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signup" className="px-5 py-2.5 bg-blue-600 text-white rounded-full font-medium text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-600/25">Get Started</Link>
            </motion.div>
          </div>

          <div className="flex md:hidden items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 touch-target" aria-label="Open menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </motion.nav>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}

export default function Landing() {
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      setMouseX((e.clientX - centerX) * 0.02)
      setMouseY((e.clientY - centerY) * 0.02)
    }
  }, [])

  const featureColors = ['from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-pink-500 to-pink-600', 'from-orange-500 to-orange-600', 'from-green-500 to-green-600', 'from-cyan-500 to-cyan-600']

  const features = [
    { title: 'Instant Reports', description: 'Generate beautiful reports in seconds.', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
    { title: 'PDF Export', description: 'Professional PDFs with your branding.', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> },
    { title: 'Auto-Schedule', description: 'Reports delivered automatically.', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { title: 'Multi-Client', description: 'Manage all clients in one place.', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg> },
    { title: 'Meta Ads', description: 'Pull data directly from Meta.', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { title: 'GA4 Integration', description: 'Connect Google Analytics 4.', icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <ScrollProgress />
      <AnimatedNav scrolled={scrolled} />
      
      <section ref={heroRef} onMouseMove={handleMouseMove} className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 relative overflow-hidden">
        <GradientOrbs />
        <motion.div className="max-w-7xl mx-auto relative z-10" style={{ opacity: heroOpacity, y: heroY }}>
          <motion.div className="text-center max-w-4xl mx-auto" variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6" variants={fadeInUp} whileHover={{ scale: 1.05 }}>
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>
              Now with GA4 Integration
            </motion.div>
            
            <motion.h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight px-2" variants={fadeInUp}>
              Client Reports That{' '}
              <motion.span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent inline-block" animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }} transition={{ duration: 5, repeat: Infinity }} style={{ backgroundSize: '200% 200%' }}>
                Impress
              </motion.span>{' '}
              Every Time
            </motion.h1>
            
            <motion.p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-10 max-w-2xl mx-auto px-4" variants={fadeInUp}>
              Create stunning, branded marketing reports in seconds. Connect Meta Ads and Google Analytics, generate PDFs, and auto-deliver.
            </motion.p>
            
            <motion.div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4" variants={fadeInUp}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={triggerConfetti} className="px-6 sm:px-8 py-3 sm:py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-semibold text-sm sm:text-base shadow-xl touch-target">
                <Link to="/signup" className="block">Start Free Trial</Link>
              </motion.button>
              <motion.a href="#how-it-works" className="px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-full font-semibold text-sm sm:text-base touch-target text-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                See How It Works
              </motion.a>
            </motion.div>
            
            <motion.p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500" variants={fadeInUp}>No credit card required • 14-day free trial</motion.p>
          </motion.div>

          <DashboardMockup mouseX={mouseX} mouseY={mouseY} />
        </motion.div>
      </section>

      <IntegrationLogos />

      <section id="features" className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div className="text-center mb-8 md:mb-16" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">Everything You Need</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">Powerful features that make client reporting effortless.</p>
          </motion.div>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {features.map((feature, index) => (
              <motion.div key={index} className="bg-white dark:bg-gray-700 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-100 dark:border-gray-600" variants={fadeInUp} whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)" }}>
                <motion.div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-6 bg-gradient-to-br ${featureColors[index]}`} whileHover={{ scale: 1.1 }}>
                  <div className="w-6 h-6 sm:w-7 sm:h-7 text-white">{feature.icon}</div>
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 md:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div className="text-center mb-8 md:mb-16" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">How It Works</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">Three simple steps to automated reporting.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { num: '1', title: 'Add Clients', desc: 'Create profiles and connect Meta Ads & GA4.', color: 'blue' },
              { num: '2', title: 'Generate', desc: 'One-click beautiful branded reports.', color: 'purple' },
              { num: '3', title: 'Auto-Deliver', desc: 'Clients get reports automatically.', color: 'pink' }
            ].map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="text-center">
                <motion.div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 text-xl sm:text-2xl font-bold shadow-lg ${step.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : step.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'}`} whileHover={{ scale: 1.1 }}>
                  {step.num}
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PricingPreview />

      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 dark:from-gray-900 dark:via-indigo-900 dark:to-gray-900 relative overflow-hidden">
        <motion.div className="absolute inset-0 opacity-30" animate={{ background: ["radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)", "radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.4) 0%, transparent 50%)", "radial-gradient(circle at 50% 80%, rgba(236, 72, 153, 0.4) 0%, transparent 50%)", "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)"] }} transition={{ duration: 10, repeat: Infinity }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Ready to Impress Your Clients?
          </motion.h2>
          <motion.p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto px-4" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Start your 14-day free trial today. No credit card required.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={triggerConfetti} className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 rounded-full font-semibold text-sm sm:text-base shadow-xl touch-target">
              <Link to="/signup" className="block">Start Free Trial</Link>
            </motion.button>
            <motion.a href="#" className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 text-white rounded-full font-semibold text-sm sm:text-base border border-white/20 touch-target" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              Book a Demo
            </motion.a>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <span className="text-base sm:text-lg font-semibold text-white">ReportFlow</span>
            </div>
            <div className="flex gap-4 sm:gap-8 text-sm flex-wrap justify-center">
              <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-white transition">Cookie Policy</Link>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800 text-center text-xs sm:text-sm">
            <p>© 2024 ReportFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
