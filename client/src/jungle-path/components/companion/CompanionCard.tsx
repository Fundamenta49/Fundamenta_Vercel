import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Companion } from '../../types/companion';
import { Lock, CheckCircle } from 'lucide-react';

interface CompanionCardProps {
  companion: Companion;
  isUnlocked: boolean;
  isActive: boolean;
  onSelect: (companionId: string) => void;
  className?: string;
}

/**
 * CompanionCard displays a jungle companion character that can be selected
 */
const CompanionCard: React.FC<CompanionCardProps> = ({
  companion,
  isUnlocked,
  isActive,
  onSelect,
  className = ''
}) => {
  const handleSelect = () => {
    if (isUnlocked) {
      onSelect(companion.id);
    }
  };
  
  // Determine personality badges
  const getPersonalityBadge = (personality: Companion['personality']) => {
    switch (personality) {
      case 'friendly':
        return <span className="px-2 py-0.5 text-xs rounded-full bg-[#94C973] text-white">Friendly</span>;
      case 'wise':
        return <span className="px-2 py-0.5 text-xs rounded-full bg-[#724E91] text-white">Wise</span>;
      case 'energetic':
        return <span className="px-2 py-0.5 text-xs rounded-full bg-[#E67E33] text-white">Energetic</span>;
      case 'cautious':
        return <span className="px-2 py-0.5 text-xs rounded-full bg-[#3B82C4] text-white">Cautious</span>;
      case 'bold':
        return <span className="px-2 py-0.5 text-xs rounded-full bg-[#C24D4D] text-white">Bold</span>;
      default:
        return null;
    }
  };
  
  return (
    <Card
      className={`overflow-hidden ${
        isActive ? 'ring-2' : ''
      } ${isUnlocked ? 'hover:shadow-md' : 'opacity-70'} ${className}`}
      style={{ 
        ringColor: isActive ? companion.color : 'transparent' 
      }}
    >
      <div className="h-2" style={{ backgroundColor: companion.color }}></div>
      
      <CardContent className="p-4">
        <div className="flex justify-between mb-3">
          <div>
            <h3 className="font-bold">{companion.name}</h3>
            <p className="text-sm text-muted-foreground">{companion.species}</p>
          </div>
          
          {!isUnlocked ? (
            <Lock className="text-muted-foreground" size={20} />
          ) : isActive ? (
            <CheckCircle style={{ color: companion.color }} size={20} />
          ) : null}
        </div>
        
        <div 
          className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center"
          style={{ border: `2px solid ${companion.color}` }}
        >
          {/* Placeholder for companion avatar */}
          <span className="text-2xl">{companion.species.charAt(0)}</span>
        </div>
        
        <p className="text-sm text-center mb-3">{companion.description}</p>
        
        <div className="flex justify-center space-x-2 mb-2">
          {getPersonalityBadge(companion.personality)}
        </div>
      </CardContent>
      
      <CardFooter className="p-3 pt-0">
        <Button
          onClick={handleSelect}
          disabled={!isUnlocked}
          variant={isActive ? "outline" : "default"}
          className="w-full"
          style={!isActive && isUnlocked ? { backgroundColor: companion.color } : {}}
        >
          {isUnlocked
            ? isActive
              ? 'Currently Active'
              : 'Select Companion'
            : 'Locked'
          }
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompanionCard;