import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { usePostInteractions } from '@/hooks/usePostInteractions';
import { RotateCcw, TrendingUp, Eye, Heart } from 'lucide-react';

export function PostInteractionManager() {
  const [isResetting, setIsResetting] = useState(false);
  const { resetAllCounters } = usePostInteractions();
  const { toast } = useToast();

  const handleResetCounters = async () => {
    setIsResetting(true);
    try {
      const success = await resetAllCounters();
      if (success) {
        toast({
          title: "카운터 초기화 완료",
          description: "모든 조회수와 좋아요 수가 0으로 초기화되었습니다.",
        });
      } else {
        throw new Error("Reset failed");
      }
    } catch (error) {
      toast({
        title: "초기화 실패",
        description: "카운터 초기화 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          포스트 상호작용 관리
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <Eye className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="font-semibold">조회수 추적</h3>
              <p className="text-sm text-muted-foreground">
                포스트 방문 시 자동으로 조회수가 증가합니다
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 border rounded-lg">
            <Heart className="h-8 w-8 text-red-500" />
            <div>
              <h3 className="font-semibold">좋아요 시스템</h3>
              <p className="text-sm text-muted-foreground">
                사용자별 좋아요 상태가 실시간으로 관리됩니다
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">관리 작업</h3>
          <Button
            onClick={handleResetCounters}
            disabled={isResetting}
            variant="outline"
            className="w-full"
          >
            <RotateCcw className={`h-4 w-4 mr-2 ${isResetting ? 'animate-spin' : ''}`} />
            {isResetting ? '초기화 중...' : '모든 카운터 초기화'}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            ⚠️ 이 작업은 모든 포스트의 조회수와 좋아요 수를 0으로 리셋합니다.
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">실시간 카운팅 시스템</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 조회수: 포스트 페이지 방문 시 자동 증가</li>
            <li>• 좋아요: 사용자별 중복 방지 및 토글 기능</li>
            <li>• 데이터베이스: Supabase에서 실시간 동기화</li>
            <li>• 성능: 인덱스 최적화로 빠른 응답</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}