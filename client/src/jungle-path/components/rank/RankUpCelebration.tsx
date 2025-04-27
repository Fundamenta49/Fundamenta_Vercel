import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { JUNGLE_RANKS } from '../../utils/rankCalculator';
import RankBadge from './RankBadge';
import { Star, Sparkles, Trophy } from 'lucide-react';

interface RankUpCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  previousRank: number;
  newRank: number;
}

/**
 * Celebration modal shown when a user levels up to a new rank in the jungle
 */
const RankUpCelebration: React.FC<RankUpCelebrationProps> = ({
  isOpen,
  onClose,
  previousRank,
  newRank
}) => {
  const previousRankData = JUNGLE_RANKS.find(r => r.level === previousRank) || JUNGLE_RANKS[0];
  const newRankData = JUNGLE_RANKS.find(r => r.level === newRank) || JUNGLE_RANKS[1];
  
  // Play celebration sound if available
  useEffect(() => {
    if (isOpen) {
      // Could implement sound effects here if supported
      const timer = setTimeout(() => {
        // Auto-close after 10 seconds if user doesn't interact
        onClose();
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="border-2 border-amber-300 bg-gradient-to-b from-amber-50 to-white max-w-md">
        <div className="absolute -top-2 -left-2">
          <Sparkles className="h-8 w-8 text-amber-400" />
        </div>
        <div className="absolute -top-2 -right-2">
          <Sparkles className="h-8 w-8 text-amber-400" />
        </div>
        
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl text-amber-800 flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-amber-500" />
            Rank Advancement!
            <Trophy className="h-6 w-6 text-amber-500" />
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Your jungle expertise has reached new heights!
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 flex flex-col items-center space-y-6">
          <div className="flex items-center justify-center gap-6 w-full">
            <div className="flex flex-col items-center">
              <RankBadge rank={previousRank} size="md" showTitle={true} />
              <p className="mt-2 text-sm text-gray-500">Previous Rank</p>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <Star className="h-8 w-8 text-amber-500" />
              <div className="h-0.5 w-12 bg-amber-300" />
            </div>
            
            <div className="flex flex-col items-center">
              <div className="animate-bounce">
                <RankBadge rank={newRank} size="lg" showTitle={true} />
              </div>
              <p className="mt-2 text-sm font-semibold text-amber-800">New Rank!</p>
            </div>
          </div>
          
          <div className="text-center p-4 bg-white border border-amber-200 rounded-lg">
            <h3 className="font-medium text-amber-800">Rank Abilities Unlocked</h3>
            <p className="mt-1 text-sm text-gray-600">{newRankData.description}</p>
            
            {newRank >= 2 && (
              <ul className="mt-3 text-sm text-left space-y-2">
                {newRank >= 2 && <li className="flex gap-2 items-center">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Access to Wellness and Fitness zones</span>
                </li>}
                {newRank >= 3 && <li className="flex gap-2 items-center">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  <span>Access to Scholar's Grove advanced quests</span>
                </li>}
                {newRank >= 4 && <li className="flex gap-2 items-center">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Access to Guardian Ruins emergency training</span>
                </li>}
                {newRank >= 5 && <li className="flex gap-2 items-center">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>Access to all jungle companions and special expeditions</span>
                </li>}
              </ul>
            )}
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={onClose}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
          >
            Continue My Jungle Journey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RankUpCelebration;