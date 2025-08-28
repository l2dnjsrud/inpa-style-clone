import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Heart } from "lucide-react";

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

  useEffect(() => {
    // Load posts from localStorage
    const savedPosts = localStorage.getItem("blog-posts");
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      setPosts(parsedPosts.slice(0, 6)); // Show only recent 6 posts
    } else {
      // Sample posts for demo
      const samplePosts: Post[] = [
        {
          id: "1",
          title: "React 18의 새로운 기능들",
          excerpt: "React 18에서 도입된 Concurrent Features와 Suspense의 활용법을 알아보세요.",
          category: "프론트엔드",
          createdAt: "2024-01-15",
          views: 0,
          likes: 0,
          author: "개발자",
        },
        {
          id: "2",
          title: "TypeScript 5.0 업데이트 정리",
          excerpt: "TypeScript 5.0의 주요 변경사항과 새로운 기능들을 정리해보았습니다.",
          category: "프론트엔드",
          createdAt: "2024-01-12",
          views: 0,
          likes: 0,
          author: "개발자",
        },
        {
          id: "3",
          title: "ComfyUI 마스크 Advanced 완벽 가이드",
          excerpt: "ComfyUI에서 마스크를 활용한 고급 이미지 생성 기법을 마스터해보세요. 인페인팅부터 아웃페인팅까지 모든 것을 다룹니다.",
          category: "AI/ML",
          createdAt: "2024-01-16",
          views: 0,
          likes: 0,
          author: "개발자",
        },
        {
          id: "4",
          title: "Next.js 14 App Router 완벽 가이드",
          excerpt: "Next.js 14의 App Router를 활용한 모던 웹 애플리케이션 개발 방법을 소개합니다.",
          category: "프론트엔드",
          createdAt: "2024-01-10",
          views: 0,
          likes: 0,
          author: "개발자",
        },
        {
          id: "5",
          title: "Docker 컨테이너 최적화 팁",
          excerpt: "Docker 이미지 크기를 줄이고 빌드 시간을 단축하는 실전 기법들을 공유합니다.",
          category: "DevOps",
          createdAt: "2024-01-08",
          views: 0,
          likes: 0,
          author: "개발자",
        },
        {
          id: "6",
          title: "VS Code 확장 개발 가이드",
          excerpt: "나만의 VS Code 확장을 만들어보세요. 기초부터 배포까지 완벽 가이드입니다.",
          category: "도구",
          createdAt: "2024-01-05",
          views: 0,
          likes: 0,
          author: "개발자",
        },
      ];
      setPosts(samplePosts);
    }
  }, []);

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