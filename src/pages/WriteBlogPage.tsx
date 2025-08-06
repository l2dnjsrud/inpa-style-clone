import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Navbar } from '@/components/Navbar';

const categories = [
  { value: 'technology', label: '기술' },
  { value: 'development', label: '개발' },
  { value: 'design', label: '디자인' },
  { value: 'security', label: '보안' },
  { value: 'linux', label: 'Linux' },
  { value: 'database', label: '데이터베이스' }
];

const WriteBlogPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title,
          content,
          excerpt,
          category,
          tags: tagsArray,
          author_id: user.id,
          status: 'published'
        });

      if (error) {
        toast({
          title: "게시물 작성 실패",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "게시물 작성 완료",
          description: "새 게시물이 성공적으로 작성되었습니다."
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "예상치 못한 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">새 게시물 작성</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">제목</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="게시물 제목을 입력하세요"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="excerpt">요약</Label>
                      <Textarea
                        id="excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="게시물 요약을 입력하세요"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">카테고리</Label>
                        <Select value={category} onValueChange={setCategory} required>
                          <SelectTrigger>
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags">태그</Label>
                        <Input
                          id="tags"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="태그1, 태그2, 태그3 (쉼표로 구분)"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">내용</Label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        placeholder="게시물 내용을 입력하세요"
                        rows={15}
                        className="min-h-[400px]"
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="flex-1"
                      >
                        {loading ? '게시 중...' : '게시하기'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate('/')}
                        className="flex-1"
                      >
                        취소
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default WriteBlogPage;