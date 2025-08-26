import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Clock, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  slug: string;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Search functionality
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, excerpt, category, created_at, slug')
        .or(`title.ilike.%${searchQuery}%, content.ilike.%${searchQuery}%, excerpt.ilike.%${searchQuery}%`)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle search result click
  const handleResultClick = (result: SearchResult) => {
    // Save to recent searches
    const newRecent = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem("recentSearches", JSON.stringify(newRecent));

    // Navigate to post
    navigate(`/post/${result.slug}`);
    onOpenChange(false);
    setQuery("");
  };

  // Handle recent search click
  const handleRecentClick = (searchTerm: string) => {
    setQuery(searchTerm);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            포스트 검색
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="검색어를 입력하세요..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="text-center py-4 text-muted-foreground">
                검색 중...
              </div>
            )}

            {!loading && query && results.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                검색 결과가 없습니다.
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-2">
                {results.map((result) => (
                  <Button
                    key={result.id}
                    variant="ghost"
                    className="w-full h-auto p-4 text-left justify-start"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="w-full">
                      <div className="font-medium text-sm mb-1">{result.title}</div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {result.category} • {new Date(result.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {result.excerpt}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  최근 검색
                </div>
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => handleRecentClick(search)}
                  >
                    <Search className="w-4 h-4 mr-2 text-muted-foreground" />
                    {search}
                  </Button>
                ))}
              </div>
            )}

            {/* Popular Suggestions */}
            {!query && recentSearches.length === 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  인기 검색어
                </div>
                {["ComfyUI", "AI 이미지 생성", "프롬프트 엔지니어링", "Python"].map((term) => (
                  <Button
                    key={term}
                    variant="ghost"
                    className="w-full justify-start text-left"
                    onClick={() => handleRecentClick(term)}
                  >
                    <TrendingUp className="w-4 h-4 mr-2 text-muted-foreground" />
                    {term}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}