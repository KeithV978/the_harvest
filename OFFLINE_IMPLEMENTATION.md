# Offline-First Mobile App Implementation Summary

This document summarizes the offline-first mobile app implementation for the Harvest App using Capacitor.

## What Has Been Completed

### 1. **Offline Storage Service** (`lib/offlineLeads.ts`)
- Abstract storage layer supporting both IndexedDB (web) and Capacitor Storage (native)
- Full CRUD operations for offline leads
- Proper TypeScript interfaces for type safety
- Automatic platform detection (web vs native)
- Indexes on `syncStatus` and `createdAt` for efficient querying

**Key Methods:**
- `saveOfflineLead()` - Save a new lead to local storage
- `getOfflineLeads()` - Retrieve all stored leads
- `getPendingLeads()` - Get leads not yet synced
- `updateLeadSyncStatus()` - Update sync status (pending, syncing, synced, failed)
- `deleteOfflineLead()` - Remove lead after successful sync
- `clearOfflineLeads()` - Clear all offline leads

### 2. **Sync Manager Service** (`lib/syncManager.ts`)
- Network detection using Web APIs and Capacitor Network plugin
- Automatic sync when connection is restored
- Retry logic with error tracking
- Progress tracking (pending leads → synced leads)
- Status notifications to UI via callback pattern

**Key Functions:**
- `initializeSyncManager()` - Initialize and start network monitoring
- `onSyncStatusChange()` - Subscribe to sync status updates
- `syncOfflineLeads()` - Trigger sync automatically
- `triggerManualSync()` - Manual sync button support

### 3. **SyncProvider Context** (`components/SyncProvider.tsx`)
- React Context for providing sync status to entire app
- Exposes: `isSyncing`, `isOnline`, `pendingCount`, `lastSyncTime`, `error`, `manualSync()`
- Automatically initializes and cleans up sync manager

**Usage:**
```tsx
const { isSyncing, isOnline, pendingCount, manualSync } = useSyncStatus();
```

### 4. **SyncStatus Indicator Component** (`components/SyncStatusIndicator.tsx`)
- Visual indicator showing current sync status
- Displays pending lead count and last sync time
- Manual sync button when offline
- Toast notifications on completion/error
- Auto-hides when online with no pending leads

### 5. **Offline Lead Creation Hook** (`hooks/useOfflineLeadCreation.ts`)
- Detects network status
- Creates leads either via API (online) or local storage (offline)
- Handles success and error callbacks
- Seamless fallback to offline mode

**Usage:**
```tsx
const { isOnline, createLead } = useOfflineLeadCreation();
await createLead(formData); // Works online or offline
```

### 6. **Modified AddLeadModal Component** (`components/leads/AddLeadModal.tsx`)
- Integrated offline support
- Shows "Offline - Will sync when online" indicator
- Uses `useOfflineLeadCreation` hook for smart lead creation
- Seamless experience whether online or offline

### 7. **App Providers Integration** (`app/providers.tsx`)
- Added `SyncProvider` wrapper for sync status availability
- Added `SyncStatusIndicator` for UI visibility
- Proper nesting: SessionProvider > SyncProvider > PushNotificationProvider > ActivityTracker

### 8. **Capacitor Configuration** (`capacitor.config.ts`)
- Configured app ID: `com.tlac.harvest`
- Configured app name: `Harvest`
- Configured plugins: Storage, Network, SplashScreen
- Set up Android-specific configuration

### 9. **Build Scripts** (`package.json`)
- `npm run build:mobile` - Build Next.js and copy files for Capacitor
- `npm run cap:add-android` - Initialize Android platform
- `npm run cap:sync` - Sync web files to Android
- `npm run cap:open-android` - Open in Android Studio

### 10. **Setup Documentation** (`CAPACITOR_SETUP.md`)
- Complete step-by-step guide for Capacitor setup
- Instructions for building APK
- Troubleshooting guide
- Development workflow

## How Offline-First Works

### User Journey: Creating Lead While Offline

1. **User opens Add Lead Modal** (online or offline)
2. **User fills form** and submits
3. **Check network status:**
   - **If online:** POST to `/api/leads` → Returns success → Lead in database
   - **If offline:** Save to IndexedDB/Capacitor Storage → Returns success immediately
4. **Modal closes** with success message
5. **Lead appears in offline indicator** (if offline) showing "1 lead waiting to sync"
6. **When user comes online:**
   - Sync manager detects connection
   - Automatically starts syncing pending leads
   - Makes POST requests to `/api/leads` for each pending lead
   - On success: Removes from local storage
   - On failure: Marks as failed, retries later
7. **Lead appears in database** and admin sees it
8. **Offline indicator updates** showing sync status and completion time

### Key Features

✅ **Automatic Sync** - No manual button needed (though available)
✅ **Offline-First UX** - Works seamlessly without internet
✅ **Error Resilience** - Failed syncs retry automatically
✅ **Status Visibility** - Users see pending count and sync progress
✅ **Cross-Platform** - IndexedDB for web, Capacitor Storage for native
✅ **Type-Safe** - Full TypeScript support with proper interfaces
✅ **Non-Blocking** - Sync doesn't interrupt user interactions
✅ **Background Sync** - Syncs even if user leaves the app (on mobile)

## Next Steps for User

### 1. Install Capacitor Dependencies
```bash
npm install
```

This installs all Capacitor packages added to `package.json`.

### 2. Build and Prepare for Android
```bash
npm run build:mobile
```

This builds Next.js app and copies files to Capacitor's web directory.

### 3. Add Android Platform
```bash
npm run cap:add-android
```

This initializes the Android project in the `android/` directory.

### 4. Open in Android Studio
```bash
npm run cap:open-android
```

This opens Android Studio with the project ready to build.

### 5. Build APK in Android Studio
In Android Studio:
- Build > Generate Signed Bundle/APK
- Select APK
- Create or select keystore
- Choose release or debug build type
- Click Finish

APK will be generated in `android/app/release/` directory.

### 6. Test on Device
- Install APK: `adb install app-release.apk`
- Test offline lead creation
- Toggle airplane mode
- Verify auto-sync when coming online

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│         AddLeadModal Component                   │
│  (with offline support notification)             │
└──────────────┬──────────────────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │ useOfflineLeadCreation │ (checks network)
    └──────┬───────────────┘
           │
    ┌──────┴──────┐
    │             │
    ▼ (online)  ▼ (offline)
  /api/leads   offlineLeads.ts
  (server)     (IndexedDB/
               Capacitor)
               │
               ▼
          SyncManager
          (Network listener)
          │
          ├─ Detects online event
          ├─ Calls syncOfflineLeads()
          ├─ Fetches pending leads
          ├─ POST each to /api/leads
          ├─ Updates sync status
          └─ Notifies SyncProvider
               │
               ▼
          SyncStatusIndicator
          (Visual UI feedback)
```

## File Structure

```
harvest-app/
├── lib/
│   ├── offlineLeads.ts          # Offline storage service
│   ├── syncManager.ts           # Sync orchestration
│   └── ...
├── components/
│   ├── SyncProvider.tsx         # Context provider
│   ├── SyncStatusIndicator.tsx  # UI indicator
│   ├── leads/
│   │   └── AddLeadModal.tsx     # Modified for offline
│   └── ...
├── hooks/
│   ├── useOfflineLeadCreation.ts # Offline hook
│   └── ...
├── app/
│   ├── providers.tsx             # SyncProvider integrated
│   ├── api/
│   │   ├── leads/
│   │   │   └── route.ts         # Lead creation endpoint
│   │   └── ...
│   └── ...
├── capacitor.config.ts           # Capacitor config
├── CAPACITOR_SETUP.md            # Setup guide
└── package.json                  # Updated with Capacitor deps
```

## Important Notes

1. **API Server Required**: Mobile app connects to the backend API. Ensure the API server is running and accessible.

2. **CORS Configuration**: If API is on different domain, add CORS origins:
   ```bash
   sanity cors add --origin https://yourdomain.com
   ```

3. **Authentication**: JWT tokens stored in Capacitor Storage. Sync uses existing session/JWT for authentication.

4. **Data Consistency**: Offline leads stored temporarily until sync success. Failed syncs marked and retried.

5. **Database**: Server database is source of truth. Local storage is temporary cache.

6. **Push Notifications**: Work in background on mobile. Service worker handles them.

## Testing Offline Mode (Development)

In browser DevTools:
1. Open DevTools
2. Go to Network tab
3. Use "Offline" checkbox to simulate offline
4. Create lead - should store locally
5. Check IndexedDB under Application > Storage
6. Go back online - automatic sync should trigger

## Troubleshooting

**Sync not triggering?**
- Check browser console for sync manager errors
- Verify network is actually detected as online
- Check SyncStatusIndicator is visible and showing offline state

**Leads not appearing after sync?**
- Check API response for errors
- Verify `/api/leads` endpoint is working
- Check server database for the lead

**Offline storage not persisting?**
- IndexedDB may be cleared in private/incognito mode
- Check browser storage settings
- On mobile, Capacitor Storage handles it

## What's Next?

1. ✅ Offline storage and sync (complete)
2. ⏳ Android build and APK generation (ready for you to execute)
3. ⏳ Testing on real device with airplane mode
4. ⏳ Production deployment with signed APK
5. ⏳ Optional: iOS support using Capacitor

Refer to `CAPACITOR_SETUP.md` for detailed step-by-step instructions.
