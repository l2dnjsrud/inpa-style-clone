import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  condition_type: string;
  condition_value: number;
  reward_type: string;
  reward_data: any;
  rarity: string;
  created_at: string;
}

interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  achievement: Achievement;
}

interface AchievementState {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  completedAchievements: UserAchievement[];
  pendingAchievements: UserAchievement[];
  loading: boolean;
  updateProgress: (achievementId: string, progress: number) => Promise<boolean>;
  completeAchievement: (achievementId: string) => Promise<boolean>;
  checkAchievements: () => Promise<void>;
}

export function useAchievements(): AchievementState {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadAchievements();
    if (user) {
      loadUserAchievements();
    }
  }, [user]);

  const loadAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('category, rarity, condition_value');

      if (error) {
        console.error('Error loading achievements:', error);
        return;
      }

      setAchievements(data || []);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const loadUserAchievements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user.id);

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user achievements:', error);
        return;
      }

      setUserAchievements(data || []);
    } catch (error) {
      console.error('Error loading user achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (achievementId: string, progress: number): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_achievements')
        .upsert({
          user_id: user.id,
          achievement_id: achievementId,
          progress: progress
        }, {
          onConflict: 'user_id,achievement_id'
        });

      if (error) {
        console.error('Error updating achievement progress:', error);
        return false;
      }

      // Reload user achievements
      await loadUserAchievements();
      return true;
    } catch (error) {
      console.error('Error updating achievement progress:', error);
      return false;
    }
  };

  const completeAchievement = async (achievementId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const achievement = achievements.find(a => a.id === achievementId);
      if (!achievement) return false;

      const { error } = await supabase
        .from('user_achievements')
        .upsert({
          user_id: user.id,
          achievement_id: achievementId,
          progress: achievement.condition_value,
          completed: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,achievement_id'
        });

      if (error) {
        console.error('Error completing achievement:', error);
        return false;
      }

      // Reload user achievements
      await loadUserAchievements();
      return true;
    } catch (error) {
      console.error('Error completing achievement:', error);
      return false;
    }
  };

  const checkAchievements = async () => {
    if (!user) return;

    try {
      // Get user stats for checking achievement conditions
      const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id);

      const { data: experience } = await supabase
        .from('user_experience')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!posts || !experience) return;

      const publishedPosts = posts.filter(p => p.status === 'published');
      const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
      const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
      const categories = new Set(posts.map(p => p.category));

      // Check each achievement
      for (const achievement of achievements) {
        const existingUserAchievement = userAchievements.find(
          ua => ua.achievement_id === achievement.id
        );

        if (existingUserAchievement?.completed) continue;

        let currentProgress = 0;
        let shouldComplete = false;

        switch (achievement.condition_type) {
          case 'posts_count':
            currentProgress = publishedPosts.length;
            shouldComplete = currentProgress >= achievement.condition_value;
            break;
          case 'total_likes':
            currentProgress = totalLikes;
            shouldComplete = currentProgress >= achievement.condition_value;
            break;
          case 'categories_used':
            currentProgress = categories.size;
            shouldComplete = currentProgress >= achievement.condition_value;
            break;
          case 'level_reached':
            currentProgress = experience.current_level || 1;
            shouldComplete = currentProgress >= achievement.condition_value;
            break;
          // Add more condition types as needed
        }

        if (shouldComplete) {
          await completeAchievement(achievement.id);
        } else if (currentProgress > 0) {
          await updateProgress(achievement.id, currentProgress);
        }
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  const completedAchievements = userAchievements.filter(ua => ua.completed);
  const pendingAchievements = userAchievements.filter(ua => !ua.completed);

  return {
    achievements,
    userAchievements,
    completedAchievements,
    pendingAchievements,
    loading,
    updateProgress,
    completeAchievement,
    checkAchievements
  };
}

// Achievement categories and rarities
export const ACHIEVEMENT_CATEGORIES = {
  writing: {
    name: 'Writing',
    icon: '✍️',
    color: '#3B82F6'
  },
  engagement: {
    name: 'Engagement',
    icon: '❤️',
    color: '#EF4444'
  },
  consistency: {
    name: 'Consistency',
    icon: '📅',
    color: '#10B981'
  },
  learning: {
    name: 'Learning',
    icon: '🧠',
    color: '#8B5CF6'
  },
  special: {
    name: 'Special',
    icon: '⭐',
    color: '#F59E0B'
  }
};

export const ACHIEVEMENT_RARITIES = {
  common: {
    name: 'Common',
    color: '#6B7280',
    borderColor: '#9CA3AF'
  },
  rare: {
    name: 'Rare',
    color: '#3B82F6',
    borderColor: '#60A5FA'
  },
  epic: {
    name: 'Epic',
    color: '#8B5CF6',
    borderColor: '#A78BFA'
  },
  legendary: {
    name: 'Legendary',
    color: '#F59E0B',
    borderColor: '#FBBF24'
  }
};