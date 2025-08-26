// vite.config.ts
import { defineConfig } from "file:///C:/Users/gaon/Downloads/inpa-style-clone/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/gaon/Downloads/inpa-style-clone/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///C:/Users/gaon/Downloads/inpa-style-clone/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "C:\\Users\\gaon\\Downloads\\inpa-style-clone";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          "react-vendor": ["react", "react-dom"],
          // UI library chunks
          "ui-vendor": [
            "@radix-ui/react-slot",
            "@radix-ui/react-dialog",
            "@radix-ui/react-tabs",
            "@radix-ui/react-progress",
            "@radix-ui/react-select"
          ],
          // Router and forms
          "router-forms": ["react-router-dom", "react-hook-form"],
          // Supabase and database
          "supabase": ["@supabase/supabase-js"],
          // Animations and charts
          "animations": ["animejs"],
          "charts": ["recharts"],
          // Icons
          "icons": ["lucide-react"],
          // Utilities
          "utils": ["date-fns", "clsx", "tailwind-merge"]
        }
      }
    },
    chunkSizeWarningLimit: 1e3
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxnYW9uXFxcXERvd25sb2Fkc1xcXFxpbnBhLXN0eWxlLWNsb25lXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxnYW9uXFxcXERvd25sb2Fkc1xcXFxpbnBhLXN0eWxlLWNsb25lXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9nYW9uL0Rvd25sb2Fkcy9pbnBhLXN0eWxlLWNsb25lL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgY29tcG9uZW50VGFnZ2VyIH0gZnJvbSBcImxvdmFibGUtdGFnZ2VyXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogODA4MCxcclxuICB9LFxyXG4gIHBsdWdpbnM6IFtcclxuICAgIHJlYWN0KCksXHJcbiAgICBtb2RlID09PSAnZGV2ZWxvcG1lbnQnICYmXHJcbiAgICBjb21wb25lbnRUYWdnZXIoKSxcclxuICBdLmZpbHRlcihCb29sZWFuKSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBtYW51YWxDaHVua3M6IHtcclxuICAgICAgICAgIC8vIENvcmUgUmVhY3QgbGlicmFyaWVzXHJcbiAgICAgICAgICAncmVhY3QtdmVuZG9yJzogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8gVUkgbGlicmFyeSBjaHVua3NcclxuICAgICAgICAgICd1aS12ZW5kb3InOiBbXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3Qtc2xvdCcsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtZGlhbG9nJywgXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtdGFicycsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtcHJvZ3Jlc3MnLFxyXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LXNlbGVjdCdcclxuICAgICAgICAgIF0sXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIFJvdXRlciBhbmQgZm9ybXNcclxuICAgICAgICAgICdyb3V0ZXItZm9ybXMnOiBbJ3JlYWN0LXJvdXRlci1kb20nLCAncmVhY3QtaG9vay1mb3JtJ10sXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIFN1cGFiYXNlIGFuZCBkYXRhYmFzZVxyXG4gICAgICAgICAgJ3N1cGFiYXNlJzogWydAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXSxcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8gQW5pbWF0aW9ucyBhbmQgY2hhcnRzXHJcbiAgICAgICAgICAnYW5pbWF0aW9ucyc6IFsnYW5pbWVqcyddLFxyXG4gICAgICAgICAgJ2NoYXJ0cyc6IFsncmVjaGFydHMnXSxcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgLy8gSWNvbnNcclxuICAgICAgICAgICdpY29ucyc6IFsnbHVjaWRlLXJlYWN0J10sXHJcbiAgICAgICAgICBcclxuICAgICAgICAgIC8vIFV0aWxpdGllc1xyXG4gICAgICAgICAgJ3V0aWxzJzogWydkYXRlLWZucycsICdjbHN4JywgJ3RhaWx3aW5kLW1lcmdlJ11cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDEwMDBcclxuICB9XHJcbn0pKTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvVCxTQUFTLG9CQUFvQjtBQUNqVixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSGhDLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1I7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFNBQVMsaUJBQ1QsZ0JBQWdCO0FBQUEsRUFDbEIsRUFBRSxPQUFPLE9BQU87QUFBQSxFQUNoQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixjQUFjO0FBQUE7QUFBQSxVQUVaLGdCQUFnQixDQUFDLFNBQVMsV0FBVztBQUFBO0FBQUEsVUFHckMsYUFBYTtBQUFBLFlBQ1g7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsVUFDRjtBQUFBO0FBQUEsVUFHQSxnQkFBZ0IsQ0FBQyxvQkFBb0IsaUJBQWlCO0FBQUE7QUFBQSxVQUd0RCxZQUFZLENBQUMsdUJBQXVCO0FBQUE7QUFBQSxVQUdwQyxjQUFjLENBQUMsU0FBUztBQUFBLFVBQ3hCLFVBQVUsQ0FBQyxVQUFVO0FBQUE7QUFBQSxVQUdyQixTQUFTLENBQUMsY0FBYztBQUFBO0FBQUEsVUFHeEIsU0FBUyxDQUFDLFlBQVksUUFBUSxnQkFBZ0I7QUFBQSxRQUNoRDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSx1QkFBdUI7QUFBQSxFQUN6QjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
