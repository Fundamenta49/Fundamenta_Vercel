import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ExerciseType } from "../modules/active-you/context/module-context";
import { 
  useActivityProfile, 
  ActivityProfile,
  YogaProfile,
  RunningProfile,
  WeightliftingProfile,
  HIITProfile,
  StretchingProfile,
  MeditationProfile
} from "../contexts/activity-profile-context";

// Base form schema
const baseProfileSchema = z.object({
  experience: z.enum(['beginner', 'intermediate', 'advanced']),
  timeAvailable: z.number().min(5).max(180)
});

// Activity-specific schemas
const yogaProfileSchema = baseProfileSchema.extend({});
const runningProfileSchema = baseProfileSchema.extend({
  typicalDistance: z.number().min(0.5).max(100),
  typicalPace: z.number().min(3).max(20),
});
const weightliftingProfileSchema = baseProfileSchema.extend({
  maxLifts: z.record(z.string(), z.number().optional()).optional()
});
const hiitProfileSchema = baseProfileSchema.extend({
  intensityPreference: z.enum(['low', 'medium', 'high']),
  restPreference: z.enum(['short', 'medium', 'long']),
});
const stretchingProfileSchema = baseProfileSchema.extend({});
const meditationProfileSchema = baseProfileSchema.extend({});

interface ActivityProfileFormProps {
  activityType: ExerciseType;
  onComplete?: () => void;
}

// Activity-specific form options
const activityOptions = {
  yoga: {
    focusAreas: ['Flexibility', 'Strength', 'Balance', 'Mindfulness', 'Core', 'Relaxation'],
    styles: ['Hatha', 'Vinyasa', 'Yin', 'Power', 'Restorative', 'Ashtanga', 'Kundalini'],
    frequency: ['Daily', '2-3 times per week', 'Weekly', 'Occasionally'],
    injuries: ['Lower Back', 'Knees', 'Shoulders', 'Wrists', 'Neck', 'Hips'],
    poses: ['Downward Dog', 'Child\'s Pose', 'Warrior I/II', 'Tree Pose', 'Corpse Pose', 'Bridge Pose']
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
    focusAreas: ['Cardio', 'Strength', 'Agility', 'Endurance', 'Fat Loss', 'Power'],
    equipment: ['Bodyweight', 'Kettlebell', 'Dumbbells', 'Jump Rope', 'Medicine Ball', 'Resistance Bands'],
    frequency: ['1-2 times per week', '2-3 times per week', '3-4 times per week', 'Daily'],
    injuries: ['Knees', 'Lower Back', 'Shoulders', 'Ankles', 'Wrists']
  },
  stretch: {
    flexibilityGoals: ['Touch Toes', 'Splits', 'Shoulder Mobility', 'Hip Mobility', 'General Flexibility'],
    tightAreas: ['Hamstrings', 'Back', 'Shoulders', 'Hips', 'Calves', 'Chest', 'Neck'],
    techniques: ['Static', 'Dynamic', 'PNF', 'Ballistic', 'Active', 'Passive'],
    frequency: ['Daily', 'After Workouts', 'Morning Routine', '2-3 times per week'],
    injuries: ['Lower Back', 'Hamstrings', 'Shoulders', 'Knees', 'Hips']
  },
  meditation: {
    goals: ['Stress Reduction', 'Focus', 'Sleep', 'Mindfulness', 'Anxiety Relief', 'Emotional Balance'],
    styles: ['Guided', 'Breathing', 'Body Scan', 'Mindfulness', 'Loving-Kindness', 'Transcendental', 'Zen'],
    frequency: ['Daily', 'Morning and Evening', 'Weekly', 'As Needed'],
    challenges: ['Staying Focused', 'Finding Time', 'Posture', 'Quieting the Mind', 'Consistency']
  },
  activeyou: {
    // General options for the main profile
    goals: ['General Fitness', 'Weight Management', 'Stress Reduction', 'Better Sleep', 'More Energy', 'Specific Sport'],
    preferences: ['Solo Activities', 'Group Classes', 'Outdoor', 'Indoor', 'Morning', 'Evening'],
    challenges: ['Time Constraints', 'Motivation', 'Energy Levels', 'Physical Limitations', 'Access to Facilities']
  }
};

// Activity-specific colors
const activityColors: Record<string, string> = {
  'yoga': 'purple',
  'running': 'green',
  'weightlifting': 'pink',
  'hiit': 'orange',
  'stretch': 'blue',
  'meditation': 'indigo',
  'activeyou': 'sky'
};

const ActivityProfileForm: React.FC<ActivityProfileFormProps> = ({ 
  activityType,
  onComplete
}) => {
  const { updateProfile, getProfileByType } = useActivityProfile();
  const { toast } = useToast();
  const [selectedItems, setSelectedItems] = useState<Record<string, string[]>>({});
  const color = activityColors[activityType] || 'slate';
  
  // Get the existing profile data or create default
  const existingProfile = getProfileByType(activityType);
  
  // Set up default form data based on activity type
  const getDefaultFormData = () => {
    const baseDefaults = {
      experience: 'beginner' as const,
      timeAvailable: 30,
      lastUpdated: new Date()
    };
    
    switch (activityType) {
      case 'yoga':
        return {
          ...baseDefaults,
          practiceFrequency: activityOptions.yoga.frequency[1],
        } as YogaProfile;
      
      case 'running':
        return {
          ...baseDefaults,
          typicalDistance: 5,
          typicalPace: 6,
          runningFrequency: activityOptions.running.frequency[1]
        } as RunningProfile;
      
      case 'weightlifting':
        return {
          ...baseDefaults,
          trainingFrequency: activityOptions.weightlifting.frequency[0],
          maxLifts: {}
        } as WeightliftingProfile;
      
      case 'hiit':
        return {
          ...baseDefaults,
          intensityPreference: 'medium' as const,
          restPreference: 'medium' as const,
          trainingFrequency: activityOptions.hiit.frequency[1]
        } as HIITProfile;
        
      case 'stretch':
        return {
          ...baseDefaults,
          stretchingFrequency: activityOptions.stretch.frequency[0]
        } as StretchingProfile;
      
      case 'meditation':
        return {
          ...baseDefaults,
          practiceFrequency: activityOptions.meditation.frequency[0]
        } as MeditationProfile;
      
      default:
        return baseDefaults;
    }
  };
  
  // Initialize form with existing profile data or defaults
  const defaultValues = existingProfile || getDefaultFormData();
  const [formData, setFormData] = useState<Partial<ActivityProfile>>(defaultValues);
  
  // Initialize selected items based on existing profile
  useEffect(() => {
    if (!existingProfile) return;
    
    const initialSelected: Record<string, string[]> = {};
    
    // Extract arrays from the profile based on activity type
    switch (activityType) {
      case 'yoga':
        const yogaProfile = existingProfile as YogaProfile;
        initialSelected.focusAreas = yogaProfile.focusAreas || [];
        initialSelected.styles = yogaProfile.preferredStyles || [];
        initialSelected.injuries = yogaProfile.injuryConsiderations || [];
        initialSelected.poses = yogaProfile.favoriteAsanas || [];
        break;
      
      case 'running':
        const runningProfile = existingProfile as RunningProfile;
        initialSelected.goals = runningProfile.runningGoals || [];
        initialSelected.terrain = runningProfile.preferredTerrain || [];
        initialSelected.injuries = runningProfile.injuryConsiderations || [];
        initialSelected.weather = runningProfile.preferredWeather || [];
        break;
      
      case 'weightlifting':
        const weightliftingProfile = existingProfile as WeightliftingProfile;
        initialSelected.goals = weightliftingProfile.strengthGoals || [];
        initialSelected.muscleGroups = weightliftingProfile.focusMuscleGroups || [];
        initialSelected.equipment = weightliftingProfile.preferredEquipment || [];
        initialSelected.injuries = weightliftingProfile.injuryConsiderations || [];
        break;
      
      case 'hiit':
        const hiitProfile = existingProfile as HIITProfile;
        initialSelected.focusAreas = hiitProfile.focusAreas || [];
        initialSelected.equipment = hiitProfile.preferredEquipment || [];
        initialSelected.exercises = hiitProfile.preferredExercises || [];
        initialSelected.injuries = hiitProfile.injuryConsiderations || [];
        break;
      
      case 'stretch':
        const stretchProfile = existingProfile as StretchingProfile;
        initialSelected.flexibilityGoals = stretchProfile.flexibilityGoals || [];
        initialSelected.tightAreas = stretchProfile.tightAreas || [];
        initialSelected.techniques = stretchProfile.preferredTechniques || [];
        initialSelected.injuries = stretchProfile.injuryConsiderations || [];
        break;
      
      case 'meditation':
        const meditationProfile = existingProfile as MeditationProfile;
        initialSelected.goals = meditationProfile.meditationGoals || [];
        initialSelected.styles = meditationProfile.preferredStyles || [];
        initialSelected.challenges = meditationProfile.challengingAspects || [];
        break;
    }
    
    setSelectedItems(initialSelected);
  }, [existingProfile, activityType]);
  
  // Handle input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Toggle list items (for badges)
  const toggleListItem = (listName: string, item: string) => {
    setSelectedItems(prev => {
      const list = prev[listName] || [];
      return {
        ...prev,
        [listName]: list.includes(item)
          ? list.filter(i => i !== item)
          : [...list, item]
      };
    });
  };
  
  // Handle form submission
  const handleSubmit = async () => {
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
            preferredExercises: selectedItems.exercises || [],
            injuryConsiderations: selectedItems.injuries || [],
          } as HIITProfile;
          break;
        
        case 'stretch':
          updatedProfile = {
            ...formData,
            flexibilityGoals: selectedItems.flexibilityGoals || [],
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
          throw new Error(`Unsupported activity type: ${activityType}`);
      }
      
      // Update the lastUpdated field
      updatedProfile.lastUpdated = new Date();
      
      // Update the profile in the context
      updateProfile(activityType, updatedProfile);
      
      // Show success notification
      toast({
        title: "Profile Updated",
        description: `Your ${activityType} profile has been saved.`,
      });
      
      // Call the onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Render the appropriate form based on activity type
  const renderActivityForm = () => {
    switch (activityType) {
      case 'yoga':
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Focus Areas</Label>
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
                <Label className="mb-2 block">Preferred Styles</Label>
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
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select 
                    value={(formData as YogaProfile).experience}
                    onValueChange={(value) => handleInputChange('experience', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
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
              </div>
              
              <div>
                <Label htmlFor="timeAvailable">Time Available (minutes)</Label>
                <Input
                  type="number"
                  min="5"
                  max="180"
                  step="5"
                  value={(formData as YogaProfile).timeAvailable}
                  onChange={(e) => handleInputChange('timeAvailable', parseInt(e.target.value))}
                />
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
                  {activityOptions.yoga.poses.map((pose) => (
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
                    max="20"
                    step="0.5"
                    value={(formData as RunningProfile).typicalPace}
                    onChange={(e) => handleInputChange('typicalPace', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select 
                    value={(formData as RunningProfile).experience}
                    onValueChange={(value) => handleInputChange('experience', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
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
              
              <div>
                <Label htmlFor="timeAvailable">Time Available (minutes)</Label>
                <Input
                  type="number"
                  min="5"
                  max="180"
                  step="5"
                  value={(formData as RunningProfile).timeAvailable}
                  onChange={(e) => handleInputChange('timeAvailable', parseInt(e.target.value))}
                />
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
                  {activityOptions.weightlifting.muscleGroups.map((group) => (
                    <Badge
                      key={group}
                      variant={selectedItems.muscleGroups?.includes(group) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedItems.muscleGroups?.includes(group) ? 'bg-pink-500' : ''}`}
                      onClick={() => toggleListItem('muscleGroups', group)}
                    >
                      {group}
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
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select 
                    value={(formData as WeightliftingProfile).experience}
                    onValueChange={(value) => handleInputChange('experience', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
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
              </div>
              
              <div>
                <Label htmlFor="timeAvailable">Time Available (minutes)</Label>
                <Input
                  type="number"
                  min="5"
                  max="180"
                  step="5"
                  value={(formData as WeightliftingProfile).timeAvailable}
                  onChange={(e) => handleInputChange('timeAvailable', parseInt(e.target.value))}
                />
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
              
              <Separator className="my-4" />
              
              <div>
                <Label className="mb-2 block">Max Lifts (optional)</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="benchPress">Bench Press (kg)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="500"
                      value={(formData as WeightliftingProfile).maxLifts?.['benchPress'] || ''}
                      onChange={(e) => {
                        const value = e.target.value ? parseInt(e.target.value) : undefined;
                        setFormData(prev => ({
                          ...prev,
                          maxLifts: {
                            ...((prev as WeightliftingProfile).maxLifts || {}),
                            benchPress: value
                          }
                        }));
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="squat">Squat (kg)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="500"
                      value={(formData as WeightliftingProfile).maxLifts?.['squat'] || ''}
                      onChange={(e) => {
                        const value = e.target.value ? parseInt(e.target.value) : undefined;
                        setFormData(prev => ({
                          ...prev,
                          maxLifts: {
                            ...((prev as WeightliftingProfile).maxLifts || {}),
                            squat: value
                          }
                        }));
                      }}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="deadlift">Deadlift (kg)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="500"
                      value={(formData as WeightliftingProfile).maxLifts?.['deadlift'] || ''}
                      onChange={(e) => {
                        const value = e.target.value ? parseInt(e.target.value) : undefined;
                        setFormData(prev => ({
                          ...prev,
                          maxLifts: {
                            ...((prev as WeightliftingProfile).maxLifts || {}),
                            deadlift: value
                          }
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'hiit':
        return (
          <>
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Focus Areas</Label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.hiit.focusAreas.map((area) => (
                    <Badge
                      key={area}
                      variant={selectedItems.focusAreas?.includes(area) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedItems.focusAreas?.includes(area) ? 'bg-orange-500' : ''}`}
                      onClick={() => toggleListItem('focusAreas', area)}
                    >
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="intensityPreference">Intensity Preference</Label>
                  <Select 
                    value={(formData as HIITProfile).intensityPreference}
                    onValueChange={(value: 'low' | 'medium' | 'high') => handleInputChange('intensityPreference', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select intensity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="restPreference">Rest Preference</Label>
                  <Select 
                    value={(formData as HIITProfile).restPreference}
                    onValueChange={(value: 'short' | 'medium' | 'long') => handleInputChange('restPreference', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select rest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="long">Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select 
                    value={(formData as HIITProfile).experience}
                    onValueChange={(value) => handleInputChange('experience', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="trainingFrequency">Training Frequency</Label>
                  <Select 
                    value={(formData as HIITProfile).trainingFrequency}
                    onValueChange={(value) => handleInputChange('trainingFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityOptions.hiit.frequency.map((freq) => (
                        <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="timeAvailable">Time Available (minutes)</Label>
                <Input
                  type="number"
                  min="5"
                  max="60"
                  step="5"
                  value={(formData as HIITProfile).timeAvailable}
                  onChange={(e) => handleInputChange('timeAvailable', parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <Label className="mb-2 block">Preferred Equipment</Label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.hiit.equipment.map((equipment) => (
                    <Badge
                      key={equipment}
                      variant={selectedItems.equipment?.includes(equipment) ? "default" : "outline"}
                      className={`cursor-pointer ${selectedItems.equipment?.includes(equipment) ? 'bg-orange-500' : ''}`}
                      onClick={() => toggleListItem('equipment', equipment)}
                    >
                      {equipment}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="mb-2 block">Injury Considerations</Label>
                <div className="flex flex-wrap gap-2">
                  {activityOptions.hiit.injuries.map((injury) => (
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
            </div>
          </>
        );
        
      // Add cases for other activity types
        
      default:
        return (
          <p className="text-gray-500 italic">
            Profile form not available for this activity type.
          </p>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Your {activityType.charAt(0).toUpperCase() + activityType.slice(1)} Profile</h3>
        <p className="text-gray-500 text-sm">
          Tell us about your preferences to get personalized recommendations
        </p>
      </div>
      
      {renderActivityForm()}
      
      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleSubmit}
          className={`bg-${color}-600 hover:bg-${color}-700`}
        >
          Save Profile
        </Button>
      </div>
    </div>
  );
};

export default ActivityProfileForm;