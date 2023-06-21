import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx, defineManifest } from '@crxjs/vite-plugin';

const manifest = defineManifest({
  manifest_version: 3,
  name: '端的次郎',
  description: '文章を端的に、わかりやすくするわ。（ChatGPT API使用）',
  version: '1.0.2',
  icons: {
    16: 'public/icon-16.png',
    32: 'public/icon-32.png',
    48: 'public/icon-48.png',
    128: 'public/icon-128.png'
  },
  action: {
    default_popup: 'index.html'
  },
  background: {
    service_worker: 'src/background.ts'
  },
  permissions: [
    'storage'
  ]
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    crx({ manifest })
  ]
});
