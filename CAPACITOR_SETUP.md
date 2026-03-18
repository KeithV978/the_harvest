# Capacitor Setup Guide

This guide outlines the steps to set up Capacitor for building the Harvest App as an Android APK.

## Prerequisites

- Node.js and npm installed
- Android Studio installed with Android SDK
- Java Development Kit (JDK) 11 or higher
- A valid package ID and app name

## Step 1: Install Capacitor Dependencies

Run the following command to install Capacitor and required plugins:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/storage @capacitor/network @capacitor/app
```

This installs:
- `@capacitor/core` - Core Capacitor functionality
- `@capacitor/cli` - Capacitor command-line interface
- `@capacitor/android` - Android platform integration
- `@capacitor/storage` - Device storage API (for offline leads)
- `@capacitor/network` - Network status API
- `@capacitor/app` - App lifecycle management

## Step 2: Configure Build Output

Update the `next.config.js` to ensure it can be built for static deployment:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export for web view
};

module.exports = nextConfig;
```

This tells Next.js to generate static HTML/CSS/JS suitable for Capacitor's WebView.

## Step 3: Add Android Platform

Run the following command to initialize Capacitor and add the Android platform:

```bash
npx cap add android
```

This creates:
- `android/` directory with the Android project
- `android/app/src/main/AndroidManifest.xml` - Android manifest
- Build configuration files

## Step 4: Build Next.js for Production

Build the Next.js app to generate static files:

```bash
npm run build
```

This generates the static files in the `.next/` directory (or `out/` if using static export).

## Step 5: Copy Built Files to Capacitor

Copy the built Next.js files to the web directory:

```bash
npx cap copy
```

This copies the web files from `out/` (as configured in `capacitor.config.ts`) to the Android project's web directory.

## Step 6: Update Android Configuration

Update `android/app/src/main/AndroidManifest.xml` to add required permissions:

```xml
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## Step 7: Open in Android Studio

Open the Android project in Android Studio:

```bash
npx cap open android
```

This opens Android Studio with the project ready to build.

## Step 8: Build APK

In Android Studio:

1. Go to **Build** > **Generate Signed Bundle/APK**
2. Select **APK** and click **Next**
3. Select or create a keystore (for testing, you can create a debug keystore)
4. Fill in the details and keystore password
5. Select **release** build variant (or **debug** for testing)
6. Click **Finish**

The APK will be generated in `android/app/release/` or `android/app/debug/`.

## Alternative: Build via Gradle

You can also build via command line:

```bash
cd android
./gradlew build  # For debug
./gradlew bundleRelease  # For release
```

## Development Workflow

For ongoing development:

1. **Make changes** to the Next.js app
2. **Build**: `npm run build`
3. **Sync**: `npx cap copy` (or `npx cap sync` to sync and copy)
4. **Test**: Open in Android Studio and run on emulator/device

## Troubleshooting

### webDir path issue
If Capacitor can't find the web files, verify `capacitor.config.ts` has the correct `webDir` path. For static exports, use `'out'`. For `.next`, you may need to configure a custom server.

### Android SDK not found
Set the `ANDROID_HOME` environment variable:
```bash
export ANDROID_HOME=~/Android/Sdk
```

### Port conflicts
If port 5173 (or configured port) is in use, Capacitor may fail to serve. Configure an alternative port in `capacitor.config.ts`.

### Build errors
Always ensure you run `npx cap sync` or `npx cap copy` after building Next.js to update the web files in the Android project.

## Environment Variables

For production builds, ensure environment variables are set:

```bash
# For push notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<your-public-key>

# For database
DATABASE_URL=<your-db-url>

# For Next Auth
NEXTAUTH_SECRET=<your-secret>
```

## Testing Offline Functionality

Once the APK is built and installed on a device:

1. **Toggle Airplane Mode** to test offline/online detection
2. **Create a lead** while offline - it should save to local storage
3. **Turn on internet** - leads should auto-sync
4. **Verify** the lead appears in the admin dashboard on the server

## Next Steps

1. Install dependencies: `npm install`
2. Configure Next.js build: Update `next.config.js`
3. Add Android platform: `npx cap add android`
4. Build and sync: `npm run build && npx cap sync`
5. Open in Android Studio: `npx cap open android`
6. Build APK in Android Studio

Refer to the [Capacitor Documentation](https://capacitorjs.com/) for more detailed information.
