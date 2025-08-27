import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAchievements, ACHIEVEMENT_CATEGORIES, ACHIEVEMENT_RARITIES } from '@/hooks/useAchievements';
import { Trophy, Lock, Star, CheckCircle, Target } from 'lucide-react';
import anime from 'animejs';

interface AchievementGalleryProps {
  compact?: boolean;
}

export function AchievementGallery({ compact = false }: AchievementGalleryProps) {
  const { 
    achievements, 
    userAchievements, 
    completedAchievements, 
    pendingAchievements, 
    loading 
  } = useAchievements();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const triggerUnlockAnimation = (achievementId: string) => {
    const element = document.querySelector(`[data-achievement="${achievementId}"]`);
    if (element) {
      anime({
        targets: element,
        scale: [1, 1.1, 1],
        rotate: [0, 5, -5, 0],
        duration: 800,
        easing: 'easeOutElastic(1, .6)'
      });
    }
  };

  const getProgressForAchievement = (achievementId: string) => {
    const userAchievement = userAchievements.find(ua => ua.achievement_id === achievementId);
    const achievement = achievements.find(a => a.id === achievementId);
    
    if (!userAchievement || !achievement) return 0;
    
    return Math.min(100, (userAchievement.progress / achievement.condition_value) * 100);
  };

  const isAchievementCompleted = (achievementId: string) => {
    return completedAchievements.some(ua => ua.achievement_id === achievementId);
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'completed') return isAchievementCompleted(achievement.id);
    if (selectedCategory === 'pending') return !isAchievementCompleted(achievement.id);
    return achievement.category === selectedCategory;
  });

  const AchievementCard = ({ achievement }: { achievement: any }) => {
    const isCompleted = isAchievementCompleted(achievement.id);
    const progress = getProgressForAchievement(achievement.id);
    const rarity = ACHIEVEMENT_RARITIES[achievement.rarity as keyof typeof ACHIEVEMENT_RARITIES] || ACHIEVEMENT_RARITIES.common;
    const userAchievement = userAchievements.find(ua => ua.achievement_id === achievement.id);

    return (
      <Card 
        className={`relative transition-all duration-300 hover:shadow-lg ${
          isCompleted ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'hover:border-primary/50'
        }`}
        data-achievement={achievement.id}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Achievement Icon */}
            <div className={`text-3xl ${isCompleted ? 'animate-pulse' : 'grayscale opacity-50'}`}>
              {achievement.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              {/* Achievement Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className={`font-medium text-sm ${isCompleted ? 'text-yellow-800' : ''}`}>
                    {achievement.name}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {achievement.description}
                  </p>
                </div>
                
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </div>
              
              {/* Progress Bar */}
              {!isCompleted && userAchievement && (
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{userAchievement.progress}/{achievement.condition_value}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              {/* Achievement Meta */}
              <div className="flex items-center gap-2 mt-2">
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ borderColor: rarity.borderColor, color: rarity.color }}
                >
                  {rarity.name}
                </Badge>
                
                <Badge variant="secondary" className="text-xs">
                  {ACHIEVEMENT_CATEGORIES[achievement.category as keyof typeof ACHIEVEMENT_CATEGORIES]?.icon || '🏆'} 
                  {ACHIEVEMENT_CATEGORIES[achievement.category as keyof typeof ACHIEVEMENT_CATEGORIES]?.name || achievement.category}
                </Badge>
                
                {isCompleted && userAchievement?.completed_at && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(userAchievement.completed_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              {/* Reward Preview */}
              {achievement.reward_type && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Reward: {achievement.reward_type.replace('_', ' ')}
                  {achievement.reward_data?.item && ` - ${achievement.reward_data.item}`}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading achievements...</div>
        </CardContent>
      </Card>
    );
  }

  const completionRate = achievements.length > 0 
    ? Math.round((completedAchievements.length / achievements.length) * 100)
    : 0;

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Achievements
            </span>
            <Badge variant="secondary">
              {completedAchievements.length}/{achievements.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Completion Rate</span>
                <span>{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            
            {/* Recent Achievements */}
            <div className="space-y-2">
              {completedAchievements.slice(0, 3).map((userAchievement) => (
                <div key={userAchievement.id} className="flex items-center gap-2 text-sm">
                  <span className="text-lg">{userAchievement.achievement.icon}</span>
                  <span className="font-medium">{userAchievement.achievement.name}</span>
                  <Badge variant="outline" className="text-xs ml-auto">
                    {userAchievement.achievement.rarity}
                  </Badge>
                </div>
              ))}
              
              {completedAchievements.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Start writing to unlock achievements!</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Achievement Gallery
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {completedAchievements.length}/{achievements.length}
            </Badge>
            <Badge variant="outline">
              {completionRate}% Complete
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{completionRate}%</span>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-4 lg:grid-cols-6 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">
                <CheckCircle className="w-4 h-4 mr-1" />
                Done
              </TabsTrigger>
              <TabsTrigger value="pending">
                <Target className="w-4 h-4 mr-1" />
                Pending
              </TabsTrigger>
              {Object.entries(ACHIEVEMENT_CATEGORIES).map(([key, category]) => (
                <TabsTrigger key={key} value={key} className="hidden lg:flex">
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-6">
              <ScrollArea className="h-96">
                <div className="grid gap-4">
                  {filteredAchievements.map((achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                  ))}
                  
                  {filteredAchievements.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No achievements in this category yet.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}