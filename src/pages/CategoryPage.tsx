import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { PostList } from "@/components/PostList";
import { PopularPosts } from "@/components/PopularPosts";
import { TagCloud } from "@/components/TagCloud";
import { supabase } from "@/integrations/supabase/client";
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
  const [loading, setLoading] = useState(true);
  
  const categoryData = categoryInfo[category as keyof typeof categoryInfo];

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      if (!category) return;
      
      setLoading(true);
      try {
        // Fetch posts for this category
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'published')
          .eq('category', categoryData?.title || category)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching category posts:', error);
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
        
        // Set popular posts (sorted by views)
        const popular = formattedPosts
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);
        setPopularPosts(popular);
        
        // Generate tags from category posts
        const categoryTags = formattedPosts
          .flatMap(post => post.category.split(' '))
          .reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
        
        const tagsArray = Object.entries(categoryTags)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        
        setTags(tagsArray);
      } catch (error) {
        console.error('Error fetching category posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [category, categoryData]);

  if (!categoryData) {
    return <div>Category not found</div>;
  }

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          
          <main className="flex-1 overflow-hidden">
            <Navbar />
            
            <div className="overflow-y-auto h-[calc(100vh-4rem)]">
              <div className="container mx-auto px-6 py-8">
                <p className="text-center text-muted-foreground">포스트를 불러오는 중...</p>
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
                    {posts.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">이 카테고리에는 아직 포스트가 없습니다.</p>
                      </div>
                    ) : (
                      <PostList 
                        posts={posts}
                        title={`${categoryData.title} 포스트`}
                        showSearch={true}
                        showCategoryFilter={false}
                      />
                    )}
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