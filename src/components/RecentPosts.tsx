import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Heart } from "lucide-react";
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
}

export function RecentPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          console.error('Error fetching recent posts:', error);
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
          author: '이원경'
        }));

        setPosts(formattedPosts);
      } catch (error) {
        console.error('Error fetching recent posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  if (loading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">최근 포스트</h2>
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">포스트를 불러오는 중...</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">최근 포스트</h2>
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">아직 작성된 포스트가 없습니다.</p>
            <p className="text-sm text-muted-foreground mt-2">첫 번째 포스트를 작성해보세요!</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-6">최근 포스트</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} to={`/post/${post.id}`} className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full hover:border-primary/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">
                    {post.category}
                  </Badge>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.likes}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                  </div>
                  <span>by {post.author}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}