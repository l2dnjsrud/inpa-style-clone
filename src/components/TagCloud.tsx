import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hash } from "lucide-react";

interface TagCloudProps {
  tags: { name: string; count: number }[];
  onTagClick?: (tag: string) => void;
}

export function TagCloud({ tags, onTagClick }: TagCloudProps) {
  if (tags.length === 0) return null;

  const maxCount = Math.max(...tags.map(tag => tag.count));

  const getTagSize = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return "text-lg";
    if (ratio > 0.6) return "text-base";
    if (ratio > 0.4) return "text-sm";
    return "text-xs";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Hash className="w-4 h-4" />
          인기 태그
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag.name}
              variant="secondary"
              className={`cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors ${getTagSize(tag.count)}`}
              onClick={() => onTagClick?.(tag.name)}
            >
              {tag.name} ({tag.count})
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}