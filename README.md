# LocalWork 🛠️

> **Connecting Customers with Trusted Local Professionals.**

LocalWork is a modern, secure, full-stack marketplace web application built from the ground up with Next.js 16 (App Router & Turbopack), TypeScript strict mode, Tailwind CSS v4, and Supabase (PostgreSQL with Row Level Security).

---

## 🌟 Key Features

### 👤 For Customers
- **Comprehensive Directory**: Browse and filter verified service professionals by trade, city, minimum rating, and availability.
- **Transparent Profiles**: Inspect verified credentials, detailed bios, hourly rates, service area coverage, and portfolio project galleries.
- **Authentic Reviews**: 100% verified review system — only clients with completed service requests can leave reviews.
- **Interactive Service Inquiries**: Submit service requests with project scopes, preferred dates, and budget estimates.
- **Customer Portal**:
  - Track request lifecycle (Pending, Accepted, In Progress, Completed, Cancelled).
  - Manage saved favorite contractors.
  - Submit and review verified ratings with star feedback.
  - Real-time notification feed.

### 👷 For Service Professionals
- **Zero Pay-Per-Lead Fees**: No exploitative lead bidding fees. Connect directly with serious local clients.
- **Verified Trust Badge**: Gain high visibility with administrative identity and license screening.
- **Digital Storefront**: Showcase business headlines, trade bios, skills tags, hourly rates, and portfolio photos.
- **Job Inquiries Workflow**: Accept incoming requests, communicate status updates with clients, and mark jobs as completed.
- **Availability Control**: Toggle on/off booking availability in real time.

### 🛡️ For Administrators
- **Executive KPI Dashboard**: Monitor active professionals, customer registrations, completed jobs, and category health.
- **Pro Verification Queue**: Review submitted contractor applications with full credential inspection, approve verified badges, or reject with feedback notes.
- **User Directory**: Search and manage user accounts with role filtering and account suspension controls.
- **Service Categories Taxonomy**: Manage active service trades and configure directory filters.
- **Safety & Moderation Queue**: Investigate user reports against spam or inappropriate profiles with resolution tracking.
- **Review Moderation**: Ensure review authenticity with public visibility toggles and spam deletion.

---

## 🏗️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Partial Prerendering)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Unit Testing**: [Vitest](https://vitest.dev/)

---

## 📁 Project Structure

```text
localwork/
├── public/                     # Static assets
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql # 9 core tables + strict RLS policies + triggers
│   └── seed.sql                # Production-grade seed data
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login, Customer Register, Pro Register, Password Reset
│   │   ├── (public)/           # Homepage, Find Pros, Pro Profile, Categories, Info Pages
│   │   ├── admin/              # Super Admin dashboard, Verification Queue, Moderation
│   │   ├── dashboard/          # Customer & Professional portal routes
│   │   ├── auth/callback/      # OAuth & email verification handler
│   │   ├── error.tsx           # Global error boundary
│   │   ├── not-found.tsx       # 404 page
│   │   └── globals.css         # Tailwind tokens & styling system
│   ├── components/
│   │   ├── layout/             # Responsive Navbar, Footer, Mobile Drawer
│   │   └── ui/                 # Reusable UI primitives (Modal, Cards, Badges, Ratings)
│   ├── lib/
│   │   ├── data/mock-data.ts   # Rich demo data for offline development & testing
│   │   ├── supabase/           # Browser, Server, & Admin Supabase clients
│   │   └── utils.ts            # Helper utilities
│   ├── types/                  # TypeScript interface declarations
│   └── validations/            # Zod validation schemas
├── vitest.config.mts           # Vitest configuration
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20+ (Node 24 recommended)
- npm or pnpm

### 2. Installation
```bash
git clone <repo-url> localwork
cd localwork
npm install
```

### 3. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env.local
```

Configure your Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://localwork-sepia.vercel.app
NEXT_PUBLIC_APP_NAME=LocalWork
```
*(Note: If no Supabase instance is configured, LocalWork automatically uses its built-in realistic mock data layer for development and testing.)*

### 4. Database Setup (Supabase)
Run the migration file in your Supabase SQL editor:
```bash
supabase/migrations/001_initial_schema.sql
```
Optionally seed starter categories and mock data:
```bash
supabase/seed.sql
```

### 5. Running the Application
Start the local development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the marketplace.

---

## 🧪 Testing & Verification

### Unit Tests
Run the test suite powered by Vitest:
```bash
npm test
```

### TypeScript Validation
Run the strict TypeScript compiler:
```bash
npx tsc --noEmit
```

### Production Build
Build and optimize the production bundle:
```bash
npm run build
```

---

## 🔒 Security & Data Integrity

1. **Row Level Security (RLS)**: Enforced on all PostgreSQL tables (`profiles`, `professionals`, `categories`, `requests`, `reviews`, `favorites`, `notifications`, `reports`, `audit_log`).
2. **Review Verification Barrier**: A review can only be posted if a completed service request exists linking the verified customer and professional.
3. **Password Security**: Enforced via Zod rules (minimum 8 characters, requiring uppercase, lowercase, and numeric digits).
4. **Input Sanitization**: Prevents SQL injection and XSS through parameterized queries and typed schema validation.

---

## 📄 License
MIT License. Built with trust and craftsmanship.
