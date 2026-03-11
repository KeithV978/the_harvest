# 🌾 The Harvest

A full-stack Next.js application for tracking evangelism leads and follow-up discipleship work.

## Tech Stack

- **Next.js 14** (App Router)
- **Prisma** + **PostgreSQL**
- **NextAuth.js** (JWT sessions)
- **Tailwind CSS** (custom harvest theme)
- **Recharts** (dashboard charts)
- **bcryptjs** (password hashing)

---

## Roles

| Role | Permissions |
|------|-------------|
| **Evangelist** | Add leads, view own leads, edit leads |
| **Follow-Up** | View assigned leads, update church info, exchange notes |
| **Admin** | Full access: assign leads, delete leads, view all users, charts |

---

## Getting Started

### 1. Clone & Install

```bash
git clone <repo>
cd harvest-app
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/harvest_db"
NEXTAUTH_SECRET="some-strong-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Set Up Database

Make sure PostgreSQL is running, then:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

This creates the admin account:
- **Email:** `admin@harvest.com`
- **Password:** `admin123`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Lead Lifecycle

```
Evangelist adds lead  →  Status: NEW LEAD
Admin assigns to Follow-Up  →  Status: FOLLOWING UP
Follow-Up records church info  →  Attendance tracked (Cold/Lukewarm/Hot)
Admin marks converted  →  Status: CONVERTED
```

## Attendance Status

| Months Consistent | Status |
|---|---|
| 0–1 | ❄️ Cold |
| 2 | 🌡️ Lukewarm |
| 3+ | 🔥 Hot |

## Soul States

- **Unbeliever** — Has not accepted Christ
- **Un-churched Believer** — Saved but not in church
- **Hungry Believer** — Actively growing in faith

---

## Project Structure

```
harvest-app/
├── app/
│   ├── api/           # REST API routes
│   ├── auth/          # Login & Signup pages
│   └── dashboard/     # Role-based dashboards
│       ├── admin/
│       ├── evangelist/
│       └── followup/
├── components/
│   ├── layout/        # Sidebar
│   └── leads/         # Lead table, modals
├── lib/               # Prisma client, auth, utils
├── prisma/            # Schema & seed
└── types/             # TypeScript declarations
```
