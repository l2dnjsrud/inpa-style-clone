import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Navbar } from '@/components/Navbar';
import { Trash2, Edit, Eye, EyeOff } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: string;
  created_at: string;
  views: number;
}

const MyBlogsPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate('/auth');
        } else {
          fetchPosts(session.user.id);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      } else {
        fetchPosts(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchPosts = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "게시물 불러오기 실패",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setPosts(data || []);
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "게시물을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        toast({
          title: "삭제 실패",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "삭제 완료",
          description: "게시물이 삭제되었습니다."
        });
        setPosts(posts.filter(post => post.id !== postId));
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "게시물 삭제 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const handleToggleStatus = async (postId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ status: newStatus })
        .eq('id', postId);

      if (error) {
        toast({
          title: "상태 변경 실패",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "상태 변경 완료",
          description: `게시물이 ${newStatus === 'published' ? '공개' : '비공개'}로 변경되었습니다.`
        });
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, status: newStatus }
            : post
        ));
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "상태 변경 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <Navbar />
          
          <div className="overflow-y-auto h-[calc(100vh-4rem)] p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">내 게시물</h1>
                <Button onClick={() => navigate('/write')}>
                  새 게시물 작성
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <p>게시물을 불러오는 중...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">작성한 게시물이 없습니다.</p>
                  <Button onClick={() => navigate('/write')}>
                    첫 게시물 작성하기
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {posts.map((post) => (
                    <Card key={post.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                            <CardDescription>{post.excerpt}</CardDescription>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                              {post.status === 'published' ? '공개' : '비공개'}
                            </Badge>
                            <Badge variant="outline">{post.category}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            <span>작성일: {new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
                            <span className="ml-4">조회수: {post.views}</span>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(post.id, post.status)}
                            >
                              {post.status === 'published' ? (
                                <>
                                  <EyeOff className="w-4 h-4 mr-1" />
                                  비공개
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-1" />
                                  공개
                                </>
                              )}
                            </Button>
                            
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4 mr-1" />
                              수정
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  삭제
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>게시물 삭제</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    정말로 이 게시물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>취소</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(post.id)}>
                                    삭제
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MyBlogsPage;