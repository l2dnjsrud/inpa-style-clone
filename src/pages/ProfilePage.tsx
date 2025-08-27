import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { User } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <Navbar />
          
          <div className="overflow-y-auto h-[calc(100vh-4rem)]">
            <div className="container mx-auto px-6 py-8 max-w-4xl">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    프로필
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                      이원경
                    </div>
                    <h2 className="text-2xl font-bold mb-2">이원경 (WonKyung Lee)</h2>
                    <p className="text-muted-foreground mb-4">
                      AI 이미지 & 비디오 생성 연구자 | ComfyUI 전문가 | 10년차 IU 팬 💜
                    </p>
                    <p className="text-sm text-muted-foreground">
                      프로필 기능은 개발 중입니다.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default ProfilePage;