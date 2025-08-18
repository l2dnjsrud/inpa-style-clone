import { useState, useMemo } from "react";
import { BlogCard } from "./BlogCard";
import { SearchBar } from "./SearchBar";
import { CategoryFilter } from "./CategoryFilter";
import { Card, CardContent } from "@/components/ui/card";

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

interface PostListProps {
  posts: Post[];
  showSearch?: boolean;
  showCategoryFilter?: boolean;
  title?: string;
}

export function PostList({
  posts,
  showSearch = true,
  showCategoryFilter = true,
  title = "포스트 목록",
}: PostListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    return Array.from(new Set(posts.map((post) => post.category)));
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === null || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  if (posts.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">포스트가 없습니다.</p>
            <p className="text-sm text-muted-foreground mt-2">
              첫 번째 포스트를 작성해보세요!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {showSearch && (
          <SearchBar 
            onSearch={setSearchQuery}
            placeholder="포스트 검색..."
          />
        )}
      </div>

      {showCategoryFilter && (
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
      )}

      {filteredPosts.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">
              검색 결과가 없습니다.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              다른 키워드로 검색해보세요.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>
      )}
    </div>
  );
}