# Quick Start: Offline-First Mobile App

Complete offline-first mobile app support has been added to the Harvest App using Capacitor. Here's what to do next.

## Summary of What Was Built

✅ **Offline Storage** - Create leads while offline, they're stored locally
✅ **Automatic Sync** - When online, leads automatically sync to the server
✅ **Network Detection** - App automatically detects online/offline status
✅ **Status Indicator** - Visual feedback showing pending leads and sync progress
✅ **Seamless UX** - Form works the same online or offline
✅ **Capacitor Setup** - Android build configuration ready
✅ **TypeScript Types** - Full type safety with proper interfaces
✅ **Error Handling** - Failed syncs are marked and retried

## What Was Added

### New Files Created
1. **`lib/offlineLeads.ts`** - Offline storage service (IndexedDB/Capacitor Storage)
2. **`lib/syncManager.ts`** - Sync orchestration with network detection
3. **`lib/capacitorUtils.ts`** - Capacitor utility functions
4. **`components/SyncProvider.tsx`** - React context for sync status
5. **`components/SyncStatusIndicator.tsx`** - Visual status indicator component
6. **`hooks/useOfflineLeadCreation.ts`** - Hook for offline-aware lead creation
7. **`capacitor.config.ts`** - Capacitor configuration
8. **`CAPACITOR_SETUP.md`** - Complete Capacitor setup guide
9. **`OFFLINE_IMPLEMENTATION.md`** - Detailed implementation documentation

### Files Modified
1. **`components/leads/AddLeadModal.tsx`** - Added offline support with indicators
2. **`app/providers.tsx`** - Integrated SyncProvider and SyncStatusIndicator
3. **`package.json`** - Added Capacitor dependencies and build scripts
4. **`.gitignore`** - Added Capacitor-specific ignores

## Quick Start: 4 Steps to Android APK

### Step 1: Install Dependencies
```bash
npm install
```

This installs Capacitor and all required plugins:
- `@capacitor/core` - Core framework
- `@capacitor/cli` - Command-line tools
- `@capacitor/android` - Android platform
- `@capacitor/storage` - Device storage (offline data)
- `@capacitor/network` - Network detection

### Step 2: Build and Prepare for Capacitor
```bash
npm run build:mobile
```

This:
- Builds the Next.js app
- Copies built files to Capacitor's web directory
- Prepares everything for Android

### Step 3: Add Android Platform
```bash
npm run cap:add-android
```

This creates the Android project structure in the `android/` directory.

### Step 4: Open in Android Studio and Build APK
```bash
npm run cap:open-android
```

In Android Studio:
1. Wait for gradle sync to complete
2. Go to **Build** → **Generate Signed Bundle/APK**
3. Select **APK** and click **Next**
4. Choose or create a keystore for signing
5. Select **release** build type (or **debug** for testing)
6. Click **Finish**

APK will be generated in `android/app/release/app-release.apk`

## Testing on Device

### Install APK
```bash
adb install android/app/release/app-release.apk
```

### Test Offline Functionality
1. **Create a lead** while online - should work normally
2. **Toggle airplane mode** (off) - app should show "offline" indicator
3. **Create another lead** while offline - it will store locally
4. **Check offline indicator** - should show "1 lead waiting to sync"
5. **Turn airplane mode off** - app automatically syncs
6. **Check database** - both leads should now be there
7. **Verify in admin dashboard** - new leads should appear

## Development Workflow

After initial setup, ongoing development follows this flow:

```bash
# Make code changes
# ...

# Rebuild for mobile
npm run build:mobile

# Sync to Android
npm run cap:sync

# Or open in Android Studio to rebuild
npm run cap:open-android
```

## Key Features Explained

### ✅ Offline Lead Creation
- User creates a lead without internet
- Lead is saved to device storage (IndexedDB on web, Capacitor Storage on mobile)
- Form shows "Offline - Will sync when online" indicator
- User gets immediate feedback (no waiting for server)

### ✅ Automatic Sync
- When device comes online, sync manager detects it
- Automatically sends all pending leads to `/api/leads` endpoint
- Shows sync progress (1/3 synced, 2/3 synced, etc.)
- Removes lead from storage on successful sync

### ✅ Error Handling
- If sync fails, lead is marked as failed
- Sync retries automatically every time connection is restored
- User sees error message with option to retry manually
- No data loss - leads stay in storage until confirmed on server

### ✅ Network Detection
- Uses Capacitor Network plugin on mobile for accurate detection
- Uses Web APIs on browser
- Detects transitions: online → offline and offline → online
- Automatic sync triggered only on online transitions

### ✅ Visual Indicators
- **Status bar at bottom right** shows:
  - 🟢 Online (green) / 🔴 Offline (orange)
  - Sync progress spinner when syncing
  - "X leads waiting to sync" count
  - Last sync time
  - Manual sync button
  - Error message if sync failed

## Configuration Files

### `capacitor.config.ts` - Capacitor Configuration
- App ID: `com.tlac.harvest`
- App Name: `Harvest`
- Configured plugins: Storage, Network, SplashScreen
- Ready for Android and iOS

### Build Scripts in `package.json`
```json
{
  "scripts": {
    "build:mobile": "next build && npx cap copy",
    "cap:add-android": "npx cap add android",
    "cap:sync": "npx cap sync",
    "cap:open-android": "npx cap open android"
  }
}
```

## Architecture Overview

```
User Creates Lead (offline/online)
    ↓
useOfflineLeadCreation hook checks network
    ↓
├─ ONLINE: POST to /api/leads (server)
└─ OFFLINE: save to IndexedDB/Capacitor Storage
    ↓
SyncManager monitors network
    ↓
Network restored → Detect online
    ↓
Automatically call syncOfflineLeads()
    ↓
For each pending lead: POST to /api/leads
    ↓
Success: delete from storage
Failure: mark as failed, retry later
    ↓
SyncStatusIndicator updates UI
```

## Important Notes

1. **API Server Must Be Running** - Mobile app connects to your backend API
2. **Network Connectivity** - For testing offline, use airplane mode or toggle network in DevTools
3. **Data Persistence** - Offline leads stay in device storage until synced to server
4. **Authentication** - JWT tokens are stored securely in Capacitor Storage
5. **Push Notifications** - Still work in background on mobile
6. **Activity Tracking** - Still tracks user activity for inactivity reminders

## Troubleshooting

### Sync Not Starting?
- Check: Device is actually online (not just WiFi without internet)
- Check: `/api/leads` endpoint is accessible and returning success
- Check: Browser console for errors in `syncManager.ts`

### Offline Storage Not Persisting?
- Private/incognito mode doesn't persist IndexedDB
- On mobile, Capacitor Storage handles persistence automatically
- Check: Storage quota (large apps can hit browser limits)

### Build Errors in Android Studio?
- Run: `npm run build:mobile` (rebuilds and prepares files)
- Run: `npm run cap:sync` (updates Android files)
- Reload: Android Studio (or restart gradle daemon)

### APK Won't Install?
- Check: Device has enough storage
- Check: No app with same package ID (`com.tlac.harvest`)
- Try: `adb uninstall com.tlac.harvest` first
- Try: Debug APK first before release signed APK

## Next Steps

1. ✅ **Review files** - Check the new implementation files
2. ✅ **Read setup guide** - See `CAPACITOR_SETUP.md` for detailed steps
3. ✅ **Test offline mode** - Try creating leads offline in browser first
4. ✅ **Build APK** - Follow the 4 steps above
5. ✅ **Test on device** - Install on Android device and test
6. ⏳ **Deploy** - Deploy signed APK for production use

## Documentation Files

- **`OFFLINE_IMPLEMENTATION.md`** - Complete technical documentation
- **`CAPACITOR_SETUP.md`** - Step-by-step Capacitor setup guide
- This file - Quick start guide

## Support

For issues or questions:
1. Check the troubleshooting sections in this guide
2. Review `CAPACITOR_SETUP.md` for detailed explanations
3. Check Capacitor documentation: https://capacitorjs.com/

## What's Included

- ✅ Offline-first architecture
- ✅ Automatic sync on network restoration
- ✅ Network detection and monitoring
- ✅ Visual status indicators
- ✅ Error handling and retry logic
- ✅ TypeScript types and safety
- ✅ Capacitor configuration
- ✅ Build scripts
- ✅ Setup documentation

Happy mobile building! 🚀
