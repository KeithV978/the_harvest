# Push Notifications Implementation Summary

## ✅ What Was Implemented

A complete Web Push Notification system has been added to your Harvest App with the following features:

### Core Features
1. **Web Push API Integration** - Browser-based push notifications that work even when the tab is closed
2. **Announcement Notifications** - Automatic push notifications sent to target roles when admins create announcements
3. **Lead Assignment Notifications** - Push notifications sent to followup members when leads are assigned to them
4. **Inactivity Reminders** - Automatic daily reminders to encourage inactive users to re-engage
5. **Activity Tracking** - Automatic tracking of user activity to determine inactivity status

### Notification Triggers

| Event | Recipients | Message | Action |
|-------|-----------|---------|--------|
| **Announcement Created** | Users matching target role | Announcement title + preview | Go to dashboard |
| **Lead Assigned** | Assigned followup member | "New Lead Assignment: {lead name}" | Open assigned lead |
| **Inactivity (7+ days)** | Inactive evangelists | "Time to Add Some Leads" | Go to evangelist dashboard |
| **Inactivity (7+ days)** | Inactive followup members | "Time to Follow Up" | Go to followup leads |

## 📁 Files Created

### Configuration & Utilities
- `lib/push.ts` - Core push notification utilities and functions
- `public/sw.js` - Service worker for handling push events in background

### Components
- `components/PushNotificationProvider.tsx` - Registers service worker and subscribes to push
- `components/ActivityTracker.tsx` - Tracks user activity

### Hooks
- `hooks/useActivityTracking.ts` - Hook that monitors user interactions

### API Routes
- `app/api/push/subscribe/route.ts` - Store device push subscription
- `app/api/push/unsubscribe/route.ts` - Remove device push subscription
- `app/api/push/public-key/route.ts` - Get VAPID public key
- `app/api/push/send/route.ts` - Send push to specific user (admin only)
- `app/api/push/send-to-role/route.ts` - Send push to all users of a role (admin only)
- `app/api/users/update-activity/route.ts` - Update user's last activity time
- `app/api/tasks/send-inactivity-reminders/route.ts` - Cron job for inactivity reminders

### Documentation
- `PUSH_NOTIFICATIONS_SETUP.md` - Comprehensive setup and configuration guide

## 📝 Files Modified

- `prisma/schema.prisma` - Added `PushSubscription` model and `lastActivity` field to User
- `app/providers.tsx` - Integrated push notification provider and activity tracker
- `app/api/admin/announcements/route.ts` - Added push notification sending on announcement creation
- `app/api/leads/[id]/route.ts` - Added push notification sending on lead assignment

## 🚀 Next Steps to Get Started

### 1. Install Required Package
```bash
npm install web-push @types/web-push
```

### 2. Generate VAPID Keys
```bash
node -e "const webpush = require('web-push'); const keys = webpush.generateVAPIDKeys(); console.log('Public Key:', keys.publicKey); console.log('Private Key:', keys.privateKey);"
```

### 3. Set Environment Variables  
Add to `.env.local`:
```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<your-public-key>
VAPID_PRIVATE_KEY=<your-private-key>
VAPID_SUBJECT=mailto:support@harvestapp.com
CRON_SECRET=<random-secret-string>
```

### 4. Run Database Migration
```bash
npx prisma migrate dev --name add_push_notifications
```

### 5. Test Locally
- Start dev server: `npm run dev`
- Open the app in your browser
- Grant notification permission when prompted
- Create an announcement to test push notifications

### 6. Set Up Cron Job (Optional but Recommended)
Configure a cron service to call `/api/tasks/send-inactivity-reminders` daily.
See `PUSH_NOTIFICATIONS_SETUP.md` for detailed instructions.

## 📊 Key Implementation Details

### Activity Tracking
- Automatically updates when users interact with the page
- Debounced to max once per 5 minutes to avoid excessive API calls
- Used to determine inactivity for reminder notifications

### Service Worker
- Registered automatically when user grants notification permission
- Handles push events and converts them to browser notifications
- Handles notification clicks to navigate to relevant pages
- Persists in background even when app is closed

### Database Schema
- **PushSubscription**: Stores device subscriptions per user
  - Composite unique key: one subscription per device/browser per user
  - Contains encryption keys needed for push API
- **User.lastActivity**: Tracks when user was last active
  - Updated on activity and on notification subscription
  - Used for inactivity reminder logic

### Push Sending Flow
1. Admin creates announcement → Push sent via `sendPushToRole`
2. Admin assigns lead → Push sent via `sendPushToUser`
3. Cron job runs → Queries inactive users and sends reminders

## 🔒 Security Features

- Push endpoints require NextAuth authentication
- Send endpoints require ADMIN role
- Cron job can be protected with `CRON_SECRET`
- Subscription data encrypted at rest in database
- All transmissions must be HTTPS in production

## 🌐 Browser Support

Push notifications work in:
- ✅ Chrome/Edge (all versions)
- ✅ Firefox (all versions)
- ✅ Safari 16+ (iOS 16.4+, macOS 13.3+)
- ✅ Opera (all versions)

## 📖 Documentation

For detailed setup instructions, troubleshooting, and advanced configuration, see:
- **`PUSH_NOTIFICATIONS_SETUP.md`** - Complete setup guide with examples

## ⚠️ Important Notes

1. **HTTPS Required**: Service workers only work over HTTPS (except localhost)
2. **User Permission**: Users must grant notification permission for push to work
3. **Browser Notifications**: Notifications must be enabled in browser settings
4. **Migration**: Must run `npx prisma migrate dev` to create the `PushSubscription` table
5. **VAPID Keys**: Must be generated and set in environment variables
6. **Cron Job**: Not required for manual testing, but should be set up in production

## ✨ Usage Examples

### Manual Testing
- Create an announcement as admin → Notifications sent to target roles
- Assign a lead to a followup member → Notification sent to that member

### Production Setup
- Deploy to Vercel/hosting with HTTPS
- Set up cron job with EasyCron or similar service
- Monitor notification delivery in browser console (DevTools)

## 🎯 What's Next

1. Complete steps 1-4 above to get push notifications working
2. Test manually by creating an announcement
3. Monitor server logs and browser console for any issues
4. Set up production cron job for inactivity reminders
5. Monitor user engagement and adjust inactivity threshold (7 days) if needed

---

All files are ready to use after installing dependencies and running the migration!
