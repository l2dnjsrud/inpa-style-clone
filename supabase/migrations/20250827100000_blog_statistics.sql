-- Create blog statistics tracking system
-- This script creates tables for tracking visitors and blog operation days

BEGIN;

-- Create blog_statistics table for tracking overall blog metrics
CREATE TABLE IF NOT EXISTS public.blog_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_visitors INTEGER DEFAULT 0,
  total_posts INTEGER DEFAULT 0,
  blog_started_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create visitor_sessions table for tracking unique visitors
CREATE TABLE IF NOT EXISTS public.visitor_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  first_visit TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_visit TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  page_views INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily_statistics table for tracking daily metrics
CREATE TABLE IF NOT EXISTS public.daily_statistics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE DEFAULT CURRENT_DATE,
  daily_visitors INTEGER DEFAULT 0,
  daily_page_views INTEGER DEFAULT 0,
  daily_posts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all statistics tables
ALTER TABLE public.blog_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_statistics ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_statistics (readable by everyone, updatable by system)
DROP POLICY IF EXISTS "Blog statistics are viewable by everyone" ON public.blog_statistics;
CREATE POLICY "Blog statistics are viewable by everyone" 
ON public.blog_statistics 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "System can update blog statistics" ON public.blog_statistics;
CREATE POLICY "System can update blog statistics" 
ON public.blog_statistics 
FOR ALL
USING (true);

-- Create policies for visitor_sessions (insertable by everyone, readable by system)
DROP POLICY IF EXISTS "Anyone can create visitor sessions" ON public.visitor_sessions;
CREATE POLICY "Anyone can create visitor sessions" 
ON public.visitor_sessions 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "System can read visitor sessions" ON public.visitor_sessions;
CREATE POLICY "System can read visitor sessions" 
ON public.visitor_sessions 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "System can update visitor sessions" ON public.visitor_sessions;
CREATE POLICY "System can update visitor sessions" 
ON public.visitor_sessions 
FOR UPDATE 
USING (true);

-- Create policies for daily_statistics (readable by everyone, updatable by system)
DROP POLICY IF EXISTS "Daily statistics are viewable by everyone" ON public.daily_statistics;
CREATE POLICY "Daily statistics are viewable by everyone" 
ON public.daily_statistics 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "System can manage daily statistics" ON public.daily_statistics;
CREATE POLICY "System can manage daily statistics" 
ON public.daily_statistics 
FOR ALL
USING (true);

-- Initialize blog_statistics with default values (reset everything to 0)
INSERT INTO public.blog_statistics (total_visitors, total_posts, blog_started_date)
VALUES (0, 0, CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

-- If no record exists yet, create one
INSERT INTO public.blog_statistics (total_visitors, total_posts, blog_started_date)
SELECT 0, 0, CURRENT_DATE
WHERE NOT EXISTS (SELECT 1 FROM public.blog_statistics);

-- Create function to update blog statistics when posts are published
CREATE OR REPLACE FUNCTION public.update_blog_post_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total posts count when a post is published
  IF TG_OP = 'INSERT' AND NEW.status = 'published' THEN
    UPDATE public.blog_statistics 
    SET total_posts = total_posts + 1, updated_at = now()
    WHERE id = (SELECT id FROM public.blog_statistics LIMIT 1);
    
    -- Update daily posts count
    INSERT INTO public.daily_statistics (date, daily_posts)
    VALUES (CURRENT_DATE, 1)
    ON CONFLICT (date) 
    DO UPDATE SET daily_posts = daily_statistics.daily_posts + 1, updated_at = now();
    
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != 'published' AND NEW.status = 'published' THEN
    -- Post was just published
    UPDATE public.blog_statistics 
    SET total_posts = total_posts + 1, updated_at = now()
    WHERE id = (SELECT id FROM public.blog_statistics LIMIT 1);
    
    INSERT INTO public.daily_statistics (date, daily_posts)
    VALUES (CURRENT_DATE, 1)
    ON CONFLICT (date) 
    DO UPDATE SET daily_posts = daily_statistics.daily_posts + 1, updated_at = now();
    
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'published' AND NEW.status != 'published' THEN
    -- Post was unpublished
    UPDATE public.blog_statistics 
    SET total_posts = GREATEST(0, total_posts - 1), updated_at = now()
    WHERE id = (SELECT id FROM public.blog_statistics LIMIT 1);
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'published' THEN
    -- Published post was deleted
    UPDATE public.blog_statistics 
    SET total_posts = GREATEST(0, total_posts - 1), updated_at = now()
    WHERE id = (SELECT id FROM public.blog_statistics LIMIT 1);
    
    RETURN OLD;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic post count updates
DROP TRIGGER IF EXISTS update_blog_post_count_trigger ON public.posts;
CREATE TRIGGER update_blog_post_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_blog_post_count();

-- Create function to track visitor sessions
CREATE OR REPLACE FUNCTION public.track_visitor_session(
  p_session_id TEXT,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  session_exists BOOLEAN;
BEGIN
  -- Check if session already exists
  SELECT EXISTS(
    SELECT 1 FROM public.visitor_sessions 
    WHERE session_id = p_session_id
  ) INTO session_exists;
  
  IF session_exists THEN
    -- Update existing session
    UPDATE public.visitor_sessions 
    SET 
      last_visit = now(),
      page_views = page_views + 1
    WHERE session_id = p_session_id;
  ELSE
    -- Create new session
    INSERT INTO public.visitor_sessions (session_id, ip_address, user_agent)
    VALUES (p_session_id, p_ip_address, p_user_agent);
    
    -- Update total visitors count
    UPDATE public.blog_statistics 
    SET total_visitors = total_visitors + 1, updated_at = now()
    WHERE id = (SELECT id FROM public.blog_statistics LIMIT 1);
    
    -- Update daily visitors count
    INSERT INTO public.daily_statistics (date, daily_visitors)
    VALUES (CURRENT_DATE, 1)
    ON CONFLICT (date) 
    DO UPDATE SET daily_visitors = daily_statistics.daily_visitors + 1, updated_at = now();
  END IF;
  
  -- Update daily page views
  INSERT INTO public.daily_statistics (date, daily_page_views)
  VALUES (CURRENT_DATE, 1)
  ON CONFLICT (date) 
  DO UPDATE SET daily_page_views = daily_statistics.daily_page_views + 1, updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to reset all blog statistics
CREATE OR REPLACE FUNCTION public.reset_blog_statistics()
RETURNS VOID AS $$
BEGIN
  -- Reset all counters to 0
  UPDATE public.blog_statistics 
  SET 
    total_visitors = 0,
    total_posts = 0,
    blog_started_date = CURRENT_DATE,
    updated_at = now()
  WHERE id = (SELECT id FROM public.blog_statistics LIMIT 1);
  
  -- Clear visitor sessions
  DELETE FROM public.visitor_sessions;
  
  -- Clear daily statistics
  DELETE FROM public.daily_statistics;
  
  -- Reset post views and likes
  UPDATE public.posts SET views = 0, likes = 0;
  
  -- Clear post likes
  DELETE FROM public.post_likes;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_session_id ON public.visitor_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_sessions_created_at ON public.visitor_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_statistics_date ON public.daily_statistics(date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_statistics_updated_at ON public.blog_statistics(updated_at DESC);

COMMIT;