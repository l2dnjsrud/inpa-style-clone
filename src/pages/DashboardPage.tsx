import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Edit3, Trash2, Eye, EyeOff, Plus, BarChart3 } from 'lucide-react';


interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  tags: string[] | null;
  status: string;
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadPosts();
  }, [user, navigate]);

  const loadPosts = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "포스트 로드 실패",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setPosts((data || []).map(post => ({
        ...post,
        tags: post.tags || [],
        excerpt: post.excerpt || ''
      })));
    }
    
    setLoading(false);
  };

  const updatePostStatus = async (postId: string, newStatus: 'published' | 'deactivated') => {
    const { error } = await supabase
      .from('posts')
      .update({ 
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : null
      })
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
        description: `포스트가 ${newStatus === 'published' ? '발행' : '비활성화'}되었습니다.`
      });
      loadPosts();
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('정말로 이 포스트를 삭제하시겠습니까?')) return;

    const { error } = await supabase
      .from('posts')
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
        description: "포스트가 삭제되었습니다."
      });
      loadPosts();
    }
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    return post.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'deactivated': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return '발행됨';
      case 'draft': return '초안';
      case 'deactivated': return '비활성화';
      default: return status;
    }
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 overflow-hidden">
          <Navbar />
          
          <div className="overflow-y-auto h-[calc(100vh-4rem)] p-6">
            <div className="max-w-6xl mx-auto">
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart3 className="w-5 h-5" />
                      통계
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">총 포스트</span>
                        <span className="font-medium">{posts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">발행됨</span>
                        <span className="font-medium">{posts.filter(p => p.status === 'published').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">초안</span>
                        <span className="font-medium">{posts.filter(p => p.status === 'draft').length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">빠른 작업</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button 
                        onClick={() => navigate('/write')} 
                        className="w-full flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        새 포스트 작성
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => navigate('/profile')}
                        className="w-full flex items-center gap-2"
                      >
                        <BarChart3 className="h-4 w-4" />
                        프로필 보기
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">최근 활동</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      {posts.length > 0 ? (
                        <p>최근 포스트: {new Date(posts[0].created_at).toLocaleDateString()}</p>
                      ) : (
                        <p>아직 포스트가 없습니다</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">내 포스트 관리</h1>
                <Button onClick={() => navigate('/write')} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  새 포스트 작성
                </Button>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">전체 ({posts.length})</TabsTrigger>
                  <TabsTrigger value="published">
                    발행됨 ({posts.filter(p => p.status === 'published').length})
                  </TabsTrigger>
                  <TabsTrigger value="draft">
                    초안 ({posts.filter(p => p.status === 'draft').length})
                  </TabsTrigger>
                  <TabsTrigger value="deactivated">
                    비활성화 ({posts.filter(p => p.status === 'deactivated').length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  {loading ? (
                    <div className="text-center py-8">로딩 중...</div>
                  ) : filteredPosts.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-muted-foreground">포스트가 없습니다.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid gap-4">
                      {filteredPosts.map((post) => (
                        <Card key={post.id} className="card-hover">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                                <CardDescription className="mb-2">{post.excerpt}</CardDescription>
                                
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline">{post.category}</Badge>
                                  <Badge className={getStatusColor(post.status)}>
                                    {getStatusText(post.status)}
                                  </Badge>
                                </div>
                                
                                {post.tags && post.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {post.tags.map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                
                                <div className="text-sm text-muted-foreground">
                                  조회수: {post.views} | 좋아요: {post.likes} | 
                                  생성: {new Date(post.created_at).toLocaleDateString()}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => navigate(`/write/${post.id}`)}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                
                                {post.status === 'published' ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updatePostStatus(post.id, 'deactivated')}
                                  >
                                    <EyeOff className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updatePostStatus(post.id, 'published')}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                )}
                                
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deletePost(post.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}