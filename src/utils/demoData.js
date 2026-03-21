export const demoClients = [
  {
    id: 'demo-client-1',
    name: 'Acme Corp',
    industry: 'E-commerce',
    website: 'https://acme-corp-demo.com',
    meta_connected: true,
    ga4_connected: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-client-2',
    name: 'TechStart Inc',
    industry: 'SaaS',
    website: 'https://techstart-demo.com',
    meta_connected: true,
    ga4_connected: false,
    created_at: new Date().toISOString()
  }
]

export const demoMetaData = {
  campaigns: [
    {
      id: 'camp-1',
      name: 'Summer Sale 2026',
      status: 'ACTIVE',
      budget: 5000,
      spend: 3245.67,
      impressions: 245000,
      clicks: 12500,
      ctr: 5.1,
      cpc: 0.26,
      conversions: 342,
      cpa: 9.49,
      roas: 4.2
    },
    {
      id: 'camp-2',
      name: 'Brand Awareness',
      status: 'ACTIVE',
      budget: 3000,
      spend: 2100.00,
      impressions: 520000,
      clicks: 8400,
      ctr: 1.62,
      cpc: 0.25,
      conversions: 156,
      cpa: 13.46,
      roas: 2.8
    },
    {
      id: 'camp-3',
      name: 'Product Launch',
      status: 'PAUSED',
      budget: 2000,
      spend: 890.50,
      impressions: 78000,
      clicks: 3200,
      ctr: 4.1,
      cpc: 0.28,
      conversions: 89,
      cpa: 10.01,
      roas: 3.5
    }
  ],
  totalSpend: 6236.17,
  totalImpressions: 843000,
  totalClicks: 24100,
  totalConversions: 587,
  averageRoas: 3.5,
  dateRange: {
    start: '2026-02-01',
    end: '2026-02-28'
  }
}

export const demoGA4Data = {
  overview: {
    users: 45230,
    sessions: 68450,
    pageviews: 156780,
    bounceRate: 42.5,
    avgSessionDuration: '3:45',
    newUsers: 28500
  },
  trafficSources: [
    { source: 'Organic Search', sessions: 28500, percentage: 41.6 },
    { source: 'Direct', sessions: 18200, percentage: 26.6 },
    { source: 'Social', sessions: 11400, percentage: 16.6 },
    { source: 'Referral', sessions: 6850, percentage: 10.0 },
    { source: 'Email', sessions: 3500, percentage: 5.1 }
  ],
  topPages: [
    { path: '/home', views: 45000, uniqueViews: 38000 },
    { path: '/products', views: 32000, uniqueViews: 28000 },
    { path: '/about', views: 18000, uniqueViews: 15000 },
    { path: '/contact', views: 12000, uniqueViews: 10500 },
    { path: '/blog', views: 9500, uniqueViews: 8200 }
  ],
  conversions: {
    total: 1256,
    rate: 2.84,
    goal: 'Purchase'
  },
  dateRange: {
    start: '2026-02-01',
    end: '2026-02-28'
  }
}

export function isDemoClient(clientId) {
  return clientId?.startsWith('demo-')
}
