import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Code, 
  Settings, 
  FileText, 
  Database, 
  Palette,
  Terminal,
  GitBranch,
  Globe
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface Category {
  id: string;
  title: string;
  count: number;
  icon: React.ElementType;
  rank?: number;
  description: string;
  color: string;
}

const categories: Category[] = [
  {
    id: "aws",
    title: "AWS",
    count: 34,
    icon: Server,
    rank: 1,
    description: "클라우드 서비스 완전 정복",
    color: "text-orange-400"
  },
  {
    id: "linux",
    title: "Linux",
    count: 39,
    icon: Terminal,
    rank: 2,
    description: "리눅스 시스템 관리",
    color: "text-blue-400"
  },
  {
    id: "nodejs",
    title: "Node.js",
    count: 76,
    icon: Settings,
    rank: 3,
    description: "백엔드 개발의 핵심",
    color: "text-green-400"
  },
  {
    id: "javascript",
    title: "JavaScript",
    count: 65,
    icon: FileText,
    description: "모던 웹 개발",
    color: "text-yellow-400"
  },
  {
    id: "css",
    title: "CSS",
    count: 42,
    icon: Palette,
    description: "스타일링의 예술",
    color: "text-pink-400"
  },
  {
    id: "mysql",
    title: "MySQL",
    count: 33,
    icon: Database,
    description: "데이터베이스 마스터",
    color: "text-cyan-400"
  },
  {
    id: "git",
    title: "GIT",
    count: 20,
    icon: GitBranch,
    description: "버전 관리 시스템",
    color: "text-red-400"
  },
  {
    id: "web",
    title: "WEB 지식",
    count: 46,
    icon: Globe,
    description: "웹 개발 필수 지식",
    color: "text-purple-400"
  },
  {
    id: "vscode",
    title: "VSCode",
    count: 26,
    icon: Code,
    description: "개발 도구 활용법",
    color: "text-indigo-400"
  }
];

export function CategoriesGrid() {
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
          {categories.map((category, index) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}