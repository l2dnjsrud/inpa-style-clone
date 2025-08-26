-- Gamification System Migration
-- This adds avatar, room, experience, and achievement systems to the blog

-- User Avatar & Character System
CREATE TABLE public.user_avatars (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  character_name text DEFAULT 'Developer',
  avatar_style text DEFAULT 'casual', -- casual, formal, quirky, etc.
  hair_style text DEFAULT 'default',
  hair_color text DEFAULT '#4A5568',
  skin_tone text DEFAULT '#F7FAFC',
  clothing text DEFAULT 'hoodie',
  clothing_color text DEFAULT '#3182CE',
  accessories jsonb DEFAULT '[]', -- glasses, hat, etc.
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User Room System (like Cyworld miniroom)
CREATE TABLE public.user_rooms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  room_theme text DEFAULT 'cozy_dev', -- cozy_dev, modern_office, retro_game, etc.
  background_color text DEFAULT '#F7FAFC',
  furniture jsonb DEFAULT '[]', -- array of furniture items with positions
  decorations jsonb DEFAULT '[]', -- wall art, plants, etc.
  mood_lighting text DEFAULT 'warm',
  custom_elements jsonb DEFAULT '{}', -- user's custom touches
  room_level integer DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Experience & Leveling System
CREATE TABLE public.user_experience (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp integer DEFAULT 0,
  current_level integer DEFAULT 1,
  xp_to_next_level integer DEFAULT 100,
  writing_xp integer DEFAULT 0, -- XP from writing posts
  engagement_xp integer DEFAULT 0, -- XP from likes, comments, views
  consistency_xp integer DEFAULT 0, -- XP from regular posting
  learning_xp integer DEFAULT 0, -- XP from reading others' posts
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Achievement System
CREATE TABLE public.achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  icon text DEFAULT '🏆',
  category text NOT NULL, -- writing, engagement, consistency, learning, special
  condition_type text NOT NULL, -- posts_count, total_likes, consecutive_days, etc.
  condition_value integer NOT NULL,
  reward_type text DEFAULT 'decoration', -- decoration, avatar_item, room_upgrade, etc.
  reward_data jsonb DEFAULT '{}',
  rarity text DEFAULT 'common', -- common, rare, epic, legendary
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User Achievement Progress
CREATE TABLE public.user_achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  progress integer DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Activity Log for XP tracking
CREATE TABLE public.user_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL, -- post_created, post_liked, post_viewed, etc.
  xp_gained integer DEFAULT 0,
  reference_id uuid, -- post_id, comment_id, etc.
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Collectible Items (furniture, decorations, avatar items)
CREATE TABLE public.collectible_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL, -- furniture, decoration, avatar_clothing, avatar_accessory
  item_type text NOT NULL, -- desk, chair, plant, shirt, glasses, etc.
  rarity text DEFAULT 'common',
  unlock_condition text, -- level_5, achievement_first_post, etc.
  visual_data jsonb NOT NULL, -- colors, style, positioning info
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User's Collected Items
CREATE TABLE public.user_inventory (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES public.collectible_items(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  acquired_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collectible_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies

-- User Avatars: Users can view all, but only edit their own
CREATE POLICY "Avatar viewable by everyone" ON public.user_avatars FOR SELECT USING (true);
CREATE POLICY "Users can update own avatar" ON public.user_avatars FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own avatar" ON public.user_avatars FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Rooms: Users can view all, but only edit their own
CREATE POLICY "Rooms viewable by everyone" ON public.user_rooms FOR SELECT USING (true);
CREATE POLICY "Users can update own room" ON public.user_rooms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own room" ON public.user_rooms FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Experience: Viewable by all, updatable by system
CREATE POLICY "Experience viewable by everyone" ON public.user_experience FOR SELECT USING (true);
CREATE POLICY "Users can update own experience" ON public.user_experience FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own experience" ON public.user_experience FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements: Everyone can view
CREATE POLICY "Achievements viewable by everyone" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Only admins can manage achievements" ON public.achievements FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update achievements" ON public.achievements FOR UPDATE USING (public.is_admin());

-- User Achievements: Users can view all, system updates
CREATE POLICY "User achievements viewable by everyone" ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Users can update own achievements" ON public.user_achievements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activities: Users can view their own
CREATE POLICY "Users can view own activities" ON public.user_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activities" ON public.user_activities FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Collectible Items: Everyone can view
CREATE POLICY "Items viewable by everyone" ON public.collectible_items FOR SELECT USING (true);
CREATE POLICY "Only admins can manage items" ON public.collectible_items FOR INSERT WITH CHECK (public.is_admin());

-- User Inventory: Users can view all inventories, manage their own
CREATE POLICY "Inventory viewable by everyone" ON public.user_inventory FOR SELECT USING (true);
CREATE POLICY "Users can update own inventory" ON public.user_inventory FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own inventory" ON public.user_inventory FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at columns
CREATE TRIGGER update_user_avatars_updated_at
  BEFORE UPDATE ON public.user_avatars
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_rooms_updated_at
  BEFORE UPDATE ON public.user_rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_experience_updated_at
  BEFORE UPDATE ON public.user_experience
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Functions for XP and leveling system

-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION public.calculate_level_from_xp(total_xp integer)
RETURNS integer AS $$
BEGIN
  -- Level formula: level = floor(sqrt(total_xp / 100)) + 1
  -- This creates a curved progression
  RETURN GREATEST(1, floor(sqrt(total_xp::float / 100.0)) + 1);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate XP needed for next level
CREATE OR REPLACE FUNCTION public.calculate_xp_for_next_level(current_level integer)
RETURNS integer AS $$
BEGIN
  -- XP needed = (level^2) * 100
  RETURN (current_level * current_level) * 100;
END;
$$ LANGUAGE plpgsql;

-- Function to award XP
CREATE OR REPLACE FUNCTION public.award_xp(
  user_id_param uuid,
  xp_amount integer,
  activity_type_param text,
  reference_id_param uuid DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  new_total_xp integer;
  new_level integer;
  old_level integer;
BEGIN
  -- Get current level
  SELECT current_level INTO old_level
  FROM public.user_experience
  WHERE user_id = user_id_param;

  -- Update XP
  UPDATE public.user_experience
  SET 
    total_xp = total_xp + xp_amount,
    writing_xp = CASE WHEN activity_type_param LIKE '%post%' THEN writing_xp + xp_amount ELSE writing_xp END,
    engagement_xp = CASE WHEN activity_type_param LIKE '%like%' OR activity_type_param LIKE '%comment%' THEN engagement_xp + xp_amount ELSE engagement_xp END,
    learning_xp = CASE WHEN activity_type_param LIKE '%read%' OR activity_type_param LIKE '%view%' THEN learning_xp + xp_amount ELSE learning_xp END
  WHERE user_id = user_id_param
  RETURNING total_xp INTO new_total_xp;

  -- Calculate new level
  new_level := public.calculate_level_from_xp(new_total_xp);

  -- Update level if changed
  IF new_level > old_level THEN
    UPDATE public.user_experience
    SET 
      current_level = new_level,
      xp_to_next_level = public.calculate_xp_for_next_level(new_level) - new_total_xp
    WHERE user_id = user_id_param;
  END IF;

  -- Log activity
  INSERT INTO public.user_activities (user_id, activity_type, xp_gained, reference_id)
  VALUES (user_id_param, activity_type_param, xp_amount, reference_id_param);
END;
$$ LANGUAGE plpgsql;

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, category, condition_type, condition_value, reward_type, reward_data) VALUES
('First Post', 'Write your first blog post', '✍️', 'writing', 'posts_count', 1, 'decoration', '{"item": "motivational_poster"}'),
('Prolific Writer', 'Write 10 blog posts', '📚', 'writing', 'posts_count', 10, 'room_upgrade', '{"theme": "writers_den"}'),
('Popular Post', 'Get 50 likes on a single post', '❤️', 'engagement', 'post_likes', 50, 'avatar_item', '{"type": "accessory", "item": "success_badge"}'),
('Consistent Blogger', 'Post for 7 consecutive days', '📅', 'consistency', 'consecutive_days', 7, 'decoration', '{"item": "productivity_clock"}'),
('Knowledge Seeker', 'Read 25 posts by others', '🧠', 'learning', 'posts_read', 25, 'avatar_item', '{"type": "accessory", "item": "smart_glasses"}'),
('Community Leader', 'Get 100 total likes across all posts', '👑', 'engagement', 'total_likes', 100, 'room_upgrade', '{"background": "gradient_sunset"}'),
('Tech Explorer', 'Write posts in 5 different categories', '🚀', 'writing', 'categories_used', 5, 'decoration', '{"item": "multi_monitor_setup"}'),
('Night Owl', 'Post between 10PM and 2AM', '🦉', 'special', 'night_posts', 1, 'avatar_item', '{"type": "clothing", "item": "cozy_hoodie"}'),
('Early Bird', 'Post between 5AM and 8AM', '🐦', 'special', 'morning_posts', 1, 'avatar_item', '{"type": "accessory", "item": "coffee_mug"}'),
('Legendary Author', 'Write 100 blog posts', '🏆', 'writing', 'posts_count', 100, 'room_upgrade', '{"theme": "legendary_library"}');

-- Insert default collectible items
INSERT INTO public.collectible_items (name, description, category, item_type, rarity, unlock_condition, visual_data) VALUES
-- Furniture
('Gaming Chair', 'A comfortable gaming chair for long coding sessions', 'furniture', 'chair', 'common', 'level_1', '{"color": "#FF6B6B", "style": "gaming"}'),
('Standing Desk', 'Modern standing desk for healthy coding', 'furniture', 'desk', 'rare', 'level_5', '{"color": "#4ECDC4", "style": "modern"}'),
('Bookshelf', 'Filled with programming books', 'furniture', 'storage', 'common', 'achievement_first_post', '{"color": "#8B4513", "contents": "tech_books"}'),

-- Decorations
('Motivational Poster', 'Keep pushing forward!', 'decoration', 'wall_art', 'common', 'achievement_first_post', '{"message": "Code Never Stops", "frame": "modern"}'),
('Plant Buddy', 'A small succulent for your desk', 'decoration', 'plant', 'common', 'level_2', '{"plant_type": "succulent", "pot_color": "#90EE90"}'),
('RGB Lighting', 'Colorful ambient lighting', 'decoration', 'lighting', 'epic', 'level_10', '{"colors": ["#FF0000", "#00FF00", "#0000FF"], "pattern": "rainbow"}'),

-- Avatar Clothing
('Cozy Hoodie', 'Perfect for late-night coding', 'avatar_clothing', 'hoodie', 'common', 'achievement_night_owl', '{"color": "#8B7355", "style": "oversized"}'),
('Professional Blazer', 'For those important meetings', 'avatar_clothing', 'blazer', 'rare', 'level_8', '{"color": "#1F2937", "style": "formal"}'),
('Retro T-Shirt', 'Vintage programming humor', 'avatar_clothing', 'tshirt', 'common', 'level_3', '{"color": "#F59E0B", "text": "Hello World"}'),

-- Avatar Accessories
('Smart Glasses', 'For the intellectual look', 'avatar_accessory', 'glasses', 'rare', 'achievement_knowledge_seeker', '{"frame": "modern", "lens_tint": "blue_light"}'),
('Coffee Mug', 'Essential for any developer', 'avatar_accessory', 'hand_item', 'common', 'achievement_early_bird', '{"mug_color": "#8B4513", "steam": true}'),
('Success Badge', 'Shows your achievements', 'avatar_accessory', 'badge', 'epic', 'achievement_popular_post', '{"shape": "star", "color": "#FFD700"}');

-- Create indexes for better performance
CREATE INDEX idx_user_avatars_user_id ON public.user_avatars(user_id);
CREATE INDEX idx_user_rooms_user_id ON public.user_rooms(user_id);
CREATE INDEX idx_user_experience_user_id ON public.user_experience(user_id);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at DESC);
CREATE INDEX idx_user_inventory_user_id ON public.user_inventory(user_id);

-- Trigger to create initial avatar and room when user profile is created
CREATE OR REPLACE FUNCTION public.setup_gamification_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Create initial avatar
  INSERT INTO public.user_avatars (user_id) VALUES (NEW.user_id);
  
  -- Create initial room
  INSERT INTO public.user_rooms (user_id) VALUES (NEW.user_id);
  
  -- Create initial experience record
  INSERT INTO public.user_experience (user_id) VALUES (NEW.user_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on profile creation
CREATE TRIGGER on_profile_created_setup_gamification
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.setup_gamification_profile();

-- Trigger to award XP when posts are created/published
CREATE OR REPLACE FUNCTION public.handle_post_xp()
RETURNS TRIGGER AS $$
BEGIN
  -- Award XP for creating a post
  IF TG_OP = 'INSERT' THEN
    PERFORM public.award_xp(NEW.user_id, 25, 'post_created', NEW.id);
    
    -- Extra XP if published immediately
    IF NEW.status = 'published' THEN
      PERFORM public.award_xp(NEW.user_id, 25, 'post_published', NEW.id);
    END IF;
  END IF;
  
  -- Award XP for publishing a draft
  IF TG_OP = 'UPDATE' AND OLD.status = 'draft' AND NEW.status = 'published' THEN
    PERFORM public.award_xp(NEW.user_id, 25, 'post_published', NEW.id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER post_xp_trigger
  AFTER INSERT OR UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_post_xp();