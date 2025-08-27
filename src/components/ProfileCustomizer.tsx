import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { BadgeGenerator } from '@/components/BadgeGenerator';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Save, 
  Upload, 
  Eye, 
  EyeOff, 
  Plus, 
  X,
  Github,
  Twitter,
  Globe,
  Mail
} from 'lucide-react';

interface ProfileSettings {
  displayName: string;
  bio: string;
  location: string;
  website: string;
  githubUsername: string;
  twitterUsername: string;
  email: string;
  isPublic: boolean;
  showEmail: boolean;
  showStats: boolean;
  techStack: string[];
  customBadges: CustomBadge[];
}

interface CustomBadge {
  id: string;
  label: string;
  message: string;
  color: string;
  logo?: string;
}

export function ProfileCustomizer() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ProfileSettings>({
    displayName: '이원경 (WonKyung Lee)',
    bio: 'AI 이미지 & 비디오 생성 연구자 | ComfyUI 전문가 | 10년차 IU 팬 💜',
    location: 'Seoul, South Korea',
    website: '',
    githubUsername: '',
    twitterUsername: '',
    email: '',
    isPublic: true,
    showEmail: false,
    showStats: true,
    techStack: ['ComfyUI', 'Python', 'AI/ML', 'Prompt Engineering', 'Stable Diffusion'],
    customBadges: []
  });
  
  const [newTech, setNewTech] = useState('');
  const [newBadge, setNewBadge] = useState({
    label: '',
    message: '',
    color: '#3b82f6'
  });

  const handleSave = async () => {
    try {
      // Here you would typically save to your database
      console.log('Saving profile settings:', settings);
      
      toast({
        title: "프로필이 업데이트되었습니다! ✨",
        description: "변경사항이 성공적으로 저장되었습니다.",
      });
    } catch (error) {
      toast({
        title: "저장 실패",
        description: "프로필 업데이트 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  const addTechStack = () => {
    if (newTech.trim() && !settings.techStack.includes(newTech.trim())) {
      setSettings(prev => ({
        ...prev,
        techStack: [...prev.techStack, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTechStack = (tech: string) => {
    setSettings(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const addCustomBadge = () => {
    if (newBadge.label && newBadge.message) {
      const badge: CustomBadge = {
        id: Date.now().toString(),
        ...newBadge
      };
      setSettings(prev => ({
        ...prev,
        customBadges: [...prev.customBadges, badge]
      }));
      setNewBadge({ label: '', message: '', color: '#3b82f6' });
    }
  };

  const removeCustomBadge = (id: string) => {
    setSettings(prev => ({
      ...prev,
      customBadges: prev.customBadges.filter(b => b.id !== id)
    }));
  };

  const PreviewSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          프로필 미리보기
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg border-blue-200 border">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
              이원경
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{settings.displayName}</h3>
              <p className="text-muted-foreground mb-3">{settings.bio}</p>
              
              {/* Tech Stack Preview */}
              <div className="flex flex-wrap gap-2 mb-3">
                {settings.techStack.map((tech) => (
                  <Badge key={tech} className="bg-blue-100 text-blue-700">
                    {tech}
                  </Badge>
                ))}
              </div>

              {/* Custom Badges Preview */}
              <div className="flex flex-wrap gap-2 mb-3">
                {settings.customBadges.map((badge) => (
                  <Badge 
                    key={badge.id} 
                    style={{ backgroundColor: badge.color, color: 'white' }}
                  >
                    {badge.label}: {badge.message}
                  </Badge>
                ))}
              </div>

              {/* Links Preview */}
              <div className="flex gap-2 text-sm text-muted-foreground">
                {settings.location && (
                  <span>📍 {settings.location}</span>
                )}
                {settings.website && (
                  <span>🔗 {settings.website}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PreviewSection />

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            기본 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="displayName">표시 이름</Label>
            <Input
              id="displayName"
              value={settings.displayName}
              onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
              placeholder="이름을 입력하세요"
            />
          </div>

          <div>
            <Label htmlFor="bio">자기소개</Label>
            <Textarea
              id="bio"
              value={settings.bio}
              onChange={(e) => setSettings(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="자신을 소개해보세요"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">위치</Label>
              <Input
                id="location"
                value={settings.location}
                onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Seoul, South Korea"
              />
            </div>

            <div>
              <Label htmlFor="website">웹사이트</Label>
              <Input
                id="website"
                value={settings.website}
                onChange={(e) => setSettings(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            소셜 링크
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="github">GitHub 사용자명</Label>
              <Input
                id="github"
                value={settings.githubUsername}
                onChange={(e) => setSettings(prev => ({ ...prev, githubUsername: e.target.value }))}
                placeholder="username"
              />
            </div>

            <div>
              <Label htmlFor="twitter">Twitter 사용자명</Label>
              <Input
                id="twitter"
                value={settings.twitterUsername}
                onChange={(e) => setSettings(prev => ({ ...prev, twitterUsername: e.target.value }))}
                placeholder="@username"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card>
        <CardHeader>
          <CardTitle>기술 스택</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {settings.techStack.map((tech) => (
              <Badge 
                key={tech} 
                variant="outline" 
                className="flex items-center gap-1 pr-1"
              >
                {tech}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeTechStack(tech)}
                  className="h-4 w-4 p-0 hover:bg-red-100"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              placeholder="새로운 기술 추가"
              onKeyPress={(e) => e.key === 'Enter' && addTechStack()}
            />
            <Button onClick={addTechStack} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom Badges */}
      <Card>
        <CardHeader>
          <CardTitle>커스텀 배지 (GitHub Shields 스타일)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {settings.customBadges.map((badge) => (
              <Badge 
                key={badge.id}
                style={{ backgroundColor: badge.color, color: 'white' }}
                className="flex items-center gap-1 pr-1"
              >
                {badge.label}: {badge.message}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeCustomBadge(badge.id)}
                  className="h-4 w-4 p-0 hover:bg-white/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              value={newBadge.label}
              onChange={(e) => setNewBadge(prev => ({ ...prev, label: e.target.value }))}
              placeholder="라벨 (예: Python)"
            />
            <Input
              value={newBadge.message}
              onChange={(e) => setNewBadge(prev => ({ ...prev, message: e.target.value }))}
              placeholder="메시지 (예: Expert)"
            />
            <div className="flex gap-2">
              <Input
                type="color"
                value={newBadge.color}
                onChange={(e) => setNewBadge(prev => ({ ...prev, color: e.target.value }))}
                className="w-16"
              />
              <Button onClick={addCustomBadge} size="sm" className="flex-1">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>프라이버시 설정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">공개 프로필</div>
              <div className="text-sm text-muted-foreground">다른 사용자가 프로필을 볼 수 있습니다</div>
            </div>
            <Switch
              checked={settings.isPublic}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, isPublic: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">이메일 표시</div>
              <div className="text-sm text-muted-foreground">프로필에 이메일 주소를 표시합니다</div>
            </div>
            <Switch
              checked={settings.showEmail}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showEmail: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">통계 표시</div>
              <div className="text-sm text-muted-foreground">포스트 수, 조회수 등의 통계를 표시합니다</div>
            </div>
            <Switch
              checked={settings.showStats}
              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showStats: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Badge Generator */}
      <BadgeGenerator />

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          프로필 저장
        </Button>
      </div>
    </div>
  );
}