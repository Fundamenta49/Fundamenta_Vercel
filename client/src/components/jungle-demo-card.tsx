import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Award, Compass } from "lucide-react";
import { useJungleTheme } from '@/jungle-path/contexts/JungleThemeContext';
import { useJungleFundi } from '@/jungle-path/contexts/JungleFundiContext';

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

  // Updated compact card matching the provided design
  const CompactJungleCard = () => (
    <div 
      className="rounded-lg overflow-hidden relative w-[350px]"
      style={{
        background: '#1E4A3D',
        color: '#E6B933',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
        border: '1px solid #E6B933',
        padding: '16px',
      }}
      onMouseEnter={handleInteraction}
    >
      {/* Header with title and quest count */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-[#E6B933]" />
          <h3 className="text-lg font-semibold text-[#E6B933]">
            Financial Wilderness Expedition
          </h3>
        </div>
        <div className="rounded-full bg-[#1E4A3D] border border-[#E6B933] px-3 py-1 text-sm flex items-center">
          <span>8</span>
          <span className="ml-1 text-xs">quests</span>
        </div>
      </div>
      
      {/* Description */}
      <p className="text-green-100 mb-6 text-sm">
        Navigate the ancient temple ruins to discover the secrets of financial wisdom and treasure management.
      </p>
      
      {/* Progress section */}
      <div className="mb-4">
        <p className="text-[#E6B933] text-sm font-medium mb-1">Expedition Progress</p>
        <Progress 
          value={progress} 
          className="h-2 bg-[#163729]"
          style={{
            "--progress-foreground": "#E6B933"
          } as React.CSSProperties}
        />
        <p className="text-green-100 text-xs mt-1">5/8 quests completed</p>
      </div>
      
      {/* Quest example */}
      <div className="border border-[#E6B933]/50 rounded-md p-3 mb-4 bg-[#163729]/70 flex justify-between items-center">
        <div>
          <h4 className="text-[#E6B933] text-sm font-medium">The Investment River</h4>
          <p className="text-green-100 text-xs">15 expedition time</p>
        </div>
        <Button
          size="sm"
          className="bg-[#E6B933] hover:bg-[#D4A625] text-[#1E4A3D] font-medium text-xs border-none"
        >
          Begin Quest
        </Button>
      </div>
      
      {/* Footer with rank and button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center bg-[#163729] border border-[#E6B933]/50 rounded-full py-1 px-3">
          <Award className="h-4 w-4 text-[#E6B933] mr-1" />
          <span className="text-xs text-[#E6B933]">Explorer (Level 2)</span>
        </div>
        
        <Button
          size="sm"
          className="bg-[#E6B933] hover:bg-[#D4A625] text-[#1E4A3D] font-medium border-none"
        >
          Continue Expedition
        </Button>
      </div>
    </div>
  );

  // Standard card for non-jungle theme
  const StandardCard = () => (
    <div 
      className="border rounded-lg shadow p-4 w-[350px] bg-white"
      onMouseEnter={handleInteraction}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <Compass className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-lg font-semibold">Financial Literacy Path</h3>
        </div>
        <div className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs">
          8 modules
        </div>
      </div>
      
      <p className="text-muted-foreground text-sm mb-6">
        Learn essential financial concepts and develop money management skills.
      </p>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1">5/8 modules completed</p>
      </div>
      
      <div className="border rounded-md p-3 mb-4 bg-slate-50 flex justify-between items-center">
        <div>
          <h4 className="text-sm font-medium">Introduction to Investments</h4>
          <p className="text-xs text-muted-foreground">15 minutes</p>
        </div>
        <Button size="sm">Start</Button>
      </div>
      
      <div className="flex justify-end">
        <Button size="sm">Continue Learning</Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      {isJungleTheme ? <CompactJungleCard /> : <StandardCard />}
      
      <Button 
        onClick={toggleJungleTheme}
        variant="outline"
        className="mt-6 mb-4"
      >
        {isJungleTheme ? "Disable Jungle Theme" : "Enable Jungle Theme"}
      </Button>
      
      <div className="text-center text-sm text-muted-foreground max-w-md">
        <p>The Jungle Path transforms standard learning pathways into immersive adventures with themed styling, terminology, and interactive elements.</p>
      </div>
    </div>
  );
}