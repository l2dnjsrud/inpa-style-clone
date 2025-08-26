import { useState, useEffect } from 'react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useExperience } from '@/hooks/useExperience';
import { useAchievements } from '@/hooks/useAchievements';
import { Trophy, Star, Zap, TrendingUp, BookOpen, Heart, Calendar, Brain } from 'lucide-react';
import anime from 'animejs';

interface ExperienceWidgetProps {
  compact?: boolean;
  showDetailed?: boolean;
}

export const ExperienceWidget = React.memo(function ExperienceWidget({ compact = false, showDetailed = false }: ExperienceWidgetProps) {
  const { experience, loading, levelProgress, nextLevelXp } = useExperience();
  const { completedAchievements } = useAchievements();
  const [showXpAnimation, setShowXpAnimation] = useState(false);

  useEffect(() => {
    // Animate progress bar when component mounts
    if (experience && !loading) {
      anime({
        targets: '.xp-progress',
        value: [0, levelProgress],
        duration: 1500,
        easing: 'easeOutCubic',
        round: 1
      });
    }
  }, [experience, loading, levelProgress]);

  const triggerXpAnimation = () => {
    setShowXpAnimation(true);
    
    // Create floating +XP animation
    anime({
      targets: '.xp-float',
      translateY: [-20, -60],
      opacity: [1, 0],
      duration: 2000,
      easing: 'easeOutCubic',
      complete: () => setShowXpAnimation(false)
    });
  };

  if (loading) {
    return (
      <Card className={compact ? "h-24" : ""}>
        <CardContent className={compact ? "p-3" : "p-6"}>
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!experience) {
    return null;
  }

  const getLevelIcon = (level: number) => {
    if (level >= 50) return '👑';
    if (level >= 25) return '⭐';
    if (level >= 10) return '🔥';
    if (level >= 5) return '💎';
    return '🌱';
  };

  const getLevelTitle = (level: number) => {
    if (level >= 50) return 'Master Developer';
    if (level >= 25) return 'Senior Developer';
    if (level >= 10) return 'Experienced Developer';
    if (level >= 5) return 'Junior Developer';
    return 'Aspiring Developer';
  };

  if (compact) {
    return (
      <Card className="h-24 relative overflow-hidden">
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-2xl">{getLevelIcon(experience.current_level || 1)}</div>
              <div>
                <div className="font-bold text-lg">Level {experience.current_level || 1}</div>
                <div className="text-xs text-muted-foreground">{experience.total_xp || 0} XP</div>
              </div>
            </div>
            <div className="flex-1 mx-4">
              <Progress 
                value={levelProgress} 
                className="h-2 xp-progress"
              />
              <div className="text-xs text-center mt-1 text-muted-foreground">
                {Math.round(levelProgress)}% to next level
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {completedAchievements.length} 🏆
            </Badge>
          </div>
          
          {/* XP Float Animation */}
          {showXpAnimation && (
            <div className="absolute top-2 right-2 xp-float text-green-500 font-bold">
              +25 XP
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Display */}
        <div className="text-center">
          <div className="text-6xl mb-2">{getLevelIcon(experience.current_level || 1)}</div>
          <div className="text-2xl font-bold">Level {experience.current_level || 1}</div>
          <div className="text-muted-foreground">{getLevelTitle(experience.current_level || 1)}</div>
          <Badge variant="outline" className="mt-2">
            {experience.total_xp || 0} Total XP
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {(experience.current_level || 1) + 1}</span>
            <span>{Math.round(levelProgress)}%</span>
          </div>
          <Progress 
            value={levelProgress} 
            className="h-3 xp-progress"
          />
          <div className="text-xs text-center text-muted-foreground">
            {experience.xp_to_next_level || 0} XP needed for next level
          </div>
        </div>

        {/* XP Breakdown */}
        {showDetailed && (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <BookOpen className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-sm font-medium">Writing</div>
              <div className="text-lg font-bold text-blue-600">{experience.writing_xp || 0}</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <Heart className="w-6 h-6 mx-auto mb-2 text-red-600" />
              <div className="text-sm font-medium">Engagement</div>
              <div className="text-lg font-bold text-red-600">{experience.engagement_xp || 0}</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <div className="text-sm font-medium">Consistency</div>
              <div className="text-lg font-bold text-green-600">{experience.consistency_xp || 0}</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Brain className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <div className="text-sm font-medium">Learning</div>
              <div className="text-lg font-bold text-purple-600">{experience.learning_xp || 0}</div>
            </div>
          </div>
        )}

        {/* Recent Achievements */}
        {completedAchievements.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Recent Achievements
            </h4>
            <div className="space-y-2">
              {completedAchievements.slice(0, 3).map((userAchievement) => (
                <div key={userAchievement.id} className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                  <span className="text-xl">{userAchievement.achievement.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{userAchievement.achievement.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {userAchievement.achievement.description}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {userAchievement.achievement.rarity}
                  </Badge>
                </div>
              ))}
              {completedAchievements.length > 3 && (
                <div className="text-center">
                  <Button variant="ghost" size="sm">
                    View All {completedAchievements.length} Achievements
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Test XP Button (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <Button onClick={triggerXpAnimation} variant="outline" size="sm" className="w-full">
            <Zap className="w-4 h-4 mr-2" />
            Test XP Animation
          </Button>
        )}

        {/* XP Float Animation */}
        {showXpAnimation && (
          <div className="absolute top-4 right-4 xp-float text-green-500 font-bold text-lg">
            +25 XP ✨
          </div>
        )}
      </CardContent>
    </Card>
  );
});