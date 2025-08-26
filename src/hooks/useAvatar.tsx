import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserAvatar {
  id: string;
  user_id: string;
  character_name: string;
  avatar_style: string;
  hair_style: string;
  hair_color: string;
  skin_tone: string;
  clothing: string;
  clothing_color: string;
  accessories: any[];
  created_at: string;
  updated_at: string;
}

interface AvatarState {
  avatar: UserAvatar | null;
  loading: boolean;
  updateAvatar: (updates: Partial<UserAvatar>) => Promise<boolean>;
  addAccessory: (accessory: any) => Promise<boolean>;
  removeAccessory: (accessoryId: string) => Promise<boolean>;
}

export function useAvatar(): AvatarState {
  const [avatar, setAvatar] = useState<UserAvatar | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setAvatar(null);
      setLoading(false);
      return;
    }

    loadAvatar();
  }, [user]);

  const loadAvatar = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_avatars')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading avatar:', error);
        return;
      }

      if (data) {
        setAvatar(data);
      }
    } catch (error) {
      console.error('Error loading avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAvatar = async (updates: Partial<UserAvatar>): Promise<boolean> => {
    if (!user || !avatar) return false;

    try {
      const { data, error } = await supabase
        .from('user_avatars')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating avatar:', error);
        return false;
      }

      if (data) {
        setAvatar(data);
        return true;
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
    }

    return false;
  };

  const addAccessory = async (accessory: any): Promise<boolean> => {
    if (!avatar) return false;

    const newAccessories = [...(avatar.accessories || []), accessory];
    return await updateAvatar({ accessories: newAccessories });
  };

  const removeAccessory = async (accessoryId: string): Promise<boolean> => {
    if (!avatar) return false;

    const newAccessories = (avatar.accessories || []).filter(
      (acc: any) => acc.id !== accessoryId
    );
    return await updateAvatar({ accessories: newAccessories });
  };

  return {
    avatar,
    loading,
    updateAvatar,
    addAccessory,
    removeAccessory
  };
}

// Default avatar configurations
export const AVATAR_STYLES = {
  casual: {
    name: 'Casual Developer',
    description: 'Relaxed and comfortable coding style'
  },
  formal: {
    name: 'Professional',
    description: 'Business-ready developer look'
  },
  quirky: {
    name: 'Creative Coder',
    description: 'Express your unique personality'
  },
  retro: {
    name: 'Retro Programmer',
    description: 'Old-school computing vibes'
  }
};

export const HAIR_STYLES = {
  default: 'Classic',
  short: 'Short & Clean',
  long: 'Long & Flowing',
  curly: 'Curly',
  pixie: 'Pixie Cut',
  ponytail: 'Ponytail',
  messy: 'Messy Coder',
  bald: 'Bald & Proud'
};

export const CLOTHING_OPTIONS = {
  hoodie: 'Cozy Hoodie',
  tshirt: 'Classic T-Shirt',
  blazer: 'Professional Blazer',
  sweater: 'Warm Sweater',
  polo: 'Polo Shirt',
  dress_shirt: 'Dress Shirt',
  tank_top: 'Tank Top',
  cardigan: 'Cardigan'
};

export const COLOR_PALETTE = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85929E', '#A569BD'
];