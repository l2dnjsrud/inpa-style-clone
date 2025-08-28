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
  const { interactions, incrementViews, toggleLike, getPostInteraction } = usePostInteractions();

  useEffect(() => {
    // Simulate loading and finding the post
    const loadPost = async () => {
      setIsLoading(true);
      
      const mockPosts: Record<string, Post> = {
        "1": {
          id: "1",
          title: "ComfyUI 시작하기",
          excerpt: "ComfyUI로 AI 이미지 생성을 시작하는 방법을 알아보세요.",
          content: `<h2>ComfyUI로 AI 이미지 생성 시작하기</h2><p>ComfyUI는 강력한 노드 기반 AI 이미지 생성 도구입니다.</p>`,
          category: "AI 이미지 생성",
          createdAt: "2024-01-15",
          views: 0,
          likes: 0,
          author: "이원경",
        },
      };

      const foundPost = mockPosts[id || ""];
      
      setTimeout(async () => {
        setPost(foundPost || null);
        setIsLoading(false);
        
        // Increment view count when post is loaded
        if (foundPost && id) {
          await incrementViews(id);
          // Get updated interaction data
          await getPostInteraction(id);
        }
      }, 500);
    };

    loadPost();
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
                      comments={[
                        {
                          id: "1",
                          author: "개발자A",
                          content: "정말 유용한 포스트네요!",
                          createdAt: "2024-01-16",
                          likes: 5
                        }
                      ]}
                    />
                  </div>
                </div>

                <div className="w-80 space-y-6">
                  <PopularPosts 
                    posts={[
                      {
                        id: "popular-1",
                        title: "React 18의 새로운 기능들",
                        category: "React",
                        views: 1250,
                        createdAt: "2024-01-15"
                      }
                    ]}
                    title="인기 포스트"
                  />
                  
                  <TagCloud 
                    tags={[
                      { name: "React", count: 15 },
                      { name: "JavaScript", count: 12 }
                    ]}
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
