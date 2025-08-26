import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserExperience {
  id: string;
  user_id: string;
  total_xp: number;
  current_level: number;
  xp_to_next_level: number;
  writing_xp: number;
  engagement_xp: number;
  consistency_xp: number;
  learning_xp: number;
  created_at: string;
  updated_at: string;
}

interface ExperienceStats {
  experience: UserExperience | null;
  loading: boolean;
  levelProgress: number;
  nextLevelXp: number;
}

export function useExperience(): ExperienceStats {
  const [experience, setExperience] = useState<UserExperience | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setExperience(null);
      setLoading(false);
      return;
    }

    loadExperience();
  }, [user]);

  const loadExperience = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_experience')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading experience:', error);
        return;
      }

      if (data) {
        setExperience(data);
      }
    } catch (error) {
      console.error('Error loading experience:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate level progress percentage
  const levelProgress = experience ? 
    ((experience.total_xp - (experience.current_level - 1) ** 2 * 100) / 
     (experience.current_level ** 2 * 100 - (experience.current_level - 1) ** 2 * 100)) * 100 : 0;

  const nextLevelXp = experience ? experience.current_level ** 2 * 100 : 100;

  return {
    experience,
    loading,
    levelProgress: Math.max(0, Math.min(100, levelProgress)),
    nextLevelXp
  };
}

// Hook for awarding XP
export function useAwardXp() {
  const awardXp = async (
    userId: string,
    xpAmount: number,
    activityType: string,
    referenceId?: string
  ) => {
    try {
      const { error } = await supabase.rpc('award_xp', {
        user_id_param: userId,
        xp_amount: xpAmount,
        activity_type_param: activityType,
        reference_id_param: referenceId || null
      });

      if (error) {
        console.error('Error awarding XP:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error awarding XP:', error);
      return false;
    }
  };

  return { awardXp };
}