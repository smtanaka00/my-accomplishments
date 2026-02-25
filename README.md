# My Achievements

A modern, mobile-first web application for professionals to document daily work achievements, track high-impact metrics, and generate reports for graduate school applications, executive reviews, and visa applications (H1B, EB2 NIW).

## Overview

- **Frontend**: React + Vite, vanilla CSS.
- **Backend & Authentication**: Supabase (PostgreSQL + Auth).
- **Deployment**: Vercel (Frontend), GitHub (Version Control).

## Setup Instructions

1.  **Clone the repository**: `git clone <repository_url>`
2.  **Install dependencies**: `npm install`
3.  **Environment Variables**: Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
4.  **Run Locally**: `npm run dev`

## Implementation Details

Please refer to the [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) file for a detailed breakdown of completed phases, current status, and future feature recommendations.
