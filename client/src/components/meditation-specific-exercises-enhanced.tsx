import { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  VolumeX, 
  Volume2, 
  Sun, 
  Moon, 
  BookOpen, 
  MessageCircle, 
  AlertCircle, 
  BarChart2, 
  Info, 
  Timer, 
  Calendar 
} from "lucide-react";
import axios from 'axios';

// Define interfaces for our meditation features
interface MeditationSoundOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  audioSrc?: string;
}

interface MeditationGenerationRequest {
  duration: number;
  focusArea: string;
  experience: string;
  includeBreathwork: boolean;
}

interface MeditationScript {
  title: string;
  introduction: string;
  steps: string[];
  conclusion: string;
  duration: number;
}

interface MeditationJournalEntry {
  id: string;
  date: Date;
  duration: number;
  focusArea: string;
  notes: string;
  rating: number;
}

interface MeditationInsight {
  id: string;
  title: string;
  description: string;
  date: Date;
  tips: string[];
}

// Main Meditation Component
export const MeditationSpecificExercisesEnhanced = () => {
  const [activeTab, setActiveTab] = useState('practice');
  
  // Guided meditation state
  const [isPlaying, setIsPlaying] = useState(false);
  const [meditationDuration, setMeditationDuration] = useState(5);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [focusArea, setFocusArea] = useState('mindfulness');
  const [experience, setExperience] = useState('beginner');
  const [includeBreathwork, setIncludeBreathwork] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [volume, setVolume] = useState(70);
  const [ambientSound, setAmbientSound] = useState('nature');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meditationScript, setMeditationScript] = useState<MeditationScript | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Journal state
  const [journalEntries, setJournalEntries] = useState<MeditationJournalEntry[]>([
    {
      id: '1',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      duration: 10,
      focusArea: 'Stress Relief',
      notes: 'Felt very restless at the beginning, but gradually found some stillness. Noticed how much tension I was holding in my shoulders.',
      rating: 3
    },
    {
      id: '2',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      duration: 15,
      focusArea: 'Focus',
      notes: 'Much better session today. Used counting breaths technique which really helped keep my mind from wandering too much.',
      rating: 4
    }
  ]);
  
  const [newJournalEntry, setNewJournalEntry] = useState({
    duration: 0,
    focusArea: '',
    notes: '',
    rating: 3
  });
  
  // Insights state
  const [insights, setInsights] = useState<MeditationInsight[]>([
    {
      id: '1',
      title: 'Consistency is Building',
      description: 'You\'ve meditated 5 of the last 7 days. Regular practice is strengthening your meditation habit.',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      tips: [
        'Try meditating at the same time each day to reinforce the habit',
        'Even 5 minutes daily is more beneficial than one long session weekly'
      ]
    },
    {
      id: '2',
      title: 'Focus Improvement',
      description: 'Your focus-based meditations are showing improvement with longer periods of concentration.',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      tips: [
        'Continue using counting techniques to stabilize attention',
        'Consider increasing duration gradually as your focus strengthens'
      ]
    }
  ]);
  
  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ambient sound options
  const soundOptions: MeditationSoundOption[] = [
    { id: 'nature', name: 'Nature', icon: <span className="text-green-500">🌿</span>, audioSrc: '/sounds/nature.mp3' },
    { id: 'rain', name: 'Rain', icon: <span>🌧️</span>, audioSrc: '/sounds/rain.mp3' },
    { id: 'ocean', name: 'Ocean', icon: <span className="text-blue-500">🌊</span>, audioSrc: '/sounds/ocean.mp3' },
    { id: 'silence', name: 'Silence', icon: <VolumeX className="h-4 w-4 text-gray-500" /> }
  ];
  
  // Generate an AI-guided meditation
  const generateMeditation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const request: MeditationGenerationRequest = {
        duration: meditationDuration,
        focusArea,
        experience,
        includeBreathwork
      };
      
      const response = await axios.post('/api/meditation/generate', request);
      
      if (response.data && response.data.steps) {
        setMeditationScript(response.data);
        setCurrentStepIndex(0);
      } else {
        throw new Error('Invalid response format');
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error generating meditation:', err);
      setError('Unable to generate meditation. Please try again later.');
      setIsLoading(false);
      
      // Use a fallback meditation script
      setMeditationScript({
        title: 'Mindful Awareness Practice',
        introduction: 'Welcome to this guided meditation. Find a comfortable position and let your body relax. We\'ll focus on developing present moment awareness.',
        steps: [
          'Take a deep breath in through your nose, filling your lungs completely.',
          'Exhale slowly through your mouth, letting go of any tension.',
          'Bring your attention to the sensation of your breath at the tip of your nose.',
          'Notice the cool air as you inhale, and the warmer air as you exhale.',
          'When your mind wanders, gently bring your attention back to your breath.',
          'Expand your awareness to include the sensations throughout your body.',
          'Notice any areas of tension and breathe into them, allowing them to soften.',
          'Observe your thoughts coming and going, without getting caught up in them.',
          'Imagine each thought as a cloud passing through the sky of your mind.'
        ],
        conclusion: 'As we conclude this practice, take a moment to appreciate the stillness you\'ve cultivated. Gently wiggle your fingers and toes, and when you\'re ready, open your eyes.',
        duration: meditationDuration
      });
    }
  };
  
  // Start meditation timer
  const startMeditation = () => {
    if (!meditationScript) {
      generateMeditation();
      return;
    }
    
    setIsPlaying(true);
    const startTime = Date.now() - elapsedTime * 1000;
    
    timerRef.current = setInterval(() => {
      const newElapsedTime = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(newElapsedTime);
      
      // Calculate which step to show based on elapsed time
      if (meditationScript) {
        const stepDuration = (meditationScript.duration * 60) / (meditationScript.steps.length + 2); // +2 for intro and conclusion
        const newStepIndex = Math.min(
          Math.floor(newElapsedTime / stepDuration) - 1,
          meditationScript.steps.length + 1
        );
        
        if (newStepIndex !== currentStepIndex && newStepIndex >= 0) {
          setCurrentStepIndex(newStepIndex);
        }
        
        // End meditation when time is up
        if (newElapsedTime >= meditationScript.duration * 60) {
          pauseMeditation();
          // Prompt to save journal entry
          setNewJournalEntry({
            duration: meditationScript.duration,
            focusArea: focusArea,
            notes: '',
            rating: 3
          });
          setActiveTab('journal');
        }
      }
    }, 1000);
  };
  
  // Pause meditation timer
  const pauseMeditation = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  // Reset meditation
  const resetMeditation = () => {
    pauseMeditation();
    setElapsedTime(0);
    setCurrentStepIndex(0);
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Save a journal entry
  const saveJournalEntry = () => {
    const newEntry: MeditationJournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      duration: newJournalEntry.duration,
      focusArea: newJournalEntry.focusArea || focusArea,
      notes: newJournalEntry.notes,
      rating: newJournalEntry.rating
    };
    
    setJournalEntries([newEntry, ...journalEntries]);
    
    // Reset form
    setNewJournalEntry({
      duration: 0,
      focusArea: '',
      notes: '',
      rating: 3
    });
    
    // Generate a new insight occasionally based on journal entries
    if (journalEntries.length % 3 === 0) {
      generateInsight();
    }
  };
  
  // Generate an insight based on meditation history
  const generateInsight = async () => {
    try {
      // In a real implementation, we'd call the AI API with the journal entries
      // to generate personalized insights
      console.log('Generating insight from meditation history');
      
      // Simulate an API call with a timeout
      setTimeout(() => {
        const newInsight: MeditationInsight = {
          id: Date.now().toString(),
          title: 'Evening Sessions Most Effective',
          description: 'Your evening meditation sessions have consistently higher ratings than morning sessions.',
          date: new Date(),
          tips: [
            'Consider making evening meditation a regular part of your wind-down routine',
            'The calming effects may also be helping with sleep quality'
          ]
        };
        
        setInsights([newInsight, ...insights]);
      }, 1000);
      
    } catch (err) {
      console.error('Error generating insight:', err);
    }
  };
  
  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Get current meditation step text
  const getCurrentStepText = (): string => {
    if (!meditationScript) return '';
    
    if (currentStepIndex < 0) {
      return meditationScript.introduction;
    } else if (currentStepIndex >= meditationScript.steps.length) {
      return meditationScript.conclusion;
    } else {
      return meditationScript.steps[currentStepIndex];
    }
  };
  
  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  return (
    <div className="mx-auto w-full max-w-4xl">
      <Card className={`shadow-md border-pink-100 ${darkMode ? 'bg-gray-900 text-gray-100' : ''}`}>
        <div className={`p-4 ${darkMode ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-pink-50 to-white'}`}>
          <div className="flex justify-between items-center mb-2">
            <h2 className={`text-2xl font-semibold ${darkMode ? 'text-gray-100' : 'text-pink-700'}`}>
              Meditation & Mindfulness
            </h2>
            <div className="flex items-center space-x-2">
              <Sun className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-yellow-500'}`} />
              <Switch 
                checked={darkMode} 
                onCheckedChange={setDarkMode} 
                className={darkMode ? 'bg-gray-700' : ''}
              />
              <Moon className={`h-4 w-4 ${darkMode ? 'text-blue-300' : 'text-gray-400'}`} />
            </div>
          </div>
          
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Practice mindfulness, manage stress, and cultivate inner peace with guided meditations and reflection exercises.
          </p>
          
          {error && (
            <Alert className={`mb-4 ${darkMode ? 'bg-red-900 border-red-800' : 'bg-red-50 border-red-200'}`}>
              <AlertCircle className={`h-4 w-4 ${darkMode ? 'text-red-300' : 'text-red-600'}`} />
              <AlertTitle className={darkMode ? 'text-red-300' : 'text-red-600'}>Error</AlertTitle>
              <AlertDescription className={darkMode ? 'text-red-300' : 'text-red-500'}>
                {error}
              </AlertDescription>
            </Alert>
          )}
          
          <Tabs 
            defaultValue="practice" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className={`w-full grid grid-cols-3 ${darkMode ? 'bg-gray-800' : 'bg-pink-100'}`}>
              <TabsTrigger 
                value="practice" 
                className={darkMode 
                  ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-blue-300' 
                  : 'data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800'
                }
              >
                <Timer className="h-4 w-4 mr-2" />
                Practice
              </TabsTrigger>
              <TabsTrigger 
                value="journal" 
                className={darkMode 
                  ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-blue-300' 
                  : 'data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800'
                }
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Journal
              </TabsTrigger>
              <TabsTrigger 
                value="insights" 
                className={darkMode 
                  ? 'data-[state=active]:bg-gray-700 data-[state=active]:text-blue-300' 
                  : 'data-[state=active]:bg-pink-200 data-[state=active]:text-pink-800'
                }
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Insights
              </TabsTrigger>
            </TabsList>
            
            {/* Meditation Practice Tab */}
            <TabsContent value="practice" className="pt-4">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-4`}>
                {/* Meditation Settings */}
                <div className="mb-6">
                  <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Meditation Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label className={darkMode ? 'text-gray-300' : ''}>Duration (minutes)</Label>
                        <div className="flex items-center mt-1 space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : ''}
                            onClick={() => setMeditationDuration(Math.max(1, meditationDuration - 1))}
                            disabled={isPlaying}
                          >
                            -
                          </Button>
                          <div className={`text-center px-4 py-2 rounded-md w-16 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100'}`}>
                            {meditationDuration}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className={darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : ''}
                            onClick={() => setMeditationDuration(Math.min(60, meditationDuration + 1))}
                            disabled={isPlaying}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <Label className={darkMode ? 'text-gray-300' : ''}>Focus Area</Label>
                        <select 
                          value={focusArea}
                          onChange={(e) => setFocusArea(e.target.value)}
                          disabled={isPlaying}
                          className={`w-full mt-1 rounded-md ${
                            darkMode 
                              ? 'bg-gray-700 text-gray-300 border-gray-600' 
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          <option value="mindfulness">Mindfulness</option>
                          <option value="stress-relief">Stress Relief</option>
                          <option value="sleep">Sleep & Relaxation</option>
                          <option value="focus">Focus & Concentration</option>
                          <option value="gratitude">Gratitude</option>
                          <option value="compassion">Self-Compassion</option>
                        </select>
                      </div>
                      
                      <div>
                        <Label className={darkMode ? 'text-gray-300' : ''}>Experience Level</Label>
                        <select 
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          disabled={isPlaying}
                          className={`w-full mt-1 rounded-md ${
                            darkMode 
                              ? 'bg-gray-700 text-gray-300 border-gray-600' 
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <Label className={darkMode ? 'text-gray-300' : ''}>Include Breathwork</Label>
                          <Switch 
                            checked={includeBreathwork} 
                            onCheckedChange={setIncludeBreathwork}
                            disabled={isPlaying}
                            className={darkMode ? 'bg-gray-700' : ''}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label className={darkMode ? 'text-gray-300' : ''}>Volume</Label>
                        <div className="flex items-center mt-2 space-x-2">
                          <VolumeX className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <Slider
                            value={[volume]}
                            min={0}
                            max={100}
                            step={1}
                            onValueChange={(vals) => setVolume(vals[0])}
                            className={darkMode ? 'bg-gray-700' : ''}
                          />
                          <Volume2 className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </div>
                      </div>
                      
                      <div>
                        <Label className={darkMode ? 'text-gray-300' : ''}>Ambient Sound</Label>
                        <div className="grid grid-cols-4 gap-2 mt-1">
                          {soundOptions.map((option) => (
                            <Button
                              key={option.id}
                              variant={ambientSound === option.id ? "default" : "outline"}
                              size="sm"
                              onClick={() => setAmbientSound(option.id)}
                              className={`flex items-center justify-center ${
                                darkMode 
                                  ? (ambientSound === option.id ? 'bg-blue-600' : 'bg-gray-700 border-gray-600') 
                                  : (ambientSound === option.id ? 'bg-pink-500' : '')
                              }`}
                            >
                              {option.icon}
                              <span className="ml-1 text-xs">{option.name}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Generate Button */}
                {!meditationScript && !isPlaying && (
                  <Button 
                    onClick={generateMeditation}
                    disabled={isLoading}
                    className={`w-full ${
                      darkMode 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-pink-500 hover:bg-pink-600'
                    }`}
                  >
                    {isLoading ? 'Generating...' : 'Generate Guided Meditation'}
                  </Button>
                )}
                
                {/* Meditation Player */}
                {meditationScript && (
                  <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                    <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-blue-300' : 'text-pink-700'}`}>
                      {meditationScript.title}
                    </h3>
                    
                    <div className="h-32 overflow-y-auto mb-4 p-4 rounded-md text-center flex items-center justify-center">
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {getCurrentStepText()}
                      </p>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                          {formatTime(elapsedTime)}
                        </span>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                          {formatTime(meditationScript.duration * 60)}
                        </span>
                      </div>
                      <Progress 
                        value={(elapsedTime / (meditationScript.duration * 60)) * 100} 
                        className={`h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} 
                      />
                    </div>
                    
                    {/* Player Controls */}
                    <div className="flex justify-center space-x-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={resetMeditation}
                        className={darkMode ? 'border-gray-700 bg-gray-800 text-gray-300' : ''}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-skip-back"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" x2="5" y1="19" y2="5"></line></svg>
                      </Button>
                      
                      <Button
                        variant="default"
                        size="icon"
                        onClick={isPlaying ? pauseMeditation : startMeditation}
                        className={`rounded-full w-12 h-12 ${
                          darkMode 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-pink-500 hover:bg-pink-600'
                        }`}
                      >
                        {isPlaying 
                          ? <Pause className="h-6 w-6" /> 
                          : <Play className="h-6 w-6" />
                        }
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          if (currentStepIndex < meditationScript.steps.length) {
                            setCurrentStepIndex(currentStepIndex + 1);
                          }
                        }}
                        disabled={currentStepIndex >= meditationScript.steps.length}
                        className={darkMode ? 'border-gray-700 bg-gray-800 text-gray-300' : ''}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-skip-forward"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" x2="19" y1="5" y2="19"></line></svg>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Quick Tips */}
              <Alert className={`${
                darkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <Info className={`h-4 w-4 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`} />
                <AlertTitle className={darkMode ? 'text-gray-200' : 'text-blue-700'}>Meditation Tips</AlertTitle>
                <AlertDescription className={darkMode ? 'text-gray-300' : 'text-blue-600'}>
                  Find a quiet space, sit comfortably, and focus on your breath. When your mind wanders, 
                  gently bring your attention back without judgment. Consistency is more important than duration.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            {/* Meditation Journal Tab */}
            <TabsContent value="journal" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Journal Entry Form */}
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Record Your Practice
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label className={darkMode ? 'text-gray-300' : ''}>Duration (minutes)</Label>
                      <Input 
                        type="number" 
                        value={newJournalEntry.duration || ''}
                        onChange={(e) => setNewJournalEntry({
                          ...newJournalEntry,
                          duration: parseInt(e.target.value) || 0
                        })}
                        className={darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : ''}
                      />
                    </div>
                    
                    <div>
                      <Label className={darkMode ? 'text-gray-300' : ''}>Focus Area</Label>
                      <Input 
                        value={newJournalEntry.focusArea}
                        onChange={(e) => setNewJournalEntry({
                          ...newJournalEntry,
                          focusArea: e.target.value
                        })}
                        placeholder="e.g., Mindfulness, Stress Relief, Focus"
                        className={darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : ''}
                      />
                    </div>
                    
                    <div>
                      <Label className={darkMode ? 'text-gray-300' : ''}>Notes</Label>
                      <Textarea 
                        value={newJournalEntry.notes}
                        onChange={(e) => setNewJournalEntry({
                          ...newJournalEntry,
                          notes: e.target.value
                        })}
                        placeholder="How did your practice go? What did you notice?"
                        className={`min-h-24 ${darkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : ''}`}
                      />
                    </div>
                    
                    <div>
                      <Label className={darkMode ? 'text-gray-300' : ''}>How was your experience?</Label>
                      <RadioGroup 
                        value={newJournalEntry.rating.toString()}
                        onValueChange={(value) => setNewJournalEntry({
                          ...newJournalEntry,
                          rating: parseInt(value)
                        })}
                        className="flex justify-between mt-2"
                      >
                        {[1, 2, 3, 4, 5].map((value) => (
                          <div key={value} className="flex items-center space-x-1">
                            <RadioGroupItem 
                              value={value.toString()} 
                              id={`rating-${value}`}
                              className={darkMode ? 'text-blue-400 border-gray-600' : ''}
                            />
                            <Label 
                              htmlFor={`rating-${value}`}
                              className={darkMode ? 'text-gray-300' : ''}
                            >
                              {value}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <div className="flex justify-between text-xs mt-1">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Challenging</span>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Excellent</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={saveJournalEntry}
                      className={`w-full ${
                        darkMode 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-pink-500 hover:bg-pink-600'
                      }`}
                    >
                      Save Entry
                    </Button>
                  </div>
                </div>
                
                {/* Journal Entries List */}
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Journal History
                  </h3>
                  
                  <div className="space-y-3 overflow-y-auto" style={{ maxHeight: '400px' }}>
                    {journalEntries.length === 0 ? (
                      <div className={`text-center py-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No entries yet. Record your first meditation experience!</p>
                      </div>
                    ) : (
                      journalEntries.map((entry) => (
                        <div 
                          key={entry.id} 
                          className={`p-3 rounded-md ${
                            darkMode 
                              ? 'bg-gray-900 border border-gray-700' 
                              : 'bg-gray-50 border border-gray-100'
                          }`}
                        >
                          <div className="flex justify-between mb-1">
                            <div className="flex items-center">
                              <Calendar className={`h-3 w-3 mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {formatDate(entry.date)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Timer className={`h-3 w-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {entry.duration} min
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between mb-2">
                            <Badge 
                              variant="outline" 
                              className={darkMode ? 'bg-gray-800 text-blue-300 border-gray-700' : ''}
                            >
                              {entry.focusArea}
                            </Badge>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <span 
                                  key={i}
                                  className={`text-xs ${
                                    i < entry.rating 
                                      ? (darkMode ? 'text-blue-400' : 'text-pink-500') 
                                      : (darkMode ? 'text-gray-600' : 'text-gray-300')
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {entry.notes}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Insights Tab */}
            <TabsContent value="insights" className="pt-4">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-4`}>
                <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Your Meditation Insights
                </h3>
                
                <div className="space-y-4">
                  {insights.length === 0 ? (
                    <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <BarChart2 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>Keep practicing and journaling to receive personalized insights!</p>
                    </div>
                  ) : (
                    insights.map((insight) => (
                      <div 
                        key={insight.id} 
                        className={`p-4 rounded-md ${
                          darkMode 
                            ? 'bg-gray-900 border border-gray-700' 
                            : 'bg-blue-50 border border-blue-100'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="/images/insight-avatar.png" alt="AI" />
                              <AvatarFallback className={darkMode ? 'bg-blue-600' : 'bg-pink-100'}>
                                <BarChart2 className={`h-5 w-5 ${darkMode ? 'text-blue-200' : 'text-pink-600'}`} />
                              </AvatarFallback>
                            </Avatar>
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <h4 className={`font-medium ${darkMode ? 'text-blue-300' : 'text-pink-700'}`}>
                                {insight.title}
                              </h4>
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {formatDate(insight.date)}
                              </span>
                            </div>
                            <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {insight.description}
                            </p>
                            
                            <h5 className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Tips:
                            </h5>
                            <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {insight.tips.map((tip, index) => (
                                <li key={index} className="flex items-start">
                                  <span className={`inline-block mr-2 ${darkMode ? 'text-blue-400' : 'text-pink-500'}`}>•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Meditation Stats */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Practice Summary
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className={`p-3 rounded-md text-center ${
                    darkMode ? 'bg-gray-900' : 'bg-gray-50'
                  }`}>
                    <p className={`text-2xl font-semibold ${darkMode ? 'text-blue-400' : 'text-pink-600'}`}>
                      {journalEntries.length}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Total Sessions
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-md text-center ${
                    darkMode ? 'bg-gray-900' : 'bg-gray-50'
                  }`}>
                    <p className={`text-2xl font-semibold ${darkMode ? 'text-blue-400' : 'text-pink-600'}`}>
                      {journalEntries.reduce((sum, entry) => sum + entry.duration, 0)}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Total Minutes
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-md text-center ${
                    darkMode ? 'bg-gray-900' : 'bg-gray-50'
                  }`}>
                    <p className={`text-2xl font-semibold ${darkMode ? 'text-blue-400' : 'text-pink-600'}`}>
                      {journalEntries.length > 0 
                        ? (journalEntries.reduce((sum, entry) => sum + entry.rating, 0) / journalEntries.length).toFixed(1)
                        : '0'}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Average Rating
                    </p>
                  </div>
                  
                  <div className={`p-3 rounded-md text-center ${
                    darkMode ? 'bg-gray-900' : 'bg-gray-50'
                  }`}>
                    <p className={`text-2xl font-semibold ${darkMode ? 'text-blue-400' : 'text-pink-600'}`}>
                      {journalEntries.length > 0
                        ? Math.round(journalEntries.reduce((sum, entry) => sum + entry.duration, 0) / journalEntries.length)
                        : '0'}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Avg. Session Length
                    </p>
                  </div>
                </div>
                
                {/* Meditation Streak Calendar */}
                <div className="mt-4">
                  <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    April 2025
                  </h4>
                  <div className="grid grid-cols-7 gap-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <div 
                        key={`header-${i}`} 
                        className={`text-center text-xs py-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        {day}
                      </div>
                    ))}
                    
                    {Array.from({ length: 30 }).map((_, i) => {
                      // Sample data - in a real app this would be based on actual meditation dates
                      const hasSession = [2, 5, 6, 7, 12, 13, 14, 19, 20, 21, 22, 23].includes(i + 1);
                      const isToday = i + 1 === 25; // April 25, 2025
                      
                      return (
                        <div 
                          key={`day-${i}`} 
                          className={`rounded-full w-8 h-8 mx-auto flex items-center justify-center text-xs
                            ${isToday 
                              ? (darkMode ? 'bg-blue-600 text-white' : 'bg-pink-500 text-white') 
                              : hasSession 
                                ? (darkMode ? 'bg-blue-900 text-blue-200' : 'bg-pink-100 text-pink-700')
                                : (darkMode ? 'text-gray-500' : 'text-gray-400')
                            }
                          `}
                        >
                          {i + 1}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default MeditationSpecificExercisesEnhanced;