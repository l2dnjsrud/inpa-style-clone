import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Code, 
  Settings, 
  FileText, 
  Database
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useCategoryCounts } from "@/hooks/useCategoryCounts";

interface Category {
  id: string;
  title: string;
  count: number;
  icon: React.ElementType;
  rank?: number;
  description: string;
  color: string;
}

export function CategoriesGrid() {
  const { getCountForCategory } = useCategoryCounts();

  // Create categories with dynamic counts that match the actual blog structure
  const categories: Category[] = [
    {
      id: "comfyui",
      title: "ComfyUI",
      count: getCountForCategory('comfyui'),
      icon: Code,
      rank: 1,
      description: "AI 워크플로우 자동화 도구",
      color: "text-blue-400"
    },
    {
      id: "ai-image",
      title: "AI 이미지 생성",
      count: getCountForCategory('ai-image'),
      icon: Server,
      rank: 2,
      description: "최신 AI 이미지 생성 기술",
      color: "text-purple-400"
    },
    {
      id: "prompt-engineering",
      title: "프롬프트 엔지니어링",
      count: getCountForCategory('prompt-engineering'),
      icon: Settings,
      rank: 3,
      description: "효과적인 프롬프트 작성법",
      color: "text-green-400"
    },
    {
      id: "travel-cafe",
      title: "일상 & 여행",
      count: getCountForCategory('travel-cafe'),
      icon: FileText,
      description: "개발자의 일상과 여행 이야기",
      color: "text-orange-400"
    },
    {
      id: "python-vibe",
      title: "Python & 바이브코딩",
      count: getCountForCategory('python-vibe'),
      icon: Database,
      description: "파이썬과 함께하는 코딩 라이프",
      color: "text-cyan-400"
    }
  ].filter(category => category.count > 0); // Only show categories with posts
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 hero-title">
            인기있는 카테고리
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            👑 잘 정리된 다양한 카테고리를 둘러보세요
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length > 0 ? categories.map((category, index) => (
            <NavLink 
              key={category.id} 
              to={`/category/${category.id}`}
              className="block"
            >
              <Card 
                className="card-hover bg-gradient-card border-border/50 h-full group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-background/10 border border-border/20 ${category.color}`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    
                    {category.rank && (
                      <Badge 
                        variant="outline" 
                        className="border-primary/50 bg-primary/10 text-primary font-bold"
                      >
                        #{category.rank}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {category.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground/80">
                      {category.count} Articles
                    </span>
                    
                    <div className="w-8 h-1 bg-gradient-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </NavLink>
          )) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              <p>카테고리별 포스트를 준비 중입니다...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}