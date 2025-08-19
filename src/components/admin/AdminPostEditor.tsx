import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, X, Image, Video } from "lucide-react";

interface Post {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  featured_image?: string;
  slug: string;
}

interface AdminPostEditorProps {
  post?: Post;
  onSave: (post: Post) => void;
  onCancel: () => void;
}

export function AdminPostEditor({ post, onSave, onCancel }: AdminPostEditorProps) {
  const [formData, setFormData] = useState<Post>({
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    category: post?.category || "",
    tags: post?.tags || [],
    status: post?.status || 'draft',
    featured_image: post?.featured_image || "",
    slug: post?.slug || "",
    ...(post?.id && { id: post.id })
  });
  
  const [newTag, setNewTag] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      toast.error('카테고리를 불러오는데 실패했습니다');
      return;
    }
    
    setCategories(data || []);
  };

  useState(() => {
    loadCategories();
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileUpload = async (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      toast.error('이미지 또는 비디오 파일만 업로드 가능합니다');
      return;
    }

    const bucket = isImage ? 'post-images' : 'post-videos';
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
    
    setIsLoading(true);
    setUploadProgress(0);

    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      // Insert the media URL into the content at cursor position
      const mediaTag = isImage 
        ? `\n![이미지](${publicUrl})\n`
        : `\n<video src="${publicUrl}" controls width="100%" height="auto"></video>\n`;
      
      setFormData(prev => ({
        ...prev,
        content: prev.content + mediaTag
      }));

      toast.success(`${isImage ? '이미지' : '비디오'}가 업로드되었습니다`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('파일 업로드에 실패했습니다');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('제목과 내용을 입력해주세요');
      return;
    }

    setIsLoading(true);

    try {
      const postData = {
        ...formData,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
        read_time: Math.ceil(formData.content.length / 200) // Rough estimation
      };

      if (post?.id) {
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', post.id);
        
        if (error) throw error;
        toast.success('포스트가 수정되었습니다');
      } else {
        const { error } = await supabase
          .from('posts')
          .insert(postData);
        
        if (error) throw error;
        toast.success('포스트가 생성되었습니다');
      }

      onSave(formData);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('포스트 저장에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{post?.id ? '포스트 수정' : '새 포스트 작성'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="포스트 제목을 입력하세요"
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">슬러그</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="post-slug"
              required
            />
          </div>

          <div>
            <Label htmlFor="excerpt">요약</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="포스트 요약을 입력하세요"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">카테고리</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>태그</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="태그를 입력하세요"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                추가
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="cursor-pointer">
                  {tag}
                  <X 
                    className="w-3 h-3 ml-1" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="content">내용</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  미디어 업로드
                </Button>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    업로드 중... {Math.round(uploadProgress)}%
                  </div>
                )}
              </div>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="포스트 내용을 마크다운으로 작성하세요"
                rows={15}
                required
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.status === 'published'}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ 
                  ...prev, 
                  status: checked ? 'published' : 'draft' 
                }))
              }
            />
            <Label htmlFor="published">
              {formData.status === 'published' ? '게시됨' : '임시저장'}
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '저장 중...' : (post?.id ? '수정' : '저장')}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
      </div>
    </form>
  );
}