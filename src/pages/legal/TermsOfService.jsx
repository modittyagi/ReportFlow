import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, AlertTriangle, Mail } from 'lucide-react'
import { useSEO } from '../../hooks/useSEO'

export default function TermsOfService() {
  useSEO({
    title: 'Terms of Service - ReportFlow',
    description: 'Read ReportFlow\'s Terms of Service. Understand the terms and conditions for using our platform.',
    keywords: 'terms of service, terms and conditions, user agreement'
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
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Last updated: March 22, 2026
          </p>

          <div className="space-y-8 text-gray-600 dark:text-gray-300">
            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-300">
                Please read these terms carefully before using ReportFlow.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Agreement to Terms
              </h2>
              <p className="leading-relaxed">
                By accessing or using ReportFlow, you agree to be bound by these Terms. If you do not agree, you may not access or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Description of Service
              </h2>
              <p className="leading-relaxed">
                ReportFlow is an automated marketing report generation platform that allows agencies to create and manage client accounts, connect marketing data sources, and generate automated reports.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Account Registration
              </h2>
              <p className="leading-relaxed">
                You must be at least 16 years of age and provide accurate information to use ReportFlow. You are responsible for maintaining the security of your account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Disclaimer of Warranties
              </h2>
              <p className="leading-relaxed">
                REPORTFLOW IS PROVIDED "AS IS" WITHOUT WARRANTIES. We disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>
              <p className="leading-relaxed">Questions? Contact us at legal@reportflow.app</p>
            </section>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <Link to="/privacy" className="text-brand-600 hover:text-brand-700">Privacy Policy</Link>
          <span className="text-gray-400">|</span>
          <Link to="/cookies" className="text-brand-600 hover:text-brand-700">Cookie Policy</Link>
        </div>
      </div>
    </div>
  )
}
