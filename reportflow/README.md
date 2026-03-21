# ReportFlow

White-label client report builder for marketing agencies.

## Tech Stack
- **Frontend:** React + Tailwind CSS + Vite
- **Backend:** Supabase (Auth + Database + Storage)
- **Charts:** Recharts
- **PDF:** html2canvas + jsPDF
- **Email:** Resend

## Getting Started

### 1. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Enable Email auth in Authentication > Providers

### 2. Get API Keys

**Supabase:**
- Project URL: Settings > API
- Anon Key: Settings > API > Project API keys
- Service Role Key: Settings > API > Project API keys (for Edge Functions)

**Meta Ads API:**
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create an app (Marketing App type)
3. Add "Facebook Login" and "Marketing API" products
4. Get App ID and App Secret

**Google Cloud (GA4):**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create project and enable "Google Analytics Data API"
3. Create OAuth 2.0 credentials
4. Get Client ID and Client Secret

**Resend (Email):**
1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. Add and verify your domain

### 3. Environment Variables

Create `.env.local` in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
VITE_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RESEND_API_KEY=your_resend_api_key
```

### 4. Install & Run

```bash
npm install
npm run dev
```

### 5. Deploy to Vercel

```bash
npm run build
vercel --prod
```

Set environment variables in Vercel project settings.

### 6. Setup Scheduled Reports (Optional)

Deploy the Edge Function:
```bash
supabase functions deploy send-report
```

Set up a cron job to trigger it hourly:
- Use a service likecron-job.org or Vercel Cron
- Endpoint: `https://your-project.supabase.co/functions/v1/send-report`

## Features

- Email/password authentication
- Agency profile with logo
- Client management
- Meta Ads integration (OAuth)
- GA4 integration (OAuth)
- Report generation with charts
- PDF export
- Scheduled email delivery

## File Structure

```
reportflow/
├── src/
│   ├── components/
│   │   ├── ui/          # Button, Card, Input
│   │   └── charts/      # MetaChart, GA4Chart
│   ├── context/
│   │   └── AuthContext  # Auth state management
│   ├── lib/
│   │   └── supabase.js  # Supabase client
│   ├── pages/
│   │   ├── auth/        # Login, Signup, Setup
│   │   ├── dashboard/   # Main dashboard
│   │   ├── clients/     # Client management
│   │   ├── reports/     # Report history
│   │   └── settings/    # Agency settings
│   ├── utils/
│   │   ├── reportGenerator.js
│   │   └── pdfGenerator.js
│   ├── App.jsx
│   └── main.jsx
├── supabase/
│   ├── schema.sql       # Database schema
│   └── functions/       # Edge Functions
└── package.json
```
