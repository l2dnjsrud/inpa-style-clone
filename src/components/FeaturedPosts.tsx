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
        title: "ComfyUI로 시작하는 AI 이미지 생성 완벽 가이드",
        excerpt: "AI 이미지 생성의 혁신, ComfyUI 노드 기반 워크플로우를 처음부터 끝까지 상세히 설명합니다. 프롬프트 엔지니어링 팁도 함께 공유해요! ✨",
        category: "comfyui",
        createdAt: "2024-01-20",
        views: 0,
        likes: 0,
        author: "이원경",
        featured: true,
      },
      {
        id: "featured-2",
        title: "프롬프트 엔지니어가 되기까지의 여정 💜",
        excerpt: "10년차 유애나에서 프롬프트 엔지니어로! AI 시대에 꼭 필요한 스킬과 제가 걸어온 길을 솔직하게 공유합니다. 아이유 덕질과 개발의 조화도 함께요!",
        category: "prompt-engineering",
        createdAt: "2024-01-18",
        views: 0,
        likes: 0,
        author: "이원경",
        featured: true,
      },
      {
        id: "featured-3",
        title: "Python으로 즐기는 바이브 코딩 🐍",
        excerpt: "일상 속 소소한 문제들을 Python으로 해결하며 느끼는 코딩의 재미! 카페에서, 여행지에서 영감을 받은 프로젝트들을 소개합니다.",
        category: "python-vibe",
        createdAt: "2024-01-15",
        views: 0,
        likes: 0,
        author: "이원경",
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
        <h2 className="text-2xl font-bold text-gray-800">
          이원경의 최신 포스트
        </h2>
        <div className="h-px bg-gradient-to-r from-gray-300/50 to-transparent flex-1 ml-4"></div>
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