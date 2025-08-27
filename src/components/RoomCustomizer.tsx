import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRoom, ROOM_THEMES, MOOD_LIGHTING } from '@/hooks/useRoom';
import { useToast } from '@/hooks/use-toast';
import { Home, Palette, Lightbulb, Sofa, Star } from 'lucide-react';

interface RoomCustomizerProps {
  onSave?: () => void;
  embedded?: boolean;
}

export function RoomCustomizer({ onSave, embedded = false }: RoomCustomizerProps) {
  const { room, loading, updateRoom, changeTheme } = useRoom();
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState('cozy_dev');
  const [selectedLighting, setSelectedLighting] = useState('warm');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (room) {
      setSelectedTheme(room.room_theme || 'cozy_dev');
      setSelectedLighting(room.mood_lighting || 'warm');
    }
  }, [room]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await updateRoom({
        room_theme: selectedTheme,
        mood_lighting: selectedLighting
      });
      
      if (success) {
        toast({
          title: "Room Updated!",
          description: "Your personal space has been customized.",
        });
        onSave?.();
      } else {
        toast({
          title: "Update Failed",
          description: "Could not save your room changes.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const RoomPreview = () => {
    const theme = ROOM_THEMES[selectedTheme as keyof typeof ROOM_THEMES] || ROOM_THEMES.cozy_dev;
    const lighting = MOOD_LIGHTING[selectedLighting as keyof typeof MOOD_LIGHTING] || MOOD_LIGHTING.warm;
    
    return (
      <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-primary/20">
        {/* Room Background */}
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: theme.defaultBackground }}
        >
          {/* Floor */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-400 to-gray-300" />
          
          {/* Back Wall */}
          <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-gray-200 to-gray-100" />
          
          {/* Furniture - Desk */}
          <div className="absolute bottom-16 right-8 w-16 h-8 bg-amber-800 rounded-t-lg">
            {/* Monitor */}
            <div className="absolute -top-6 left-2 w-12 h-6 bg-black rounded-sm">
              <div className="w-full h-full bg-blue-400 rounded-sm m-0.5"></div>
            </div>
            {/* Keyboard */}
            <div className="absolute -top-1 left-4 w-8 h-2 bg-gray-600 rounded-sm"></div>
          </div>
          
          {/* Chair */}
          <div className="absolute bottom-16 right-16 w-6 h-12 bg-red-600 rounded-t-lg"></div>
          
          {/* Room decorations based on furniture array */}
          {room?.furniture?.map((furniture: any, index: number) => (
            <div 
              key={index}
              className="absolute"
              style={{
                left: `${furniture.x || 20}%`,
                bottom: `${furniture.y || 20}%`,
                transform: 'translate(-50%, 0)'
              }}
            >
              <div className="text-2xl">{furniture.icon || '🪑'}</div>
            </div>
          ))}
          
          {/* Decorations */}
          {room?.decorations?.map((decoration: any, index: number) => (
            <div 
              key={index}
              className="absolute"
              style={{
                left: `${decoration.x || 10}%`,
                top: `${decoration.y || 10}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="text-lg">{decoration.icon || '🖼️'}</div>
            </div>
          ))}
          
          {/* Mood Lighting Effect */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
            style={{ 
              backgroundColor: lighting.color === 'rainbow' ? '#ff6b6b' : lighting.color,
              background: lighting.color === 'rainbow' 
                ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57)'
                : undefined
            }}
          />
          
          {/* Room Level Badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              Level {room?.room_level || 1}
            </Badge>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading room...</div>
        </CardContent>
      </Card>
    );
  }

  const content = (
    <div className="space-y-6">
      {/* Room Preview */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Your Personal Space</h3>
        <RoomPreview />
      </div>

      {/* Customization Tabs */}
      <Tabs defaultValue="themes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Themes
          </TabsTrigger>
          <TabsTrigger value="lighting" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Lighting
          </TabsTrigger>
          <TabsTrigger value="furniture" className="flex items-center gap-2">
            <Sofa className="w-4 h-4" />
            Furniture
          </TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Choose Your Room Theme</h4>
            <ScrollArea className="h-64">
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(ROOM_THEMES).map(([key, theme]) => (
                  <Button
                    key={key}
                    variant={selectedTheme === key ? "default" : "outline"}
                    className="h-auto p-4 text-left justify-start"
                    onClick={() => setSelectedTheme(key)}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{theme.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {theme.description}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: theme.defaultBackground }}
                        />
                        <span className="text-xs">
                          {theme.moodLighting} lighting
                        </span>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="lighting" className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Mood Lighting</h4>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(MOOD_LIGHTING).map(([key, lighting]) => (
                <Button
                  key={key}
                  variant={selectedLighting === key ? "default" : "outline"}
                  className="h-auto p-3 text-left justify-start"
                  onClick={() => setSelectedLighting(key)}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full border"
                      style={{ 
                        backgroundColor: lighting.color === 'rainbow' ? '#ff6b6b' : lighting.color,
                        background: lighting.color === 'rainbow' 
                          ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)'
                          : undefined
                      }}
                    />
                    <div>
                      <div className="font-medium">{lighting.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {lighting.intensity} intensity
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="furniture" className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Room Items</h4>
            <div className="text-center text-muted-foreground py-8">
              <Sofa className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Furniture customization coming soon!</p>
              <p className="text-sm mt-1">
                Unlock new items by leveling up and completing achievements.
              </p>
            </div>
            
            {/* Show current furniture if any */}
            {room?.furniture && room.furniture.length > 0 && (
              <div>
                <h5 className="text-sm font-medium mb-2">Current Furniture</h5>
                <div className="flex flex-wrap gap-2">
                  {room.furniture.map((item: any, index: number) => (
                    <Badge key={index} variant="outline">
                      {item.icon} {item.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Show current decorations if any */}
            {room?.decorations && room.decorations.length > 0 && (
              <div>
                <h5 className="text-sm font-medium mb-2">Decorations</h5>
                <div className="flex flex-wrap gap-2">
                  {room.decorations.map((item: any, index: number) => (
                    <Badge key={index} variant="outline">
                      {item.icon} {item.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <Button 
        onClick={handleSave} 
        disabled={saving}
        className="w-full"
        size="lg"
      >
        {saving ? 'Saving...' : 'Update Room'}
      </Button>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="w-5 h-5" />
          Customize Your Room
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}