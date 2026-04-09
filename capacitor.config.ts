import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.giovannilabs.deucediary',
  appName: 'Deuce Diary',
  webDir: 'dist/public',
  ios: {
    scheme: 'Deuce Diary',
    backgroundColor: '#8B6914',
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
  },
  // No server.url — use bundled local assets for native feel
  // API calls route to production via the API base URL interceptor
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
