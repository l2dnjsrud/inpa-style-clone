-- Create storage buckets for post media
INSERT INTO storage.buckets (id, name, public) VALUES ('post-images', 'post-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('post-videos', 'post-videos', true);

-- Create storage policies for post images
CREATE POLICY "Post images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'post-images');

CREATE POLICY "Admins can upload post images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'post-images' AND public.is_admin());

CREATE POLICY "Admins can update post images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'post-images' AND public.is_admin());

CREATE POLICY "Admins can delete post images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'post-images' AND public.is_admin());

-- Create storage policies for post videos
CREATE POLICY "Post videos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'post-videos');

CREATE POLICY "Admins can upload post videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'post-videos' AND public.is_admin());

CREATE POLICY "Admins can update post videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'post-videos' AND public.is_admin());

CREATE POLICY "Admins can delete post videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'post-videos' AND public.is_admin());

-- Create categories table for better category management
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  description text,
  slug text NOT NULL UNIQUE,
  color text DEFAULT '#6366f1',
  icon text,
  post_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Categories are viewable by everyone
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

-- Only admins can manage categories
CREATE POLICY "Only admins can create categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update categories" 
ON public.categories 
FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Only admins can delete categories" 
ON public.categories 
FOR DELETE 
USING (public.is_admin());

-- Create trigger for categories updated_at
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default categories
INSERT INTO public.categories (name, description, slug, color) VALUES
('React', 'React 관련 포스트', 'react', '#61dafb'),
('TypeScript', 'TypeScript 관련 포스트', 'typescript', '#3178c6'),
('Next.js', 'Next.js 관련 포스트', 'nextjs', '#000000'),
('CSS', 'CSS 관련 포스트', 'css', '#1572b6'),
('Node.js', 'Node.js 관련 포스트', 'nodejs', '#339933'),
('MongoDB', 'MongoDB 관련 포스트', 'mongodb', '#47a248'),
('Vue', 'Vue.js 관련 포스트', 'vue', '#4fc08d'),
('DevOps', 'DevOps 관련 포스트', 'devops', '#326ce5');