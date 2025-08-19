import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminPostList } from "@/components/admin/AdminPostList";
import { AdminPostEditor } from "@/components/admin/AdminPostEditor";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Shield, AlertCircle } from "lucide-react";

interface Post {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  featured_image?: string;
  slug: string;
}

const AdminPage = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [currentView, setCurrentView] = useState<'list' | 'editor'>('list');
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const checkAdminRole = async () => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .rpc('is_admin');

      if (error) throw error;
      setIsAdmin(data || false);
    } catch (error) {
      console.error('Admin check error:', error);
      setIsAdmin(false);
      toast.error('관리자 권한 확인에 실패했습니다');
    }
  };

  useEffect(() => {
    checkAdminRole();
  }, [user]);

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setCurrentView('editor');
  };

  const handleCreateNew = () => {
    setEditingPost(null);
    setCurrentView('editor');
  };

  const handleSavePost = () => {
    setCurrentView('list');
    setEditingPost(null);
  };

  const handleCancelEdit = () => {
    setCurrentView('list');
    setEditingPost(null);
  };

  // Loading state
  if (isAdmin === null) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">
            <Navbar />
            <div className="overflow-y-auto h-[calc(100vh-4rem)]">
              <div className="container mx-auto px-6 py-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">권한을 확인하는 중...</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  // Access denied
  if (!user || !isAdmin) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">
            <Navbar />
            <div className="overflow-y-auto h-[calc(100vh-4rem)]">
              <div className="container mx-auto px-6 py-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
                    <h2 className="text-xl font-semibold mb-2">접근 권한이 없습니다</h2>
                    <p className="text-muted-foreground">
                      이 페이지는 관리자만 접근할 수 있습니다. 
                      {!user && " 먼저 로그인해주세요."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <Navbar />
          
          <div className="overflow-y-auto h-[calc(100vh-4rem)]">
            <div className="container mx-auto px-6 py-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-6 h-6 text-primary" />
                  <h1 className="text-3xl font-bold">관리자 페이지</h1>
                </div>
                <p className="text-muted-foreground">
                  포스트, 카테고리를 관리하고 사이트 설정을 변경할 수 있습니다.
                </p>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                  <TabsTrigger value="posts">포스트 관리</TabsTrigger>
                  <TabsTrigger value="categories">카테고리 관리</TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="mt-6">
                  {currentView === 'list' ? (
                    <AdminPostList
                      onEdit={handleEditPost}
                      onCreateNew={handleCreateNew}
                    />
                  ) : (
                    <AdminPostEditor
                      post={editingPost}
                      onSave={handleSavePost}
                      onCancel={handleCancelEdit}
                    />
                  )}
                </TabsContent>

                <TabsContent value="categories" className="mt-6">
                  <CategoryManager />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminPage;