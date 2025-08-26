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
import { AchievementGallery } from '@/components/AchievementGallery';
import { useAuth } from '@/hooks/useAuth';
import { useExperience } from '@/hooks/useExperience';
import { useAvatar } from '@/hooks/useAvatar';
import { useRoom } from '@/hooks/useRoom';
import { useAchievements } from '@/hooks/useAchievements';
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
  Target
} from 'lucide-react';
import anime from 'animejs';

const GamePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { experience } = useExperience();
  const { avatar } = useAvatar();
  const { room } = useRoom();
  const { completedAchievements, checkAchievements } = useAchievements();
  const [activeTab, setActiveTab] = useState('overview');
  const [showWelcome, setShowWelcome] = useState(false);

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

  const getDailyQuests = () => [
    {
      id: 'daily_post',
      title: 'Write a Post',
      description: 'Share your thoughts with the community',
      reward: '50 XP',
      icon: '✍️',
      progress: 0,
      total: 1,
      completed: false
    },
    {
      id: 'daily_engagement',
      title: 'Engage with Community',
      description: 'Like or comment on 3 posts',
      reward: '25 XP',
      icon: '❤️',
      progress: 0,
      total: 3,
      completed: false
    },
    {
      id: 'daily_customize',
      title: 'Customize Your Space',
      description: 'Update your avatar or room',
      reward: '15 XP',
      icon: '🎨',
      progress: 0,
      total: 1,
      completed: false
    }
  ];

  const getWeeklyStats = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      postsThisWeek: 3,
      xpGained: 150,
      achievementsUnlocked: 1,
      consecutiveDays: 5
    };
  };

  const OverviewTab = () => {
    const weeklyStats = getWeeklyStats();
    const dailyQuests = getDailyQuests();

    return (
      <div className="space-y-6">
        {/* Welcome Card for New Users */}
        {showWelcome && (
          <Card className="welcome-card bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🎮</div>
                <h2 className="text-2xl font-bold mb-2">Welcome to Your Developer Journey!</h2>
                <p className="opacity-90 mb-4">
                  Start writing, engage with the community, and watch your character grow!
                </p>
                <Button 
                  variant="secondary" 
                  onClick={() => setShowWelcome(false)}
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  Let's Begin! 🚀
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
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Your Character
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-b from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-4xl">
                    👨‍💻
                  </div>
                  <div>
                    <div className="font-medium">{avatar?.character_name || 'Developer'}</div>
                    <Badge variant="outline" className="mt-1">
                      {avatar?.avatar_style || 'Casual'} Style
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveTab('avatar')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Room Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Your Room
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="w-full h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <div className="text-2xl">🏠</div>
                  </div>
                  <div>
                    <div className="font-medium">{room?.room_theme?.replace('_', ' ') || 'Cozy Dev'}</div>
                    <Badge variant="outline" className="mt-1">
                      <Star className="w-3 h-3 mr-1" />
                      Level {room?.room_level || 1}
                    </Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveTab('room')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Decorate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Second Row - Daily Quests & Weekly Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Quests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Daily Quests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dailyQuests.map((quest) => (
                  <div key={quest.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="text-xl">{quest.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{quest.title}</div>
                      <div className="text-xs text-muted-foreground">{quest.description}</div>
                      <div className="text-xs text-green-600 mt-1">+{quest.reward}</div>
                    </div>
                    <Badge variant={quest.completed ? "default" : "secondary"}>
                      {quest.progress}/{quest.total}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{weeklyStats.postsThisWeek}</div>
                  <div className="text-sm text-muted-foreground">Posts Written</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{weeklyStats.xpGained}</div>
                  <div className="text-sm text-muted-foreground">XP Gained</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{weeklyStats.achievementsUnlocked}</div>
                  <div className="text-sm text-muted-foreground">Achievements</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{weeklyStats.consecutiveDays}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
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
                  <Gamepad2 className="w-8 h-8 text-primary" />
                  <h1 className="text-3xl font-bold">Your Developer Journey</h1>
                </div>
                <p className="text-muted-foreground">
                  Track your progress, customize your character, and unlock achievements as you grow!
                </p>
              </div>

              {/* Main Content Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="avatar" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Avatar
                  </TabsTrigger>
                  <TabsTrigger value="room" className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Room
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Achievements
                  </TabsTrigger>
                  <TabsTrigger value="rewards" className="flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    Rewards
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <OverviewTab />
                </TabsContent>

                <TabsContent value="avatar" className="mt-6">
                  <AvatarCustomizer />
                </TabsContent>

                <TabsContent value="room" className="mt-6">
                  <RoomCustomizer />
                </TabsContent>

                <TabsContent value="achievements" className="mt-6">
                  <AchievementGallery />
                </TabsContent>

                <TabsContent value="rewards" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Gift className="w-5 h-5" />
                        Rewards & Inventory
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center text-muted-foreground py-8">
                        <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Inventory system coming soon!</p>
                        <p className="text-sm mt-1">
                          Collect items by completing achievements and leveling up.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default GamePage;