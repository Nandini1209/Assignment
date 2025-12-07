# LoanMate — Loan Products Dashboard

A small Next.js + Supabase + OpenAI demo app that shows loan products, allows filtering and quick AI-powered Q&A about each product.

This README includes:
- How to run locally
- Where to put the new `TopProducts` widget
- Notes about env variables and deployment

## Features
- Product listing with filters (bank, APR, income, credit score)
- Top 5 products widget (server-side fetch)
- Product details pages (`/products/[id]`)
- In-product AI chat (powered by OpenAI)
- Supabase as data store
- Responsive UI using Tailwind CSS + shadcn-style UI components

## Local setup

1. Install dependencies:
npm install

## Run dev server:

npm run dev
Open https://localhost:3000

 ## Files of interest

app/page.tsx — Homepage: add the TopProducts widget here

components/TopProducts.tsx — Top 5 server-side widget (fetches from Supabase)

components/product-card.tsx — Product card (UI + chat trigger)

app/products/[id]/page.tsx — Product detail page

app/api/products/ai/ask/route.ts — AI endpoint

lib/supabase.ts — supabase client wrapper
