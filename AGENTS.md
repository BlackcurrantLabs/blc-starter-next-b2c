# AGENTS.md - Blackcurrant Stack (BLC-Stack)

> Guidelines for AI coding agents working in this repository.

## Quick Reference

| Action | Command |
|--------|---------|
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Lint | `pnpm lint` |
| Regenerate Prisma | `pnpm regenerate-schema` |
| Migrations | `npx prisma migrate dev --name <description>` |

**No test runner configured.** Manual verification required.

## Tech Stack

Next.js 15 (App Router, Turbopack) + React 19 | TypeScript (strict) | Prisma (MySQL/MariaDB) | BetterAuth | Tailwind v4 | shadcn/ui | react-hook-form + Zod | TanStack Table

## Project Structure

```
src/
  app/                 # Next.js App Router pages
    (landing)/         # Public pages (landing, about, terms)
    admin/             # Admin portal
    user/              # User portal
    api/auth/[...all]/ # BetterAuth catch-all
  actions/             # Server actions
  auth.ts              # BetterAuth config
  components/ui/       # shadcn/ui primitives
  database/
    datasource.ts      # Prisma client singleton
    prisma/            # Generated client (DO NOT EDIT)
    zod/               # Generated Zod schemas (DO NOT EDIT)
  lib/                 # Utilities
  middleware.ts        # Auth redirect middleware
  permissions.ts       # Role definitions
prisma/schema.prisma   # Database schema (source of truth)
```

### Colocation Guidance

- Co-locate page-specific client components, server actions, validation, and types inside the page directory (e.g., `src/app/(landing)/contact-us/`).
- Keep shared components in `src/components/` only when used by multiple routes (e.g., ALTCHA widget).

## Code Style

### TypeScript
- Strict mode - no implicit any
- Prefer interfaces over types
- Avoid enums - use const objects
- **No `as any`, `@ts-ignore`, `@ts-expect-error`**

### Naming
| Element | Convention | Example |
|---------|------------|---------|
| Files/dirs | kebab-case | `list-users/`, `auth-client.ts` |
| Components | PascalCase (named export) | `export function UserTable()` |
| Functions/vars | camelCase | `isLoading`, `handleSubmit()` |
| Constants | UPPERCASE | `MAX_RETRIES` |
| Booleans | verb prefix | `isLoading`, `hasError` |

### Imports
```typescript
import { auth } from "@/auth";
import prisma from "@/database/datasource";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
```

### Formatting
- 2 spaces indentation
- ESLint: `next/core-web-vitals` + `next/typescript`

## React / Next.js Patterns

- **App Router only** - never use Pages Router patterns
- **Default to Server Components (RSC)**
- Minimize `"use client"`, `useEffect`, `useState`
- Wrap client components in `<Suspense>` with fallback

### Server Actions
```typescript
"use server";
import prisma from "@/database/datasource";

export async function searchUsers(tableState: TableState) {
  // Implementation
}
```

### Auth
- Access session: `auth.api.getSession({ headers: await headers() })`
- Roles: `admin`, `user`, `vendor`, `customer`
- Config: `src/auth.ts` | Permissions: `src/permissions.ts`

## Prisma

### After Schema Changes
```bash
npx prisma migrate dev --name <descriptive-name>
pnpm regenerate-schema
```

### Usage
```typescript
import prisma from "@/database/datasource";

const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, name: true },
});
```

### Model Conventions
- Singular names: `User`, `Session`
- camelCase fields: `createdAt`, `emailVerified`
- Table mapping: `@@map("lowercase")`

### Adding Custom User Fields
1. Add to `prisma/schema.prisma` User model
2. Add to `additionalFields` in `src/auth.ts`
3. Run migrations + regenerate

## UI

### shadcn/ui
```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
<div className={cn("base", isActive && "active")} />
```

### Forms
- react-hook-form + Zod validation
- Builder: https://www.shadcn-form.com/playground
- Generated schemas: `@/database/zod`

### Navigation (Admin/User Portals)
- Navigation metadata lives with each portal:
  - `src/app/user/(main)/_components/user-nav-data.ts`
  - `src/app/admin/(main)/_components/admin-nav-data.ts`
- Sidebar active state is derived from `isActive(pathname)` on each nav item.
- Titlebar/breadcrumbs are driven by `routeMeta` in the same files.
- When adding a new route:
  1. Add the sidebar item to `navGroups` (if it should appear in the sidebar).
  2. Add/adjust a `routeMeta` entry for breadcrumbs/titlebar.
  3. Keep matchers explicit (exact or `startsWith`) and cover dynamic routes.

## Error Handling

```typescript
import { Prisma } from "@/database/prisma/client";

try {
  // db operation
} catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2002') { /* Unique constraint */ }
  }
}
```

## Environment Variables

Required: `DATABASE_URL`, `DATABASE_DIRECT_URL`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_DB`, `DATABASE_SSLMODE`

Reference: `example.env`

## Do NOT

- Edit `src/database/prisma/` or `src/database/zod/` (generated)
- Use Pages Router patterns
- Add `as any` or type suppressions
- Commit `.env` files
- Use enums
- Skip input validation on server actions
