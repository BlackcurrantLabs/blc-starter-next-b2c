# Blackcurrant Stack Starter Next B2C

This is a boilerplate for starting new projects. 
B2C SaaS starter template built with Next.js 15+, Prisma, BetterAuth, and Tailwind 4.
It's an opionated set of frameworks and tools hand picked for our general use cases.
This may not fit every use case.

*Vibe code* friendly, includes `AGENTS.md` and `.agent/rules` 
compatible with opencode, claude code, antigravity.

If you need B2B (Users have Orgs, invite within org to collaborate), start from other repo at [B2B Starter](https://github.com/BlackcurrantLabs/blc-starter-next-b2b)

## Stack

| Category                   | Technology/Tool                      |
|----------------------------|--------------------------------------|
| Framework                  | NextJS                               |
| ORM                        | Prisma, Typescript backend           |
| Authentication             | BetterAuth + BetterAuthUI            |
| Styling                    | Tailwind                             |
| Components                 | Shadcn,                              |
| Frontend State Management  | Context API                          |
| Emails                     | Resend                               |
| Long running Jobs          | Trigger.dev                          |
| Deployment                 | Vercel / Railway / AWS (self-hosted) |
| Tables                     | Tanstack Tables                      |
| Forms                      | react-hook-form                      |

## Goals

1. Landing page fully customised as per project, hosted with SSR with sign-in, sign-up and account button if already logged in. Redirect to user home if logged in.
2. Static pages like privacy policy and terms of use
3. Favicon, Robots.txt
4. Multiple user types with their own home page like Admin, User
5. Extensible APIs with auth that can be used with mobile clients
6. Parts of website that the users can see without a login
7. Parts of website that the user can only see after a login
8. Parts of website that the user can see only after custom attribute passes verification (maker/checker model)
9. Best in class DX with end to end typesafety
10. Support for long running jobs via trigger.dev with realtime job status in frontend
11. Admin side custom permissions and actions
12. A working template of table with serverside search, pagination, filtering, sorting
13. A working template of table with client side pagination
14. A working template of ideal implementation of forms following best practises with serverside and clinetside validation, synced schema
15. JWT based flow for mobile clients using apis

## Requirements

- Node.js 22 LTS
- pnpm 10.x

## Environment Variables

Copy `example.env` to `.env` and fill in required values.

Required:
- `SITE_NAME`
- `DATABASE_URL`
- `DATABASE_DIRECT_URL`
- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE_DB`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `TRIGGER_SECRET_KEY`
- `ALTCHA_HMAC_SECRET`

## Operational Endpoints

- `GET /api/health` — health check (includes DB ping)
- `GET /api/altcha-challenge` — ALTCHA proof-of-work challenge

# Ecosystem Tools

## Form Builder
Build with https://www.shadcn-form.com/playground

## Placeholder Blocks
https://www.hyperui.dev/
