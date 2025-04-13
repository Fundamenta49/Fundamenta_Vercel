import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Flame,
  Bell,
  Star,
  Crown,
  Award,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Wellness green from design system
const WELLNESS_COLOR = "#10b981";

interface FitnessGoal {
  id: string;
  type: "weightlifting" | "yoga" | "running" | "meditation";
  target: number;
  current: number;
  unit: string;
  deadline: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  progress: number;
  unlocked: boolean;
}

export default function FitnessProgress() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<FitnessGoal[]>([]);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const achievements: Achievement[] = [
    {
      id: "first-workout",
      title: "First Step",
      description: "Complete your first workout",
      icon: <Trophy className="h-5 w-5" style={{ color: WELLNESS_COLOR }} />,
      progress: 100,
      unlocked: true,
    },
    {
      id: "streak-7",
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: <Flame className="h-5 w-5" style={{ color: WELLNESS_COLOR }} />,
      progress: (streak / 7) * 100,
      unlocked: streak >= 7,
    },
    {
      id: "all-activities",
      title: "Renaissance Athlete",
      description: "Try all workout types",
      icon: <Crown className="h-5 w-5" style={{ color: WELLNESS_COLOR }} />,
      progress: 75,
      unlocked: false,
    },
  ];

  const enableNotifications = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        toast({
          title: "Notifications Enabled",
          description: "You'll receive updates about your fitness goals",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Notification Error",
        description: "Could not enable notifications",
      });
    }
  };

  // Custom progress component that uses wellness color
  const StyledProgress = ({ value }: { value: number }) => (
    <Progress 
      value={value} 
      className="mt-2" 
      style={{ 
        "--progress-background": `${WELLNESS_COLOR}20`,
        "--progress-foreground": WELLNESS_COLOR
      } as React.CSSProperties} 
    />
  );

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" style={{ color: WELLNESS_COLOR }} />
          <span style={{ color: WELLNESS_COLOR }}>Your Fitness Journey</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border" style={{ borderColor: `${WELLNESS_COLOR}40` }}>
            <CardHeader className="py-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Streak</CardTitle>
                <Flame className="h-4 w-4" style={{ color: WELLNESS_COLOR }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{streak} days</div>
            </CardContent>
          </Card>

          <Card className="border" style={{ borderColor: `${WELLNESS_COLOR}40` }}>
            <CardHeader className="py-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Fitness Points</CardTitle>
                <Star className="h-4 w-4" style={{ color: WELLNESS_COLOR }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{points} XP</div>
            </CardContent>
          </Card>

          <Card className="border" style={{ borderColor: `${WELLNESS_COLOR}40` }}>
            <CardHeader className="py-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Level</CardTitle>
                <Award className="h-4 w-4" style={{ color: WELLNESS_COLOR }} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Level {Math.floor(points / 1000) + 1}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Trophy className="h-5 w-5" style={{ color: WELLNESS_COLOR }} />
          <span style={{ color: WELLNESS_COLOR }}>Achievements</span>
        </h3>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <Card 
              key={achievement.id}
              className="border overflow-hidden"
              style={{ borderColor: WELLNESS_COLOR }}
            >
              <div className="flex items-center p-4">
                <div
                  className="p-2 rounded-full mr-4"
                  style={{ backgroundColor: `${WELLNESS_COLOR}15` }}
                >
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  <StyledProgress value={achievement.progress} />
                </div>
                {achievement.unlocked && (
                  <Badge 
                    variant="outline" 
                    className="ml-2"
                    style={{ 
                      backgroundColor: `${WELLNESS_COLOR}15`, 
                      borderColor: WELLNESS_COLOR,
                      color: WELLNESS_COLOR 
                    }}
                  >
                    Unlocked
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Bell className="h-5 w-5" style={{ color: WELLNESS_COLOR }} />
          <span style={{ color: WELLNESS_COLOR }}>Notifications</span>
        </h3>
        <Card className="border" style={{ borderColor: `${WELLNESS_COLOR}40` }}>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Stay motivated with timely reminders about your fitness goals
            </p>
            <Button
              onClick={enableNotifications}
              disabled={notificationsEnabled}
              className="w-full"
              style={{ 
                backgroundColor: notificationsEnabled ? undefined : WELLNESS_COLOR,
                color: notificationsEnabled ? undefined : "white" 
              }}
            >
              {notificationsEnabled ? "Notifications Enabled" : "Enable Notifications"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
