import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, Sparkles, Code, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const typingTexts = [
  "이원경의 개발 블로그",
  "ComfyUI & AI 이미지 생성",
  "프롬프트 엔지니어링 여정",
  "Python과 함께하는 코딩라이프"
];

export function HeroSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const currentText = typingTexts[currentTextIndex];
    
    if (isTyping) {
      if (displayText.length < currentText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
        setIsTyping(true);
      }
    }
  }, [displayText, isTyping, currentTextIndex]);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white flex items-center justify-center overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-40 right-20 w-16 h-16 bg-gray-200 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-blue-200 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-gray-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
      </div>
      
      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <Badge 
              variant="outline" 
              className="inline-flex items-center gap-2 border-blue-300 bg-white/80 backdrop-blur-sm text-blue-700 font-medium px-4 py-2 shadow-lg"
            >
              <Code className="w-4 h-4" />
              프롬프트 엔지니어 & 개발자
            </Badge>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-700 via-blue-600 to-gray-800 bg-clip-text text-transparent">
                  {displayText}
                </span>
                <span className="typing-cursor text-blue-500" />
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
              ComfyUI와 AI 이미지 생성, 프롬프트 엔지니어링의 세계를 탐험해보세요. 
              전문적이고 실용적인 개발 경험을 공유합니다.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate('/posts')}
              >
                <Code className="w-5 h-5 mr-2" />
                내 포스트 보기
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => navigate('/game')}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                게임 시작하기
              </Button>
            </div>
          </div>

          {/* Right Side - Feature Cards */}
          <div className="space-y-6">
            {/* Main Feature Card */}
            <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow" onClick={() => navigate('/category/ai-image')}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">AI 이미지 생성</h3>
                    <p className="text-sm text-gray-600">ComfyUI 노드 기반 워크플로우</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  최신 AI 기술을 활용한 이미지 생성 및 프롬프트 엔지니어링 경험을 공유합니다.
                </p>
              </CardContent>
            </Card>

            {/* Secondary Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/category/travel-cafe')}>
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-4 h-4 text-gray-500" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">일상 & 여행</h4>
                  <p className="text-xs text-gray-600">카페와 일상 이야기</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={() => navigate('/category/python-vibe')}>
                <CardContent className="p-4 text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Code className="w-4 h-4 text-blue-500" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">바이브 코딩</h4>
                  <p className="text-xs text-gray-600">Python & AI 개발</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-gray-400" />
      </div>
    </section>
  );
}