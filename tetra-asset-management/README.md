# TETRA Asset Management System

This is a comprehensive enterprise-grade TETRA device asset and inventory management system.

## Prerequisites
- Node.js (latest LTS)
- Docker (latest)
- pnpm (or npm/yarn)

## Setup
1. Clone the repository.
2. Copy `.env.example` to `.env.local` and fill in the required values.
3. Install dependencies: `pnpm install` (or `npm install` / `yarn install`)
4. Run database migrations: `pnpm run prisma:migrate` (or `npm run prisma:migrate` / `yarn prisma:migrate`)
5. Seed initial data (optional): `pnpm run seed` (or `npm run seed` / `yarn seed`)

## Development
- Start frontend: `pnpm run dev:frontend`
- Start backend: `pnpm run dev:backend`

## Building for Production
- Build frontend: `pnpm run build:frontend`
- Build backend: `pnpm run build:backend`
