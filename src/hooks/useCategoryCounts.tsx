import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CategoryCount {
  category: string;
  count: number;
}

export function useCategoryCounts() {
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategoryCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('category')
        .eq('status', 'published');

      if (error) throw error;

      // Count posts by category
      const counts: { [key: string]: number } = {};
      data?.forEach(post => {
        counts[post.category] = (counts[post.category] || 0) + 1;
      });

      const categoryCountsArray = Object.entries(counts).map(([category, count]) => ({
        category,
        count
      }));

      setCategoryCounts(categoryCountsArray);
    } catch (error) {
      console.error('Error fetching category counts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryCounts();
  }, []);

  const getCountForCategory = (category: string): number => {
    const found = categoryCounts.find(c => c.category === category);
    return found ? found.count : 0;
  };

  return {
    categoryCounts,
    loading,
    getCountForCategory,
    refetch: fetchCategoryCounts
  };
}