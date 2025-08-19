import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { PostList } from "@/components/PostList";

// Sample posts data - in a real app, this would come from your backend/API
const samplePosts = [
  {
    id: "1",
    title: "React 18의 새로운 기능들",
    excerpt: "React 18에서 추가된 Concurrent Features와 Suspense의 새로운 기능들을 살펴보겠습니다.",
    category: "React",
    createdAt: "2024-01-15",
    views: 1234,
    likes: 89,
    author: "김개발자",
    featured: true
  },
  {
    id: "2",
    title: "TypeScript 완벽 가이드",
    excerpt: "TypeScript의 기본부터 고급 기능까지 완벽하게 정리한 가이드입니다.",
    category: "TypeScript",
    createdAt: "2024-01-10",
    views: 2156,
    likes: 156,
    author: "이코딩",
    featured: true
  },
  {
    id: "3",
    title: "Next.js 13 App Router 완전 정복",
    excerpt: "Next.js 13의 새로운 App Router를 활용한 모던 웹 개발 방법을 알아봅시다.",
    category: "Next.js",
    createdAt: "2024-01-08",
    views: 1876,
    likes: 134,
    author: "박풀스택"
  },
  {
    id: "4",
    title: "CSS Grid와 Flexbox 마스터하기",
    excerpt: "CSS Layout의 핵심인 Grid와 Flexbox를 완벽하게 이해하고 활용하는 방법",
    category: "CSS",
    createdAt: "2024-01-05",
    views: 1543,
    likes: 98,
    author: "최디자이너"
  },
  {
    id: "5",
    title: "Node.js 백엔드 개발 시작하기",
    excerpt: "Node.js로 REST API를 구축하고 데이터베이스와 연동하는 방법을 배워봅시다.",
    category: "Node.js",
    createdAt: "2024-01-02",
    views: 1987,
    likes: 167,
    author: "정백엔드"
  },
  {
    id: "6",
    title: "MongoDB 데이터베이스 설계 패턴",
    excerpt: "MongoDB를 활용한 효율적인 데이터베이스 설계 방법과 최적화 기법",
    category: "MongoDB",
    createdAt: "2023-12-28",
    views: 1432,
    likes: 112,
    author: "김데이터"
  },
  {
    id: "7",
    title: "Vue 3 Composition API 활용법",
    excerpt: "Vue 3의 Composition API를 활용한 재사용 가능한 컴포넌트 작성법",
    category: "Vue",
    createdAt: "2023-12-25",
    views: 1298,
    likes: 89,
    author: "이뷰"
  },
  {
    id: "8",
    title: "Docker 컨테이너 기초부터 배포까지",
    excerpt: "Docker를 활용한 애플리케이션 컨테이너화와 배포 전략을 알아봅시다.",
    category: "DevOps",
    createdAt: "2023-12-20",
    views: 1765,
    likes: 143,
    author: "박데브옵스"
  }
];

const AllPostsPage = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <Navbar />
          
          <div className="overflow-y-auto h-[calc(100vh-4rem)]">
            <div className="container mx-auto px-6 py-8">
              <PostList 
                posts={samplePosts}
                title="모든 포스트"
                showSearch={true}
                showCategoryFilter={true}
              />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AllPostsPage;