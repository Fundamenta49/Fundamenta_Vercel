import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  ActivityProfile,
  YogaProfile,
  RunningProfile,
  WeightliftingProfile,
  HIITProfile,
  StretchingProfile,
  MeditationProfile,
  useActivityProfile 
} from "@/contexts/activity-profile-context";
import { ExerciseType } from "@/modules/active-you/context/module-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dumbbell,
  Timer as Clock,
  Hammer,
  Zap,
  Heart,
  Brain,
  Wind,
  Mountain,
  Footprints
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Map of activity types to their icons
const activityIcons: Record<string, React.ReactNode> = {
  'yoga': <Mountain className="h-5 w-5 mr-2" />,
  'running': <Footprints className="h-5 w-5 mr-2" />,
  'weightlifting': <Dumbbell className="h-5 w-5 mr-2" />,
  'hiit': <Zap className="h-5 w-5 mr-2" />,
  'stretch': <Wind className="h-5 w-5 mr-2" />,
  'meditation': <Brain className="h-5 w-5 mr-2" />,
  'activeyou': <Heart className="h-5 w-5 mr-2" />
};

// Activity-specific colors
const activityColors = {
  'yoga': 'purple',
  'running': 'green',
  'weightlifting': 'pink',
  'hiit': 'orange',
  'stretch': 'blue',
  'meditation': 'indigo',
  'activeyou': 'sky' // Adding activeyou for compatibility with ExerciseType
};

// Activity-specific presets for form options
const activityOptions = {
  yoga: {
    focusAreas: ['Flexibility', 'Strength', 'Balance', 'Mindfulness', 'Core', 'Relaxation'],
    styles: ['Hatha', 'Vinyasa', 'Yin', 'Power', 'Restorative', 'Ashtanga', 'Kundalini'],
    frequency: ['Daily', '2-3 times per week', 'Weekly', 'Occasionally'],
    injuries: ['Lower Back', 'Knees', 'Shoulders', 'Wrists', 'Neck', 'Hips'],
    favoritePoses: ['Downward Dog', 'Child\'s Pose', 'Warrior I/II', 'Tree Pose', 'Corpse Pose', 'Bridge Pose']
  },
  running: {
    goals: ['5K', '10K', 'Half Marathon', 'Marathon', 'Improve Pace', 'Weight Loss', 'Endurance'],
    terrain: ['Road', 'Trail', 'Track', 'Treadmill', 'Beach', 'Hills'],
    frequency: ['Daily', '3-4 times per week', '1-2 times per week', 'Occasionally'],
    injuries: ['Knees', 'Ankles', 'Shin Splints', 'IT Band', 'Plantar Fasciitis', 'Hip Flexors'],
    weather: ['Any', 'Sunny', 'Cool', 'Indoor Only']
  },
  weightlifting: {
    goals: ['Muscle Gain', 'Strength', 'Endurance', 'Power', 'Toning', 'Functional Fitness'],
    muscleGroups: ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders', 'Core', 'Glutes'],
    equipment: ['Free Weights', 'Machines', 'Bodyweight', 'Resistance Bands', 'Kettlebells', 'Dumbbells', 'Barbells'],
    frequency: ['3-4 times per week', '5-6 times per week', 'Every Other Day', 'Full Body 2-3x/Week'],
    injuries: ['Shoulders', 'Lower Back', 'Knees', 'Elbows', 'Wrists']
  },
  hiit: {
    intensity: ['Low', 'Medium', 'High'],
    rest: ['Short', 'Medium', 'Long'],
    focusAreas: ['Cardio', 'Strength', 'Agility', 'Endurance', 'Fat Burning', 'Full Body'],
    equipment: ['Bodyweight', 'Kettlebell', 'Dumbbells', 'Jump Rope', 'Medicine Ball', 'Resistance Bands'],
    frequency: ['1-2 times per week', '2-3 times per week', '3-4 times per week'],
    injuries: ['Knees', 'Ankles', 'Wrists', 'Shoulders', 'Back', 'Hips']
  },
  stretch: {
    goals: ['Touch Toes', 'Splits', 'Shoulder Mobility', 'Hip Flexibility', 'Better Posture', 'Injury Prevention'],
    tightAreas: ['Hamstrings', 'Back', 'Shoulders', 'Hips', 'Calves', 'Chest', 'Neck'],
    techniques: ['Static', 'Dynamic', 'PNF', 'Ballistic', 'Active Isolated'],
    frequency: ['Daily', 'After Workouts', 'Morning Routine', 'Evening Routine', 'Multiple Times Daily'],
    injuries: ['Lower Back', 'Hamstrings', 'Shoulders', 'Neck']
  },
  meditation: {
    goals: ['Stress Reduction', 'Focus', 'Sleep', 'Mindfulness', 'Anxiety Relief', 'Emotional Balance'],
    styles: ['Guided', 'Breathing', 'Body Scan', 'Mindfulness', 'Mantra', 'Loving-Kindness', 'Transcendental'],
    frequency: ['Daily', 'Morning and Evening', 'Weekly', 'As Needed', 'Multiple Times Daily'],
    challenges: ['Staying Focused', 'Finding Time', 'Posture', 'Falling Asleep', 'Racing Thoughts']
  }
};

// Get default values for each activity type
const getDefaultProfile = (type: ExerciseType): ActivityProfile => {
  const baseProfile = {
    lastUpdated: new Date(),
    experience: 'beginner' as const,
    timeAvailable: 30,
  };

  switch (type) {
    case 'yoga':
      return {
        ...baseProfile,
        focusAreas: [],
        preferredStyles: [],
        practiceFrequency: 'Weekly',
        injuryConsiderations: [],
        favoriteAsanas: [],
      } as YogaProfile;
    
    case 'running':
      return {
        ...baseProfile,
        runningGoals: [],
        typicalDistance: 5,
        typicalPace: 6,
        preferredTerrain: [],
        runningFrequency: '3 times per week',
        injuryConsiderations: [],
        preferredWeather: [],
      } as RunningProfile;
    
    case 'weightlifting':
      return {
        ...baseProfile,
        strengthGoals: [],
        focusMuscleGroups: [],
        preferredEquipment: [],
        maxLifts: {},
        trainingFrequency: '3-4 times per week',
        injuryConsiderations: [],
      } as WeightliftingProfile;
    
    case 'hiit':
      return {
        ...baseProfile,
        intensityPreference: 'medium',
        restPreference: 'medium',
        focusAreas: [],
        preferredEquipment: [],
        preferredExercises: [],
        trainingFrequency: '2-3 times per week',
        injuryConsiderations: [],
      } as HIITProfile;
    
    case 'stretch':
      return {
        ...baseProfile,
        flexibilityGoals: [],
        tightAreas: [],
        preferredTechniques: [],
        stretchingFrequency: 'daily',
        injuryConsiderations: [],
      } as StretchingProfile;
    
    case 'meditation':
      return {
        ...baseProfile,
        meditationGoals: [],
        preferredStyles: [],
        practiceFrequency: 'daily',
        challengingAspects: [],
      } as MeditationProfile;
    
    default:
      return baseProfile as ActivityProfile;
  }
};

interface ActivityProfileFormProps {
  activityType: ExerciseType;
  onComplete?: () => void;
}

export default function ActivityProfileForm({ activityType, onComplete }: ActivityProfileFormProps) {
  const { toast } = useToast();
  const { getProfileByType, setActivityProfile } = useActivityProfile();
  
  // Load existing profile or create default
  const existingProfile = getProfileByType(activityType);
  const [formData, setFormData] = useState<ActivityProfile>(
    existingProfile || getDefaultProfile(activityType)
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>({});

  // Set up initial selected items based on the profile type
  useEffect(() => {
    const profile = existingProfile || getDefaultProfile(activityType);
    const initialSelected: Record<string, string[]> = {};
    
    switch (activityType) {
      case 'yoga':
        const yogaProfile = profile as YogaProfile;
        initialSelected.focusAreas = yogaProfile.focusAreas;
        initialSelected.styles = yogaProfile.preferredStyles;
        initialSelected.injuries = yogaProfile.injuryConsiderations;
        initialSelected.poses = yogaProfile.favoriteAsanas;
        break;
      
      case 'running':
        const runningProfile = profile as RunningProfile;
        initialSelected.goals = runningProfile.runningGoals;
        initialSelected.terrain = runningProfile.preferredTerrain;
        initialSelected.injuries = runningProfile.injuryConsiderations;
        initialSelected.weather = runningProfile.preferredWeather;
        break;
      
      case 'weightlifting':
        const liftingProfile = profile as WeightliftingProfile;
        initialSelected.goals = liftingProfile.strengthGoals;
        initialSelected.muscleGroups = liftingProfile.focusMuscleGroups;
        initialSelected.equipment = liftingProfile.preferredEquipment;
        initialSelected.injuries = liftingProfile.injuryConsiderations;
        break;
      
      case 'hiit':
        const hiitProfile = profile as HIITProfile;
        initialSelected.focusAreas = hiitProfile.focusAreas;
        initialSelected.equipment = hiitProfile.preferredEquipment;
        initialSelected.injuries = hiitProfile.injuryConsiderations;
        initialSelected.exercises = hiitProfile.preferredExercises;
        break;
      
      case 'stretch':
        const stretchProfile = profile as StretchingProfile;
        initialSelected.goals = stretchProfile.flexibilityGoals;
        initialSelected.tightAreas = stretchProfile.tightAreas;
        initialSelected.techniques = stretchProfile.preferredTechniques;
        initialSelected.injuries = stretchProfile.injuryConsiderations;
        break;
      
      case 'meditation':
        const meditationProfile = profile as MeditationProfile;
        initialSelected.goals = meditationProfile.meditationGoals;
        initialSelected.styles = meditationProfile.preferredStyles;
        initialSelected.challenges = meditationProfile.challengingAspects;
        break;
    }
    
    setSelectedItems(initialSelected);
  }, [activityType, existingProfile]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleListItem = (category: string, item: string) => {
    setSelectedItems(prev => {
      const currentItems = prev[category] || [];
      const newItems = currentItems.includes(item)
        ? currentItems.filter(i => i !== item)
        : [...currentItems, item];
      
      return {
        ...prev,
        [category]: newItems
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Combine selected items with form data based on activity type
      let updatedProfile: ActivityProfile;
      
      switch (activityType) {
        case 'yoga':
          updatedProfile = {
            ...formData,
            focusAreas: selectedItems.focusAreas || [],
            preferredStyles: selectedItems.styles || [],
            injuryConsiderations: selectedItems.injuries || [],
            favoriteAsanas: selectedItems.poses || [],
          } as YogaProfile;
          break;
        
        case 'running':
          updatedProfile = {
            ...formData,
            runningGoals: selectedItems.goals || [],
            preferredTerrain: selectedItems.terrain || [],
            injuryConsiderations: selectedItems.injuries || [],
            preferredWeather: selectedItems.weather || [],
          } as RunningProfile;
          break;
        
        case 'weightlifting':
          updatedProfile = {
            ...formData,
            strengthGoals: selectedItems.goals || [],
            focusMuscleGroups: selectedItems.muscleGroups || [],
            preferredEquipment: selectedItems.equipment || [],
            injuryConsiderations: selectedItems.injuries || [],
          } as WeightliftingProfile;
          break;
        
        case 'hiit':
          updatedProfile = {
            ...formData,
            focusAreas: selectedItems.focusAreas || [],
            preferredEquipment: selectedItems.equipment || [],
            injuryConsiderations: selectedItems.injuries || [],
            preferredExercises: selectedItems.exercises || [],
          } as HIITProfile;
          break;
        
        case 'stretch':
          updatedProfile = {
            ...formData,
            flexibilityGoals: selectedItems.goals || [],
            tightAreas: selectedItems.tightAreas || [],
            preferredTechniques: selectedItems.techniques || [],
            injuryConsiderations: selectedItems.injuries || [],
          } as StretchingProfile;
          break;
        
        case 'meditation':
          updatedProfile = {
            ...formData,
            meditationGoals: selectedItems.goals || [],
            preferredStyles: selectedItems.styles || [],
            challengingAspects: selectedItems.challenges || [],
          } as MeditationProfile;
          break;
        
        default:
          updatedProfile = formData;
      }

      // Save profile to context
      setActivityProfile(activityType, updatedProfile);

      toast({
        title: "Profile Saved!",
        description: `Your ${activityType} profile has been updated.`,
      });

      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error(`${activityType} profile update error:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the title and icon for the activity
  const getActivityTitle = () => {
    const titles: Record<ExerciseType, string> = {
      'yoga': 'Yoga',
      'running': 'Running',
      'weightlifting': 'Strength Training',
      'hiit': 'HIIT Training',
      'stretch': 'Stretching',
      'meditation': 'Meditation'
    };
    
    return titles[activityType] || activityType.charAt(0).toUpperCase() + activityType.slice(1);
  };

  const getColorClass = (type: string) => {
    const color = activityColors[activityType as keyof typeof activityColors] || 'blue';
    switch (type) {
      case 'bg-light':
        return `bg-${color}-50`;
      case 'bg-medium':
        return `bg-${color}-100`;
      case 'border':
        return `border-${color}-200`;
      case 'text':
        return `text-${color}-700`;
      case 'text-dark':
        return `text-${color}-800`;
      default:
        return '';
    }
  };

  // Render form fields specific to each activity type
  const renderActivitySpecificFields = () => {
    switch (activityType) {
      case 'yoga':
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Focus Areas (Select multiple)</Label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.yoga.focusAreas.map((area) => (
                    <Badge
                      key={area}
                      variant={selectedItems.focusAreas?.includes(area) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedItems.focusAreas?.includes(area) ? 'bg-purple-500' : ''}`}
                      onClick={() => toggleListItem('focusAreas', area)}
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Preferred Yoga Styles</Label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.yoga.styles.map((style) => (
                    <Badge
                      key={style}
                      variant={selectedItems.styles?.includes(style) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedItems.styles?.includes(style) ? 'bg-purple-500' : ''}`}
                      onClick={() => toggleListItem('styles', style)}
                    >
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="practiceFrequency">Practice Frequency</Label>
                  <Select 
                    value={(formData as YogaProfile).practiceFrequency}
                    onValueChange={(value) => handleInputChange('practiceFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityOptions.yoga.frequency.map((freq) => (
                        <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timeAvailable">Time Available (minutes)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[formData.timeAvailable]}
                      min={5}
                      max={120}
                      step={5}
                      onValueChange={(value) => handleInputChange('timeAvailable', value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{formData.timeAvailable}min</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Injury Considerations</Label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.yoga.injuries.map((injury) => (
                    <Badge
                      key={injury}
                      variant={selectedItems.injuries?.includes(injury) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedItems.injuries?.includes(injury) ? 'bg-red-500' : ''}`}
                      onClick={() => toggleListItem('injuries', injury)}
                    >
                      {injury}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Favorite Poses</Label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.yoga.favoritePoses.map((pose) => (
                    <Badge
                      key={pose}
                      variant={selectedItems.poses?.includes(pose) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedItems.poses?.includes(pose) ? 'bg-purple-500' : ''}`}
                      onClick={() => toggleListItem('poses', pose)}
                    >
                      {pose}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case 'running':
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Running Goals</Label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.running.goals.map((goal) => (
                    <Badge
                      key={goal}
                      variant={selectedItems.goals?.includes(goal) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedItems.goals?.includes(goal) ? 'bg-green-500' : ''}`}
                      onClick={() => toggleListItem('goals', goal)}
                    >
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="typicalDistance">Typical Distance (km)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="100"
                    step="0.5"
                    value={(formData as RunningProfile).typicalDistance}
                    onChange={(e) => handleInputChange('typicalDistance', parseFloat(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="typicalPace">Typical Pace (min/km)</Label>
                  <Input
                    type="number"
                    min="3"
                    max="15"
                    step="0.5"
                    value={(formData as RunningProfile).typicalPace}
                    onChange={(e) => handleInputChange('typicalPace', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Preferred Terrain</Label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.running.terrain.map((terrain) => (
                    <Badge
                      key={terrain}
                      variant={selectedItems.terrain?.includes(terrain) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedItems.terrain?.includes(terrain) ? 'bg-green-500' : ''}`}
                      onClick={() => toggleListItem('terrain', terrain)}
                    >
                      {terrain}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="runningFrequency">Running Frequency</Label>
                  <Select 
                    value={(formData as RunningProfile).runningFrequency}
                    onValueChange={(value) => handleInputChange('runningFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityOptions.running.frequency.map((freq) => (
                        <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timeAvailable">Time Available (minutes)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[formData.timeAvailable]}
                      min={5}
                      max={120}
                      step={5}
                      onValueChange={(value) => handleInputChange('timeAvailable', value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{formData.timeAvailable}min</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Injury Considerations</Label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.running.injuries.map((injury) => (
                    <Badge
                      key={injury}
                      variant={selectedItems.injuries?.includes(injury) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedItems.injuries?.includes(injury) ? 'bg-red-500' : ''}`}
                      onClick={() => toggleListItem('injuries', injury)}
                    >
                      {injury}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Preferred Weather</Label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.running.weather.map((weather) => (
                    <Badge
                      key={weather}
                      variant={selectedItems.weather?.includes(weather) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedItems.weather?.includes(weather) ? 'bg-green-500' : ''}`}
                      onClick={() => toggleListItem('weather', weather)}
                    >
                      {weather}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case 'weightlifting':
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Strength Goals</Label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.weightlifting.goals.map((goal) => (
                    <Badge
                      key={goal}
                      variant={selectedItems.goals?.includes(goal) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedItems.goals?.includes(goal) ? 'bg-pink-500' : ''}`}
                      onClick={() => toggleListItem('goals', goal)}
                    >
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Focus Muscle Groups</Label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.weightlifting.muscleGroups.map((muscle) => (
                    <Badge
                      key={muscle}
                      variant={selectedItems.muscleGroups?.includes(muscle) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedItems.muscleGroups?.includes(muscle) ? 'bg-pink-500' : ''}`}
                      onClick={() => toggleListItem('muscleGroups', muscle)}
                    >
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Preferred Equipment</Label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.weightlifting.equipment.map((equipment) => (
                    <Badge
                      key={equipment}
                      variant={selectedItems.equipment?.includes(equipment) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedItems.equipment?.includes(equipment) ? 'bg-pink-500' : ''}`}
                      onClick={() => toggleListItem('equipment', equipment)}
                    >
                      {equipment}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="trainingFrequency">Training Frequency</Label>
                  <Select 
                    value={(formData as WeightliftingProfile).trainingFrequency}
                    onValueChange={(value) => handleInputChange('trainingFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityOptions.weightlifting.frequency.map((freq) => (
                        <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="timeAvailable">Time Available (minutes)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[formData.timeAvailable]}
                      min={10}
                      max={120}
                      step={5}
                      onValueChange={(value) => handleInputChange('timeAvailable', value[0])}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{formData.timeAvailable}min</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Injury Considerations</Label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.weightlifting.injuries.map((injury) => (
                    <Badge
                      key={injury}
                      variant={selectedItems.injuries?.includes(injury) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedItems.injuries?.includes(injury) ? 'bg-red-500' : ''}`}
                      onClick={() => toggleListItem('injuries', injury)}
                    >
                      {injury}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="experience">Experience Level</Label>
                <Select 
                  value={formData.experience}
                  onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => handleInputChange('experience', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );

      // Add cases for hiit, stretch, and meditation as needed
      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Profile form for {activityType} is not available.</p>
          </div>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className={`${getColorClass('bg-light')} border-b ${getColorClass('border')}`}>
        <div className="flex items-center gap-2">
          {activityIcons[activityType as keyof typeof activityIcons]}
          <div>
            <CardTitle className={getColorClass('text-dark')}>
              {getActivityTitle()} Profile
            </CardTitle>
            <CardDescription>
              Tell us about your {activityType} preferences to get personalized workout recommendations
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <ScrollArea className="h-[60vh] pr-4">
            {renderActivitySpecificFields()}
          </ScrollArea>
          
          <Button 
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Saving Profile..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}