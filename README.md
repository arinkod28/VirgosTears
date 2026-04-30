# CMMC 2.0 Compliance Dashboard

A lightweight CMMC Level 2 compliance dashboard that connects to Microsoft Azure to automatically assess and generate evidence for selected NIST SP 800-171A controls.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js)                │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐ │
│  │  Auth UI  │  │Dashboard │  │   AI Chat Panel   │ │
│  │  (MSAL)  │  │  + Stats │  │  (Evidence Bot)   │ │
│  └────┬─────┘  └────┬─────┘  └────────┬──────────┘ │
│       │              │                 │            │
└───────┼──────────────┼─────────────────┼────────────┘
        │              │                 │
        ▼              ▼                 ▼
┌─────────────────────────────────────────────────────┐
│                  BACKEND (Express)                   │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐ │
│  │Auth Route│  │Scan Route│  │  AI/Evidence Route │ │
│  │ /auth/*  │  │ /scan/*  │  │  /chat, /evidence │ │
│  └────┬─────┘  └────┬─────┘  └────────┬──────────┘ │
│       │              │                 │            │
│       ▼              ▼                 ▼            │
│  ┌──────────────────────────────────────────────┐   │
│  │           Azure Connector Service            │   │
│  │  (Microsoft Graph API + Azure Resource Mgr)  │   │
│  └──────────────────────┬───────────────────────┘   │
│                         │                           │
│  ┌──────────────────────┼───────────────────────┐   │
│  │        Anthropic API (Claude Sonnet)          │   │
│  └───────────────────────────────────────────────┘   │
│                                                      │
│  ┌───────────────────────────────────────────────┐   │
│  │           SQLite / Supabase (Snapshots)       │   │
│  └───────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────┐
│     Microsoft Azure      │
│  ┌────────┐ ┌──────────┐ │
│  │Graph API│ │  ARM API │ │
│  │(AD/IAM) │ │(Infra)   │ │
│  └────────┘ └──────────┘ │
└──────────────────────────┘
```

## Targeted CMMC Controls (6 controls)

| Control ID     | Title                    | Azure Source                        |
|----------------|--------------------------|-------------------------------------|
| AC.L2-3.1.1   | Authorized Access        | Azure AD Conditional Access Policies|
| AC.L2-3.1.2   | Transaction Control      | Azure RBAC Role Assignments         |
| AU.L2-3.3.1   | System Audit             | Azure Monitor Activity Logs         |
| IA.L2-3.5.1   | Identification           | Azure AD User Enumeration           |
| IA.L2-3.5.2   | Authentication           | Azure AD MFA Registration Status    |
| SC.L2-3.13.1  | Boundary Protection      | Network Security Group Rules        |

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS
- **Backend:** Node.js + Express
- **Auth:** Azure AD OAuth 2.0 via MSAL
- **AI:** Anthropic Claude API (Sonnet)
- **Database:** SQLite (dev) / Supabase (prod)
- **Azure APIs:** Microsoft Graph v1.0 + Azure Resource Manager

## Getting Started

### Prerequisites
- Node.js 18+
- Azure AD App Registration (see docs/AZURE_SETUP.md)
- Anthropic API Key

### Environment Setup

```bash
# Clone and install
git clone <repo-url>
cd cmmc-dashboard

# Backend
cd server
cp .env.example .env    # Fill in your keys
npm install
npm run dev

# Frontend (separate terminal)
cd client
cp .env.example .env.local
npm install
npm run dev
```

### Azure AD App Registration
See [docs/AZURE_SETUP.md](docs/AZURE_SETUP.md) for step-by-step instructions on registering your Azure AD application and configuring the required API permissions.

## Project Structure

```
cmmc-dashboard/
├── client/                     # Next.js frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Login, Azure connection
│   │   │   ├── chat/           # AI evidence bot
│   │   │   ├── controls/       # CMMC control cards
│   │   │   ├── dashboard/      # Main dashboard view
│   │   │   ├── evidence/       # Evidence display/export
│   │   │   ├── layout/         # Shell, sidebar, nav
│   │   │   └── ui/             # Shared primitives
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # API client, utils
│   │   ├── pages/              # Next.js routes
│   │   ├── styles/             # Global CSS + Tailwind
│   │   └── types/              # TypeScript interfaces
│   └── public/
├── server/                     # Express backend
│   ├── src/
│   │   ├── config/             # Env, Azure, DB config
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/          # Auth, error handling
│   │   ├── models/             # DB schemas
│   │   ├── routes/             # Express routes
│   │   ├── services/           # Azure connector, AI, hashing
│   │   └── utils/              # Helpers
│   └── tests/
└── docs/                       # Setup guides
```
