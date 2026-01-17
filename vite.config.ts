
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY || ''),
      'process.env.MISTRAL_API_KEY': JSON.stringify(env.MISTRAL_API_KEY || ''),
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
      'process.env': {
        GEMINI_API_KEY: env.GEMINI_API_KEY || env.API_KEY || '',
        MISTRAL_API_KEY: env.MISTRAL_API_KEY || '',
        API_KEY: env.API_KEY || ''
      }
    },
    server: {
      port: 5173,
      strictPort: true,
    },
  };
});
