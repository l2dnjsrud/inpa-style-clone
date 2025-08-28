-- Initialize post interactions system
-- This script creates the post_likes table and resets all counters

BEGIN;

-- Create post_likes table for tracking user likes
CREATE TABLE IF NOT EXISTS public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS on post_likes
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- Create policies for post_likes
DROP POLICY IF EXISTS "Users can view all post likes" ON public.post_likes;
CREATE POLICY "Users can view all post likes" 
ON public.post_likes 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Users can create their own likes" ON public.post_likes;
CREATE POLICY "Users can create their own likes" 
ON public.post_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own likes" ON public.post_likes;
CREATE POLICY "Users can delete their own likes" 
ON public.post_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Reset all existing views and likes to 0
UPDATE public.posts 
SET views = 0, likes = 0 
WHERE id IS NOT NULL;

-- Create function to automatically update post likes count
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.posts 
    SET likes = likes + 1 
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.posts 
    SET likes = GREATEST(0, likes - 1) 
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic likes count update
DROP TRIGGER IF EXISTS update_post_likes_count_trigger ON public.post_likes;
CREATE TRIGGER update_post_likes_count_trigger
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_post_likes_count();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON public.post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_views ON public.posts(views DESC);
CREATE INDEX IF NOT EXISTS idx_posts_likes ON public.posts(likes DESC);

COMMIT;