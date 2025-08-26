import { useState, useEffect, useCallback } from 'react';
import { useExperience } from './useExperience';
import { useAvatar } from './useAvatar';
import { useRoom } from './useRoom';
import { useAchievements } from './useAchievements';
import { useToast } from './use-toast';
import anime from 'animejs';

interface GameAction {
  type: 'level_up' | 'achievement_unlock' | 'xp_gain' | 'customization_change' | 'post_published';
  data?: any;
  source?: string;
}

interface FluidNotification {
  id: string;
  type: 'success' | 'achievement' | 'level_up' | 'xp_gain';
  title: string;
  description: string;
  icon: string;
  duration: number;
}

interface GameState {
  level: number;
  xp: number;
  avatar: any;
  room: any;
  achievements: any[];
  isLevelingUp: boolean;
  notifications: FluidNotification[];
}

export function useGameFluid() {
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    xp: 0,
    avatar: null,
    room: null,
    achievements: [],
    isLevelingUp: false,
    notifications: []
  });

  const [activeConnections, setActiveConnections] = useState<string[]>([]);
  const { experience } = useExperience();
  const { avatar } = useAvatar();
  const { room } = useRoom();
  const { completedAchievements } = useAchievements();
  const { toast } = useToast();

  // Update game state when individual systems change
  useEffect(() => {
    if (experience) {
      const prevLevel = gameState.level;
      const newLevel = experience.current_level || 1;
      
      setGameState(prev => ({
        ...prev,
        level: newLevel,
        xp: experience.total_xp || 0
      }));

      // Trigger level up celebration
      if (newLevel > prevLevel && prevLevel > 0) {
        triggerLevelUp(newLevel);
      }
    }
  }, [experience]);

  useEffect(() => {
    setGameState(prev => ({ ...prev, avatar }));
  }, [avatar]);

  useEffect(() => {
    setGameState(prev => ({ ...prev, room }));
  }, [room]);

  useEffect(() => {
    setGameState(prev => ({ ...prev, achievements: completedAchievements }));
    
    // Check for new achievements
    if (completedAchievements.length > gameState.achievements.length) {
      const newAchievements = completedAchievements.slice(gameState.achievements.length);
      newAchievements.forEach(achievement => {
        triggerAchievementUnlock(achievement);
      });
    }
  }, [completedAchievements]);

  // Fluid notification system
  const addNotification = useCallback((notification: Omit<FluidNotification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: FluidNotification = { ...notification, id };
    
    setGameState(prev => ({
      ...prev,
      notifications: [...prev.notifications, newNotification]
    }));

    // Auto remove notification
    setTimeout(() => {
      removeNotification(id);
    }, notification.duration);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setGameState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }));
  }, []);

  // Level up celebration
  const triggerLevelUp = useCallback((newLevel: number) => {
    setGameState(prev => ({ ...prev, isLevelingUp: true }));
    
    // Celebratory animations
    anime({
      targets: '.avatar-3d',
      scale: [1, 1.3, 1],
      rotateY: [0, 360],
      duration: 2000,
      easing: 'easeOutElastic(1, .6)'
    });

    anime({
      targets: '.room-3d',
      scale: [1, 1.05, 1],
      duration: 1000,
      easing: 'easeOutQuad'
    });

    // Sparkle effects
    anime({
      targets: '.sparkle-effect',
      scale: [0, 1.5, 0],
      opacity: [0, 1, 0],
      duration: 3000,
      delay: anime.stagger(200)
    });

    addNotification({
      type: 'level_up',
      title: `레벨 업! 🎉`,
      description: `축하합니다! 레벨 ${newLevel}이 되었습니다!`,
      icon: '🎊',
      duration: 5000
    });

    setTimeout(() => {
      setGameState(prev => ({ ...prev, isLevelingUp: false }));
    }, 3000);
  }, [addNotification]);

  // Achievement unlock celebration
  const triggerAchievementUnlock = useCallback((achievement: any) => {
    // Achievement popup animation
    anime({
      targets: '.achievement-popup',
      translateY: [-100, 0],
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutElastic(1, .6)'
    });

    addNotification({
      type: 'achievement',
      title: '달성 배지 획득! 🏆',
      description: achievement.achievement?.name || '새로운 배지를 획득했습니다!',
      icon: achievement.achievement?.icon || '🏆',
      duration: 4000
    });

    // Update avatar mood based on achievement
    if (achievement.achievement?.category === 'writing') {
      triggerAvatarMoodChange('happy');
    }
  }, [addNotification]);

  // XP gain animation
  const triggerXpGain = useCallback((amount: number, source: string) => {
    anime({
      targets: '.xp-counter',
      scale: [1, 1.2, 1],
      color: ['#000', '#10B981', '#000'],
      duration: 1000,
      easing: 'easeOutQuad'
    });

    addNotification({
      type: 'xp_gain',
      title: `+${amount} XP`,
      description: `${source}로 경험치를 획득했습니다!`,
      icon: '✨',
      duration: 2000
    });
  }, [addNotification]);

  // Avatar mood change
  const triggerAvatarMoodChange = useCallback((mood: 'happy' | 'excited' | 'focused' | 'creative') => {
    const animations = {
      happy: {
        scale: [1, 1.1, 1],
        rotateZ: [0, 5, -5, 0],
        duration: 1000
      },
      excited: {
        translateY: [0, -10, 0],
        scale: [1, 1.05, 1],
        duration: 800
      },
      focused: {
        rotateX: [0, -10, 0],
        duration: 600
      },
      creative: {
        rotateY: [0, 15, -15, 0],
        scale: [1, 1.08, 1],
        duration: 1200
      }
    };

    anime({
      targets: '.avatar-3d',
      ...animations[mood],
      easing: 'easeOutQuad'
    });
  }, []);

  // Room theme change animation
  const triggerRoomThemeChange = useCallback((newTheme: string) => {
    anime({
      targets: '.room-3d',
      scale: [1, 0.9, 1.05, 1],
      rotateY: [0, 10, -5, 0],
      duration: 1500,
      easing: 'easeOutElastic(1, .6)'
    });

    addNotification({
      type: 'success',
      title: '룸 테마 변경! 🏠',
      description: `새로운 테마 "${newTheme}"로 변경되었습니다.`,
      icon: '🎨',
      duration: 3000
    });
  }, [addNotification]);

  // Connection between systems
  const createConnection = useCallback((sourceSystem: string, targetSystem: string, action: GameAction) => {
    const connectionId = `${sourceSystem}-${targetSystem}-${Date.now()}`;
    setActiveConnections(prev => [...prev, connectionId]);

    // Visual connection line animation
    anime({
      targets: `.connection-${sourceSystem}-${targetSystem}`,
      strokeDashoffset: [1000, 0],
      opacity: [0, 1, 0],
      duration: 2000,
      easing: 'easeInOutQuad',
      complete: () => {
        setActiveConnections(prev => prev.filter(id => id !== connectionId));
      }
    });

    // Process the action
    processGameAction(action);
  }, []);

  // Process game actions with fluid effects
  const processGameAction = useCallback((action: GameAction) => {
    switch (action.type) {
      case 'level_up':
        triggerLevelUp(action.data.newLevel);
        break;
      case 'achievement_unlock':
        triggerAchievementUnlock(action.data);
        break;
      case 'xp_gain':
        triggerXpGain(action.data.amount, action.data.source);
        break;
      case 'customization_change':
        if (action.data.type === 'avatar') {
          triggerAvatarMoodChange('creative');
        } else if (action.data.type === 'room') {
          triggerRoomThemeChange(action.data.theme);
        }
        break;
      case 'post_published':
        triggerXpGain(50, '포스트 발행');
        triggerAvatarMoodChange('excited');
        break;
    }
  }, [triggerLevelUp, triggerAchievementUnlock, triggerXpGain, triggerAvatarMoodChange, triggerRoomThemeChange]);

  // Synchronized animations for all systems
  const syncAllSystems = useCallback(() => {
    // Synchronize all game elements
    anime({
      targets: ['.avatar-3d', '.room-3d', '.experience-widget', '.achievement-gallery'],
      scale: [1, 1.02, 1],
      duration: 1000,
      delay: anime.stagger(100),
      easing: 'easeOutQuad'
    });
  }, []);

  return {
    gameState,
    notifications: gameState.notifications,
    isLevelingUp: gameState.isLevelingUp,
    activeConnections,
    
    // Actions
    triggerLevelUp,
    triggerAchievementUnlock,
    triggerXpGain,
    triggerAvatarMoodChange,
    triggerRoomThemeChange,
    createConnection,
    processGameAction,
    syncAllSystems,
    addNotification,
    removeNotification
  };
}