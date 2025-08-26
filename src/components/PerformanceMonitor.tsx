import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Clock, Zap } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  componentCount: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const measurePerformance = () => {
      // Get performance timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      const renderTime = navigation.loadEventEnd - navigation.domContentLoadedEventStart;

      // Get memory usage (if available)
      const memory = (performance as any).memory;
      const memoryUsage = memory ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : 0;

      // Count React components (approximation)
      const componentCount = document.querySelectorAll('[data-radix-collection-item], [role], button, input').length;

      setMetrics({
        loadTime: Math.round(loadTime),
        renderTime: Math.round(renderTime),
        memoryUsage: Math.round(memoryUsage),
        componentCount
      });
    };

    // Wait for page to load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Show/hide with keyboard shortcut
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('load', measurePerformance);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (!metrics || !isVisible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getPerformanceRating = (loadTime: number) => {
    if (loadTime < 1000) return { label: 'Excellent', color: 'bg-green-500' };
    if (loadTime < 2000) return { label: 'Good', color: 'bg-yellow-500' };
    if (loadTime < 3000) return { label: 'Fair', color: 'bg-orange-500' };
    return { label: 'Poor', color: 'bg-red-500' };
  };

  const performance_rating = getPerformanceRating(metrics.loadTime);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg border-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Activity className="w-4 h-4" />
            Performance Monitor
            <Badge variant="outline" className="ml-auto">
              Dev Only
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Load Time */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Load Time
              </span>
              <span className="text-sm">{metrics.loadTime}ms</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={Math.min(100, (metrics.loadTime / 3000) * 100)} className="flex-1 h-2" />
              <Badge variant="outline" className={`text-xs ${performance_rating.color} text-white`}>
                {performance_rating.label}
              </Badge>
            </div>
          </div>

          {/* Render Time */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-3 h-3" />
                Render Time
              </span>
              <span className="text-sm">{metrics.renderTime}ms</span>
            </div>
            <Progress value={Math.min(100, (metrics.renderTime / 1000) * 100)} className="h-2" />
          </div>

          {/* Memory Usage */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Memory Usage</span>
              <span className="text-sm">{metrics.memoryUsage}%</span>
            </div>
            <Progress value={metrics.memoryUsage} className="h-2" />
          </div>

          {/* Component Count */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">DOM Elements</span>
            <Badge variant="secondary">{metrics.componentCount}</Badge>
          </div>

          <div className="text-xs text-muted-foreground text-center border-t pt-2">
            Press Ctrl+Shift+P to toggle
          </div>
        </CardContent>
      </Card>
    </div>
  );
}