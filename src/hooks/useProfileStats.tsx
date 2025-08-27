import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ProfileStats {
  totalPosts: number;
  totalViews: number;
  totalLikes: number;
  followers: number;
  joinedDate: string;
  consecutiveDays: number;
  categories: string[];
  topPost: string;
  recentActivity: ActivityItem[];
  achievements: Achievement[];
  languageStats: LanguageStat[];
}

interface ActivityItem {
  id: string;
  action: string;
  title: string;
  time: string;
  type: 'post' | 'comment' | 'edit' | 'category';
}

interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
}

interface LanguageStat {
  name: string;
  percentage: number;
  color: string;
  postCount: number;
}

export function useProfileStats() {
  const { user } = useAuth();
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    followers: 0,
    joinedDate: '2024년 1월',
    consecutiveDays: 0,
    categories: [],
    topPost: '',
    recentActivity: [],
    achievements: [],
    languageStats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate profile statistics
  const calculateStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch total posts
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'published');

      if (postsError) throw postsError;

      // Fetch categories with post counts
      const { data: categories, error: categoriesError } = await supabase
        .from('posts')
        .select('category')
        .eq('user_id', user.id)
        .eq('status', 'published');

      if (categoriesError) throw categoriesError;

      // Calculate category distribution
      const categoryStats = categories.reduce((acc: Record<string, number>, post) => {
        if (post.category) {
          acc[post.category] = (acc[post.category] || 0) + 1;
        }
        return acc;
      }, {});

      // Get user profile creation date
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('created_at')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.warn('Profile not found:', profileError);
      }

      // Calculate consecutive days (simplified - you might want to implement more sophisticated logic)
      const today = new Date();
      const recentPosts = posts?.filter(post => {
        const postDate = new Date(post.created_at);
        const diffDays = Math.floor((today.getTime() - postDate.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 30; // Posts in last 30 days
      }) || [];

      // Generate language stats based on categories
      const languageStats: LanguageStat[] = [
        {
          name: 'ComfyUI/AI',
          percentage: Math.round(((categoryStats['comfyui'] || 0) + (categoryStats['ai-image'] || 0)) / (posts?.length || 1) * 100),
          color: '#f97316',
          postCount: (categoryStats['comfyui'] || 0) + (categoryStats['ai-image'] || 0)
        },
        {
          name: 'Prompt Engineering',
          percentage: Math.round((categoryStats['prompt-engineering'] || 0) / (posts?.length || 1) * 100),
          color: '#8b5cf6',
          postCount: categoryStats['prompt-engineering'] || 0
        },
        {
          name: 'Python',
          percentage: Math.round((categoryStats['python-vibe'] || 0) / (posts?.length || 1) * 100),
          color: '#3776ab',
          postCount: categoryStats['python-vibe'] || 0
        },
        {
          name: '일상 & 여행',
          percentage: Math.round((categoryStats['travel-cafe'] || 0) / (posts?.length || 1) * 100),
          color: '#06b6d4',
          postCount: categoryStats['travel-cafe'] || 0
        }
      ].filter(stat => stat.postCount > 0);

      // Generate recent activity
      const recentActivity: ActivityItem[] = posts?.slice(0, 4).map((post, index) => ({
        id: post.id,
        action: index === 0 ? '새 포스트 발행' : '포스트 수정',
        title: post.title,
        time: formatTimeAgo(post.created_at),
        type: 'post' as const
      })) || [];

      // Define achievements
      const achievements: Achievement[] = [
        {
          id: 'first_post',
          title: '첫 포스트',
          icon: '🎉',
          description: '첫 번째 블로그 포스트 작성',
          earned: (posts?.length || 0) >= 1
        },
        {
          id: 'comfyui_master',
          title: 'ComfyUI 마스터',
          icon: '🎨',
          description: 'ComfyUI 관련 5개 포스트 작성',
          earned: (categoryStats['comfyui'] || 0) >= 5
        },
        {
          id: 'popular_writer',
          title: '인기 작가',
          icon: '⭐',
          description: '포스트 10개 이상 작성',
          earned: (posts?.length || 0) >= 10
        },
        {
          id: 'consistent_writer',
          title: '꾸준한 작가',
          icon: '📅',
          description: '5개 이상의 포스트 작성',
          earned: (posts?.length || 0) >= 5
        },
        {
          id: 'ai_expert',
          title: 'AI 전문가',
          icon: '🤖',
          description: 'AI 관련 3개 포스트 작성',
          earned: ((categoryStats['ai-image'] || 0) + (categoryStats['prompt-engineering'] || 0)) >= 3
        },
        {
          id: 'diverse_writer',
          title: '다양한 작가',
          icon: '🌈',
          description: '3개 이상의 카테고리에 포스트 작성',
          earned: Object.keys(categoryStats).length >= 3
        }
      ];

      setProfileStats({
        totalPosts: posts?.length || 0,
        totalViews: (posts?.reduce((sum, post) => sum + (post.views || 0), 0) || 0),
        totalLikes: (posts?.reduce((sum, post) => sum + (post.likes || 0), 0) || 0),
        followers: Math.floor(Math.random() * 50) + 10, // Simulated for now
        joinedDate: profile?.created_at ? 
          new Date(profile.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' }) : 
          '2024년 1월',
        consecutiveDays: Math.min(recentPosts.length, 30),
        categories: Object.keys(categoryStats),
        topPost: posts?.[0]?.title || 'No posts yet',
        recentActivity,
        achievements,
        languageStats
      });
    } catch (err) {
      console.error('Error fetching profile stats:', err);
      setError('프로필 통계를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}분 전`;
    } else if (diffHours < 24) {
      return `${diffHours}시간 전`;
    } else {
      return `${diffDays}일 전`;
    }
  };

  useEffect(() => {
    if (user) {
      calculateStats();
    }
  }, [user]);

  const refreshStats = () => {
    calculateStats();
  };

  return {
    profileStats,
    loading,
    error,
    refreshStats
  };
}