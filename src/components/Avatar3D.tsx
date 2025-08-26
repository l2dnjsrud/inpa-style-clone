import { useState, useEffect } from 'react';
import { useAvatar } from '@/hooks/useAvatar';
import anime from 'animejs';

interface Avatar3DProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Avatar3D({ size = 'md', animated = true, onClick, className = '' }: Avatar3DProps) {
  const { avatar } = useAvatar();
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  useEffect(() => {
    if (animated && isHovered) {
      anime({
        targets: '.avatar-3d',
        scale: [1, 1.05],
        rotateY: [0, 10],
        duration: 300,
        easing: 'easeOutQuad'
      });
    } else if (animated) {
      anime({
        targets: '.avatar-3d',
        scale: [1.05, 1],
        rotateY: [10, 0],
        duration: 300,
        easing: 'easeOutQuad'
      });
    }
  }, [isHovered, animated]);

  const getHairStyle = (style: string) => {
    const styles = {
      default: 'rounded-t-full',
      short: 'rounded-t-lg',
      long: 'rounded-t-full h-8',
      curly: 'rounded-t-full transform rotate-1',
      pixie: 'rounded-t-lg h-4',
      ponytail: 'rounded-t-full relative',
      messy: 'rounded-t-full transform -rotate-1',
      bald: 'hidden'
    };
    return styles[style as keyof typeof styles] || styles.default;
  };

  const getClothingStyle = (clothing: string) => {
    const styles = {
      hoodie: 'rounded-t-lg relative overflow-hidden',
      tshirt: 'rounded-t-sm',
      blazer: 'rounded-t-none border-t-2 border-opacity-30',
      sweater: 'rounded-t-lg',
      polo: 'rounded-t-sm border-t border-opacity-20',
      dress_shirt: 'rounded-t-none',
      tank_top: 'rounded-t-lg',
      cardigan: 'rounded-t-lg border border-opacity-20'
    };
    return styles[clothing as keyof typeof styles] || styles.hoodie;
  };

  return (
    <div 
      className={`avatar-3d relative ${sizeClasses[size]} ${className} cursor-pointer transition-all duration-300 transform-gpu`}
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* 3D Container */}
      <div className="relative w-full h-full transform-gpu transition-transform duration-300 hover:scale-105">
        {/* Shadow */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-black/10 rounded-full blur-sm"></div>
        
        {/* Main Avatar Container */}
        <div className="relative w-full h-full">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 rounded-full"></div>
          
          {/* Character Body */}
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 h-3/5 rounded-t-full transition-colors duration-300"
            style={{ backgroundColor: avatar?.skin_tone || '#F7FAFC' }}
          >
            {/* Clothing */}
            <div 
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-4/5 transition-colors duration-300 ${getClothingStyle(avatar?.clothing || 'hoodie')}`}
              style={{ backgroundColor: avatar?.clothing_color || '#3182CE' }}
            >
              {/* Clothing Details */}
              {avatar?.clothing === 'hoodie' && (
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-black/10 rounded-full"></div>
              )}
              {avatar?.clothing === 'blazer' && (
                <div className="absolute top-1/3 left-1/4 w-1/2 h-1/2 border-l border-black/10"></div>
              )}
            </div>
            
            {/* Head */}
            <div 
              className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-3/4 h-3/4 rounded-full transition-colors duration-300 shadow-lg"
              style={{ backgroundColor: avatar?.skin_tone || '#F7FAFC' }}
            >
              {/* Hair */}
              <div 
                className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-full h-3/4 transition-colors duration-300 ${getHairStyle(avatar?.hair_style || 'default')}`}
                style={{ backgroundColor: avatar?.hair_color || '#4A5568' }}
              >
                {/* Hair Details */}
                {avatar?.hair_style === 'ponytail' && (
                  <div 
                    className="absolute -right-1 top-1/2 w-2 h-4 rounded-full"
                    style={{ backgroundColor: avatar?.hair_color || '#4A5568' }}
                  ></div>
                )}
              </div>
              
              {/* Face Features */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Eyes */}
                <div className="flex gap-1 mb-1">
                  <div className="w-1 h-1 bg-black rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-black rounded-full animate-pulse"></div>
                </div>
                
                {/* Nose */}
                <div className="w-0.5 h-0.5 bg-pink-300 rounded-full mb-1"></div>
                
                {/* Smile */}
                <div className="w-2 h-1 border-b-2 border-pink-400 rounded-b-full"></div>
              </div>
              
              {/* Blush */}
              <div className="absolute left-1 top-1/2 w-1 h-1 bg-pink-200 rounded-full opacity-60"></div>
              <div className="absolute right-1 top-1/2 w-1 h-1 bg-pink-200 rounded-full opacity-60"></div>
            </div>
            
            {/* Accessories */}
            {avatar?.accessories && avatar.accessories.length > 0 && (
              <div className="absolute -top-4 right-1">
                {avatar.accessories.map((accessory: any, index: number) => (
                  <div key={index} className="text-xs animate-bounce">
                    {accessory.icon || '👓'}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Character Name */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium shadow-sm">
              {avatar?.character_name || '이원경'}
            </div>
          </div>
          
          {/* Special Effects */}
          {isHovered && (
            <>
              {/* Sparkles */}
              <div className="absolute -top-2 -left-2 text-yellow-300 animate-ping">✨</div>
              <div className="absolute -top-3 -right-1 text-pink-300 animate-pulse">💫</div>
              <div className="absolute top-1/2 -right-3 text-purple-300 animate-bounce">⭐</div>
              
              {/* IU Fan Heart */}
              <div className="absolute bottom-1/2 -left-3 text-purple-400 animate-pulse">💜</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}