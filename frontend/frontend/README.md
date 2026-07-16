# EcoSmart AI — Frontend

A modern web application that empowers users to scan, identify, and earn from recyclable waste using AI. Built with **Next.js**, **React**, and **Tailwind CSS**.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI Library:** React 18
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **Icons:** Lucide React / Heroicons
- **State Management:** React Query (TanStack)
- **HTTP Client:** Axios
- **AI Integration:** Google Gemini API, OpenAI

---

## Features

### For Individuals
- **AI Waste Scanner** — Upload an image or describe waste to get instant classification, recyclability status, and estimated value
- **Dashboard** — Track earnings, scan history, and eco-impact
- **Recycler Directory** — Find verified recyclers near you
- **Activity History** — View past scans and transactions
- **Wallet Tracking** — Monitor earnings from recycled waste

### For Recyclers
- **Business Registration** — Dedicated sign-up flow for recycling businesses
- **Service Management** — Manage collection requests and grow your business

### General
- **Authentication** — Secure sign-up/sign-in with JWT
- **Password Reset** — OTP-based reset via email or SMS
- **AI Assistant (Mina)** — 24/7 chatbot for waste-related queries
- **Responsive Design** — Optimized for mobile and desktop
- **Social Login** — Google and Apple integration

---

## Getting Started

### Prerequisites

- Node.js v18+
- Backend server running (see [Ecosmart-Ai-Backend](https://github.com/Ecosmart-Ai-and-Innnovation/Ecosmart-Ai-Backend))

### Installation

```bash
# Clone the repository
git clone https://github.com/Ecosmart-Ai-and-Innnovation/-Ecosmart-Ai-Frontend.git
cd Ecosmart-Ai-Frontend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Run the Development Server

```bash
npm run dev
# Opens at http://localhost:3000
```

---

## Project Structure

```
app/
├── account-selection/        # Role selection (Individual/Recycler)
├── api/chat/                 # AI chatbot API route
├── auth/
│   ├── individual/           # Individual auth flow
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   ├── verify-email/
│   │   ├── verify-sms/
│   │   └── reset-password/
│   └── recycler/             # Recycler auth flow
│       ├── sign-in/
│       ├── sign-up/
│       ├── forgot-password/
│       ├── verify-email/
│       ├── verify-sms/
│       └── reset-password/
├── dashboard/
│   ├── activity/             # Activity history
│   ├── profile/              # User profile
│   ├── recyclers/            # Recycler directory
│   └── scan/                 # Waste scanner (upload, analyze, result)
├── layout.tsx                # Root layout
└── page.tsx                  # Landing page

components/
├── ai assistant/             # AI chat assistant (Mina)
├── auth/                     # Shared auth components
├── dashboard/                # Dashboard widgets
├── landingpage/              # Landing page sections
├── recycler/                 # Recycler-specific components
└── ui/                       # Reusable UI primitives

lib/
├── api.ts                    # API client
└── auth.ts                   # Auth helpers

public/
├── images/                   # Static images
└── videos/                   # Demo and promotional videos
```

---

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, stats, features |
| `/account-selection` | Choose Individual or Recycler |
| `/auth/individual/sign-in` | Individual sign in |
| `/auth/individual/sign-up` | Individual registration |
| `/auth/recycler/sign-in` | Recycler sign in |
| `/auth/recycler/sign-up` | Recycler registration |
| `/dashboard` | User dashboard overview |
| `/dashboard/scan` | AI waste scanner |
| `/dashboard/activity` | Scan and earnings history |
| `/dashboard/recyclers` | Recycler directory |
| `/dashboard/profile` | User profile settings |

---

## Design

- **Color Palette:** Green (#449339, #549B45) and dark green (#1b5030) — reflecting eco-conscious branding
- **Typography:** System font stack, bold and clean
- **Responsive:** Mobile-first with adaptive layouts across all breakpoints
- **Components:** Reusable UI system with cards, buttons, inputs, and form elements

---

## Built With

- **Next.js** — React framework with server-side rendering
- **Tailwind CSS** — Utility-first styling
- **Google Gemini AI** — Integration for waste analysis
- **TanStack Query** — Server state management
# Vercel deployment check


