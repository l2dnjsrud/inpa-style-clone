import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Navbar } from '@/components/Navbar';
import { MediaUpload } from '@/components/MediaUpload';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

import { supabase } from '@/integrations/supabase/client';
import { X } from 'lucide-react';

const categories = [
  'comfyui', 'ai-image', 'prompt-engineering', 'iu-fan', 'travel-cafe', 'python-vibe',
  'ai-video', 'daily-life', 'tech-review', 'creative-coding'
];

export default function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const saveDraft = async () => {
    if (!user || !title.trim() || !content.trim() || !category) {
      toast({
        title: "필수 항목 누락",
        description: "제목, 내용, 카테고리는 필수입니다.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    const { error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || content.slice(0, 150) + '...',
        slug: generateSlug(title) + '-' + Date.now(),
        category,
        tags,
        status: 'draft',
        read_time: calculateReadTime(content)
      });

    if (error) {
      toast({
        title: "저장 실패",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "초안 저장 완료",
        description: "포스트가 초안으로 저장되었습니다."
      });
      
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  const publishPost = async () => {
    if (!user || !title.trim() || !content.trim() || !category) {
      toast({
        title: "필수 항목 누락",
        description: "제목, 내용, 카테고리는 필수입니다.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    const { error } = await supabase
      .from('posts')
      .insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || content.slice(0, 150) + '...',
        slug: generateSlug(title) + '-' + Date.now(),
        category,
        tags,
        status: 'published',
        published_at: new Date().toISOString(),
        read_time: calculateReadTime(content)
      });

    if (error) {
      toast({
        title: "발행 실패",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "포스트 발행 완료",
        description: "포스트가 성공적으로 발행되었습니다."
      });
      
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  if (!user) return null;

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
                  <CardTitle className="text-2xl">새 포스트 작성</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">제목</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="포스트 제목을 입력하세요"
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">요약</Label>
                    <Textarea
                      id="excerpt"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="포스트 요약을 입력하세요 (선택사항)"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>카테고리</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="카테고리 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>태그</Label>
                      <div className="flex gap-2">
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="태그를 입력하고 Enter"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" onClick={addTag} variant="outline">
                          추가
                        </Button>
                      </div>
                      
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => removeTag(tag)}
                              />
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>미디어 첫부하기 📸</Label>
                    <MediaUpload 
                      onFilesChange={setMediaFiles}
                      maxFiles={10}
                      maxFileSize={50}
                      acceptedTypes={['image/*', 'video/*']}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">내용</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="포스트 내용을 작성하세요"
                      rows={20}
                      className="font-mono"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      onClick={saveDraft} 
                      variant="outline" 
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? "저장 중..." : "초안 저장"}
                    </Button>
                    
                    <Button 
                      onClick={publishPost} 
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? "발행 중..." : "포스트 발행"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}