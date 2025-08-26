import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { useRoom, ROOM_THEMES, MOOD_LIGHTING } from '@/hooks/useRoom';
import { useToast } from '@/hooks/use-toast';
import { Home, Palette, Lightbulb, Star, Heart, Sparkles, Coffee } from 'lucide-react';
import anime from 'animejs';

interface RoomCustomizer3DProps {
  onSave?: () => void;
  embedded?: boolean;
}

export function RoomCustomizer3D({ onSave, embedded = false }: RoomCustomizer3DProps) {
  const { room, loading, updateRoom } = useRoom();
  const { toast } = useToast();
  const [localRoom, setLocalRoom] = useState({
    room_theme: 'cozy_dev',
    background_color: '#F7FAFC',
    mood_lighting: 'warm',
    furniture: [],
    decorations: [],
    custom_elements: {}
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (room) {
      setLocalRoom({
        room_theme: room.room_theme || 'cozy_dev',
        background_color: room.background_color || '#F7FAFC',
        mood_lighting: room.mood_lighting || 'warm',
        furniture: room.furniture || [],
        decorations: room.decorations || [],
        custom_elements: room.custom_elements || {}
      });
    }
  }, [room]);

  useEffect(() => {
    // Animate room elements when component mounts
    anime({
      targets: '.room-element',
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 800,
      delay: anime.stagger(100),
      easing: 'easeOutElastic(1, .6)'
    });
  }, [localRoom.room_theme]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await updateRoom(localRoom);
      if (success) {
        toast({
          title: "룸 저장 완료! 🏠",
          description: "당신만의 특별한 공간이 업데이트되었습니다.",
        });
        onSave?.();
      } else {
        toast({
          title: "저장 실패",
          description: "룸 변경사항을 저장할 수 없습니다.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "예상치 못한 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const Room3DPreview = () => {
    const currentTheme = ROOM_THEMES[localRoom.room_theme as keyof typeof ROOM_THEMES];
    const currentLighting = MOOD_LIGHTING[localRoom.mood_lighting as keyof typeof MOOD_LIGHTING];
    
    return (
      <div className="relative w-full h-64 mx-auto room-3d overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 rounded-xl transition-colors duration-500"
          style={{ 
            background: `linear-gradient(135deg, ${currentTheme?.defaultBackground || '#F7FAFC'} 0%, ${localRoom.background_color} 100%)`
          }}
        />
        
        {/* Lighting Effect */}
        <div 
          className="absolute inset-0 rounded-xl opacity-30 transition-all duration-500"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${currentLighting?.color || '#FFA726'} 0%, transparent 50%)`
          }}
        />
        
        {/* Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/10 to-transparent rounded-b-xl" />
        
        {/* Furniture Elements */}
        <div className="absolute bottom-16 left-8 room-element floating-3d">
          <div className="text-4xl">🪑</div>
        </div>
        
        <div className="absolute bottom-20 right-12 room-element floating-3d">
          <div className="text-3xl">💻</div>
        </div>
        
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 room-element floating-3d">
          <div className="text-3xl">🖥️</div>
        </div>
        
        {/* IU-themed decorations */}
        <div className="absolute top-4 left-4 room-element iu-heart">
          <div className="text-2xl">💜</div>
        </div>
        
        <div className="absolute top-4 right-4 room-element sparkle-effect">
          <div className="text-2xl">✨</div>
        </div>
        
        <div className="absolute top-1/2 left-4 room-element floating-3d">
          <div className="text-xl">🌸</div>
        </div>
        
        {/* Character in room */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 room-element avatar-3d">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center text-2xl border-2 border-purple-300">
            👩‍💻
          </div>
        </div>
        
        {/* Room name overlay */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-purple-700">
            {currentTheme?.name || '코지 개발 공간'}
          </Badge>
        </div>
      </div>
    );
  };

  const IUThemeRooms = {
    iu_fan_room: {
      name: 'IU 팬룸 💜',
      description: '아이유를 사랑하는 공간',
      defaultBackground: '#E6E6FA',
      moodLighting: 'artistic',
      icon: '💜'
    },
    coding_cafe: {
      name: '코딩 카페 ☕',
      description: '카페 같은 편안한 코딩 공간',
      defaultBackground: '#F5E6D3',
      moodLighting: 'warm',
      icon: '☕'
    },
    ai_studio: {
      name: 'AI 스튜디오 🤖',
      description: 'ComfyUI와 AI 작업을 위한 공간',
      defaultBackground: '#E0F2F1',
      moodLighting: 'neon',
      icon: '🤖'
    },
    travel_memories: {
      name: '여행 추억방 ✈️',
      description: '여행 기억들을 담은 공간',
      defaultBackground: '#FFF3E0',
      moodLighting: 'natural',
      icon: '✈️'
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">룸 정보를 불러오는 중...</div>
        </CardContent>
      </Card>
    );
  }

  const content = (
    <div className="space-y-6">
      {/* 3D Room Preview */}
      <div className="text-center">
        <Room3DPreview />
      </div>

      {/* Customization Tabs */}
      <Tabs defaultValue="themes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            테마
          </TabsTrigger>
          <TabsTrigger value="lighting" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            조명
          </TabsTrigger>
          <TabsTrigger value="decorations" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            장식
          </TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">이원경님을 위한 특별한 테마 ✨</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(IUThemeRooms).map(([key, theme]) => (
                <Button
                  key={key}
                  variant={localRoom.room_theme === key ? "default" : "outline"}
                  className="h-auto p-4 text-left bondee-card"
                  onClick={() => setLocalRoom(prev => ({ ...prev, room_theme: key }))}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{theme.icon}</span>
                      <div className="font-medium">{theme.name}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{theme.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">기본 테마</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(ROOM_THEMES).map(([key, theme]) => (
                <Button
                  key={key}
                  variant={localRoom.room_theme === key ? "default" : "outline"}
                  className="h-auto p-3 text-left bondee-card"
                  onClick={() => setLocalRoom(prev => ({ ...prev, room_theme: key }))}
                >
                  <div>
                    <div className="font-medium text-sm">{theme.name}</div>
                    <div className="text-xs text-muted-foreground">{theme.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="lighting" className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">무드 조명 🌟</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(MOOD_LIGHTING).map(([key, lighting]) => (
                <Button
                  key={key}
                  variant={localRoom.mood_lighting === key ? "default" : "outline"}
                  className="h-auto p-3 text-left bondee-card"
                  onClick={() => setLocalRoom(prev => ({ ...prev, mood_lighting: key }))}
                >
                  <div>
                    <div className="font-medium text-sm">{lighting.name}</div>
                    <div className="text-xs text-muted-foreground">
                      강도: {lighting.intensity}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="decorations" className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">IU 컬렉션 💜</h4>
            <div className="grid grid-cols-4 gap-3">
              {['💜', '🌸', '✨', '🎤', '📷', '☕', '🌙', '⭐'].map((emoji, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="aspect-square bondee-card hover:scale-105 transition-transform"
                  size="sm"
                >
                  <span className="text-xl">{emoji}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">개발자 아이템 💻</h4>
            <div className="grid grid-cols-4 gap-3">
              {['💻', '🖥️', '⌨️', '🖱️', '📱', '🎧', '☕', '📚'].map((emoji, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="aspect-square bondee-card hover:scale-105 transition-transform"
                  size="sm"
                >
                  <span className="text-xl">{emoji}</span>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <Button 
        onClick={handleSave} 
        disabled={saving}
        className="w-full bondee-card bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        size="lg"
      >
        {saving ? '저장 중...' : '룸 저장하기 💜'}
      </Button>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <Card className="bondee-card sparkle-effect">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5 text-purple-400" />
          나만의 공간 꾸미기 🏠
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}