import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env': env // هذا سيجعل كل متغيرات .env متاحة
    },
    server: {
      port: 5173,
      strictPort: true,
    },
  };
});