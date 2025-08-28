import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, Calendar } from "lucide-react";
import { useBlogStatistics } from "@/hooks/useBlogStatistics";
import { useAuth } from "@/hooks/useAuth";

interface StatItem {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix?: string;
  loading?: boolean;
}

function CountUpNumber({ 
  end, 
  duration = 2000, 
  suffix = "" 
}: { 
  end: number; 
  duration?: number; 
  suffix?: string; 
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <span className="text-3xl md:text-4xl font-bold text-primary glow-text">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsSection() {
  const { statistics, loading } = useBlogStatistics();
  const { user } = useAuth();

  const stats: StatItem[] = [
    { 
      icon: Users, 
      label: "총 방문자", 
      value: statistics.totalVisitors,
      loading 
    },
    { 
      icon: FileText, 
      label: "총 포스팅", 
      value: statistics.totalPosts,
      loading 
    },
    { 
      icon: Calendar, 
      label: "블로그 운영", 
      value: statistics.blogOperationDays, 
      suffix: "일",
      loading 
    },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="card-hover bg-gradient-card border-border/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-primary/10 border border-primary/20">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                
                {stat.loading ? (
                  <div className="text-3xl md:text-4xl font-bold text-primary glow-text">
                    <div className="animate-pulse bg-muted rounded h-8 w-16 mx-auto"></div>
                  </div>
                ) : (
                  <CountUpNumber 
                    end={stat.value} 
                    suffix={stat.suffix} 
                  />
                )}
                
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}