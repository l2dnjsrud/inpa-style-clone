import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        size="sm"
        onClick={() => onCategorySelect(null)}
        className="rounded-full"
      >
        전체
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategorySelect(category)}
          className="rounded-full"
        >
          {category}
        </Button>
      ))}
    </div>
  );
}