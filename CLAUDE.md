# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A service marketplace platform connecting customers who need services with professional partners. Built with Next.js 16, using phone-based authentication (Better Auth) and PostgreSQL (Drizzle ORM).

**Two user types:**
- **Customers**: Create service requests and accept proposals
- **Partners**: Browse requests and submit proposals

**Key Flow**: Customer creates request → Partners submit proposals → Customer accepts proposal(s) → Both parties receive WhatsApp contact to continue negotiations.

## Development Commands

```bash
# Development
npm run dev              # Start Next.js dev server (default: localhost:3000)

# Build & Run
npm run build            # Build for production
npm start                # Start production server

# Linting & Formatting
npm run lint             # Check code with Biome
npm run format           # Format code with Biome

# Database (Drizzle)
npm run db:generate      # Generate migrations from schema changes
npm run db:migrate       # Run migrations
npm run db:push          # Push schema changes directly to DB (dev only)
npm run db:pull          # Pull schema from DB
npm run db:studio        # Open Drizzle Studio (visual DB browser)
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript
- **Database**: PostgreSQL via Drizzle ORM
- **Authentication**: Better Auth (phone number-based, passwordless)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Forms**: TanStack Form
- **Linting**: Biome (replaces ESLint/Prettier)
- **Themes**: next-themes (dark mode support)

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/auth/[...all]/  # Better Auth API routes
│   ├── layout.tsx          # Root layout with theme provider
│   └── page.tsx            # Homepage
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── theme-provider.tsx  # Theme context provider
│   └── theme-switcher.tsx  # Dark mode toggle
├── db/
│   ├── schema/             # Drizzle schemas
│   │   ├── auth-schema.ts  # Better Auth tables (users, sessions, accounts, verifications)
│   │   └── index.ts        # Schema barrel export
│   └── index.ts            # Database client initialization
├── lib/
│   ├── auth.ts             # Better Auth server config
│   ├── auth-client.ts      # Better Auth client (React)
│   ├── fonts.ts            # Font configuration
│   └── utils.ts            # cn() and other utilities
├── types/
│   └── index.ts            # Shared TypeScript types
├── styles/
│   └── globals.css         # Global styles and Tailwind imports
└── env.ts                  # Type-safe environment variables (@t3-oss/env-nextjs)
```

### Authentication System

**Phone-based authentication** (Better Auth + phoneNumber plugin):

1. **Unified login/signup**: Single form for both user types
2. **User type detection**: Sent via `x-user-type` header ("customer" | "partner")
3. **OTP flow**:
   - User enters phone number
   - Receives verification code (currently console.log, future: WhatsApp API)
   - Code verification creates session automatically
4. **Auto-registration**: First-time users auto-created with:
   - Name: phone number
   - Email: `{phoneNumber}@acme.com`
   - userType: from header
5. **Onboarding**: Users with default data (name = phone number) redirected to complete profile

**Key files:**
- Server config: `src/lib/auth.ts`
- Client config: `src/lib/auth-client.ts`
- Schema: `src/db/schema/auth-schema.ts`
- API routes: `src/app/api/auth/[...all]/route.ts`

**Database hook**: `databaseHooks.user.create.after` sets userType from `x-user-type` header after user creation.

### Database Schema

**Better Auth tables** (managed by drizzle adapter):
- `users`: id, name, email, phoneNumber, phoneNumberVerified, userType, timestamps
- `sessions`: Session tokens with expiry, IP, user agent
- `accounts`: OAuth/provider accounts (future extensibility)
- `verifications`: OTP codes for phone verification

**userType enum**: "customer" | "partner" (drives application logic and permissions)

### Environment Variables

Type-safe env vars via `@t3-oss/env-nextjs` in `src/env.ts`:

**Required:**
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL`: Base URL (used by Better Auth client)
- `BETTER_AUTH_SECRET`: Auth encryption key
- `BETTER_AUTH_URL`: Auth server URL

See `.env.example` for template.

### Styling System

- **Tailwind CSS v4**: Using new `@tailwindcss/postcss` setup
- **shadcn/ui**: Component library (Button, Label, Separator, etc.)
- **CVA**: Class variance authority for component variants
- **Theming**: Dark mode via next-themes with system preference detection
- **Fonts**: Custom font configuration in `src/lib/fonts.ts`

### Business Logic (Per README)

**Request/Proposal Status:**
- Requests: "opened" | "closed" (customer-controlled)
- Proposals: "pending" | "accepted" | "rejected"
- Closing a request auto-rejects all pending proposals

**Partner MVP Requirements:**
- Name, email, services, postal code (for distance calculation)
- Immediate dashboard access post-onboarding
- Future: Manual approval system via backoffice

**Customer Flow:**
1. Browse services → Create request → Verify phone → Complete profile (if new)
2. Add postal code → Submit request
3. View proposals → Accept multiple (to get multiple contacts)
4. Close request when done

**Future Features:**
- WhatsApp notifications with deep links
- Distance calculation via postal code
- Partner document verification and approval
- Reviews/ratings system

## Development Notes

### Adding Database Changes

1. Modify schema in `src/db/schema/`
2. Run `npm run db:generate` to create migration
3. Run `npm run db:migrate` to apply (or `db:push` for quick dev changes)
4. Use `npm run db:studio` to inspect data visually

### Working with Better Auth

- Custom user fields defined in `src/lib/auth.ts` under `user.additionalFields`
- Client hooks available via `authClient` from `src/lib/auth-client.ts`
- Use `databaseHooks` for post-auth logic (e.g., setting userType)

### Component Guidelines

- Use shadcn/ui components from `src/components/ui/`
- Extend with CVA for variants when needed
- All new components should support dark mode (use CSS variables from Tailwind)

### Linting

- Biome handles both linting and formatting (no ESLint/Prettier)
- Config in `biome.json`
- Specific rules disabled: `noUnknownAtRules`, `noChildrenProp`, `noSvgWithoutTitle`
- Auto-organizes imports on save

### React Compiler

Enabled in `next.config.ts` (`reactCompiler: true`). Write idiomatic React - the compiler optimizes automatically.
