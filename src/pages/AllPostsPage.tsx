import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { PostList } from "@/components/PostList";

// Sample posts data - in a real app, this would come from your backend/API
const samplePosts = [
  {
    id: "1",
    title: "ComfyUI 시작하기",
    excerpt: "AI 이미지 생성의 차세대 도구인 ComfyUI로 당신만의 작품을 만들어보세요.",
    category: "ComfyUI",
    createdAt: "2024-01-20",
    views: 0,
    likes: 0,
    author: "이원경",
    featured: true
  },
  {
    id: "2",
    title: "프롬프트 엔지니어링 기초",
    excerpt: "효과적인 AI 프롬프트 작성법과 엔지니어링 팁을 공유합니다.",
    category: "프롬프트 엔지니어링",
    createdAt: "2024-01-18",
    views: 0,
    likes: 0,
    author: "이원경",
    featured: true
  },
  {
    id: "3",
    title: "Python으로 바이브 코딩하기",
    excerpt: "Python의 아름다운 코드를 작성하는 노하우와 바이브 코딩의 세계를 탐험해보세요.",
    category: "Python & 바이브코딩",
    createdAt: "2024-01-15",
    views: 0,
    likes: 0,
    author: "이원경"
  },
  {
    id: "4",
    title: "카페에서 코딩하기",
    excerpt: "카페의 따뜻한 분위기에서 코딩하는 즐거움과 생산성 향상 팁을 공유합니다.",
    category: "여행 & 카페",
    createdAt: "2024-01-12",
    views: 0,
    likes: 0,
    author: "이원경"
  },
  {
    id: "5",
    title: "아이유의 음악에서 영감 받기",
    excerpt: "아이유의 아름다운 음악에서 영감을 받아 창작 활동을 하는 이야기를 나누어보세요.",
    category: "아이유 덕질 💜",
    createdAt: "2024-01-10",
    views: 0,
    likes: 0,
    author: "이원경"
  },
  {
    id: "6",
    title: "AI 이미지 생성 팩트",
    excerpt: "AI 이미지 생성 도구들의 비교와 효과적인 활용 방법을 알아보세요.",
    category: "AI 이미지 생성",
    createdAt: "2024-01-08",
    views: 0,
    likes: 0,
    author: "이원경"
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