import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download, Eye, Code2, Palette } from 'lucide-react';

interface BadgeConfig {
  label: string;
  message: string;
  color: string;
  style: string;
  logo?: string;
  logoColor?: string;
  labelColor?: string;
}

export function BadgeGenerator() {
  const { toast } = useToast();
  const [badgeConfig, setBadgeConfig] = useState<BadgeConfig>({
    label: 'Blog',
    message: 'Portfolio',
    color: 'blue',
    style: 'flat'
  });

  const [generatedMarkdown, setGeneratedMarkdown] = useState('');
  const [previewMode, setPreviewMode] = useState<'shield' | 'markdown' | 'html'>('shield');

  const colorOptions = [
    { value: 'brightgreen', label: '밝은 녹색', hex: '#4c1' },
    { value: 'green', label: '녹색', hex: '#97CA00' },
    { value: 'yellowgreen', label: '황녹색', hex: '#a4a61d' },
    { value: 'yellow', label: '노란색', hex: '#dfb317' },
    { value: 'orange', label: '주황색', hex: '#fe7d37' },
    { value: 'red', label: '빨간색', hex: '#e05d44' },
    { value: 'lightgrey', label: '연한 회색', hex: '#9f9f9f' },
    { value: 'blue', label: '파란색', hex: '#007ec6' },
    { value: 'blueviolet', label: '청보라색', hex: '#8a2be2' },
    { value: 'ff69b4', label: '핫핑크', hex: '#ff69b4' },
    { value: '9cf', label: '하늘색', hex: '#9cf' }
  ];

  const styleOptions = [
    { value: 'flat', label: 'Flat' },
    { value: 'flat-square', label: 'Flat Square' },
    { value: 'plastic', label: 'Plastic' },
    { value: 'for-the-badge', label: 'For the Badge' },
    { value: 'social', label: 'Social' }
  ];

  const logoOptions = [
    { value: 'github', label: 'GitHub' },
    { value: 'react', label: 'React' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'vue.js', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'docker', label: 'Docker' },
    { value: 'kubernetes', label: 'Kubernetes' },
    { value: 'aws', label: 'AWS' },
    { value: 'firebase', label: 'Firebase' }
  ];

  const generateBadgeURL = () => {
    const baseURL = 'https://img.shields.io/badge';
    const encodedLabel = encodeURIComponent(badgeConfig.label);
    const encodedMessage = encodeURIComponent(badgeConfig.message);
    
    let url = `${baseURL}/${encodedLabel}-${encodedMessage}-${badgeConfig.color}`;
    
    const params = new URLSearchParams();
    if (badgeConfig.style !== 'flat') params.append('style', badgeConfig.style);
    if (badgeConfig.logo) params.append('logo', badgeConfig.logo);
    if (badgeConfig.logoColor) params.append('logoColor', badgeConfig.logoColor);
    if (badgeConfig.labelColor) params.append('labelColor', badgeConfig.labelColor);
    
    if (params.toString()) {
      url += '?' + params.toString();
    }
    
    return url;
  };

  const generateMarkdown = () => {
    const url = generateBadgeURL();
    const markdown = `![${badgeConfig.label}](${url})`;
    setGeneratedMarkdown(markdown);
    return markdown;
  };

  const generateHTML = () => {
    const url = generateBadgeURL();
    return `<img src="${url}" alt="${badgeConfig.label}" />`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "복사되었습니다! 📋",
        description: "클립보드에 코드가 복사되었습니다.",
      });
    });
  };

  const presetBadges = [
    { label: 'Blog', message: 'Portfolio', color: 'blue', logo: 'github' },
    { label: 'Python', message: 'Expert', color: 'brightgreen', logo: 'python' },
    { label: 'ComfyUI', message: 'Specialist', color: 'orange', logo: 'react' },
    { label: 'AI', message: 'Researcher', color: 'blueviolet', logo: 'tensorflow' },
    { label: 'Status', message: 'Active', color: 'brightgreen' },
    { label: 'Posts', message: '12+', color: 'blue' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            GitHub 스타일 배지 생성기
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="label">라벨</Label>
                  <Input
                    id="label"
                    value={badgeConfig.label}
                    onChange={(e) => setBadgeConfig(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="예: Python"
                  />
                </div>
                <div>
                  <Label htmlFor="message">메시지</Label>
                  <Input
                    id="message"
                    value={badgeConfig.message}
                    onChange={(e) => setBadgeConfig(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="예: Expert"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>색상</Label>
                  <Select 
                    value={badgeConfig.color} 
                    onValueChange={(value) => setBadgeConfig(prev => ({ ...prev, color: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border" 
                              style={{ backgroundColor: color.hex }}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>스타일</Label>
                  <Select 
                    value={badgeConfig.style} 
                    onValueChange={(value) => setBadgeConfig(prev => ({ ...prev, style: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styleOptions.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>로고 (선택사항)</Label>
                <Select 
                  value={badgeConfig.logo || ''} 
                  onValueChange={(value) => setBadgeConfig(prev => ({ ...prev, logo: value || undefined }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="로고 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">로고 없음</SelectItem>
                    {logoOptions.map((logo) => (
                      <SelectItem key={logo.value} value={logo.value}>
                        {logo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced Options */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logoColor">로고 색상 (선택사항)</Label>
                  <Input
                    id="logoColor"
                    value={badgeConfig.logoColor || ''}
                    onChange={(e) => setBadgeConfig(prev => ({ ...prev, logoColor: e.target.value || undefined }))}
                    placeholder="예: white, #ffffff"
                  />
                </div>
                <div>
                  <Label htmlFor="labelColor">라벨 색상 (선택사항)</Label>
                  <Input
                    id="labelColor"
                    value={badgeConfig.labelColor || ''}
                    onChange={(e) => setBadgeConfig(prev => ({ ...prev, labelColor: e.target.value || undefined }))}
                    placeholder="예: #555"
                  />
                </div>
              </div>
            </div>

            {/* Preview & Output */}
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4" />
                  미리보기
                </Label>
                <div className="p-4 border rounded-lg bg-gray-50 text-center">
                  <img 
                    src={generateBadgeURL()} 
                    alt="Badge Preview" 
                    className="inline-block"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>

              <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="shield">Shield URL</TabsTrigger>
                  <TabsTrigger value="markdown">Markdown</TabsTrigger>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                </TabsList>

                <TabsContent value="shield" className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Shield URL</Label>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(generateBadgeURL())}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <Textarea 
                    value={generateBadgeURL()} 
                    readOnly 
                    rows={3}
                    className="font-mono text-sm"
                  />
                </TabsContent>

                <TabsContent value="markdown" className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Markdown</Label>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(generateMarkdown())}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <Textarea 
                    value={generateMarkdown()} 
                    readOnly 
                    rows={2}
                    className="font-mono text-sm"
                  />
                </TabsContent>

                <TabsContent value="html" className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>HTML</Label>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard(generateHTML())}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <Textarea 
                    value={generateHTML()} 
                    readOnly 
                    rows={2}
                    className="font-mono text-sm"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preset Badges */}
      <Card>
        <CardHeader>
          <CardTitle>프리셋 배지</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {presetBadges.map((preset, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => setBadgeConfig(prev => ({ 
                  ...prev, 
                  ...preset,
                  style: prev.style 
                }))}
              >
                <img 
                  src={`https://img.shields.io/badge/${encodeURIComponent(preset.label)}-${encodeURIComponent(preset.message)}-${preset.color}${preset.logo ? `?logo=${preset.logo}` : ''}`}
                  alt={preset.label}
                  className="mb-1"
                />
                <span className="text-xs text-muted-foreground">
                  {preset.label} - {preset.message}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}