import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Lock, Star } from 'lucide-react';
import { Companion } from '../../data/companions';

interface CompanionCardProps {
  companion: Companion;
  isUnlocked: boolean;
  isActive: boolean;
  onSelect: (companionId: string) => void;
  className?: string;
  compact?: boolean;
}

/**
 * Displays a jungle companion character card with information and selection
 */
const CompanionCard: React.FC<CompanionCardProps> = ({
  companion,
  isUnlocked,
  isActive,
  onSelect,
  className = '',
  compact = false
}) => {
  // Helper to get tier badge color
  const getTierBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'tier1': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'tier2': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'tier3': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };
  
  // For locked companions, show a locked version
  if (!isUnlocked) {
    return (
      <Card className={`border-2 border-dashed border-gray-200 bg-gray-50 ${className}`}>
        <CardHeader className="pb-2 relative">
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className={getTierBadgeStyle(companion.tier)}>
              {companion.tier === 'free' ? 'Free' : 
               companion.tier === 'tier1' ? 'Tier 1' : 
               companion.tier === 'tier2' ? 'Tier 2' : 'Tier 3'}
            </Badge>
          </div>
          <div className="flex items-center gap-2 opacity-60">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <Lock className="h-6 w-6 text-gray-400" />
            </div>
            <div>
              <CardTitle className="text-sm">Mystery Companion</CardTitle>
              <CardDescription>Locked</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500 italic">
            {companion.tier === 'free' 
              ? `Complete the "${companion.unlockRequirements.join(', ')}" quest to unlock this companion.`
              : `Subscribe to ${companion.tier === 'tier1' ? 'Tier 1' : companion.tier === 'tier2' ? 'Tier 2' : 'Tier 3'} to unlock this companion.`
            }
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`border-2 ${isActive ? 'border-amber-300 bg-amber-50' : 'hover:border-amber-200'} transition-all ${className}`}>
      <CardHeader className={`${compact ? 'p-3' : 'pb-2'} relative`}>
        <div className="absolute top-3 right-3 flex gap-1">
          <Badge variant="outline" className={getTierBadgeStyle(companion.tier)}>
            {companion.tier === 'free' ? 'Free' : 
             companion.tier === 'tier1' ? 'Tier 1' : 
             companion.tier === 'tier2' ? 'Tier 2' : 'Tier 3'}
          </Badge>
          
          {isActive && (
            <Badge className="bg-amber-100 text-amber-800 border-amber-300">
              <Star className="h-3 w-3 mr-1" /> Active
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
            {/* This would normally be an actual image */}
            <div className="font-bold text-2xl text-amber-800">
              {companion.name.charAt(0)}
            </div>
          </div>
          <div>
            <CardTitle className={compact ? 'text-sm' : 'text-base'}>
              {companion.name}
            </CardTitle>
            <CardDescription>
              {companion.type.charAt(0).toUpperCase() + companion.type.slice(1)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      {!compact && (
        <CardContent>
          <p className="text-sm text-gray-600 italic mb-3">
            "{companion.messages.greeting}"
          </p>
          
          <div className="text-xs text-gray-500 space-y-2">
            <div className="flex gap-2">
              <span className="font-medium">Specialty:</span>
              <span>{companion.specialtyZone}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium">Personality:</span>
              <span>{companion.personality}</span>
            </div>
          </div>
        </CardContent>
      )}
      
      <CardFooter className={compact ? 'p-3 pt-0' : ''}>
        <Button 
          variant={isActive ? "outline" : "default"}
          size="sm"
          className={`w-full ${isActive ? 'border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}
          onClick={() => onSelect(companion.id)}
        >
          {isActive ? (
            <>
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with {companion.name.split(' ')[0]}
            </>
          ) : (
            <>Select Companion</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompanionCard;