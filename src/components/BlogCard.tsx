import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Heart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { usePostInteractions } from "@/hooks/usePostInteractions";

interface BlogCardProps {
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

export function BlogCard({
  id,
  title,
  excerpt,
  category,
  createdAt,
  views,
  likes,
  author,
  featured = false,
}: BlogCardProps) {
  const { interactions, getPostInteraction } = usePostInteractions();

  useEffect(() => {
    // Load interaction data for this post
    getPostInteraction(id);
  }, [id, getPostInteraction]);

  const currentViews = interactions[id]?.views ?? views;
  const currentLikes = interactions[id]?.likes ?? likes;

  return (
    <Link to={`/post/${id}`} className="block">
      <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer h-full group ${
        featured ? "border-primary/50 bg-gradient-to-br from-background to-primary/5" : ""
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <Badge 
              variant={featured ? "default" : "secondary"}
              className={featured ? "bg-primary text-primary-foreground" : ""}
            >
              {category}
            </Badge>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{currentViews.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{currentLikes}</span>
              </div>
            </div>
          </div>
          <CardTitle className={`leading-tight transition-colors group-hover:text-primary ${
            featured ? "text-xl" : "text-lg"
          }`}>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
            {excerpt}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(createdAt).toLocaleDateString("ko-KR")}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{author}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}