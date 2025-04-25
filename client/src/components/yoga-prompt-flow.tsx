import React, { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MegaDialog,
  MegaDialogContent,
  MegaDialogTitle,
  MegaDialogDescription,
  MegaDialogBody,
  MegaDialogHeader,
  MegaDialogFooter
} from "@/components/ui/mega-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, Info, ArrowRight, Music, Volume2, VolumeX, Clock, Smile, Frown, MoveRight, Play, PauseCircle, Headphones, Volume1, X } from "lucide-react";

// Define types for the various options
export interface YogaSession {
  id: string;
  title: string;
  duration: number;
  type: string;
  description: string;
  imageUrl: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  moodTags: string[];
  videoUrl?: string; // URL for video sessions
  audioUrl?: string; // URL for audio-guided sessions
  isAudioOnly?: boolean; // Flag to indicate an audio-only guided session
  guidedInstructions?: string[]; // Verbal instructions for audio-guided sessions
}

interface YogaPromptFlowProps {
  onComplete?: (selectedSession?: YogaSession) => void;
  onClose?: () => void;
}

export default function YogaPromptFlow({ onComplete, onClose }: YogaPromptFlowProps) {
  // Check if the device is mobile
  const isMobile = useIsMobile();
  
  // State for tracking the current prompt
  const [currentPrompt, setCurrentPrompt] = useState<'welcome' | 'mood' | 'time' | 'sound' | 'results' | 'session'>('welcome');
  
  // State for storing user selections
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  
  // Sample sessions (these would normally come from an API)
  const [recommendedSessions, setRecommendedSessions] = useState<YogaSession[]>([]);
  
  // State for the selected session and video player
  const [selectedSession, setSelectedSession] = useState<YogaSession | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // State for audio player
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [audioTrack, setAudioTrack] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeInstructionIndex, setActiveInstructionIndex] = useState<number>(0);
  const [instructionInterval, setInstructionInterval] = useState<number | null>(null);
  
  // Effect for handling audio playback
  useEffect(() => {
    const handleAudioPlayback = async () => {
      if (audioRef.current) {
        if (audioPlaying) {
          try {
            // Load the audio if needed and play
            if (audioRef.current.readyState === 0) {
              await audioRef.current.load();
            }
            
            // Play the audio with user interaction context
            const playPromise = audioRef.current.play();
            
            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.error("Error playing audio:", error);
                // Auto-pause on error to prevent console spam
                setAudioPlaying(false);
              });
            }
          } catch (error) {
            console.error("Audio playback error:", error);
            setAudioPlaying(false);
          }
        } else {
          audioRef.current.pause();
        }
      }
    };
    
    handleAudioPlayback();
    
    return () => {
      // Clean up audio on unmount
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioPlaying]);
  
  // Effect for handling session audio
  useEffect(() => {
    if (selectedSession?.audioUrl && currentPrompt === 'session') {
      setAudioTrack(selectedSession.audioUrl);
      
      // Auto-play the audio when a session with audio is selected
      if (selectedSession.isAudioOnly) {
        setAudioPlaying(true);
        
        // For audio-guided sessions, set up the instruction timing
        if (selectedSession.guidedInstructions && selectedSession.guidedInstructions.length > 0) {
          setActiveInstructionIndex(0);
          
          // Clear any existing interval
          if (instructionInterval) {
            window.clearInterval(instructionInterval);
          }
          
          // Move to the next instruction every 10 seconds
          const interval = window.setInterval(() => {
            setActiveInstructionIndex(prev => {
              // If we've reached the end of instructions, loop back to the beginning
              if (prev >= (selectedSession.guidedInstructions?.length || 0) - 1) {
                return 0;
              }
              return prev + 1;
            });
          }, 10000); // 10 seconds per instruction
          
          setInstructionInterval(interval);
        }
      }
    }
    
    return () => {
      // Clean up interval on session change or unmount
      if (instructionInterval) {
        window.clearInterval(instructionInterval);
      }
    };
  }, [selectedSession, currentPrompt]);

  // Function to handle mood selection
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setCurrentPrompt('time');
  };

  // Function to handle time selection
  const handleTimeSelect = (minutes: number) => {
    setSelectedTime(minutes);
    setCurrentPrompt('sound');
  };

  // Function to handle sound preference selection
  const handleSoundSelect = (sound: string) => {
    setSelectedSound(sound);
    
    // Set up audio tracks based on selection
    if (sound === 'calming') {
      setAudioTrack('/audio/yoga-meditation.mp3');
    } else if (sound === 'nature') {
      setAudioTrack('/audio/nature-sounds.mp3');
    } else {
      // For 'silence' or 'later', don't set an audio track
      setAudioTrack(null);
    }
    
    // Generate recommendations based on selections
    generateRecommendations(selectedMood as string, selectedTime as number, sound);
    setCurrentPrompt('results');
  };

  // Function to generate session recommendations based on selections
  const generateRecommendations = (mood: string, time: number, sound: string) => {
    // This would normally call an AI API to get personalized recommendations
    // For now, we'll enhance our algorithm logic
    
    // Map moods to primary and secondary session types for more nuanced matching
    const moodToSessionTypes: Record<string, {primary: string, secondary: string[]}> = {
      'anxious': {
        primary: 'calming',
        secondary: ['grounding', 'restorative']
      },
      'tired': {
        primary: 'energizing', 
        secondary: ['restorative', 'mindful']
      },
      'focused': {
        primary: 'mindful',
        secondary: ['meditative', 'balanced']
      },
      'energetic': {
        primary: 'grounding',
        secondary: ['energizing', 'balanced']
      },
      'sore': {
        primary: 'restorative',
        secondary: ['calming', 'gentle']
      },
      'reflective': {
        primary: 'meditative',
        secondary: ['mindful', 'calming']
      }
    };
    
    // Get recommended session types for the selected mood
    const recommendedTypes = moodToSessionTypes[mood] || {primary: 'balanced', secondary: ['mindful', 'energizing']};
    
    // Generate personalized recommendation context based on mood and time
    const getPersonalizedContext = (sessionType: string, mood: string, time: number): string => {
      const contextMap: Record<string, string> = {
        'anxious': `Based on your anxious mood, this ${time}-minute session is designed to help calm your nervous system and bring a sense of ease.`,
        'tired': `This ${time}-minute practice is perfect for your tired state, offering gentle energizing movements without exhaustion.`,
        'focused': `With your focused mindset, this ${time}-minute session will help channel that concentration into mindful movement and awareness.`,
        'energetic': `Your energetic mood will be balanced by this ${time}-minute session that helps ground and direct that energy productively.`,
        'sore': `This gentle ${time}-minute session is specifically selected for your sore body, focusing on gentle relief and recovery.`,
        'reflective': `Matching your reflective mood, this ${time}-minute practice creates space for introspection while moving mindfully.`
      };
      
      return contextMap[mood] || `This ${time}-minute ${sessionType} session is personalized based on your current mood and available time.`;
    };
    
    // Sample yoga sessions with both video URLs and audio-guided options
    const allSessions: YogaSession[] = [
      {
        id: 'audio1',
        title: 'Guided Breathing & Stretching',
        duration: 15,
        type: 'mindful',
        description: 'A voice-guided session focusing on deep breathing and gentle stretches. No video needed - just follow the audio instructions.',
        imageUrl: 'https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHlvZ2ElMjBtZWRpdGF0aW9ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        level: 'beginner',
        moodTags: ['anxious', 'stressed', 'tired'],
        isAudioOnly: true,
        audioUrl: '/audio/guided-meditation.mp3',
        guidedInstructions: [
          "Find a comfortable seated position or lie down on your back",
          "Close your eyes and begin to notice your natural breath",
          "Slowly deepen your breath, inhaling for 4 counts, exhaling for 6",
          "Gently roll your shoulders back, creating space in your chest",
          "As you inhale, feel your spine lengthening",
          "As you exhale, feel your shoulders relaxing away from your ears",
          "Bring awareness to any areas of tension and consciously soften those areas",
          "Now, gently bring your right ear toward your right shoulder for a neck stretch",
          "Hold for 3 breaths, then slowly return to center",
          "Repeat on the left side, bringing your left ear toward your left shoulder",
          "Return to center and take a deep cleansing breath",
          "Now, transition to a gentle forward fold if seated, or a reclined twist if lying down"
        ]
      },
      {
        id: 'audio2',
        title: 'Evening Wind Down',
        duration: 10,
        type: 'restorative',
        description: 'A calming audio-guided session to help you relax before bed with gentle stretches and mindful breathing.',
        imageUrl: 'https://images.unsplash.com/photo-1506126944674-00c6c192e0a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHlvZ2ElMjBuaWdodHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        level: 'beginner',
        moodTags: ['tired', 'anxious', 'sore'],
        isAudioOnly: true,
        audioUrl: '/audio/nature-sounds.mp3',
        guidedInstructions: [
          "Find a comfortable position, either seated or lying down on your back",
          "Take a moment to settle in, allowing your body to be fully supported",
          "Begin to deepen your breath, feeling your belly rise and fall",
          "With each exhale, release a little more tension from your body",
          "Bring your knees to your chest and gently rock side to side",
          "Release your knees and extend your legs long on your mat",
          "Stretch your arms overhead, creating length through your entire body",
          "Draw your right knee back to your chest, feeling a stretch in your lower back",
          "Hold for 3-5 breaths, then switch to your left knee",
          "Return both legs to the floor and rest your hands on your belly",
          "Notice the natural rise and fall of your breath",
          "Allow your body to completely relax, preparing for a restful night"
        ]
      },
      {
        id: '1',
        title: 'Morning Energy Flow',
        duration: 10,
        type: 'energizing',
        description: 'Wake up your body with gentle movements to increase circulation and energy.',
        imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8eW9nYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        level: 'beginner',
        moodTags: ['tired', 'focused'],
        videoUrl: 'https://www.youtube.com/embed/UEEsdXn8oG8'
      },
      {
        id: '2',
        title: 'Calming Anxiety Sequence',
        duration: 20,
        type: 'calming',
        description: 'Gentle poses and breathing exercises to help quiet the mind and reduce anxiety.',
        imageUrl: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8eW9nYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        level: 'beginner',
        moodTags: ['anxious', 'reflective'],
        videoUrl: 'https://www.youtube.com/embed/hJbRpHZr_d0'
      },
      {
        id: '3',
        title: 'Restorative Evening Practice',
        duration: 30,
        type: 'restorative',
        description: 'Wind down with calming, supported poses to prepare for a restful night.',
        imageUrl: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8eW9nYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60',
        level: 'beginner',
        moodTags: ['tired', 'sore'],
        videoUrl: 'https://www.youtube.com/embed/BiWDsfZ3zbo'
      },
      {
        id: '4',
        title: 'Quick Desk Stretch',
        duration: 5,
        type: 'energizing',
        description: 'Brief stretches you can do at your desk to refresh your body and mind.',
        imageUrl: 'https://images.unsplash.com/photo-1599447292180-45fd84092ef4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHlvZ2F8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        level: 'beginner',
        moodTags: ['focused', 'energetic', 'sore'],
        videoUrl: 'https://www.youtube.com/embed/tAUf7aajBWE'
      },
      {
        id: '5',
        title: 'Mindful Flow',
        duration: 20,
        type: 'mindful',
        description: 'A focused practice connecting breath and movement for present-moment awareness.',
        imageUrl: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHlvZ2F8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        level: 'intermediate',
        moodTags: ['focused', 'reflective'],
        videoUrl: 'https://www.youtube.com/embed/sTANio_2E0Q'
      },
      {
        id: '6',
        title: 'Gentle Recovery',
        duration: 30,
        type: 'restorative',
        description: 'Gentle movements and holds to ease sore muscles and promote recovery.',
        imageUrl: 'https://images.unsplash.com/photo-1573590330099-d6c7355ec595?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHlvZ2F8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        level: 'beginner',
        moodTags: ['sore', 'tired'],
        videoUrl: 'https://www.youtube.com/embed/OMu6OKF5Z1k'
      },
      {
        id: '7',
        title: 'Grounding Practice',
        duration: 15,
        type: 'grounding',
        description: 'Balance excess energy with grounding poses focusing on the lower body.',
        imageUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHlvZ2F8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        level: 'intermediate',
        moodTags: ['energetic', 'anxious'],
        videoUrl: 'https://www.youtube.com/embed/VpW33Celubg'
      },
      {
        id: '8',
        title: 'Meditative Flow',
        duration: 20,
        type: 'meditative',
        description: 'A slow, thoughtful practice with longer holds to promote deep reflection.',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHlvZ2F8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        level: 'beginner',
        moodTags: ['reflective', 'focused'],
        videoUrl: 'https://www.youtube.com/embed/inpok4MKVLM'
      }
    ];
    
    // Filter sessions by time (less than or equal to requested time)
    let filtered = allSessions.filter(session => session.duration <= time);
    
    // Get the recommended session type for this mood
    const recommendedType = moodToSessionTypes[mood]?.primary || 'balanced';
    
    // Filter by type if possible
    const typeMatches = filtered.filter(session => session.type === recommendedType);
    if (typeMatches.length > 0) {
      filtered = typeMatches;
    }
    
    // If we have mood tags, prioritize those
    if (mood) {
      // Sort by relevance to mood
      filtered.sort((a, b) => {
        const aHasMood = a.moodTags.includes(mood) ? 1 : 0;
        const bHasMood = b.moodTags.includes(mood) ? 1 : 0;
        return bHasMood - aHasMood;
      });
    }
    
    // Limit to 3 recommendations
    setRecommendedSessions(filtered.slice(0, 3));
  };

  // Function to start a session
  const handleStartSession = (session: YogaSession) => {
    // Set the selected session and show the video player
    setSelectedSession(session);
    setCurrentPrompt('session');
    setIsPlaying(true);
    
    // Notify parent component but don't close the dialog
    // Pass the session to prevent the parent from closing the dialog
    if (onComplete) {
      onComplete(session);
    }
  };

  // Function to handle the "Let's Flow" button
  const handleLetsFlow = () => {
    setCurrentPrompt('mood');
  };

  // Function to handle the "Just Browsing" button
  const handleJustBrowsing = () => {
    // Skip the prompt flow and show all sessions
    // Generate recommendations with default values
    generateRecommendations('anxious', 30, 'silence');
    setCurrentPrompt('results');
  };

  // Function to render the appropriate prompt
  const renderPrompt = () => {
    switch (currentPrompt) {
      case 'welcome':
        return (
          <div className="flex flex-col items-center text-center p-6 space-y-6">
            <h2 className="text-2xl font-bold">Welcome to your Yoga Zone!</h2>
            <p className="text-lg">Ready to get centered?</p>
            <div className="grid grid-cols-1 gap-4 w-full max-w-md">
              <Button 
                className="py-6 text-lg" 
                onClick={handleLetsFlow}
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Let's Flow
              </Button>
              <Button 
                variant="outline" 
                className="py-6 text-lg"
                onClick={handleJustBrowsing}
              >
                Just Browsing
              </Button>
            </div>
          </div>
        );
        
      case 'mood':
        return (
          <div className="flex flex-col p-6 space-y-6">
            <h2 className="text-xl font-bold">How are you feeling today?</h2>
            <p className="text-muted-foreground">Select what best describes your current mood.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="flex flex-col h-24 p-4"
                onClick={() => handleMoodSelect('anxious')}
              >
                <AlertCircle className="h-6 w-6 mb-2" />
                <span>Anxious</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 p-4"
                onClick={() => handleMoodSelect('tired')}
              >
                <Frown className="h-6 w-6 mb-2" />
                <span>Tired</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 p-4"
                onClick={() => handleMoodSelect('focused')}
              >
                <Info className="h-6 w-6 mb-2" />
                <span>Focused</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 p-4"
                onClick={() => handleMoodSelect('energetic')}
              >
                <Smile className="h-6 w-6 mb-2" />
                <span>Energetic</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 p-4"
                onClick={() => handleMoodSelect('sore')}
              >
                <AlertCircle className="h-6 w-6 mb-2" />
                <span>Sore</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 p-4"
                onClick={() => handleMoodSelect('reflective')}
              >
                <Info className="h-6 w-6 mb-2" />
                <span>Reflective</span>
              </Button>
            </div>
          </div>
        );
        
      case 'time':
        return (
          <div className="flex flex-col p-6 space-y-6">
            <h2 className="text-xl font-bold">How much time do you have?</h2>
            <p className="text-muted-foreground">Select a duration that fits your schedule.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="flex flex-col h-24 p-4"
                onClick={() => handleTimeSelect(5)}
              >
                <Clock className="h-6 w-6 mb-2" />
                <span>5 minutes</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 p-4"
                onClick={() => handleTimeSelect(10)}
              >
                <Clock className="h-6 w-6 mb-2" />
                <span>10 minutes</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 p-4"
                onClick={() => handleTimeSelect(15)}
              >
                <Clock className="h-6 w-6 mb-2" />
                <span>15 minutes</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 p-4"
                onClick={() => handleTimeSelect(30)}
              >
                <Clock className="h-6 w-6 mb-2" />
                <span>30 minutes</span>
              </Button>
            </div>
          </div>
        );
        
      case 'sound':
        return (
          <div className="flex flex-col p-6 space-y-6">
            <h2 className="text-xl font-bold">What sounds would you like?</h2>
            <p className="text-muted-foreground">Choose audio to accompany your practice.</p>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="flex flex-col h-24 p-4"
                onClick={() => handleSoundSelect('calming')}
              >
                <Music className="h-6 w-6 mb-2" />
                <span>Calming Music</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 p-4"
                onClick={() => handleSoundSelect('nature')}
              >
                <Volume1 className="h-6 w-6 mb-2" />
                <span>Nature Sounds</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 p-4"
                onClick={() => handleSoundSelect('silence')}
              >
                <VolumeX className="h-6 w-6 mb-2" />
                <span>Silence</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex flex-col h-24 p-4"
                onClick={() => handleSoundSelect('later')}
              >
                <CheckCircle2 className="h-6 w-6 mb-2" />
                <span>Pick Later</span>
              </Button>
            </div>
          </div>
        );
        
      case 'results':
        return (
          <div className="flex flex-col p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-2">Your Personalized Sessions</h2>
              <p className="text-muted-foreground">Based on your preferences, here are some sessions you might enjoy.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {recommendedSessions.map(session => (
                <Card key={session.id} className="overflow-hidden">
                  <div className="aspect-video w-full overflow-hidden">
                    <img 
                      src={session.imageUrl} 
                      alt={session.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{session.title}</CardTitle>
                      <Badge>{session.duration} min</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 pb-2">
                    <CardDescription>{session.description}</CardDescription>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{session.level}</Badge>
                      <Badge variant="outline">{session.type}</Badge>
                      {session.isAudioOnly && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          <Headphones className="h-3 w-3 mr-1" />
                          Audio Only
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => handleStartSession(session)}
                    >
                      Start Session
                      <MoveRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <Button variant="outline" onClick={() => setCurrentPrompt('welcome')}>
              Start Over
            </Button>
          </div>
        );
        
      case 'session':
        if (!selectedSession) return null;
        return (
          <div className={`flex flex-col ${isMobile ? 'p-3' : 'p-4'} space-y-3 sm:space-y-4`}>
            <div className="flex justify-between items-center">
              <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>{selectedSession.title}</h2>
              <Badge>{selectedSession.duration} min</Badge>
            </div>
            
            {/* Audio player - shown for all sessions */}
            {audioTrack && (
              <div className="border rounded-md p-3 bg-slate-50">
                <div className="flex items-center gap-3 mb-2">
                  <button 
                    onClick={() => setAudioPlaying(!audioPlaying)}
                    className="h-8 w-8 flex-shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                  >
                    {audioPlaying ? (
                      <PauseCircle className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </button>
                  <div className="text-sm flex-grow">
                    {audioPlaying ? 'Playing Audio Session...' : 'Audio Paused'}
                  </div>
                  <div className="flex-shrink-0">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                
                {isMobile ? (
                  <div className="mt-1 p-1.5 bg-yellow-50 text-yellow-800 rounded text-xs">
                    <AlertCircle className="h-3 w-3 inline mr-1" />
                    Demo: Silent audio placeholder
                  </div>
                ) : (
                  <div className="mt-2 p-2 bg-yellow-50 text-yellow-800 rounded text-xs">
                    <AlertCircle className="h-3 w-3 inline mr-1" />
                    Note: Audio is silent. In a production app, this would be replaced with actual meditation music and guided voice instructions.
                  </div>
                )}
                <audio 
                  ref={audioRef} 
                  src={audioTrack} 
                  loop={!selectedSession.isAudioOnly} 
                  preload="auto"
                  controls={false}
                  onError={(e) => console.error("Audio error event:", e)}
                  onCanPlay={() => console.log("Audio is ready to play")}
                />
              </div>
            )}
            
            {/* Video content - shown for video sessions */}
            {!selectedSession.isAudioOnly && (
              <div className="aspect-video w-full overflow-hidden border rounded-md">
                {selectedSession.videoUrl ? (
                  <iframe
                    src={selectedSession.videoUrl}
                    className="w-full h-full"
                    title={selectedSession.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <p className="text-muted-foreground">No video available</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Audio-only guided session view */}
            {selectedSession.isAudioOnly && selectedSession.guidedInstructions && (
              <div className="border rounded-md overflow-hidden">
                <div className={`${isMobile ? 'h-48' : 'aspect-video'} w-full overflow-hidden relative`}>
                  <img 
                    src={selectedSession.imageUrl} 
                    alt={selectedSession.title} 
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
                    <Headphones className={`${isMobile ? 'h-8 w-8 mb-2' : 'h-12 w-12 mb-4'} text-primary`} />
                    <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium mb-1 sm:mb-2`}>Audio-Guided Session</h3>
                    
                    <div className="bg-white/90 p-3 sm:p-4 rounded-md w-full max-w-md shadow-sm">
                      <p className="font-medium text-primary text-sm sm:text-base">Current Instruction:</p>
                      <p className="mt-1 sm:mt-2 text-sm sm:text-base">
                        {selectedSession.guidedInstructions[activeInstructionIndex]}
                      </p>
                      {!isMobile && (
                        <div className="mt-3 p-2 bg-yellow-50 text-yellow-800 rounded text-xs">
                          <AlertCircle className="h-3 w-3 inline mr-1" />
                          Note: In a production app, these instructions would be voiced in the audio.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Sequence of Instructions</h4>
                    <Badge variant="outline" className="text-xs">
                      {activeInstructionIndex + 1} of {selectedSession.guidedInstructions.length}
                    </Badge>
                  </div>
                  <div className={`space-y-2 overflow-y-auto pr-2 ${isMobile ? 'max-h-28' : 'max-h-40'}`}>
                    {selectedSession.guidedInstructions.map((instruction, index) => (
                      <div 
                        key={index} 
                        className={`p-2 rounded text-sm ${
                          index === activeInstructionIndex 
                            ? 'bg-primary/10 border-l-2 border-primary' 
                            : 'opacity-60'
                        }`}
                      >
                        {index + 1}. {instruction}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <CardDescription>{selectedSession.description}</CardDescription>
            
            <div className="flex flex-wrap gap-2 py-2">
              <Badge variant="outline">{selectedSession.level}</Badge>
              <Badge variant="outline">{selectedSession.type}</Badge>
              {selectedSession.isAudioOnly && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Headphones className="h-3 w-3 mr-1" />
                  Audio Only
                </Badge>
              )}
              {selectedSession.moodTags.map(tag => (
                <Badge key={tag} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex justify-between pt-2 sm:pt-4 gap-2">
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                onClick={() => {
                  setCurrentPrompt('results');
                  setAudioPlaying(false);
                  
                  // Clear instruction interval if it exists
                  if (instructionInterval) {
                    window.clearInterval(instructionInterval);
                    setInstructionInterval(null);
                  }
                }}
              >
                {isMobile ? 'Back' : 'Back to Sessions'}
              </Button>
              <Button size={isMobile ? "sm" : "default"} onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <MegaDialog
        open={true}
        onOpenChange={() => onClose && onClose()}
      >
        <MegaDialogContent
          className="bg-background p-0"
          style={{
            /* Purple theme color for yoga flow */
            overflowY: 'auto',
            overscrollBehavior: 'contain'
          }}
        >
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={() => onClose && onClose()}
              aria-label="Close"
              type="button"
              className="rounded-full p-2 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none bg-pink-100 hover:bg-pink-200"
            >
              <X className="h-6 w-6 text-pink-500" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          {/* Hidden MegaDialogTitle for accessibility */}
          <MegaDialogTitle className="sr-only">Yoga Session Flow</MegaDialogTitle>
          <MegaDialogDescription className="sr-only">Personalized yoga sessions and prompts</MegaDialogDescription>
          
          <MegaDialogBody>
            {renderPrompt()}
          </MegaDialogBody>
        </MegaDialogContent>
      </MegaDialog>
    </>
  );
}