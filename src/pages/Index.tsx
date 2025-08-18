import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { CategoriesGrid } from "@/components/CategoriesGrid";
import { FeaturedPosts } from "@/components/FeaturedPosts";
import { RecentPosts } from "@/components/RecentPosts";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <Navbar />
          
          <div className="overflow-y-auto h-[calc(100vh-4rem)]">
            <HeroSection />
            <div className="container mx-auto px-6 py-8">
              <FeaturedPosts />
              <RecentPosts />
            </div>
            <StatsSection />
            <CategoriesGrid />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
