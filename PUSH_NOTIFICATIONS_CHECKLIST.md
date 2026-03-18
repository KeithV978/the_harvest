# Push Notifications Implementation Checklist

This checklist will guide you through setting up and verifying push notifications in your Harvest App.

## ✅ Pre-Implementation (Already Done)

- ✅ Created push notification utility functions (`lib/push.ts`)
- ✅ Created service worker (`public/sw.js`)
- ✅ Created PushNotificationProvider component
- ✅ Created activity tracking hook and component
- ✅ Created all required API endpoints
- ✅ Integrated push into announcement creation
- ✅ Integrated push into lead assignment
- ✅ Updated Prisma schema with new models
- ✅ Integrated providers into app layout

## 📋 Setup Checklist (Do These Now)

### Step 1: Install Dependencies
- [ ] Run `npm install web-push @types/web-push`
- [ ] Verify installation: `npm list web-push`

### Step 2: Generate VAPID Keys
- [ ] Run: `node -e "const webpush = require('web-push'); const keys = webpush.generateVAPIDKeys(); console.log('Public:', keys.publicKey, '\nPrivate:', keys.privateKey);"`
- [ ] Copy the public key
- [ ] Copy the private key

### Step 3: Configure Environment Variables
- [ ] Create/update `.env.local` with:
  ```
  NEXT_PUBLIC_VAPID_PUBLIC_KEY=<paste-public-key-here>
  VAPID_PRIVATE_KEY=<paste-private-key-here>
  VAPID_SUBJECT=mailto:support@harvestapp.com
  CRON_SECRET=<generate-random-string-here>
  ```
- [ ] Verify variables are saved

### Step 4: Run Database Migration
- [ ] Run: `npx prisma migrate dev --name add_push_notifications`
- [ ] Migration should complete successfully
- [ ] Check that `PushSubscription` table was created
- [ ] Check that `lastActivity` field was added to `User` table

### Step 5: Verify Database Changes
- [ ] Run: `npx prisma studio`
- [ ] Navigate to `User` model and verify `lastActivity` field exists
- [ ] Navigate to `PushSubscription` model and verify it's empty (no subscriptions yet)
- [ ] Close Prisma Studio

### Step 6: Test in Development
- [ ] Start dev server: `npm run dev`
- [ ] Open app in browser (Chrome/Firefox)
- [ ] Browser should ask for notification permission
- [ ] Click "Allow" to grant permission
- [ ] Open browser DevTools (F12)
- [ ] Go to Application > Service Workers tab
- [ ] Verify service worker is registered and "active"
- [ ] Go to Application > Manifest and check subscriptions

### Step 7: Test Announcement Notifications
- [ ] Login as admin
- [ ] Go to Admin Dashboard > Announcements
- [ ] Click "Create Announcement"
- [ ] Fill in details:
  - Title: "Test Notification"
  - Content: "This is a test"
  - Target Role: "FOLLOWUP"
  - Expiry Date: Tomorrow
- [ ] Click Create
- [ ] **Check**: Should see a push notification (or check notification center if hidden)
- [ ] Click notification (or the app) to verify it navigates to dashboard

### Step 8: Test Lead Assignment Notification
- [ ] Logout or open in different tab/browser
- [ ] Login as a different user (or create test user if needed)
- [ ] Have that user be a FOLLOWUP member
- [ ] Login as admin in original tab
- [ ] Go to Admin Dashboard > Leads
- [ ] Create or select a lead
- [ ] Click "Assign" button
- [ ] Select the FOLLOWUP user
- [ ] Click Assign
- [ ] **Check**: The FOLLOWUP user should receive a push notification about the assignment

### Step 9: Verify Database Storage
- [ ] Run: `npx prisma studio`
- [ ] Go to `PushSubscription` model
- [ ] Should see at least one record with:
  - userId: (id of user who clicked allow)
  - endpoint: (long URL string from browser)
  - auth: (encryption key)
  - p256dh: (encryption key)
- [ ] Close Prisma Studio

### Step 10: Check Activity Tracking
- [ ] Login to app
- [ ] Move mouse, click, type to generate activity
- [ ] Wait a few seconds
- [ ] Run: `npx prisma studio`
- [ ] Go to `User` model
- [ ] Find your user
- [ ] Check `lastActivity` field is recent (updated in last minute)
- [ ] Close Prisma Studio

## 🔧 Optional: Production Setup

### Configure Cron Job for Inactivity Reminders
- [ ] Choose your cron service (EasyCron, Vercel, AWS, etc.)
- [ ] Set endpoint: `https://yourdomain.com/api/tasks/send-inactivity-reminders`
- [ ] Set method: POST
- [ ] Add header: `Authorization: Bearer <your-CRON_SECRET>`
- [ ] Set schedule: `0 2 * * *` (daily at 2 AM)
- [ ] Test cron job by making a manual POST request

### Deploy to Production
- [ ] Ensure app is HTTPS enabled (required for service workers)
- [ ] Set environment variables on hosting platform
- [ ] Run migration on production database
- [ ] Deploy code
- [ ] Test in production environment

## 🧪 Testing Checklist

### Manual Notification Testing
- [ ] Announcement creates push notification
- [ ] Announcement notification shows correct title and preview
- [ ] Clicking announcement notification goes to dashboard
- [ ] Lead assignment creates push notification
- [ ] Lead assignment notification shows lead name
- [ ] Clicking lead notification goes to lead details
- [ ] Notifications work on multiple devices/browsers

### Activity Tracking Testing
- [ ] Activity tracked on page interactions
- [ ] lastActivity updates in database
- [ ] Activity tracking debounced (not on every keystroke)
- [ ] lastActivity persists across page refresh

### Service Worker Testing
- [ ] Service worker registers on first visit
- [ ] Service worker persists across sessions
- [ ] Service worker handles push events in background
- [ ] Notifications appear even with app closed

### Inactivity Reminder Testing (if set up)
- [ ] Cron job runs on schedule
- [ ] Inactivity reminders sent to inactive users
- [ ] Different messages for FOLLOWUP vs EVANGELIST
- [ ] Users with recent activity don't get reminders

## 🐛 Troubleshooting Checklist

### If Notifications Don't Appear
- [ ] Check browser notifications are enabled
- [ ] Check browser hasn't denied permission for this site
- [ ] Check DevTools Console for errors
- [ ] Verify VAPID keys are set in environment variables
- [ ] Restart dev server after changing env variables

### If Service Worker Won't Register
- [ ] Ensure `public/sw.js` file exists (check file browser)
- [ ] Check DevTools Console for registration errors
- [ ] Clear browser cache: DevTools > Application > Clear Site Data
- [ ] Restart dev server
- [ ] Check that HTTPS is enabled (required in production)

### If Subscriptions Not Saving
- [ ] Verify database migration completed successfully
- [ ] Check that `PushSubscription` table exists in database
- [ ] Check DevTools Console for error messages
- [ ] Check server logs for API errors
- [ ] Verify user is authenticated when subscribing

### If Activity Not Tracking
- [ ] Verify `lastActivity` field exists in database
- [ ] Check that activity endpoint exists: `GET /api/users/update-activity`
- [ ] Check DevTools Network tab for activity API calls
- [ ] Verify user is authenticated

## 📊 Monitoring Checklist

### Monitor in Production
- [ ] Check server logs for push sending errors
- [ ] Monitor failed notification delivery
- [ ] Check database for orphaned subscriptions
- [ ] Monitor API rate limits
- [ ] Track notification engagement (clicks)

### Regular Maintenance
- [ ] Weekly: Check for failed push notifications in logs
- [ ] Monthly: Review subscription count and cleanup
- [ ] Monthly: Test manual announcement notification
- [ ] Quarterly: Review inactivity reminder effectiveness

## 🎯 Success Criteria

Push notifications are working correctly when:
- ✅ Notifications appear in browser notification center
- ✅ Click on notification navigates to correct page
- ✅ Announcements notify target roles only
- ✅ Lead assignments notify assigned user only
- ✅ Activity tracking updates periodically
- ✅ Service worker shows as "active" in DevTools
- ✅ PushSubscription records in database
- ✅ No errors in browser console or server logs

## 📞 Need Help?

1. Check `PUSH_NOTIFICATIONS_SETUP.md` for detailed documentation
2. Review `PUSH_NOTIFICATIONS_IMPLEMENTATION.md` for technical details
3. Check browser DevTools (F12 > Console + Application tabs)
4. Check server logs for API errors
5. Verify all environment variables are set correctly
6. Ensure database migration completed

---

**Good luck! Let me know if you encounter any issues.** 🚀
