import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface PopularPost {
  id: string;
  title: string;
  category: string;
  views: number;
  createdAt: string;
}

interface PopularPostsProps {
  posts: PopularPost[];
  title?: string;
}

export function PopularPosts({ posts, title = "인기 포스트" }: PopularPostsProps) {
  if (posts.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="w-4 h-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {posts.map((post, index) => (
          <Link
            key={post.id}
            to={`/post/${post.id}`}
            className="block group"
          >
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="w-3 h-3" />
                    {post.views.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}