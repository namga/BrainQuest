import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'com.brainquest.puzzle',
  appName: 'Brain Quest',
  webDir: 'dist',
  android: { backgroundColor: '#11152D' },
  ios: { contentInset: 'automatic', backgroundColor: '#11152D' }
};
export default config;
