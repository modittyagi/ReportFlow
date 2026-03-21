import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Eye, Lock, Database, Share2, Cookie, Mail } from 'lucide-react'
import { useSEO } from '../../hooks/useSEO'

export default function PrivacyPolicy() {
  useSEO({
    title: 'Privacy Policy - ReportFlow',
    description: 'Read ReportFlow\'s Privacy Policy. Learn how we collect, use, and protect your personal information.',
    keywords: 'privacy policy, data protection, personal information'
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
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last updated: March 22, 2026
          </p>

          <div className="space-y-8 text-gray-600 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-brand-600" />
                Information We Collect
              </h2>
              <p className="leading-relaxed">We collect information you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                <li><strong>Account Information:</strong> Name, email address, password, and company name</li>
                <li><strong>Profile Data:</strong> Agency branding, logo, and business information</li>
                <li><strong>Client Data:</strong> Information about your clients</li>
                <li><strong>Usage Information:</strong> How you interact with our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-brand-600" />
                Data Security
              </h2>
              <p className="leading-relaxed">We implement industry-standard security measures including SSL/TLS encryption, secure cloud infrastructure, and access controls.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Your Rights
              </h2>
              <p className="leading-relaxed">You have the right to access, correct, or delete your personal information. Contact us at privacy@reportflow.app to exercise these rights.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6 text-brand-600" />
                Contact Us
              </h2>
              <p className="leading-relaxed">If you have questions about this Privacy Policy, please contact us at privacy@reportflow.app</p>
            </section>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <Link to="/terms" className="text-brand-600 hover:text-brand-700">Terms of Service</Link>
          <span className="text-gray-400">|</span>
          <Link to="/cookies" className="text-brand-600 hover:text-brand-700">Cookie Policy</Link>
        </div>
      </div>
    </div>
  )
}
