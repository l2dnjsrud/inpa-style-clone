import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Hash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  color: string;
  post_count: number;
}

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
}

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: '#6366f1'
  });

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Load categories error:', error);
      toast.error('카테고리를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#6366f1'
    });
    setEditingCategory(null);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      color: category.color
    });
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('카테고리 이름을 입력해주세요');
      return;
    }

    try {
      const categoryData = {
        ...formData,
        slug: generateSlug(formData.name)
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);
        
        if (error) throw error;
        toast.success('카테고리가 수정되었습니다');
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([categoryData]);
        
        if (error) throw error;
        toast.success('카테고리가 생성되었습니다');
      }

      setDialogOpen(false);
      resetForm();
      loadCategories();
    } catch (error) {
      console.error('Save category error:', error);
      toast.error('카테고리 저장에 실패했습니다');
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      toast.success('카테고리가 삭제되었습니다');
    } catch (error) {
      console.error('Delete category error:', error);
      toast.error('카테고리 삭제에 실패했습니다');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">카테고리를 불러오는 중...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">카테고리 관리</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              새 카테고리 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? '카테고리 수정' : '새 카테고리 추가'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  카테고리 이름
                </label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="카테고리 이름을 입력하세요"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  설명
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="카테고리 설명을 입력하세요"
                  rows={3}
                />
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium mb-1">
                  색상
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-10 rounded border border-input"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    placeholder="#6366f1"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingCategory ? '수정' : '생성'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  취소
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Hash className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">카테고리가 없습니다.</p>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              첫 번째 카테고리 추가하기
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <h3 className="font-semibold">{category.name}</h3>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(category)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>카테고리 삭제</AlertDialogTitle>
                          <AlertDialogDescription>
                            "{category.name}" 카테고리를 삭제하시겠습니까? 
                            이 작업은 되돌릴 수 없습니다.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>취소</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteCategory(category.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            삭제
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {category.description || '설명이 없습니다.'}
                </p>
                <div className="flex justify-between items-center">
                  <Badge variant="outline">
                    {category.post_count || 0}개 포스트
                  </Badge>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {category.slug}
                  </code>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}