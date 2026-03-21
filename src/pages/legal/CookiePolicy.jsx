import { Link } from 'react-router-dom'
import { ArrowLeft, Cookie, Settings } from 'lucide-react'
import { useSEO } from '../../hooks/useSEO'

export default function CookiePolicy() {
  useSEO({
    title: 'Cookie Policy - ReportFlow',
    description: 'Read ReportFlow\'s Cookie Policy. Learn about how we use cookies and your choices.',
    keywords: 'cookie policy, cookies, tracking, privacy'
  })
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-600 mb-6 sm:mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 lg:p-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Cookie Policy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last updated: March 22, 2026
          </p>

          <div className="space-y-8 text-gray-600 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                What Are Cookies?
              </h2>
              <p className="leading-relaxed">
                Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your browsing experience.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Why We Use Cookies
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Authentication:</strong> Keep you logged in</li>
                <li><strong>Security:</strong> Protect your account</li>
                <li><strong>Preferences:</strong> Remember your settings</li>
                <li><strong>Analytics:</strong> Understand how you use our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Types of Cookies
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Essential Cookies</h3>
                  <p className="text-sm">Required for the platform to function. Cannot be disabled.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Functionality Cookies</h3>
                  <p className="text-sm">Remember your preferences and settings.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Analytics Cookies</h3>
                  <p className="text-sm">Help us understand how visitors interact with our platform.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Managing Cookies
              </h2>
              <p className="leading-relaxed">
                You can control cookies through your browser settings. Disabling cookies may affect functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Contact Us
              </h2>
              <p className="leading-relaxed">Questions? Contact us at privacy@reportflow.app</p>
            </section>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <Link to="/privacy" className="text-brand-600 hover:text-brand-700">Privacy Policy</Link>
          <span className="text-gray-400">|</span>
          <Link to="/terms" className="text-brand-600 hover:text-brand-700">Terms of Service</Link>
        </div>
      </div>
    </div>
  )
}
