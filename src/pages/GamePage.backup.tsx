import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExperienceWidget } from '@/components/ExperienceWidget';
import { AvatarCustomizer } from '@/components/AvatarCustomizer';
import { RoomCustomizer } from '@/components/RoomCustomizer';
import { RoomCustomizer3D } from '@/components/RoomCustomizer3D';
import { AchievementGallery } from '@/components/AchievementGallery';
import { Avatar3D } from '@/components/Avatar3D';
import { FluidNotifications } from '@/components/FluidNotifications';
import { useAuth } from '@/hooks/useAuth';
import { useExperience } from '@/hooks/useExperience';
import { useAvatar } from '@/hooks/useAvatar';
import { useRoom } from '@/hooks/useRoom';
import { useAchievements } from '@/hooks/useAchievements';
import { useGameFluid } from '@/hooks/useGameFluid';
import { useNavigate } from 'react-router-dom';
import { 
  Gamepad2, 
  User, 
  Home, 
  Trophy, 
  Settings, 
  Star,
  Zap,
  Gift,
  TrendingUp,
  Calendar,
  Target,
  Coins,
  Users,
  MessageSquare,
  ShoppingBag,
  Eye
} from 'lucide-react';
import anime from 'animejs';

const GamePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { experience } = useExperience();
  const { avatar } = useAvatar();
  const { room } = useRoom();
  const { completedAchievements, checkAchievements } = useAchievements();
  const {
    gameState,
    notifications,
    isLevelingUp,
    triggerAvatarMoodChange,
    triggerRoomThemeChange,
    syncAllSystems,
    removeNotification
  } = useGameFluid();
  const [activeTab, setActiveTab] = useState('overview');
  const [showWelcome, setShowWelcome] = useState(false);
  const [dailyCredits, setDailyCredits] = useState(5); // InfoMansion-inspired credit system
  const [totalCredits, setTotalCredits] = useState(120);
  const [visitedRooms, setVisitedRooms] = useState(0);
  const [guestMessages, setGuestMessages] = useState(3);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    // Check for new achievements
    checkAchievements();

    // Show welcome animation for new users
    if (experience?.current_level === 1 && experience?.total_xp === 0) {
      setShowWelcome(true);
      // Welcome animation
      setTimeout(() => {
        anime({
          targets: '.welcome-card',
          scale: [0.8, 1],
          opacity: [0, 1],
          duration: 800,
          easing: 'easeOutElastic(1, .6)'
        });
      }, 300);
    }
  }, [user, navigate, experience, checkAchievements]);

  // Enhanced tab switching with fluid connections
  const handleTabSwitch = (newTab: string) => {
    setActiveTab(newTab);
    
    // Trigger mood changes based on tab
    switch (newTab) {
      case 'avatar':
        triggerAvatarMoodChange('creative');
        break;
      case 'room':
        triggerRoomThemeChange(room?.room_theme || 'cozy_dev');
        break;
      case 'achievements':
        triggerAvatarMoodChange('happy');
        break;
      case 'overview':
        syncAllSystems();
        break;
    }
  };

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

  const OverviewTab = () => {
    const weeklyStats = getWeeklyStats();
    const dailyQuests = getDailyQuests();

    return (
      <div className="space-y-6">
        {/* Welcome Card for New Users */}
        {showWelcome && (
          <Card className="welcome-card bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white border-0 bondee-card floating-3d">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-4xl mb-3 sparkle-effect">🎮✨</div>
                <h2 className="text-2xl font-bold mb-2">이원경님의 개발자 여정에 오신 걸 환영해요!</h2>
                <p className="opacity-90 mb-4">
                  포스트를 작성하고, 커뮤니티와 소통하며, 당신의 캐릭터를 성장시켜보세요! 💜
                </p>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowWelcome(false)}
                  className="bg-white text-purple-600 hover:bg-gray-100 bondee-card"
                >
                  시작하기! 🚀
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Row - Main Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Experience Widget */}
          <div className="lg:col-span-1">
            <ExperienceWidget showDetailed />
          </div>
          
          {/* Character & Room Preview */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Avatar Preview */}
            <Card className="bondee-card room-3d sparkle-effect">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-400" />
                  내 캐릭터 💜
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <Avatar3D 
                      size="xl" 
                      animated={true} 
                      onClick={() => setActiveTab('avatar')}
                      className="cursor-pointer transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-lg">{avatar?.character_name || '이원경'}</div>
                    <Badge variant="outline" className="mt-1 border-purple-300 text-purple-300">
                      {avatar?.avatar_style || 'Casual'} Style
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveTab('avatar')}
                    className="bondee-card border-purple-300 hover:bg-purple-100 hover:border-purple-400"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    커스터마이즈
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Room Preview */}
            <Card className="bondee-card room-3d sparkle-effect">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-pink-400" />
                  내 공간 🏠
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="w-full h-32 bg-gradient-to-br from-purple-200 via-pink-200 to-purple-300 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="text-4xl floating-3d">🏠</div>
                    <div className="absolute top-2 right-2 iu-heart">💜</div>
                    <div className="absolute bottom-2 left-2 text-sm animate-bounce">✨</div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-xl"></div>
                  </div>
                  <div>
                    <div className="font-medium">{room?.room_theme?.replace('_', ' ') || 'Cozy Dev'}</div>
                    <Badge variant="outline" className="mt-1 border-pink-300 text-pink-300">
                      <Star className="w-3 h-3 mr-1" />
                      Level {room?.room_level || 1}
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveTab('room')}
                    className="bondee-card border-pink-300 hover:bg-pink-100 hover:border-pink-400"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    꾸미기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Second Row - Daily Quests & Weekly Stats */}
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

        {/* Third Row - Recent Achievements */}
        <AchievementGallery compact />
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
                  <Gamepad2 className={`w-8 h-8 text-primary floating-3d ${isLevelingUp ? 'animate-bounce-3d' : ''}`} />
                  <h1 className="text-3xl font-bold hero-title">이원경의 개발자 여정 💜</h1>
                  {isLevelingUp && (
                    <div className="sparkle-effect text-2xl animate-pulse">✨</div>
                  )}
                </div>
                <p className="text-muted-foreground">
                  성장하는 과정을 추적하고, 캐릭터를 커스터마이즈하며, 달성 배지를 해금하며 성장해보세요! ✨
                </p>
              </div>

              {/* Main Content Tabs */}
              <Tabs value={activeTab} onValueChange={handleTabSwitch}>
                <TabsList className="grid w-full grid-cols-6 lg:w-[720px] bondee-card">
                  <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
                    <TrendingUp className="w-4 h-4" />
                    개요
                  </TabsTrigger>
                  <TabsTrigger value="avatar" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
                    <User className="w-4 h-4" />
                    아바타
                  </TabsTrigger>
                  <TabsTrigger value="room" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
                    <Home className="w-4 h-4" />
                    룸
                  </TabsTrigger>
                  <TabsTrigger value="shop" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
                    <ShoppingBag className="w-4 h-4" />
                    상점
                  </TabsTrigger>
                  <TabsTrigger value="social" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
                    <Users className="w-4 h-4" />
                    소셜
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">
                    <Trophy className="w-4 h-4" />
                    달성
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <OverviewTab />
                </TabsContent>

                <TabsContent value="avatar" className="mt-6">
                  <AvatarCustomizer />
                </TabsContent>

                <TabsContent value="room" className="mt-6">
                  <RoomCustomizer3D />
                </TabsContent>

                <TabsContent value="achievements" className="mt-6">
                  <AchievementGallery />
                </TabsContent>

                <TabsContent value="shop" className="mt-6">
                  <Card className="bondee-card sparkle-effect">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-orange-400" />
                        가구 상점 🛒
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Credit Status */}
                        <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                          <div>
                            <div className="font-medium">보유 크레딧</div>
                            <div className="text-sm text-muted-foreground">가구 구매에 사용하세요</div>
                          </div>
                          <div className="text-2xl font-bold text-yellow-600">{totalCredits}</div>
                        </div>
                        
                        {/* Furniture Categories */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { name: '책상', icon: '🖥️', price: 50, category: 'furniture' },
                            { name: '의자', icon: '🪑', price: 30, category: 'furniture' },
                            { name: '조명', icon: '💡', price: 25, category: 'lighting' },
                            { name: '식물', icon: '🪴', price: 20, category: 'decoration' },
                            { name: 'IU 포스터', icon: '🖼️', price: 40, category: 'special' },
                            { name: '커피머신', icon: '☕', price: 60, category: 'appliance' },
                            { name: '책장', icon: '📚', price: 45, category: 'furniture' },
                            { name: '러그', icon: '🗂️', price: 35, category: 'decoration' }
                          ].map((item, index) => (
                            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                              <CardContent className="p-4 text-center">
                                <div className="text-3xl mb-2">{item.icon}</div>
                                <div className="font-medium text-sm">{item.name}</div>
                                <div className="text-xs text-muted-foreground mb-2">{item.category}</div>
                                <Button size="sm" variant="outline" className="w-full">
                                  {item.price} 크레딧
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="social" className="mt-6">
                  <Card className="bondee-card sparkle-effect">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-400" />
                        소셜 & 방명록 👥
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Room Visitor Stats */}
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">12</div>
                            <div className="text-sm text-muted-foreground">방문자</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{guestMessages}</div>
                            <div className="text-sm text-muted-foreground">방명록</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">8</div>
                            <div className="text-sm text-muted-foreground">팔로워</div>
                          </div>
                        </div>
                        
                        {/* Guest Messages */}
                        <div>
                          <h4 className="font-medium mb-3">최근 방명록 💌</h4>
                          <div className="space-y-3">
                            {[
                              { name: '김개발', message: 'ComfyUI 팁 정말 유용해요! 감사합니다 🙏', time: '2시간 전' },
                              { name: '박프롬프트', message: '이원경님의 AI 이미지 작품 너무 멋져요 ✨', time: '5시간 전' },
                              { name: '이코딩', message: '룸 인테리어 센스가 대박이네요! 💜', time: '1일 전' }
                            ].map((msg, index) => (
                              <div key={index} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="font-medium text-sm">{msg.name}</div>
                                  <div className="text-xs text-muted-foreground">{msg.time}</div>
                                </div>
                                <div className="text-sm text-muted-foreground">{msg.message}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Explore Other Rooms */}
                        <div>
                          <h4 className="font-medium mb-3">다른 개발자 공간 탐색 🔍</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { name: '김AI', room: 'ML 연구실', visitors: 45 },
                              { name: '박풀스택', room: '미니멀 오피스', visitors: 32 },
                              { name: '이프론트', room: '코지 카페', visitors: 28 },
                              { name: '최백엔드', room: '서버룸', visitors: 23 }
                            ].map((room, index) => (
                              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardContent className="p-3">
                                  <div className="font-medium text-sm">{room.name}</div>
                                  <div className="text-xs text-muted-foreground">{room.room}</div>
                                  <div className="text-xs text-blue-600 mt-1">{room.visitors} 방문자</div>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="w-full mt-2"
                                    onClick={() => setVisitedRooms(prev => prev + 1)}
                                  >
                                    방문하기
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
        
        {/* Fluid Notifications */}
        <FluidNotifications 
          notifications={notifications}
          onRemove={removeNotification}
        />
      </div>
    </SidebarProvider>
  );
};

export default GamePage;