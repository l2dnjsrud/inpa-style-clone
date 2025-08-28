import { useEffect, useState } from "react";
import { BlogCard } from "./BlogCard";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  createdAt: string;
  views: number;
  likes: number;
  author: string;
  featured?: boolean;
}

export function FeaturedPosts() {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching featured posts:', error);
          return;
        }

        const formattedPosts: Post[] = (data || []).map(post => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt || '',
          category: post.category,
          createdAt: post.created_at,
          views: post.views || 0,
          likes: post.likes || 0,
          author: '이원경',
          featured: true
        }));

        setFeaturedPosts(formattedPosts);
      } catch (error) {
        console.error('Error fetching featured posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            이원경의 최신 포스트
          </h2>
          <div className="h-px bg-gradient-to-r from-gray-300/50 to-transparent flex-1 ml-4"></div>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">포스트를 불러오는 중...</p>
        </div>
      </section>
    );
  }

  if (featuredPosts.length === 0) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            이원경의 최신 포스트
          </h2>
          <div className="h-px bg-gradient-to-r from-gray-300/50 to-transparent flex-1 ml-4"></div>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">아직 작성된 포스트가 없습니다.</p>
          <p className="text-sm text-muted-foreground mt-2">첫 번째 포스트를 작성해보세요!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          이원경의 최신 포스트
        </h2>
        <div className="h-px bg-gradient-to-r from-gray-300/50 to-transparent flex-1 ml-4"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredPosts.map((post) => (
          <BlogCard
            key={post.id}
            {...post}
            featured={true}
          />
        ))}
      </div>
    </section>
  );
}