
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.025943cfd2ac4da3828f09c9cd59aad4',
  appName: 'FinanceTracker',
  webDir: 'dist',
  server: {
    url: "https://025943cf-d2ac-4da3-828f-09c9cd59aad4.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};

export default config;
