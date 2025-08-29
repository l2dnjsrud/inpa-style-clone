import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";

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
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                  <FeaturedPosts />
                  <RecentPosts />
                </div>
                <div className="lg:col-span-1 space-y-6">
                  {/* Add sidebar components here if needed */}
                </div>
              </div>
            </div>
            <StatsSection />

          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
