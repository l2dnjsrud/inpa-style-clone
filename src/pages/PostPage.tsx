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

  useEffect(() => {
    // Simulate loading and finding the post
    const loadPost = () => {
      setIsLoading(true);
      
      // Mock post data based on ID
      const mockPosts: Record<string, Post> = {
        "1": {
          id: "1",
          title: "React 18의 새로운 기능들",
          excerpt: "React 18에서 도입된 Concurrent Features와 Suspense의 활용법을 알아보세요.",
          content: `
            <h2>React 18의 주요 새 기능들</h2>
            <p>React 18은 많은 새로운 기능과 개선사항을 도입했습니다. 이 글에서는 가장 중요한 변화들을 살펴보겠습니다.</p>
            
            <h3>1. Concurrent Features</h3>
            <p>React 18의 가장 큰 변화는 Concurrent Features의 도입입니다. 이는 React가 여러 작업을 동시에 처리할 수 있게 해주며, 사용자 경험을 크게 향상시킵니다.</p>
            
            <h3>2. Automatic Batching</h3>
            <p>이제 React는 더 많은 경우에 상태 업데이트를 자동으로 배치 처리합니다. 이는 성능 향상으로 이어집니다.</p>
            
            <h3>3. Suspense의 확장</h3>
            <p>Suspense가 더 많은 시나리오에서 사용할 수 있게 되었습니다. 데이터 페칭뿐만 아니라 다양한 비동기 작업에서 활용할 수 있습니다.</p>
            
            <h3>결론</h3>
            <p>React 18은 개발자와 사용자 모두에게 큰 이익을 가져다주는 업데이트입니다. 이러한 새 기능들을 적극 활용해보세요!</p>
          `,
          category: "프론트엔드",
          createdAt: "2024-01-15",
          views: 245,
          likes: 12,
          author: "개발자",
        },
        "2": {
          id: "2",
          title: "TypeScript 5.0 업데이트 정리",
          excerpt: "TypeScript 5.0의 주요 변경사항과 새로운 기능들을 정리해보았습니다.",
          content: `
            <h2>TypeScript 5.0의 주요 변화</h2>
            <p>TypeScript 5.0이 출시되면서 많은 새로운 기능과 개선사항이 추가되었습니다.</p>
            
            <h3>1. 데코레이터 지원 개선</h3>
            <p>Stage 3 데코레이터에 대한 지원이 추가되어 더욱 강력한 메타프로그래밍이 가능해졌습니다.</p>
            
            <h3>2. const 타입 매개변수</h3>
            <p>const 타입 매개변수를 통해 더욱 정확한 타입 추론이 가능해졌습니다.</p>
            
            <h3>3. 번들 크기 최적화</h3>
            <p>TypeScript 컴파일러의 크기가 대폭 줄어들어 빌드 성능이 향상되었습니다.</p>
          `,
          category: "프론트엔드",
          createdAt: "2024-01-12",
          views: 189,
          likes: 8,
          author: "개발자",
        },
        // Add more mock posts as needed
      };

      const foundPost = mockPosts[id || ""];
      
      setTimeout(() => {
        setPost(foundPost || null);
        setIsLoading(false);
      }, 500);
    };

    loadPost();
  }, [id]);

  const handleLike = () => {
    if (post) {
      setPost({ ...post, likes: post.likes + 1 });
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
      // Fallback: copy to clipboard
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
              <div className="max-w-4xl mx-auto">
                {/* Back button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="mb-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  뒤로 가기
                </Button>

                {/* Post header */}
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
                    <h1 className="text-3xl font-bold leading-tight mb-4">
                      {post.title}
                    </h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views.toLocaleString()} 조회
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {post.likes} 좋아요
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleLike}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          좋아요
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleShare}
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          공유
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Post content */}
                <Card>
                  <CardContent className="py-8">
                    <div
                      className="prose prose-lg max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PostPage;