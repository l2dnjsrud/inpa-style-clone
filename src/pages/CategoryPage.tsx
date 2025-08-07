import { useParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Eye, 
  MessageCircle, 
  Heart,
  BookOpen,
  Clock
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  views: number;
  comments: number;
  likes: number;
  readTime: number;
  tags: string[];
}

const samplePosts: Post[] = [
  {
    id: "1",
    title: "AWS Lambda 서버리스 완벽 가이드",
    excerpt: "AWS Lambda를 활용한 서버리스 아키텍처 구축 방법을 상세히 알아보겠습니다. 비용 최적화부터 성능 튜닝까지 모든 것을 다룹니다.",
    date: "2024-01-15",
    views: 1230,
    comments: 45,
    likes: 89,
    readTime: 12,
    tags: ["AWS", "Serverless", "Lambda"]
  },
  {
    id: "2", 
    title: "Docker와 Kubernetes 실전 배포 전략",
    excerpt: "프로덕션 환경에서 Docker 컨테이너를 Kubernetes로 관리하는 실전 노하우를 공유합니다.",
    date: "2024-01-12",
    views: 2100,
    comments: 67,
    likes: 156,
    readTime: 18,
    tags: ["Docker", "Kubernetes", "DevOps"]
  },
  {
    id: "3",
    title: "Next.js 14 App Router 마이그레이션 가이드",
    excerpt: "Pages Router에서 App Router로 안전하게 마이그레이션하는 단계별 방법을 알아보겠습니다.",
    date: "2024-01-10",
    views: 890,
    comments: 23,
    likes: 67,
    readTime: 15,
    tags: ["Next.js", "React", "Migration"]
  }
];

const categoryInfo = {
  aws: { title: "AWS", description: "클라우드 서비스 완전 정복", color: "text-orange-400" },
  linux: { title: "Linux", description: "리눅스 시스템 관리", color: "text-blue-400" },
  nodejs: { title: "Node.js", description: "백엔드 개발의 핵심", color: "text-green-400" },
  javascript: { title: "JavaScript", description: "모던 웹 개발", color: "text-yellow-400" },
  css: { title: "CSS", description: "스타일링의 예술", color: "text-pink-400" },
  mysql: { title: "MySQL", description: "데이터베이스 마스터", color: "text-cyan-400" }
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const categoryData = categoryInfo[category as keyof typeof categoryInfo];

  if (!categoryData) {
    return <div>Category not found</div>;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <Navbar />
          
          <div className="overflow-y-auto h-[calc(100vh-4rem)]">
            {/* Category Header */}
            <section className="py-16 px-6 bg-gradient-hero relative">
              <div className="absolute inset-0 bg-background/80" />
              <div className="relative z-10 max-w-4xl mx-auto text-center">
                <h1 className={`text-4xl md:text-6xl font-bold mb-4 ${categoryData.color}`}>
                  {categoryData.title}
                </h1>
                <p className="text-xl text-foreground/80 mb-8">
                  {categoryData.description}
                </p>
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    {samplePosts.length} Articles
                  </span>
                  <span className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {samplePosts.reduce((sum, post) => sum + post.views, 0)} Views
                  </span>
                </div>
              </div>
            </section>

            {/* Posts Grid */}
            <section className="py-16 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid gap-8">
                  {samplePosts.map((post, index) => (
                    <Card 
                      key={post.id} 
                      className="card-hover bg-gradient-card border-border/50 overflow-hidden"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h2 className="text-2xl font-bold mb-3 hover:text-primary transition-colors cursor-pointer">
                              {post.title}
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                              {post.excerpt}
                            </p>
                          </div>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags && post.tags.map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="border-primary/30 bg-primary/10 text-primary"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(post.date).toLocaleDateString('ko-KR')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {post.readTime}분
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.views.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {post.comments}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {post.likes}
                            </span>
                          </div>

                          <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
                            Read More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-12">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-glow-primary hover:shadow-glow-accent"
                  >
                    Load More Articles
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}