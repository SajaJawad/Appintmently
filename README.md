# CarePoint Appointment Booking App

A modern, full-stack appointment booking application built with Next.js, TailwindCSS, and Supabase.

## Features

- **User Authentication**: Secure Sign-up and Login using Supabase Auth (SSR).
- **Booking Wizard**: Intuitive multi-step flow to select services, specialists, and time slots.
- **Patient Dashboard**: Manage upcoming visits and view health overview.
- **Admin Panel**: High-level clinic analytics, staff utilization, and appointment management.
- **Premium UI**: Responsive design with Tailwind CSS 4.0, Lucide icons, and a healthcare-tailored theme.
- **Database Architecture**: Robust PostgreSQL schema on Supabase with Row Level Security (RLS).

## Technical Stack

- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS 4.0.
- **Backend/Auth**: Supabase (Auth, Database).
- **Icons**: Lucide React.
- **Styling**: Modern CSS variables and theme tokens.

## Getting Started

### 1. Prerequisites

- Node.js (v20+)
- A Supabase project

### 2. Setup Environment

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Initialization

Run the SQL provided in `supabase/schema.sql` in your Supabase SQL Editor to set up the tables and RLS policies.

### 4. Install & Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the app!

## Deployment

The app is ready to be deployed to Vercel. Simply connect your repository and add the environment variables in the Vercel dashboard.
# Appintmently
