import { useEffect, useState } from "react";
import { BlogCard } from "./BlogCard";

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

export function FeaturedPosts() {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Sample featured posts
    const sampleFeaturedPosts: Post[] = [
      {
        id: "featured-1",
        title: "2024년 프론트엔드 개발 트렌드",
        excerpt: "올해 주목해야 할 프론트엔드 기술들과 개발 트렌드를 정리했습니다. React 19, Vue 3.5, 새로운 번들러들까지 모든 것을 다룹니다.",
        category: "트렌드",
        createdAt: "2024-01-20",
        views: 1250,
        likes: 89,
        author: "Tech Lead",
        featured: true,
      },
      {
        id: "featured-2",
        title: "AI 시대의 개발자, 어떻게 준비할까?",
        excerpt: "ChatGPT, GitHub Copilot 등 AI 도구들이 개발 생산성을 높이고 있습니다. 개발자로서 AI와 함께 성장하는 방법을 알아보세요.",
        category: "AI/ML",
        createdAt: "2024-01-18",
        views: 987,
        likes: 67,
        author: "AI Researcher",
        featured: true,
      },
      {
        id: "featured-3",
        title: "클린 코드를 위한 실전 가이드",
        excerpt: "읽기 쉽고 유지보수가 용이한 코드를 작성하는 방법들을 실제 예제와 함께 설명합니다. 함수 네이밍부터 아키텍처까지 모든 것을 다룹니다.",
        category: "베스트 프랙티스",
        createdAt: "2024-01-15",
        views: 756,
        likes: 45,
        author: "Senior Dev",
        featured: true,
      },
    ];
    setFeaturedPosts(sampleFeaturedPosts);
  }, []);

  if (featuredPosts.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">추천 포스트</h2>
        <div className="h-px bg-gradient-to-r from-primary/50 to-transparent flex-1 ml-4"></div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredPosts.map((post) => (
          <BlogCard
            key={post.id}
            {...post}
            featured={true}
          />
        ))}
      </div>
    </section>
  );
}