import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { PostList } from "@/components/PostList";
import { PopularPosts } from "@/components/PopularPosts";
import { TagCloud } from "@/components/TagCloud";
import { 
  BookOpen,
  Eye
} from "lucide-react";

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

const getCategoryPosts = (category: string): Post[] => {
  const allPosts: Record<string, Post[]> = {
    comfyui: [
      {
        id: "comfy-1",
        title: "ComfyUI 초보자를 위한 완벽 가이드",
        excerpt: "ComfyUI의 기본 개념부터 고급 노드 활용까지, AI 이미지 생성의 모든 것을 알아보세요.",
        category: "ComfyUI",
        createdAt: "2024-01-20",
        views: 0,
        likes: 0,
        author: "이원경",
        featured: true
      },
      {
        id: "comfy-2",
        title: "워크플로우 최적화 전략",
        excerpt: "효율적인 ComfyUI 워크플로우 구성으로 생산성을 극대화하는 방법을 소개합니다.",
        category: "ComfyUI",
        createdAt: "2024-01-18",
        views: 0,
        likes: 0,
        author: "이원경"
      },
      {
        id: "comfy-3",
        title: "커스텀 노드 개발하기",
        excerpt: "나만의 ComfyUI 커스텀 노드를 개발하여 워크플로우를 확장해보세요.",
        category: "ComfyUI",
        createdAt: "2024-01-15",
        views: 0,
        likes: 0,
        author: "이원경"
      }
    ],
    "ai-image": [
      {
        id: "ai-img-1",
        title: "Stable Diffusion 마스터하기",
        excerpt: "Stable Diffusion의 핵심 개념과 고품질 이미지 생성 기법을 완벽하게 정리했습니다.",
        category: "AI 이미지 생성",
        createdAt: "2024-01-22",
        views: 0,
        likes: 0,
        author: "이원경",
        featured: true
      },
      {
        id: "ai-img-2",
        title: "AI 모델 비교 분석",
        excerpt: "SDXL, MidJourney, DALL-E 3 등 주요 AI 이미지 생성 모델들을 비교 분석합니다.",
        category: "AI 이미지 생성",
        createdAt: "2024-01-19",
        views: 0,
        likes: 0,
        author: "이원경"
      },
      {
        id: "ai-img-3",
        title: "LoRA 훈련 완벽 가이드",
        excerpt: "나만의 스타일을 만들어내는 LoRA 훈련 방법을 단계별로 설명합니다.",
        category: "AI 이미지 생성",
        createdAt: "2024-01-16",
        views: 0,
        likes: 0,
        author: "이원경"
      }
    ],
    "prompt-engineering": [
      {
        id: "prompt-1",
        title: "프롬프트 엔지니어링 기초",
        excerpt: "효과적인 프롬프트 작성을 위한 기본 원칙과 실전 기법들을 알아보세요.",
        category: "프롬프트 엔지니어링",
        createdAt: "2024-01-21",
        views: 0,
        likes: 0,
        author: "이원경"
      },
      {
        id: "prompt-2",
        title: "네거티브 프롬프트 활용법",
        excerpt: "원하지 않는 요소를 제거하는 네거티브 프롬프트의 효과적인 사용법을 배워보세요.",
        category: "프롬프트 엔지니어링",
        createdAt: "2024-01-17",
        views: 0,
        likes: 0,
        author: "이원경"
      }
    ],
    "travel-cafe": [
      {
        id: "travel-1",
        title: "아이유 콘서트 전국 투어 후기",
        excerpt: "Golden Hour 콘서트를 따라다니며 느낀 감동과 각 도시별 맛집 정보를 공유합니다.",
        category: "일상 & 여행",
        createdAt: "2024-01-23",
        views: 0,
        likes: 0,
        author: "이원경",
        featured: true
      },
      {
        id: "travel-2",
        title: "제주도 숨은 카페 탐방기",
        excerpt: "제주도의 아름다운 풍경과 함께 즐기는 특별한 카페들을 소개합니다.",
        category: "일상 & 여행",
        createdAt: "2024-01-14",
        views: 0,
        likes: 0,
        author: "이원경"
      },
      {
        id: "travel-3",
        title: "서울 감성 카페 베스트 10",
        excerpt: "개발자의 시선으로 바라본 서울의 감성적인 카페들을 추천합니다.",
        category: "일상 & 여행",
        createdAt: "2024-01-11",
        views: 0,
        likes: 0,
        author: "이원경"
      }
    ],
    "python-vibe": [
      {
        id: "python-1",
        title: "Python으로 시작하는 AI 이미지 처리",
        excerpt: "Python과 OpenCV를 활용한 이미지 처리 기초부터 AI 연동까지 완벽 가이드입니다.",
        category: "Python & 바이브코딩",
        createdAt: "2024-01-20",
        views: 0,
        likes: 0,
        author: "이원경"
      },
      {
        id: "python-2",
        title: "FastAPI로 만드는 이미지 생성 API",
        excerpt: "FastAPI를 사용해 AI 이미지 생성 서비스의 백엔드 API를 구축해보세요.",
        category: "Python & 바이브코딩",
        createdAt: "2024-01-13",
        views: 0,
        likes: 0,
        author: "이원경"
      }
    ],
    aws: [
      {
        id: "aws-1",
        title: "AWS Lambda 서버리스 완벽 가이드",
        excerpt: "AWS Lambda를 활용한 서버리스 아키텍처 구축 방법을 상세히 알아보겠습니다. 비용 최적화부터 성능 튜닝까지 모든 것을 다룹니다.",
        category: "AWS",
        createdAt: "2024-01-15",
        views: 0,
        likes: 0,
        author: "개발자"
      },
      {
        id: "aws-2",
        title: "EC2 인스턴스 최적화 전략",
        excerpt: "AWS EC2 인스턴스의 성능을 최적화하고 비용을 절감하는 실전 기법들을 소개합니다.",
        category: "AWS",
        createdAt: "2024-01-12",
        views: 0,
        likes: 0,
        author: "클라우드 전문가"
      }
    ],
    javascript: [
      {
        id: "js-1",
        title: "모던 JavaScript ES2024 완벽 가이드",
        excerpt: "최신 JavaScript 기능들을 활용한 모던 개발 방법론을 알아보겠습니다.",
        category: "JavaScript",
        createdAt: "2024-01-18",
        views: 0,
        likes: 0,
        author: "프론트엔드 개발자"
      },
      {
        id: "js-2",
        title: "Async/Await 패턴 마스터하기",
        excerpt: "비동기 JavaScript의 핵심인 Async/Await를 완벽하게 이해하고 활용해보세요.",
        category: "JavaScript",
        createdAt: "2024-01-16",
        views: 0,
        likes: 0,
        author: "JS 개발자"
      }
    ],
    vscode: [
      {
        id: "vscode-1",
        title: "VS Code 확장 개발 완벽 가이드",
        excerpt: "나만의 VS Code 확장을 만들어보세요. 기초부터 배포까지 완벽 가이드입니다.",
        category: "개발도구",
        createdAt: "2024-01-14",
        views: 0,
        likes: 0,
        author: "도구 개발자"
      }
    ]
  };
  
  return allPosts[category] || [];
};

const categoryInfo = {
  comfyui: { title: "ComfyUI", description: "AI 이미지 생성의 혁신적 도구", color: "text-purple-400" },
  "ai-image": { title: "AI 이미지 생성", description: "창의적 AI 아트의 세계", color: "text-pink-400" },
  "prompt-engineering": { title: "프롬프트 엔지니어링", description: "AI와 소통하는 예술", color: "text-indigo-400" },
  "travel-cafe": { title: "일상 & 여행", description: "삶의 여유와 감성을 담다", color: "text-green-400" },
  "python-vibe": { title: "Python & 바이브코딩", description: "코딩의 재미와 창의성", color: "text-yellow-400" },
  aws: { title: "AWS", description: "클라우드 서비스 완전 정복", color: "text-orange-400" },
  linux: { title: "Linux", description: "리눅스 시스템 관리", color: "text-blue-400" },
  nodejs: { title: "Node.js", description: "백엔드 개발의 핵심", color: "text-green-400" },
  javascript: { title: "JavaScript", description: "모던 웹 개발", color: "text-yellow-400" },
  css: { title: "CSS", description: "스타일링의 예술", color: "text-pink-400" },
  mysql: { title: "MySQL", description: "데이터베이스 마스터", color: "text-cyan-400" }
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<{ name: string; count: number }[]>([]);
  
  const categoryData = categoryInfo[category as keyof typeof categoryInfo];

  useEffect(() => {
    if (category) {
      const categoryPosts = getCategoryPosts(category);
      setPosts(categoryPosts);
      
      // Set popular posts (sorted by views)
      const popular = categoryPosts
        .sort((a, b) => b.views - a.views)
        .slice(0, 5);
      setPopularPosts(popular);
      
      // Generate sample tags
      const sampleTags = [
        { name: "AWS", count: 12 },
        { name: "JavaScript", count: 8 },
        { name: "React", count: 15 },
        { name: "DevOps", count: 6 },
        { name: "Frontend", count: 10 }
      ];
      setTags(sampleTags);
    }
  }, [category]);

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
                    {posts.length} Articles
                  </span>
                  <span className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {posts.reduce((sum, post) => sum + post.views, 0)} Views
                  </span>
                </div>
              </div>
            </section>

            {/* Main Content */}
            <section className="py-8 px-6">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Main Posts Area */}
                  <div className="lg:col-span-3">
                    <PostList 
                      posts={posts}
                      title={`${categoryData.title} 포스트`}
                      showSearch={true}
                      showCategoryFilter={false}
                    />
                  </div>
                  
                  {/* Sidebar */}
                  <div className="lg:col-span-1 space-y-6">
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
            </section>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}