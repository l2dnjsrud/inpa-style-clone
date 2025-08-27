import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useAvatar, AVATAR_STYLES, HAIR_STYLES, CLOTHING_OPTIONS, COLOR_PALETTE } from '@/hooks/useAvatar';
import { useToast } from '@/hooks/use-toast';
import { Palette, User, Shirt, Sparkles } from 'lucide-react';

interface AvatarCustomizerProps {
  onSave?: () => void;
  embedded?: boolean;
}

export function AvatarCustomizer({ onSave, embedded = false }: AvatarCustomizerProps) {
  const { avatar, loading, updateAvatar } = useAvatar();
  const { toast } = useToast();
  const [localAvatar, setLocalAvatar] = useState({
    character_name: '',
    avatar_style: 'casual',
    hair_style: 'default',
    hair_color: '#4A5568',
    skin_tone: '#F7FAFC',
    clothing: 'hoodie',
    clothing_color: '#3182CE',
    accessories: []
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (avatar) {
      setLocalAvatar({
        character_name: avatar.character_name || '',
        avatar_style: avatar.avatar_style || 'casual',
        hair_style: avatar.hair_style || 'default',
        hair_color: avatar.hair_color || '#4A5568',
        skin_tone: avatar.skin_tone || '#F7FAFC',
        clothing: avatar.clothing || 'hoodie',
        clothing_color: avatar.clothing_color || '#3182CE',
        accessories: avatar.accessories || []
      });
    }
  }, [avatar]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await updateAvatar(localAvatar);
      if (success) {
        toast({
          title: "Avatar Saved!",
          description: "Your character has been updated successfully.",
        });
        onSave?.();
      } else {
        toast({
          title: "Save Failed",
          description: "Could not save your avatar changes.",
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

  const AvatarPreview = () => (
    <div className="relative w-48 h-48 mx-auto bg-gradient-to-b from-blue-100 to-blue-200 rounded-full overflow-hidden border-4 border-primary/20">
      {/* Character Body */}
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-t-full"
        style={{ backgroundColor: localAvatar.skin_tone }}
      >
        {/* Clothing */}
        <div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 h-24 rounded-t-lg"
          style={{ backgroundColor: localAvatar.clothing_color }}
        />
        
        {/* Head */}
        <div 
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full"
          style={{ backgroundColor: localAvatar.skin_tone }}
        >
          {/* Hair */}
          <div 
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-24 h-16 rounded-t-full"
            style={{ backgroundColor: localAvatar.hair_color }}
          />
          
          {/* Eyes */}
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <div className="w-2 h-2 bg-black rounded-full"></div>
          </div>
          
          {/* Smile */}
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-black rounded-b-full"></div>
        </div>
        
        {/* Accessories */}
        {localAvatar.accessories.map((accessory: any, index: number) => (
          <div key={index} className="absolute top-4 right-2">
            <span className="text-lg">{accessory.icon || '👓'}</span>
          </div>
        ))}
      </div>
      
      {/* Character Name */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
        <Badge variant="secondary" className="text-xs">
          {localAvatar.character_name || 'Your Character'}
        </Badge>
      </div>
    </div>
  );

  const ColorPicker = ({ value, onChange, label }: { value: string; onChange: (color: string) => void; label: string }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="grid grid-cols-5 gap-2">
        {COLOR_PALETTE.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              value === color ? 'border-black scale-110' : 'border-gray-300 hover:scale-105'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
          />
        ))}
      </div>
      <Input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8"
      />
    </div>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading avatar...</div>
        </CardContent>
      </Card>
    );
  }

  const content = (
    <div className="space-y-6">
      {/* Avatar Preview */}
      <div className="text-center">
        <AvatarPreview />
      </div>

      {/* Customization Tabs */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Basic
          </TabsTrigger>
          <TabsTrigger value="style" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Style
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="clothing" className="flex items-center gap-2">
            <Shirt className="w-4 h-4" />
            Clothing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label htmlFor="character-name">Character Name</Label>
            <Input
              id="character-name"
              value={localAvatar.character_name}
              onChange={(e) => setLocalAvatar(prev => ({ ...prev, character_name: e.target.value }))}
              placeholder="Enter your character's name"
            />
          </div>
          
          <div>
            <Label>Avatar Style</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {Object.entries(AVATAR_STYLES).map(([key, style]) => (
                <Button
                  key={key}
                  variant={localAvatar.avatar_style === key ? "default" : "outline"}
                  className="h-auto p-3 text-left"
                  onClick={() => setLocalAvatar(prev => ({ ...prev, avatar_style: key }))}
                >
                  <div>
                    <div className="font-medium">{style.name}</div>
                    <div className="text-xs text-muted-foreground">{style.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          <div>
            <Label>Hair Style</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {Object.entries(HAIR_STYLES).map(([key, name]) => (
                <Button
                  key={key}
                  variant={localAvatar.hair_style === key ? "default" : "outline"}
                  className="text-left"
                  onClick={() => setLocalAvatar(prev => ({ ...prev, hair_style: key }))}
                >
                  {name}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <ColorPicker
            value={localAvatar.hair_color}
            onChange={(color) => setLocalAvatar(prev => ({ ...prev, hair_color: color }))}
            label="Hair Color"
          />
          
          <ColorPicker
            value={localAvatar.skin_tone}
            onChange={(color) => setLocalAvatar(prev => ({ ...prev, skin_tone: color }))}
            label="Skin Tone"
          />
        </TabsContent>

        <TabsContent value="clothing" className="space-y-4">
          <div>
            <Label>Clothing Type</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {Object.entries(CLOTHING_OPTIONS).map(([key, name]) => (
                <Button
                  key={key}
                  variant={localAvatar.clothing === key ? "default" : "outline"}
                  className="text-left"
                  onClick={() => setLocalAvatar(prev => ({ ...prev, clothing: key }))}
                >
                  {name}
                </Button>
              ))}
            </div>
          </div>
          
          <ColorPicker
            value={localAvatar.clothing_color}
            onChange={(color) => setLocalAvatar(prev => ({ ...prev, clothing_color: color }))}
            label="Clothing Color"
          />
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <Button 
        onClick={handleSave} 
        disabled={saving}
        className="w-full"
        size="lg"
      >
        {saving ? 'Saving...' : 'Save Avatar'}
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
          <User className="w-5 h-5" />
          Customize Your Avatar
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}