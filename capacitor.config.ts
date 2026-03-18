import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tlac.harvest',
  appName: 'Harvest',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    cleartext: true, // Allow clear text for local development
  },
  plugins: {
    Storage: {
      group: 'com.tlac.harvest',
    },
    Network: {},
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
