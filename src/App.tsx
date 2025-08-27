import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import AuthPage from "./pages/AuthPage";
import WritePage from "./pages/WritePage";
import DashboardPage from "./pages/DashboardPage";
import PostPage from "./pages/PostPage";
import AllPostsPage from "./pages/AllPostsPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/posts" element={<AllPostsPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/write" element={<WritePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <PerformanceMonitor />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
