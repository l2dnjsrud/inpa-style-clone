import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserRoom {
  id: string;
  user_id: string;
  room_theme: string;
  background_color: string;
  furniture: any[];
  decorations: any[];
  mood_lighting: string;
  custom_elements: any;
  room_level: number;
  created_at: string;
  updated_at: string;
}

interface RoomState {
  room: UserRoom | null;
  loading: boolean;
  updateRoom: (updates: Partial<UserRoom>) => Promise<boolean>;
  addFurniture: (furniture: any) => Promise<boolean>;
  removeFurniture: (furnitureId: string) => Promise<boolean>;
  addDecoration: (decoration: any) => Promise<boolean>;
  removeDecoration: (decorationId: string) => Promise<boolean>;
  changeTheme: (theme: string) => Promise<boolean>;
}

export function useRoom(): RoomState {
  const [room, setRoom] = useState<UserRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setRoom(null);
      setLoading(false);
      return;
    }

    loadRoom();
  }, [user]);

  const loadRoom = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_rooms')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading room:', error);
        return;
      }

      if (data) {
        setRoom(data);
      }
    } catch (error) {
      console.error('Error loading room:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRoom = async (updates: Partial<UserRoom>): Promise<boolean> => {
    if (!user || !room) return false;

    try {
      const { data, error } = await supabase
        .from('user_rooms')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating room:', error);
        return false;
      }

      if (data) {
        setRoom(data);
        return true;
      }
    } catch (error) {
      console.error('Error updating room:', error);
    }

    return false;
  };

  const addFurniture = async (furniture: any): Promise<boolean> => {
    if (!room) return false;

    const newFurniture = [...(room.furniture || []), furniture];
    return await updateRoom({ furniture: newFurniture });
  };

  const removeFurniture = async (furnitureId: string): Promise<boolean> => {
    if (!room) return false;

    const newFurniture = (room.furniture || []).filter(
      (item: any) => item.id !== furnitureId
    );
    return await updateRoom({ furniture: newFurniture });
  };

  const addDecoration = async (decoration: any): Promise<boolean> => {
    if (!room) return false;

    const newDecorations = [...(room.decorations || []), decoration];
    return await updateRoom({ decorations: newDecorations });
  };

  const removeDecoration = async (decorationId: string): Promise<boolean> => {
    if (!room) return false;

    const newDecorations = (room.decorations || []).filter(
      (item: any) => item.id !== decorationId
    );
    return await updateRoom({ decorations: newDecorations });
  };

  const changeTheme = async (theme: string): Promise<boolean> => {
    return await updateRoom({ room_theme: theme });
  };

  return {
    room,
    loading,
    updateRoom,
    addFurniture,
    removeFurniture,
    addDecoration,
    removeDecoration,
    changeTheme
  };
}

// Room themes and configurations
export const ROOM_THEMES = {
  cozy_dev: {
    name: 'Cozy Developer',
    description: 'Warm and comfortable coding space',
    defaultBackground: '#F7FAFC',
    moodLighting: 'warm',
    defaultFurniture: ['desk', 'chair', 'monitor']
  },
  modern_office: {
    name: 'Modern Office',
    description: 'Clean and professional workspace',
    defaultBackground: '#FFFFFF',
    moodLighting: 'bright',
    defaultFurniture: ['standing_desk', 'ergonomic_chair', 'dual_monitors']
  },
  retro_game: {
    name: 'Retro Gaming',
    description: 'Nostalgic gaming and coding setup',
    defaultBackground: '#2D3748',
    moodLighting: 'neon',
    defaultFurniture: ['retro_desk', 'gaming_chair', 'crt_monitor']
  },
  minimalist: {
    name: 'Minimalist',
    description: 'Simple and distraction-free environment',
    defaultBackground: '#F8F9FA',
    moodLighting: 'natural',
    defaultFurniture: ['simple_desk', 'minimal_chair', 'laptop']
  },
  creative_studio: {
    name: 'Creative Studio',
    description: 'Inspiring artistic workspace',
    defaultBackground: '#FFF5F5',
    moodLighting: 'artistic',
    defaultFurniture: ['artist_desk', 'creative_chair', 'drawing_tablet']
  },
  night_owl: {
    name: 'Night Owl',
    description: 'Perfect for late-night coding sessions',
    defaultBackground: '#1A202C',
    moodLighting: 'dim',
    defaultFurniture: ['dark_desk', 'comfortable_chair', 'monitor_with_bias_lighting']
  }
};

export const MOOD_LIGHTING = {
  warm: {
    name: 'Warm Glow',
    color: '#FFA726',
    intensity: 'medium'
  },
  bright: {
    name: 'Bright White',
    color: '#FFFFFF',
    intensity: 'high'
  },
  neon: {
    name: 'Neon RGB',
    color: 'rainbow',
    intensity: 'high'
  },
  natural: {
    name: 'Natural Light',
    color: '#FFE082',
    intensity: 'medium'
  },
  artistic: {
    name: 'Artistic Ambience',
    color: '#CE93D8',
    intensity: 'medium'
  },
  dim: {
    name: 'Dim Focus',
    color: '#90A4AE',
    intensity: 'low'
  }
};