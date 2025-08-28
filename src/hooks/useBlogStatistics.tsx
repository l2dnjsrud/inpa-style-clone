import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BlogStatistics {
  totalVisitors: number;
  totalPosts: number;
  blogOperationDays: number;
  blogStartedDate: string;
}

export function useBlogStatistics() {
  const [statistics, setStatistics] = useState<BlogStatistics>({
    totalVisitors: 0,
    totalPosts: 0,
    blogOperationDays: 0,
    blogStartedDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Blog start date - set to today to start counting from 0 days
  const BLOG_START_DATE = new Date().toISOString().split('T')[0];

  // Generate or get session ID for visitor tracking
  const getSessionId = (): string => {
    let sessionId = localStorage.getItem('blog-session-id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('blog-session-id', sessionId);
      // Track this as a new visitor
      const currentVisitors = parseInt(localStorage.getItem('blog-total-visitors') || '0', 10);
      localStorage.setItem('blog-total-visitors', (currentVisitors + 1).toString());
    }
    return sessionId;
  };

  // Track visitor session
  const trackVisitor = async () => {
    try {
      getSessionId(); // This will automatically track new visitors
    } catch (error) {
      console.warn('Error tracking visitor:', error);
    }
  };

  // Calculate blog operation days
  const calculateOperationDays = (startDate: string): number => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays); // Start from 0 days
  };

  // Fetch blog statistics
  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get published posts count
      const { count: postsCount, error: postsError } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      if (postsError) {
        console.warn('Error fetching posts count:', postsError);
      }

      // Get visitor count from localStorage
      const visitorCount = parseInt(localStorage.getItem('blog-total-visitors') || '0', 10);

      setStatistics({
        totalVisitors: visitorCount,
        totalPosts: postsCount || 0,
        blogOperationDays: calculateOperationDays(BLOG_START_DATE),
        blogStartedDate: BLOG_START_DATE
      });
    } catch (err) {
      console.error('Error fetching blog statistics:', err);
      setError('블로그 통계를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Reset all blog statistics
  const resetAllStatistics = async (): Promise<boolean> => {
    try {
      // Clear localStorage visitor data
      localStorage.removeItem('blog-session-id');
      localStorage.setItem('blog-total-visitors', '0');
      
      // Reset post views and likes to 0
      const { error: updateError } = await supabase
        .from('posts')
        .update({ views: 0, likes: 0 })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all posts

      if (updateError) {
        console.warn('Error resetting post stats:', updateError);
      }
      
      // Refresh statistics
      await fetchStatistics();
      
      return true;
    } catch (error) {
      console.error('Error resetting blog statistics:', error);
      setError('통계 초기화에 실패했습니다.');
      return false;
    }
  };

  // Set up subscription for posts changes to update post count
  useEffect(() => {
    // Initial fetch
    fetchStatistics();

    // Track this visitor
    trackVisitor();

    // Set up real-time subscription for posts changes
    const subscription = supabase
      .channel('posts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        () => {
          // Refresh statistics when posts change
          fetchStatistics();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Track visitor on page visibility change (when user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        trackVisitor();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    statistics,
    loading,
    error,
    resetAllStatistics,
    refreshStatistics: fetchStatistics,
    trackVisitor
  };
}