import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Eye, Heart, User, Share2 } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { CommentSection } from "@/components/CommentSection";
import { PopularPosts } from "@/components/PopularPosts";
import { TagCloud } from "@/components/TagCloud";
import { usePostInteractions } from "@/hooks/usePostInteractions";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  createdAt: string;
  views: number;
  likes: number;
  author: string;
}

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [popularPosts, setPopularPosts] = useState<any[]>([]);
  const [tags, setTags] = useState<{ name: string; count: number }[]>([]);
  const { interactions, incrementViews, toggleLike, getPostInteraction } = usePostInteractions();

  useEffect(() => {
    const loadPost = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .eq('status', 'published')
          .single();

        if (error) {
          console.error('Error fetching post:', error);
          setPost(null);
          setIsLoading(false);
          return;
        }

        const formattedPost: Post = {
          id: data.id,
          title: data.title,
          content: data.content || '',
          excerpt: data.excerpt || '',
          category: data.category,
          createdAt: data.created_at,
          views: data.views || 0,
          likes: data.likes || 0,
          author: '이원경'
        };

        setPost(formattedPost);
        
        // Increment view count when post is loaded
        await incrementViews(id);
        // Get updated interaction data
        await getPostInteraction(id);
      } catch (error) {
        console.error('Error loading post:', error);
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    const loadSidebarData = async () => {
      try {
        // Fetch popular posts
        const { data: popularData, error: popularError } = await supabase
          .from('posts')
          .select('id, title, category, views, created_at')
          .eq('status', 'published')
          .order('views', { ascending: false })
          .limit(5);

        if (!popularError && popularData) {
          setPopularPosts(popularData.map(post => ({
            id: post.id,
            title: post.title,
            category: post.category,
            views: post.views || 0,
            createdAt: post.created_at
          })));
        }

        // Generate tags from all posts
        const { data: allPosts, error: postsError } = await supabase
          .from('posts')
          .select('category, tags')
          .eq('status', 'published');

        if (!postsError && allPosts) {
          const tagCount: Record<string, number> = {};
          
          allPosts.forEach(post => {
            // Count categories as tags
            if (post.category) {
              tagCount[post.category] = (tagCount[post.category] || 0) + 1;
            }
            
            // Count actual tags if they exist
            if (post.tags && Array.isArray(post.tags)) {
              post.tags.forEach(tag => {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
              });
            }
          });
          
          const tagsArray = Object.entries(tagCount)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
          
          setTags(tagsArray);
        }
      } catch (error) {
        console.error('Error loading sidebar data:', error);
      }
    };

    loadPost();
    loadSidebarData();
  }, [id, incrementViews, getPostInteraction]);

  const handleLike = async () => {
    if (post && id) {
      const result = await toggleLike(id);
      if (result) {
        setPost({ ...post, likes: result.likes });
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">
            <Navbar />
            <div className="container mx-auto px-6 py-8">
              <div className="max-w-4xl mx-auto">
                <div className="animate-pulse">
                  <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (!post) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1 overflow-hidden">
            <Navbar />
            <div className="container mx-auto px-6 py-8">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-2xl font-bold mb-4">포스트를 찾을 수 없습니다</h1>
                <p className="text-muted-foreground mb-6">요청하신 포스트가 존재하지 않거나 삭제되었습니다.</p>
                <Button onClick={() => navigate("/")}>홈으로 돌아가기</Button>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-hidden">
          <Navbar />
          <div className="overflow-y-auto h-[calc(100vh-4rem)]">
            <div className="container mx-auto px-6 py-8">
              <div className="flex gap-8 max-w-7xl mx-auto">
                <div className="flex-1 max-w-4xl">
                  <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    뒤로 가기
                  </Button>

                  <Card className="mb-8">
                    <CardHeader className="pb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Badge variant="default">{post.category}</Badge>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {post.author}
                          </div>
                        </div>
                      </div>
                      <h1 className="text-3xl font-bold leading-tight mb-4">{post.title}</h1>
                      <p className="text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>
                      <Separator className="my-4" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {interactions[id || ""]?.views || post.views} 조회
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {interactions[id || ""]?.likes || post.likes} 좋아요
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={handleLike}>
                            <Heart className={`w-4 h-4 mr-2 ${interactions[id || ""]?.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                            좋아요
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleShare}>
                            <Share2 className="w-4 h-4 mr-2" />
                            공유
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <Card>
                    <CardContent className="py-8">
                      <div className="prose prose-lg max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: post.content }} />
                    </CardContent>
                  </Card>

                  <div className="mt-8">
                    <CommentSection 
                      postId={post.id}
                      comments={[]}
                    />
                  </div>
                </div>

                <div className="w-80 space-y-6">
                  <PopularPosts 
                    posts={popularPosts}
                    title="인기 포스트"
                  />
                  
                  <TagCloud 
                    tags={tags}
                    onTagClick={(tag) => console.log('Tag clicked:', tag)}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PostPage;
