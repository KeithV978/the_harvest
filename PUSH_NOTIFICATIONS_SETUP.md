# Push Notifications Setup Guide

This document covers the setup and usage of the push notification system that was just added to your Harvest App.

## What Was Implemented

The following push notification features have been added to your app:

1. **Push Notification Infrastructure**: Web Push API integration for device notifications that work even when the app is closed
2. **Announcement Notifications**: Automatic push notifications sent to target roles when announcements are created
3. **Lead Assignment Notifications**: Push notifications sent to followup members when leads are assigned to them
4. **Inactivity Reminders**: Automatic reminders sent to inactive users (after 7 days) to re-engage with the app
5. **Activity Tracking**: Automatic tracking of user activity to determine inactivity status

## Database Changes

The following changes were made to your Prisma schema:

- **Added `PushSubscription` Model**: Stores device push subscriptions for each user
- **Added `lastActivity` Field to User**: Tracks when each user was last active
- **Created Migration**: You need to run the migration to apply these changes

## Installation Steps

### 1. Install Required Package

```bash
npm install web-push
```

Also install the type definitions:

```bash
npm install --save-dev @types/web-push
```

### 2. Generate VAPID Keys

VAPID keys are required for the Web Push API to work. Generate them using:

```bash
node -e "const webpush = require('web-push'); const keys = webpush.generateVAPIDKeys(); console.log('Public Key:', keys.publicKey); console.log('Private Key:', keys.privateKey);"
```

### 3. Add Environment Variables

Add the following to your `.env.local` file:

```
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<your-public-key-here>
VAPID_PRIVATE_KEY=<your-private-key-here>
VAPID_SUBJECT=mailto:support@harvestapp.com
CRON_SECRET=<your-cron-secret-for-inactivity-job>
```

### 4. Run Database Migration

Create and run a migration for the new `PushSubscription` model and `lastActivity` field:

```bash
npx prisma migrate dev --name add_push_notifications
```

This will:
- Create the `PushSubscription` table
- Add the `lastActivity` field to the `User` table

### 5. Update Type Definitions

Add the following to `types/next-auth.d.ts` to ensure proper typing:

```typescript
declare module 'next-auth' {
  interface User {
    role?: 'EVANGELIST' | 'FOLLOWUP' | 'ADMIN';
  }

  interface Session {
    user: User & {
      id: string;
      role: 'EVANGELIST' | 'FOLLOWUP' | 'ADMIN';
    };
  }
}
```

## Files Created/Modified

### New Files

- **`lib/push.ts`**: Core push notification utilities (send to user, send to role, generate VAPID keys)
- **`public/sw.js`**: Service worker that handles push events
- **`components/PushNotificationProvider.tsx`**: Client component that registers service worker and subscribes to push
- **`components/ActivityTracker.tsx`**: Client component that tracks user activity
- **`hooks/useActivityTracking.ts`**: Hook that tracks user interactions and updates `lastActivity`
- **`app/api/push/subscribe/route.ts`**: API endpoint to store device push subscriptions
- **`app/api/push/unsubscribe/route.ts`**: API endpoint to remove device push subscriptions
- **`app/api/push/public-key/route.ts`**: API endpoint to get the public VAPID key
- **`app/api/push/send/route.ts`**: Internal API endpoint to send push to a specific user
- **`app/api/push/send-to-role/route.ts`**: Internal API endpoint to send push to all users with a specific role
- **`app/api/users/update-activity/route.ts`**: API endpoint called by activity tracker to update last activity
- **`app/api/tasks/send-inactivity-reminders/route.ts`**: Cron job endpoint to send inactivity reminders

### Modified Files

- **`prisma/schema.prisma`**: Added `PushSubscription` model and `lastActivity` field to User
- **`app/providers.tsx`**: Added `PushNotificationProvider` and `ActivityTracker` components
- **`app/api/admin/announcements/route.ts`**: Added push notification sending when announcements are created
- **`app/api/leads/[id]/route.ts`**: Added push notification sending when leads are assigned

## Usage

### Manual Push Notification Sending

To send a push notification to a specific user:

```bash
curl -X POST http://localhost:3000/api/push/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <session-cookie>" \
  -d '{
    "userId": "user-id",
    "title": "Test Notification",
    "body": "This is a test notification",
    "data": {
      "url": "/dashboard"
    }
  }'
```

To send to all users with a specific role:

```bash
curl -X POST http://localhost:3000/api/push/send-to-role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <session-cookie>" \
  -d '{
    "role": "FOLLOWUP",
    "title": "Action Required",
    "body": "Please update your assigned leads",
    "data": {
      "url": "/dashboard/followup/leads"
    }
  }'
```

### Setting Up the Inactivity Reminder Cron Job

The inactivity reminder endpoint is available at:

```
POST /api/tasks/send-inactivity-reminders
```

To set this up with an external cron service (e.g., EasyCron, Vercel Cron, AWS EventBridge):

1. **For EasyCron** (simplest):
   - Go to https://www.easycron.com
   - Create a new cron job
   - URL: `https://yourdomain.com/api/tasks/send-inactivity-reminders`
   - Method: `POST`
   - Add header: `Authorization: Bearer <CRON_SECRET>`
   - Schedule: `0 2 * * *` (runs daily at 2 AM)

2. **For Vercel Cron** (if hosted on Vercel):
   - Create `app/api/crons/inactivity-reminders/route.ts`:
   ```typescript
   import { NextRequest } from 'next/server';

   export async function GET(request: NextRequest) {
     if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
       return new Response('Unauthorized', { status: 401 });
     }

     const response = await fetch(
       `${process.env.NEXTAUTH_URL}/api/tasks/send-inactivity-reminders`,
       {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${process.env.CRON_SECRET}`,
         },
       }
     );

     return response;
   }

   export const config = {
     maxDuration: 60,
   };
   ```

   - Add to `vercel.json`:
   ```json
   {
     "crons": [{
       "path": "/api/crons/inactivity-reminders",
       "schedule": "0 2 * * *"
     }]
   }
   ```

## Notification Triggers

### 1. Announcements
- **Trigger**: When an admin creates a new announcement
- **Recipients**: All users matching the target role
- **Data**: Link to dashboard

### 2. Lead Assignments
- **Trigger**: When a lead is assigned to a followup member
- **Recipients**: The assigned followup member
- **Data**: Link to the specific lead for quick access

### 3. Inactivity Reminders
- **Trigger**: Cron job runs daily (configurable)
- **Recipients**: Users with `lastActivity < 7 days ago`
- **Message**: Different message depending on role
  - **FOLLOWUP**: "Time to Follow Up - Your assigned leads are waiting"
  - **EVANGELIST**: "Time to Add Some Leads - Help us reach more souls"

## Browser Support

Push notifications are supported in:
- Chrome/Chromium (all versions)
- Firefox (all versions)
- EdgeEdge (all versions)
- Safari 16+ (iOS 16.4+, macOS 13.3+)
- Opera (all versions)

## Testing Push Notifications

### 1. Test in Development

1. Start your dev server: `npm run dev`
2. Go to any page in the app
3. Browser should ask for notification permission - click "Allow"
4. Service worker should be registered (check browser DevTools > Application > Service Workers)
5. Test announcement creation to see push notification

### 2. Check DevTools

- **DevTools > Application > Service Workers**: See if service worker is registered
- **DevTools > Application > Manifest**: Check app manifest (if using PWA)
- **DevTools > Network**: Filter by "api/push/" to see subscription API calls
- **DevTools > Console**: Look for push-related logs

### 3. Verify Database

Check if subscriptions are stored:

```bash
npx prisma studio
# Navigate to PushSubscription table and verify records have been created
```

## Troubleshooting

### No Notification Permissions Popup
- Browser might have already denied permissions. Reset in browser settings
- Check browser's notification settings for your domain

### Service Worker Not Registering
- Check if `public/sw.js` exists
- Check browser console for errors
- Ensure HTTPS is enabled (required for service workers in production)

### No Notifications Appearing
- Check if browser notifications are enabled globally
- Check if user has granted permission to the app
- Verify VAPID keys are correctly set in environment variables
- Check browser console for errors

### Subscriptions Not Saving to Database
- Ensure migration was run successfully: `npx prisma migrate status`
- Check if `NEXT_PUBLIC_VAPID_PUBLIC_KEY` is set
- Look for errors in server logs during subscription

### Inactivity Reminders Not Sending
- Verify `/api/tasks/send-inactivity-reminders` is being called
- Check if `lastActivity` field exists in database
- Verify VAPID keys are set
- Check server logs for push sending errors

## Performance Considerations

- Activity tracking is debounced to max once per 5 minutes to avoid excessive API calls
- Service worker handles all push events in the background
- Notification subscriptions are stored per device/browser combination
- Removing subscriptions are handled gracefully on failure

## Security

- Push endpoints require authentication (except the public key endpoint)
- Send and send-to-role endpoints require ADMIN role
- Subscription data includes auth tokens and encryption keys securely stored in database
- Cron job endpoint can be protected with `CRON_SECRET` environment variable
- All API calls over HTTPS in production

## Next Steps

1. Install web-push: `npm install web-push @types/web-push`
2. Generate VAPID keys
3. Set environment variables
4. Run database migration
5. Test notification permissions in browser
6. Create an announcement to test push notifications
7. Set up cron job for inactivity reminders
8. Monitor logs for any issues

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Look at browser console for error messages
3. Check server logs for push-related errors
4. Verify all environment variables are set correctly
5. Ensure database migration was successful
