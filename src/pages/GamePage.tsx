import { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Gamepad2, 
  Calendar,
  Target
} from 'lucide-react';

const GamePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [visitedRooms, setVisitedRooms] = useState(0);
  const [guestMessages, setGuestMessages] = useState(3);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
  }, [user, navigate]);



  // InfoMansion-inspired daily quest system
  const getDailyQuests = () => [
    {
      id: 'daily_post',
      title: 'ComfyUI 포스트 작성',
      description: 'AI 이미지 생성이나 프롬프트 엔지니어링 경험을 공유해보세요',
      reward: '50 XP + 2 크레딧',
      icon: '🎨',
      progress: 0,
      total: 1,
      completed: false,
      type: 'content'
    },
    {
      id: 'room_visit',
      title: '다른 개발자 공간 방문',
      description: '다른 개발자들의 멋진 공간을 구경하고 영감을 얻어보세요',
      reward: '25 XP + 1 크레딧',
      icon: '🏠',
      progress: visitedRooms,
      total: 3,
      completed: visitedRooms >= 3,
      type: 'social'
    },
    {
      id: 'room_customize',
      title: '내 공간 꾸미기',
      description: '가구를 배치하고 테마를 변경하여 나만의 공간 만들기',
      reward: '30 XP + 1 크레딧',
      icon: '✨',
      progress: 0,
      total: 1,
      completed: false,
      type: 'customization'
    },
    {
      id: 'social_engagement',
      title: '커뮤니티 소통',
      description: '방명록에 메시지를 남기거나 다른 사람과 소통하기',
      reward: '20 XP + 1 크레딧',
      icon: '💬',
      progress: 0,
      total: 2,
      completed: false,
      type: 'social'
    },
    {
      id: 'furniture_purchase',
      title: '가구 쇼핑',
      description: '상점에서 새로운 가구나 장식을 구매해보세요',
      reward: '15 XP',
      icon: '🛒',
      progress: 0,
      total: 1,
      completed: false,
      type: 'shopping'
    }
  ];

  const getWeeklyStats = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      postsThisWeek: 0,
      xpGained: 0,
      achievementsUnlocked: 0,
      consecutiveDays: 0,
      creditsEarned: 25, // InfoMansion-inspired
      roomsVisited: visitedRooms,
      socialInteractions: guestMessages
    };
  };

  const MainContent = () => {
    const weeklyStats = getWeeklyStats();
    const dailyQuests = getDailyQuests();

    return (
      <div className="space-y-6">
        {/* Daily Quests & Weekly Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Quests */}
          <Card className="bondee-card floating-3d">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                오늘의 미션 🎯
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dailyQuests.map((quest) => (
                  <div key={quest.id} className="flex items-center gap-3 p-3 border border-purple-200 rounded-lg bondee-card hover:border-purple-300 transition-colors">
                    <div className="text-xl animate-bounce-3d">{quest.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{quest.title}</div>
                      <div className="text-xs text-muted-foreground">{quest.description}</div>
                      <div className="text-xs text-purple-600 mt-1 font-medium">+{quest.reward}</div>
                    </div>
                    <Badge variant={quest.completed ? "default" : "secondary"} className={quest.completed ? "bg-purple-500" : "border-purple-200"}>
                      {quest.progress}/{quest.total}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Stats */}
          <Card className="bondee-card floating-3d">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-400" />
                이번 주 성과 📊
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-lg bondee-card">
                  <div className="text-2xl font-bold text-purple-600">{weeklyStats.postsThisWeek}</div>
                  <div className="text-sm text-muted-foreground">작성한 포스트</div>
                </div>
                <div className="text-center p-3 bg-pink-50 rounded-lg bondee-card">
                  <div className="text-2xl font-bold text-pink-600">{weeklyStats.xpGained}</div>
                  <div className="text-sm text-muted-foreground">획득 XP</div>
                </div>
                <div className="text-center p-3 bg-purple-100 rounded-lg bondee-card">
                  <div className="text-2xl font-bold text-purple-700 iu-heart">{weeklyStats.achievementsUnlocked}</div>
                  <div className="text-sm text-muted-foreground">달성 배지</div>
                </div>
                <div className="text-center p-3 bg-pink-100 rounded-lg bondee-card">
                  <div className="text-2xl font-bold text-pink-700">{weeklyStats.consecutiveDays}</div>
                  <div className="text-sm text-muted-foreground">연속 접속일</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <Navbar />
          
          <div className="overflow-y-auto h-[calc(100vh-4rem)]">
            <div className="container mx-auto px-6 py-8">
              {/* Page Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <Gamepad2 className="w-8 h-8 text-primary floating-3d" />
                  <h1 className="text-3xl font-bold hero-title">이원경의 개발자 여정 💜</h1>
                </div>
                <p className="text-muted-foreground">
                  오늘의 미션을 완료하고 이번 주 성과를 확인해보세요! ✨
                </p>
              </div>

              {/* Main Content */}
              <MainContent />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default GamePage;