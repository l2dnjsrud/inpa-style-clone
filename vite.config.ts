import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],
          
          // UI library chunks
          'ui-vendor': [
            '@radix-ui/react-slot',
            '@radix-ui/react-dialog', 
            '@radix-ui/react-tabs',
            '@radix-ui/react-progress',
            '@radix-ui/react-select'
          ],
          
          // Router and forms
          'router-forms': ['react-router-dom', 'react-hook-form'],
          
          // Supabase and database
          'supabase': ['@supabase/supabase-js'],
          
          // Animations and charts
          'animations': ['animejs'],
          'charts': ['recharts'],
          
          // Icons
          'icons': ['lucide-react'],
          
          // Utilities
          'utils': ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
}));
