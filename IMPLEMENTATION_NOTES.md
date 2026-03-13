# Implementation Summary: SMS & Announcements Features

## Overview
Successfully implemented three major features for the Harvest app:
1. **Configurable SMS Messaging** - Automated notifications at key events
2. **Announcement System** - Dashboard-wide notifications with role-based targeting
3. **Cron-based SMS Scheduling** - Delayed message delivery

---

## 1. Configurable SMS Messaging Feature

### 1a. Messages to New Leads (1 Hour Delayed)
**File:** `app/api/tasks/send-lead-sms/route.ts`

A cron endpoint that sends SMS messages to newly added leads 1 hour after creation.

**How to Use:**
- Set up a cron service (e.g., Vercel Cron, external scheduler) to call `GET /api/tasks/send-lead-sms` every 5-10 minutes
- Optionally secure with `CRON_SECRET` environment variable
- Uses the `NEW_LEAD_NOTIFICATION` SMS template

**Example Cron Setup (vercel.json):**
```json
{
  "crons": [
    {
      "path": "/api/tasks/send-lead-sms",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

### 1b. Admin Alert on Lead Creation  
Already implemented in `app/api/leads/route.ts`
- Automatically sends SMS to all admins with phone numbers when a new lead is added
- Uses `ADMIN_ALERT` template

### 1c. Followup Member Assignment Notification
Already implemented in `app/api/leads/[id]/route.ts`
- Automatically sends SMS when a lead is assigned to a followup member
- Uses `FOLLOWUP_ASSIGNMENT` template

---

## 2. SMS Template Management

### Default SMS Templates
Three SMS types are defined with customizable templates:

1. **NEW_LEAD_NOTIFICATION**
   - Default: `"Hi {leadName}, welcome to Harvest! We're excited to have you..."`
   - Placeholders: `{leadName}`, `{location}`

2. **ADMIN_ALERT**
   - Default: `"New lead added: {leadName} ({phone}) from {location}..."`
   - Placeholders: `{leadName}`, `{phone}`, `{location}`, `{status}`

3. **FOLLOWUP_ASSIGNMENT**
   - Default: `"Hi {assigneeName}, a new lead has been assigned to you..."`
   - Placeholders: `{assigneeName}`, `{leadName}`, `{location}`, `{phone}`

### Database Seeding
Updated `prisma/seed.ts` to automatically create default SMS templates when database is seeded.

**Run seeding:**
```bash
npx prisma db seed
```

---

## 3. Announcement Feature

### API Endpoints

#### Get Public Announcements
```
GET /api/announcements
- Returns active announcements for the current user's role
- Filters by expiry date and role-based targeting
- Role-based visibility: ALL, FOLLOWUP, EVANGELIST
```

#### Admin Management Endpoints
```
GET /api/admin/announcements
- List all announcements (admin only)

POST /api/admin/announcements
- Create new announcement (admin only)
- Body: { title, content, targetRole, expiryDate }

PATCH /api/admin/announcements/[id]
- Update announcement (admin only)
- Can update: title, content, targetRole, expiryDate, hidden

DELETE /api/admin/announcements/[id]
- Delete announcement (admin only)
```

### Admin Dashboard
**File:** `app/dashboard/admin/announcements/page.tsx`

Features:
- Create new announcements with modal form
- Edit existing announcements
- Delete announcements
- View expiry dates and target audience
- Mark announcements as expired (visual indicator)
- Character count for content (max 2000)
- Title validation (max 200 chars)

### Announcement Display Components

#### AnnouncementsBanner Component
**File:** `components/AnnouncementsBanner.tsx`

A reusable banner component that displays active announcements:
- Shows announcement title and content
- Displays expiry date/time
- Users can dismiss announcements (session-based)
- Bell icon for easy identification
- Gradient styling with harvest theme colors

**Usage:**
```tsx
import AnnouncementsBanner from "@/components/AnnouncementsBanner";

export default function Dashboard() {
  return (
    <div>
      <AnnouncementsBanner />
      {/* Rest of dashboard */}
    </div>
  );
}
```

#### Integrated Dashboards
The banner is now integrated into:
- **Followup Dashboard:** `app/dashboard/followup/page.tsx`
- **Evangelist Dashboard:** `app/dashboard/evangelist/EvangelistDashboardClient.tsx`

Both display announcements targeted to their role or marked for "ALL".

---

## 4. Database Schema

All tables were added via the migration: `20260313000000_add_sms_and_announcements`

### Tables

**SMSTemplate**
```sql
CREATE TABLE "SMSTemplate" (
  id TEXT PRIMARY KEY,
  type SMSType UNIQUE,           -- NEW_LEAD_NOTIFICATION, ADMIN_ALERT, FOLLOWUP_ASSIGNMENT
  title TEXT,
  content TEXT,                   -- Template with {placeholders}
  createdById TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
)
```

**SMSLog**
```sql
CREATE TABLE "SMSLog" (
  id TEXT PRIMARY KEY,
  type SMSType,
  recipientPhone TEXT,
  content TEXT,
  status SMSStatus,              -- PENDING, SENT, FAILED
  errorMessage TEXT,
  leadId TEXT?
  createdAt TIMESTAMP,
  sentAt TIMESTAMP?
)
```

**Announcement**
```sql
CREATE TABLE "Announcement" (
  id TEXT PRIMARY KEY,
  title TEXT,
  content TEXT,
  targetRole TargetRole,         -- FOLLOWUP, EVANGELIST, ALL
  expiryDate TIMESTAMP,
  hidden BOOLEAN DEFAULT false,
  createdById TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
)
```

---

## 5. Environment Variables Required

Add these to your `.env`:

```
# SMS Configuration (Bulk SMS Nigeria)
BULK_SMS_API_URL=https://api.bulksms.com/v1
BULK_SMS_TOKEN=your_bulksms_token_here
BULK_SMS_SENDER_ID=HARVEST

# Optional: Cron security
CRON_SECRET=your_secret_key_here
```

---

## 6. Next Steps / Configuration

### Configure SMS Templates
1. Login to admin dashboard
2. Go to **SMS Settings** (if page exists) to customize templates
3. Default templates will be used if none are customized

### Schedule the Cron Job
1. For Vercel: Add to `vercel.json` (see section 1a)
2. For other hosts: Use external cron service (e.g., EasyCron, AWS EventBridge)
3. Call: `GET /api/tasks/send-lead-sms`

### Test Announcements
1. Go to `/dashboard/admin/announcements`
2. Create a test announcement with 1-hour expiry
3. Check if it appears on followup/evangelist dashboards

---

## 7. Files Modified/Created

### Created Files:
- `app/api/tasks/send-lead-sms/route.ts` - Cron endpoint
- `app/api/announcements/route.ts` - Public announcements API
- `app/api/admin/announcements/route.ts` - Admin CRUD endpoints
- `app/api/admin/announcements/[id]/route.ts` - Single announcement endpoints
- `app/dashboard/admin/announcements/page.tsx` - Admin UI
- `components/AnnouncementsBanner.tsx` - Reusable component

### Modified Files:
- `prisma/seed.ts` - Added SMS template seeding
- `app/dashboard/followup/page.tsx` - Added AnnouncementsBanner
- `app/dashboard/evangelist/EvangelistDashboardClient.tsx` - Added AnnouncementsBanner

### Migration:
- `prisma/migrations/20260313000000_add_sms_and_announcements/migration.sql` - Already exists

---

## 8. Testing Checklist

- [ ] Run `npx prisma db seed` to populate SMS templates
- [ ] Create a test announcement from admin dashboard
- [ ] Verify announcement appears on follower/evangelist dashboards
- [ ] Test dismissing an announcement
- [ ] Create a lead and verify admin SMS is triggered
- [ ] Configure cron job and test 1-hour delayed SMS
- [ ] Verify SMS logs in database after sending
- [ ] Test expired announcements don't show (set expiry to past time)

---

## 9. API Examples

### Create Announcement
```bash
curl -X POST http://localhost:3000/api/admin/announcements \
  -H "Content-Type: application/json" \
  -b "session=..." \
  -d '{
    "title": "Team Meeting",
    "content": "We have a team meeting tomorrow at 2pm",
    "targetRole": "ALL",
    "expiryDate": "2026-03-14T14:00:00.000Z"
  }'
```

### Get Active Announcements
```bash
curl http://localhost:3000/api/announcements \
  -b "session=..."
```

### Trigger SMS Send
```bash
curl http://localhost:3000/api/tasks/send-lead-sms \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## Support Notes

- SMS messages require valid Bulk SMS Nigeria API credentials
- User phone numbers must be stored in the database (phone field in User table)
- Lead phone numbers must be formatted with country code or will be normalized to Nigeria (234)
- Announcements are timezone-aware; use ISO 8601 format for dates
