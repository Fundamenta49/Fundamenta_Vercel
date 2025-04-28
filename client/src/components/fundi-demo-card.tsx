import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useJungleTheme } from '@/jungle-path/contexts/JungleThemeContext';
import { useJungleFundi } from '@/jungle-path/contexts/JungleFundiContext';
import { Leaf, MessageSquare, RefreshCw } from 'lucide-react';

export default function FundiDemoCard() {
  const { isJungleTheme, toggleJungleTheme } = useJungleTheme();
  const { sendJungleMessage } = useJungleFundi();
  const [fundiEmotion, setFundiEmotion] = useState<string>('neutral');

  // Themes and colors based on jungle mode
  const bgColor = isJungleTheme ? '#1E4A3D' : 'white';
  const textColor = isJungleTheme ? '#E6B933' : 'var(--text-primary)';
  const borderColor = isJungleTheme ? '#E6B933' : 'var(--border)';
  const secondaryBg = isJungleTheme ? '#163729' : 'var(--secondary)';

  // Send various types of messages to Fundi
  const sendWelcomeMessage = () => {
    if (isJungleTheme) {
      sendJungleMessage("Welcome to the Jungle Path, brave explorer! I'll be your guide through this adventure.");
      setFundiEmotion('happy');
    } else {
      sendJungleMessage("Welcome to Fundamenta! I'm Fundi, your digital assistant.");
      setFundiEmotion('neutral');
    }
  };

  const sendTipMessage = () => {
    if (isJungleTheme) {
      sendJungleMessage("Remember to watch your step near the Investment River! The paths can be slippery, but the rewards are worth it.");
      setFundiEmotion('curious');
    } else {
      sendJungleMessage("Here's a tip: You can customize your learning path based on your interests.");
      setFundiEmotion('supportive');
    }
  };

  const sendEncouragementMessage = () => {
    if (isJungleTheme) {
      sendJungleMessage("You're making excellent progress through the jungle! Your expedition skills are impressive!");
      setFundiEmotion('enthusiastic');
    } else {
      sendJungleMessage("Great job! You're making excellent progress on your learning journey.");
      setFundiEmotion('happy');
    }
  };

  return (
    <Card 
      className="w-[350px] mb-6"
      style={{
        background: bgColor,
        color: textColor,
        borderColor: borderColor,
        boxShadow: isJungleTheme ? '0 8px 20px rgba(0, 0, 0, 0.3)' : undefined,
      }}
    >
      <CardHeader>
        <CardTitle style={{ color: textColor }}>
          <div className="flex items-center">
            {isJungleTheme && <Leaf className="mr-2 h-5 w-5" style={{ color: '#E6B933' }}/>}
            Fundi Interaction Demo
          </div>
        </CardTitle>
        <CardDescription style={{ color: isJungleTheme ? '#E6D8A8' : undefined }}>
          Interact with Fundi in {isJungleTheme ? 'Jungle' : 'Standard'} Mode
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div 
            className="p-3 rounded-md"
            style={{ 
              backgroundColor: secondaryBg,
              border: `1px solid ${isJungleTheme ? 'rgba(230, 185, 51, 0.5)' : 'var(--border)'}`
            }}
          >
            <p className="text-sm mb-2" style={{ color: isJungleTheme ? '#E6D8A8' : undefined }}>
              Send different types of messages to Fundi and see how the avatar responds with jungle-themed styling.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <Button 
              onClick={sendWelcomeMessage} 
              className="w-full"
              style={{
                backgroundColor: isJungleTheme ? '#E6B933' : undefined,
                color: isJungleTheme ? '#1E4A3D' : undefined
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Welcome Message
            </Button>
            
            <Button 
              onClick={sendTipMessage}
              className="w-full"
              style={{
                backgroundColor: isJungleTheme ? '#E6B933' : undefined,
                color: isJungleTheme ? '#1E4A3D' : undefined
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Jungle Tip
            </Button>
            
            <Button 
              onClick={sendEncouragementMessage}
              className="w-full"
              style={{
                backgroundColor: isJungleTheme ? '#E6B933' : undefined,
                color: isJungleTheme ? '#1E4A3D' : undefined
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Encouragement
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t flex justify-between" style={{ borderColor: isJungleTheme ? 'rgba(230, 185, 51, 0.3)' : undefined }}>
        <div className="flex items-center text-sm" style={{ color: isJungleTheme ? '#E6D8A8' : undefined }}>
          <span>Current emotion: {fundiEmotion}</span>
        </div>
        <Button
          variant="outline"
          size="sm" 
          onClick={toggleJungleTheme}
          style={{
            borderColor: isJungleTheme ? '#E6B933' : undefined,
            color: isJungleTheme ? '#E6B933' : undefined
          }}
        >
          <RefreshCw className="mr-2 h-3 w-3" />
          {isJungleTheme ? "Standard Mode" : "Jungle Mode"}
        </Button>
      </CardFooter>
    </Card>
  );
}