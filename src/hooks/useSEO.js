import { useEffect } from 'react'

export function useSEO({ 
  title, 
  description, 
  keywords, 
  canonical,
  ogImage,
  noIndex = false 
}) {
  useEffect(() => {
    const updateMeta = (name, content) => {
      let meta = document.querySelector(`meta[name="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    const updateProperty = (property, content) => {
      let meta = document.querySelector(`meta[property="${property}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    const updateTitle = (newTitle) => {
      document.title = newTitle
      let titleTag = document.querySelector('meta[property="og:title"]')
      if (titleTag) titleTag.setAttribute('content', newTitle)
    }

    if (title) updateTitle(title)
    if (description) updateMeta('description', description)
    if (keywords) updateMeta('keywords', keywords)
    if (ogImage) {
      updateProperty('og:image', ogImage)
      updateProperty('twitter:image', ogImage)
    }
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', canonical)
    }
    if (noIndex) {
      updateMeta('robots', 'noindex, follow')
    }

    return () => {
      if (title) document.title = 'ReportFlow - Automated Marketing Reports for Agencies'
    }
  }, [title, description, keywords, canonical, ogImage, noIndex])
}

export const SEO_CONFIG = {
  home: {
    title: 'ReportFlow - Automated Marketing Reports for Agencies',
    description: 'Create stunning, branded marketing reports in seconds. Connect Meta Ads and Google Analytics, generate beautiful PDFs, and auto-deliver to clients. Save hours every week.',
    keywords: 'marketing reports, agency reports, meta ads, google analytics, automated reporting, client reports, PDF reports'
  },
  login: {
    title: 'Login - ReportFlow',
    description: 'Sign in to your ReportFlow account to manage your agency reports and client dashboards.',
    noIndex: true
  },
  signup: {
    title: 'Sign Up - ReportFlow',
    description: 'Create your free ReportFlow account and start generating professional marketing reports in minutes.',
    keywords: 'sign up, register, free account, marketing tools'
  },
  dashboard: {
    title: 'Dashboard - ReportFlow',
    description: 'View your marketing report analytics and manage all your client reports in one place.',
    noIndex: true
  },
  clients: {
    title: 'Clients - ReportFlow',
    description: 'Manage your agency clients and their marketing report preferences.',
    noIndex: true
  },
  reports: {
    title: 'Reports - ReportFlow',
    description: 'Generate and manage automated marketing reports for your agency clients.',
    noIndex: true
  },
  settings: {
    title: 'Settings - ReportFlow',
    description: 'Configure your ReportFlow account settings, branding, and integrations.',
    noIndex: true
  }
}
