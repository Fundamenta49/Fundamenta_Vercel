import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { JUNGLE_RANKS } from '../../utils/rankCalculator';
import confetti from 'canvas-confetti';

interface RankUpCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  previousRank: number;
  newRank: number;
}

/**
 * RankUpCelebration shows a celebration modal when a user ranks up
 */
const RankUpCelebration: React.FC<RankUpCelebrationProps> = ({
  isOpen,
  onClose,
  previousRank,
  newRank
}) => {
  const previousRankData = JUNGLE_RANKS.find(rank => rank.level === previousRank);
  const newRankData = JUNGLE_RANKS.find(rank => rank.level === newRank);

  // Trigger confetti effect when dialog opens
  React.useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };
      
      // Use the new rank color for the confetti
      const colors = [
        newRankData?.color || '#E6B933',
        '#ffffff', 
        '#94C973'
      ];
      
      const confettiInterval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          clearInterval(confettiInterval);
          return;
        }
        
        confetti({
          particleCount: 3,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.1, 0.3) },
          colors: colors,
          gravity: 0.8,
          scalar: 1.2,
          drift: 0,
          ticks: 300
        });
      }, 150);
      
      return () => {
        clearInterval(confettiInterval);
      };
    }
  }, [isOpen, newRankData?.color]);

  // If we don't have rank data, don't show anything
  if (!previousRankData || !newRankData) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Rank Up!
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <div 
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ 
              backgroundColor: newRankData.color,
              animation: 'celebrationPulse 1.5s infinite, celebrationGlow 2s infinite'
            }}
          >
            <span className="text-3xl font-bold text-white">{newRank}</span>
          </div>
          
          <h3 className="text-center text-xl font-bold mb-2">
            You are now a {newRankData.title}!
          </h3>
          
          <p className="text-center text-muted-foreground mb-4">
            {newRankData.description}
          </p>
          
          <div className="bg-muted p-3 rounded-md">
            <h4 className="font-semibold mb-2">New abilities unlocked:</h4>
            <ul className="space-y-1 pl-5 list-disc">
              {newRankData.perks.map((perk, index) => (
                <li key={index} className="text-sm">{perk}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <DialogFooter className="flex justify-center">
          <Button onClick={onClose} className="w-full sm:w-auto" style={{ backgroundColor: newRankData.color }}>
            Continue Your Journey
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RankUpCelebration;