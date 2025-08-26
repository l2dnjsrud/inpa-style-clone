import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import anime from 'animejs';

interface FluidNotification {
  id: string;
  type: 'success' | 'achievement' | 'level_up' | 'xp_gain';
  title: string;
  description: string;
  icon: string;
  duration: number;
}

interface FluidNotificationsProps {
  notifications: FluidNotification[];
  onRemove: (id: string) => void;
  className?: string;
}

export function FluidNotifications({ notifications, onRemove, className = '' }: FluidNotificationsProps) {
  useEffect(() => {
    // Animate in new notifications
    if (notifications.length > 0) {
      anime({
        targets: '.fluid-notification:last-child',
        translateX: [300, 0],
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutElastic(1, .6)'
      });
    }
  }, [notifications.length]);

  const getNotificationStyle = (type: string) => {
    const styles = {
      success: 'from-green-400 to-emerald-500 border-green-300',
      achievement: 'from-yellow-400 to-orange-500 border-yellow-300',
      level_up: 'from-purple-400 to-pink-500 border-purple-300',
      xp_gain: 'from-blue-400 to-cyan-500 border-blue-300'
    };
    return styles[type as keyof typeof styles] || styles.success;
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      success: '✅',
      achievement: '🏆',
      level_up: '🎊',
      xp_gain: '✨'
    };
    return icons[type as keyof typeof icons] || '✨';
  };

  if (notifications.length === 0) return null;

  return (
    <div className={`fixed top-20 right-4 z-50 space-y-3 ${className}`}>
      {notifications.map((notification, index) => (
        <Card 
          key={notification.id}
          className={`fluid-notification bondee-card w-80 bg-gradient-to-r ${getNotificationStyle(notification.type)} text-white border-2 shadow-lg backdrop-blur-sm`}
          style={{
            transform: `translateY(${index * -10}px) scale(${1 - index * 0.05})`,
            zIndex: 1000 - index
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="text-2xl animate-bounce-3d">
                {notification.icon || getTypeIcon(notification.type)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-sm">{notification.title}</h4>
                  <Badge 
                    variant="secondary" 
                    className="bg-white/20 text-white text-xs border-white/30"
                  >
                    {notification.type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs opacity-90 leading-relaxed">
                  {notification.description}
                </p>
              </div>
              
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 text-white/80 hover:text-white hover:bg-white/20"
                onClick={() => onRemove(notification.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/60 rounded-full transition-all duration-100"
                style={{
                  animation: `shrink-progress ${notification.duration}ms linear forwards`
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Global styles for progress animation - using CSS-in-JS approach */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shrink-progress {
            from { width: 100%; }
            to { width: 0%; }
          }
        `
      }} />
    </div>
  );
}
