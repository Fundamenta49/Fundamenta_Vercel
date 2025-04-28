import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Award, Compass } from "lucide-react";
import { useJungleTheme } from '@/jungle-path/contexts/JungleThemeContext';
import { useJungleFundi } from '@/jungle-path/contexts/JungleFundiContext';

// Jungle styles for the demo card
const jungleStyles = {
  card: "border-2 border-[#1E4A3D] bg-gradient-to-br from-[#1E4A3D]/90 to-[#1E4A3D]/80 text-green-50 shadow-lg transition-all duration-300 hover:shadow-xl hover:translate-y-[-2px] backdrop-blur-sm",
  cardHeader: "pb-2",
  button: "bg-[#E6B933] hover:bg-[#D4A625] text-[#1E4A3D] font-medium",
  buttonOutline: "border-[#94C973] text-[#94C973] hover:bg-[#94C973]/20",
  progress: "h-2 bg-white/20",
  questCard: "bg-[#1E4A3D]/30 border-[1px] backdrop-blur-sm",
  questCardCompleted: "bg-[#94C973]/30 border-[1px] backdrop-blur-sm",
  questIcon: "text-[#E6B933]",
  companionBubble: "bg-[#1E4A3D]/70 text-green-50 p-4 rounded-lg border border-[#94C973]/50 backdrop-blur-sm mb-4",
  rankBadge: "bg-[#1E4A3D] text-[#E6B933] border border-[#E6B933]/50 py-1 px-3 rounded-full flex items-center gap-2 text-xs font-medium",
  tabs: "mt-4",
  tabsList: "bg-[#1E4A3D]/50 p-1 border border-[#94C973]/30",
  tabsTrigger: "data-[state=active]:bg-[#94C973]/20 data-[state=active]:text-[#E6B933] data-[state=active]:shadow-none",
};

export default function JungleDemoCard() {
  const { isJungleTheme, toggleJungleTheme } = useJungleTheme();
  const { sendJungleMessage } = useJungleFundi();

  // Simulate quest completion percentage
  const progress = 65;

  // Show a message through Fundi when interacting with the card
  const handleInteraction = () => {
    if (isJungleTheme) {
      sendJungleMessage("The Jungle Path transforms your learning journey into an exciting adventure! Each pathway becomes an expedition through different regions, and learning modules become quests to complete.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Card 
        className={isJungleTheme ? jungleStyles.card : ""}
        style={isJungleTheme ? {
          maxWidth: "450px", 
          marginBottom: "20px",
          borderColor: "#94C973",
          boxShadow: "0 4px 12px rgba(148, 201, 115, 0.2)"
        } : {
          maxWidth: "450px", 
          marginBottom: "20px"
        }}
        onMouseEnter={handleInteraction}
      >
        <CardHeader className={isJungleTheme ? jungleStyles.cardHeader : ""}>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg flex items-center">
              <Compass className={`h-5 w-5 mr-2 ${isJungleTheme ? "text-[#E6B933]" : "text-primary"}`} />
              {isJungleTheme ? "Financial Wilderness Expedition" : "Financial Literacy Path"}
            </CardTitle>
            <Badge 
              variant={isJungleTheme ? "outline" : "secondary"}
              style={isJungleTheme ? { borderColor: "#94C973", color: "#94C973" } : {}}
            >
              {isJungleTheme ? "8 quests" : "8 modules"}
            </Badge>
          </div>
          <CardDescription className={isJungleTheme ? "text-green-50/80" : ""}>
            {isJungleTheme 
              ? "Navigate the ancient temple ruins to discover the secrets of financial wisdom and treasure management."
              : "Learn essential financial concepts and develop money management skills."}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Progress bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span>
                {isJungleTheme ? "Expedition Progress" : "Progress"}
              </span>
              <span>
                {progress}%
              </span>
            </div>
            <Progress 
              value={progress} 
              className={isJungleTheme ? jungleStyles.progress : ""}
              style={isJungleTheme ? {
                "--progress-foreground": "#E6B933"
              } as React.CSSProperties : {}}
            />
            <div className="flex justify-between text-xs mt-1">
              <span className={isJungleTheme ? "text-green-50/70" : "text-muted-foreground"}>
                5/8 {isJungleTheme ? "quests" : "modules"} completed
              </span>
            </div>
          </div>
          
          {/* Example Quest */}
          <div className="mt-4">
            <div 
              className={`p-3 rounded-lg ${isJungleTheme ? jungleStyles.questCard : "bg-gray-50 border border-gray-200"}`}
              style={isJungleTheme ? {
                borderColor: "#94C973"
              } : {}}
            >
              <div className="flex justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                      isJungleTheme 
                        ? "border-[#94C973] text-[#94C973]" 
                        : "border-gray-400 text-gray-400"
                    }`}>
                      6
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">
                      {isJungleTheme ? "The Investment River Crossing" : "Introduction to Investments"}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      15 {isJungleTheme ? "expedition time" : "minutes"}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Button
                    size="sm"
                    variant={isJungleTheme ? "default" : "default"}
                    className={`text-xs ${isJungleTheme ? jungleStyles.button : ""}`}
                    style={isJungleTheme ? {
                      backgroundColor: "#E6B933",
                      color: "#1E4A3D"
                    } : {}}
                  >
                    {isJungleTheme ? "Begin Quest" : "Start"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            {isJungleTheme && (
              <div className={jungleStyles.rankBadge}>
                <Award className="h-4 w-4" />
                <span>Explorer (Level 2)</span>
              </div>
            )}
          </div>
          
          <Button
            size="sm"
            className={isJungleTheme ? jungleStyles.button : ""}
            style={isJungleTheme ? {
              backgroundColor: "#E6B933"
            } : {}}
          >
            {progress > 0 
              ? (isJungleTheme ? "Continue Expedition" : "Continue Learning") 
              : (isJungleTheme ? "Start Expedition" : "Start Learning")}
          </Button>
        </CardFooter>
      </Card>
      
      <Button 
        onClick={toggleJungleTheme}
        variant="outline"
        className="mb-4"
      >
        {isJungleTheme ? "Disable Jungle Theme" : "Enable Jungle Theme"}
      </Button>
      
      <div className="text-center text-sm text-muted-foreground max-w-md">
        <p>The Jungle Path transforms standard learning pathways into immersive adventures with themed styling, terminology, and interactive elements.</p>
      </div>
    </div>
  );
}