import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx, defineManifest } from '@crxjs/vite-plugin';

const manifest = defineManifest({
  manifest_version: 3,
  name: '端的次郎',
  description: '文章を端的に。わかりやすくするわ。（ChatGPT API使用）',
  version: '1.0.0',
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
