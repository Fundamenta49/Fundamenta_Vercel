import React, { useState } from 'react';
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, Info, ArrowRight, Music, Volume2, VolumeX, Clock, Smile, Frown, MoveRight, Play, PauseCircle } from "lucide-react";

// Define types for the various options
interface YogaSession {
  id: string;
  title: string;
  duration: number;
  type: string;
  description: string;
  imageUrl: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  moodTags: string[];
  videoUrl?: string; // Add videoUrl for yoga sessions
}

interface YogaPromptFlowProps {
  onComplete?: (selectedSession?: YogaSession) => void;
  onClose?: () => void;
}

export default function YogaPromptFlow({ onComplete, onClose }: YogaPromptFlowProps) {
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
    // Generate recommendations based on selections
    generateRecommendations(selectedMood as string, selectedTime as number, sound);
    setCurrentPrompt('results');
  };

  // Function to generate session recommendations based on selections
  const generateRecommendations = (mood: string, time: number, sound: string) => {
    // This would normally call an API or search a database
    // For now, we'll create some sample recommendations
    
    // Map moods to session types
    const moodToSessionType: Record<string, string> = {
      'anxious': 'calming',
      'tired': 'energizing',
      'focused': 'mindful',
      'energetic': 'grounding',
      'sore': 'restorative',
      'reflective': 'meditative'
    };
    
    const sessionType = moodToSessionType[mood] || 'balanced';
    
    // Sample yoga sessions with video URLs
    const allSessions: YogaSession[] = [
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
    
    // Filter by type if possible
    const typeMatches = filtered.filter(session => session.type === sessionType);
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
    
    // Also notify parent component if needed
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
    // Skip the prompt flow and show all sessions with video URLs
    const allSessions: YogaSession[] = [
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
    ];
    setRecommendedSessions(allSessions);
    setCurrentPrompt('results');
  };

  // Function to go back to the previous prompt
  const handleBack = () => {
    if (currentPrompt === 'mood') {
      setCurrentPrompt('welcome');
    } else if (currentPrompt === 'time') {
      setCurrentPrompt('mood');
    } else if (currentPrompt === 'sound') {
      setCurrentPrompt('time');
    } else if (currentPrompt === 'results') {
      setCurrentPrompt('sound');
    } else if (currentPrompt === 'session') {
      setCurrentPrompt('results');
      setIsPlaying(false);
    }
  };

  // Render the current prompt
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
                Let's Flow
                <MoveRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="py-6 text-lg" 
                onClick={handleJustBrowsing}
              >
                Just Browsing
              </Button>
              <Button 
                variant="ghost" 
                className="py-4" 
                onClick={onClose}
              >
                Maybe Later
              </Button>
            </div>
          </div>
        );
        
      case 'mood':
        return (
          <div className="flex flex-col p-6 space-y-6">
            <h2 className="text-2xl font-bold text-center">How are you feeling right now?</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="py-8 flex flex-col items-center" 
                onClick={() => handleMoodSelect('anxious')}
              >
                <Frown className="h-8 w-8 mb-2" />
                Anxious
              </Button>
              <Button 
                variant="outline" 
                className="py-8 flex flex-col items-center" 
                onClick={() => handleMoodSelect('tired')}
              >
                <Frown className="h-8 w-8 mb-2" />
                Tired
              </Button>
              <Button 
                variant="outline" 
                className="py-8 flex flex-col items-center" 
                onClick={() => handleMoodSelect('focused')}
              >
                <Smile className="h-8 w-8 mb-2" />
                Focused
              </Button>
              <Button 
                variant="outline" 
                className="py-8 flex flex-col items-center" 
                onClick={() => handleMoodSelect('energetic')}
              >
                <Smile className="h-8 w-8 mb-2" />
                Energetic
              </Button>
              <Button 
                variant="outline" 
                className="py-8 flex flex-col items-center" 
                onClick={() => handleMoodSelect('sore')}
              >
                <Frown className="h-8 w-8 mb-2" />
                Sore
              </Button>
              <Button 
                variant="outline" 
                className="py-8 flex flex-col items-center" 
                onClick={() => handleMoodSelect('reflective')}
              >
                <Smile className="h-8 w-8 mb-2" />
                Reflective
              </Button>
            </div>
            <div className="pt-4">
              <Button 
                variant="ghost" 
                onClick={handleBack}
              >
                Back
              </Button>
            </div>
          </div>
        );
        
      case 'time':
        return (
          <div className="flex flex-col p-6 space-y-6">
            <h2 className="text-2xl font-bold text-center">How much time do you have today?</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="py-8 flex flex-col items-center" 
                onClick={() => handleTimeSelect(5)}
              >
                <Clock className="h-8 w-8 mb-2" />
                5 Minutes
              </Button>
              <Button 
                variant="outline" 
                className="py-8 flex flex-col items-center" 
                onClick={() => handleTimeSelect(10)}
              >
                <Clock className="h-8 w-8 mb-2" />
                10 Minutes
              </Button>
              <Button 
                variant="outline" 
                className="py-8 flex flex-col items-center" 
                onClick={() => handleTimeSelect(20)}
              >
                <Clock className="h-8 w-8 mb-2" />
                20 Minutes
              </Button>
              <Button 
                variant="outline" 
                className="py-8 flex flex-col items-center" 
                onClick={() => handleTimeSelect(30)}
              >
                <Clock className="h-8 w-8 mb-2" />
                30+ Minutes
              </Button>
            </div>
            <div className="pt-4">
              <Button 
                variant="ghost" 
                onClick={handleBack}
              >
                Back
              </Button>
            </div>
          </div>
        );
        
      case 'sound':
        return (
          <div className="flex flex-col p-6 space-y-6">
            <h2 className="text-2xl font-bold text-center">What's your vibe today?</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="py-8 flex flex-col items-center" 
                onClick={() => handleSoundSelect('calming')}
              >
                <Music className="h-8 w-8 mb-2" />
                Calming Music
              </Button>
              <Button 
                variant="outline" 
                className="py-8 flex flex-col items-center" 
                onClick={() => handleSoundSelect('nature')}
              >
                <Volume2 className="h-8 w-8 mb-2" />
                Nature Sounds
              </Button>
              <Button 
                variant="outline" 
                className="py-8 flex flex-col items-center" 
                onClick={() => handleSoundSelect('silence')}
              >
                <VolumeX className="h-8 w-8 mb-2" />
                Silence
              </Button>
              <Button 
                variant="outline" 
                className="py-8 flex flex-col items-center" 
                onClick={() => handleSoundSelect('later')}
              >
                <ArrowRight className="h-8 w-8 mb-2" />
                Pick Later
              </Button>
            </div>
            <div className="pt-4">
              <Button 
                variant="ghost" 
                onClick={handleBack}
              >
                Back
              </Button>
            </div>
          </div>
        );
        
      case 'results':
        return (
          <div className="flex flex-col p-6 space-y-6">
            <h2 className="text-2xl font-bold text-center">Your Personalized Sessions</h2>
            <p className="text-center text-muted-foreground">
              Based on your preferences, here are some sessions we think you'll enjoy:
            </p>
            
            <div className="grid grid-cols-1 gap-6">
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
                    <div className="flex justify-between items-start">
                      <CardTitle>{session.title}</CardTitle>
                      <Badge>{session.duration} min</Badge>
                    </div>
                    <CardDescription>{session.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{session.level}</Badge>
                      <Badge variant="outline">{session.type}</Badge>
                      {session.moodTags.map(tag => (
                        <Badge key={tag} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => handleStartSession(session)}
                    >
                      Start Session
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="ghost" 
                onClick={handleBack}
              >
                Back
              </Button>
              <Button 
                variant="outline" 
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        );
        
      case 'session':
        if (!selectedSession) return null;
        return (
          <div className="flex flex-col p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{selectedSession.title}</h2>
              <Badge>{selectedSession.duration} min</Badge>
            </div>
            
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
            
            <CardDescription>{selectedSession.description}</CardDescription>
            
            <div className="flex flex-wrap gap-2 py-2">
              <Badge variant="outline">{selectedSession.level}</Badge>
              <Badge variant="outline">{selectedSession.type}</Badge>
              {selectedSession.moodTags.map(tag => (
                <Badge key={tag} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentPrompt('results')}
              >
                Back to Sessions
              </Button>
              <Button onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog 
      open={true} 
      onOpenChange={() => onClose && onClose()}
    >
      <DialogContent className="max-w-md md:max-w-lg p-0 max-h-[90vh] overflow-y-auto">
        {renderPrompt()}
      </DialogContent>
    </Dialog>
  );
}