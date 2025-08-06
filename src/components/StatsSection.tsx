import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, Heart, Calendar } from "lucide-react";

interface StatItem {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix?: string;
}

const stats: StatItem[] = [
  { icon: Users, label: "총 방문자", value: 125430 },
  { icon: FileText, label: "총 포스팅", value: 287 },
  { icon: Heart, label: "구독자", value: 1240 },
  { icon: Calendar, label: "블로그 운영", value: 1250, suffix: "일" },
];

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
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                
                <CountUpNumber 
                  end={stat.value} 
                  suffix={stat.suffix} 
                />
                
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