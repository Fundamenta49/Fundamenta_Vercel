```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useMoodTheme } from '@/hooks/use-mood-theme';
import { moodColors, moodDescriptions, moodEmojis, type MoodType } from '@/lib/mood-colors';
import { motion } from 'framer-motion';

export function MoodSelector() {
  const { currentMood, setCurrentMood } = useMoodTheme();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleMoodChange = (mood: MoodType) => {
    setCurrentMood(mood);
    setIsOpen(false);
    toast({
      title: `Theme updated to ${mood}`,
      description: moodDescriptions[mood],
      duration: 2000,
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative group h-8 w-8 rounded-full"
          style={{ backgroundColor: moodColors[currentMood].primary }}
        >
          <motion.span
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-lg"
          >
            {moodEmojis[currentMood]}
          </motion.span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {Object.entries(moodColors).map(([mood, colors]) => (
          <DropdownMenuItem
            key={mood}
            onClick={() => handleMoodChange(mood as MoodType)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
            <span className="capitalize">{mood}</span>
            <span className="ml-auto">{moodEmojis[mood as MoodType]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```
