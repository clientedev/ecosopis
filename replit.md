# ECOSOPIS E-commerce Platform

## Overview

ECOSOPIS is a full-stack e-commerce platform for a natural and vegan cosmetics brand. The project features a React frontend with a modern, minimalist design inspired by scientific skincare aesthetics, backed by a dual-backend architecture using both Express.js (TypeScript) and Django (Python). The platform supports direct site purchases, marketplace redirections (Mercado Livre, Shopee), AI-powered beauty chat assistance, and an admin dashboard for product/order management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: 
  - TanStack React Query for server state
  - Zustand with persist middleware for cart state
- **Styling**: Tailwind CSS with custom design tokens (ECOSOPIS green theme)
- **UI Components**: shadcn/ui (Radix primitives + Tailwind)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Build Tool**: Vite with custom plugins for Replit integration

### Backend Architecture (Hybrid)
The project has two backend implementations:

**1. Express.js (TypeScript) - Primary API Server**
- Located in `/server`
- Handles authentication via Passport.js with session-based auth
- Uses Drizzle ORM with PostgreSQL
- Includes AI integrations for chat, image generation, and batch processing
- Session storage via connect-pg-simple

**2. Django (Python) - Secondary/Alternative API**
- Located in `/api` and `/ecosopis_backend`
- Django REST Framework for API endpoints
- Custom User model with profile types (admin/cliente)
- OpenAI integration for beauty chat assistant

### Data Storage
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **ORM**: Drizzle ORM (TypeScript) / Django ORM (Python)
- **Session Store**: PostgreSQL-backed sessions
- **Schema Location**: `/shared/schema.ts` defines all tables (users, products, orders, order_items, conversations, messages)

### Authentication & Authorization
- Session-based authentication using express-session and Passport.js
- Local strategy for username/password login
- Password hashing with scrypt
- Role-based access control (admin vs customer)
- Protected admin routes for product/order management

### Key Features
- Product catalog with category filtering and search
- Shopping cart with persistence
- Multi-channel sales (site, Mercado Livre, Shopee links per product)
- AI-powered beauty chat assistant using OpenAI
- Skin quiz for personalized recommendations
- Admin dashboard for CRUD operations on products
- Order management system

## External Dependencies

### AI Services
- **OpenAI API**: Used for beauty chat assistant and image generation
- Environment variables: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Database
- **PostgreSQL**: Primary data store
- Environment variable: `DATABASE_URL`

### Third-party Integrations
- **Mercado Livre**: Product redirect links (stored per product)
- **Shopee**: Product redirect links (stored per product)

### Key npm Packages
- `drizzle-orm` + `drizzle-kit`: Database ORM and migrations
- `express-session` + `connect-pg-simple`: Session management
- `passport` + `passport-local`: Authentication
- `openai`: AI chat and image generation
- `@tanstack/react-query`: Data fetching and caching
- `zustand`: Client-side state management
- `framer-motion`: Animations
- Full shadcn/ui component library (Radix-based)

### Python Dependencies (Django backend)
- Django + Django REST Framework
- `dj-database-url`: Database URL parsing
- `corsheaders`: CORS handling
- `openai`: AI integration