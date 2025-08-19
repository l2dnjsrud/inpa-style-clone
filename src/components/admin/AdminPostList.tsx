import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  slug: string;
  featured_image?: string;
}

interface AdminPostListProps {
  onEdit: (post: Post) => void;
  onCreateNew: () => void;
}

export function AdminPostList({ onEdit, onCreateNew }: AdminPostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts((data || []) as Post[]);
    } catch (error) {
      console.error('Load posts error:', error);
      toast.error('포스트를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      setPosts(prev => prev.filter(post => post.id !== postId));
      toast.success('포스트가 삭제되었습니다');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('포스트 삭제에 실패했습니다');
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">포스트를 불러오는 중...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">포스트 관리</h2>
        <Button onClick={onCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          새 포스트 작성
        </Button>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">포스트가 없습니다.</p>
            <Button onClick={onCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              첫 번째 포스트 작성하기
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                        {post.status === 'published' ? '게시됨' : '임시저장'}
                      </Badge>
                      <Badge variant="outline">{post.category}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {post.excerpt || '요약이 없습니다.'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views || 0}
                      </span>
                      <span>
                        생성: {format(new Date(post.created_at), 'yyyy-MM-dd HH:mm', { locale: ko })}
                      </span>
                      {post.published_at && (
                        <span>
                          게시: {format(new Date(post.published_at), 'yyyy-MM-dd HH:mm', { locale: ko })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(post)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>포스트 삭제</AlertDialogTitle>
                          <AlertDialogDescription>
                            "{post.title}" 포스트를 삭제하시겠습니까? 
                            이 작업은 되돌릴 수 없습니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deletePost(post.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            삭제
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}