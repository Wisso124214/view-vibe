import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'view-vibe',
  webDir: 'www',
  plugins: {
    LiveUpdates: {
      appId: '30d6337e',
      channel: 'development',
      autoUpdateMethod: 'background',
      maxVersions: 3,
    }
  }
};

export default config;
