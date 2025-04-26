import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Mountain, Footprints, Wind, Brain, Zap, ArrowRight, Sparkles } from "lucide-react";
import { ExerciseType } from '@/modules/active-you/context/module-context';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ActivityProfileForm from "./activity-profile-form";
import { useActivityProfile } from "@/contexts/activity-profile-context";

// Type for the benefits shown to users for completing their profile
interface ProfileBenefit {
  title: string;
  description: string;
}

// Map activity types to their specific benefits
const activityBenefits: Record<ExerciseType, ProfileBenefit[]> = {
  'yoga': [
    { 
      title: 'Personalized Flow Sequences', 
      description: 'Get custom yoga flows tailored to your flexibility, goals, and preferred styles'
    },
    {
      title: 'Injury-Aware Recommendations',
      description: 'Receive poses that respect your body\'s limitations and needs'
    },
    {
      title: 'Style-Specific Progressions',
      description: 'Follow a path that builds skill in your preferred yoga traditions'
    }
  ],
  'running': [
    {
      title: 'Pace-Optimized Training Plans',
      description: 'Training intervals calibrated to your current running ability'
    },
    {
      title: 'Goal-Specific Workouts',
      description: 'Whether training for a 5K or marathon, get targeted programs'
    },
    {
      title: 'Terrain-Appropriate Routes',
      description: 'Workouts designed for your preferred running environment'
    }
  ],
  'weightlifting': [
    {
      title: 'Targeted Muscle Development',
      description: 'Focus on your priority muscle groups with specialized routines'
    },
    {
      title: 'Equipment-Specific Plans',
      description: 'Workouts designed for the equipment you have available'
    },
    {
      title: 'Progressive Overload Programming',
      description: 'Scientifically structured advancement based on your current strength'
    }
  ],
  'hiit': [
    {
      title: 'Intensity-Matched Intervals',
      description: 'Work/rest periods calibrated to your fitness level'
    },
    {
      title: 'Equipment-Optional Circuits',
      description: 'Workouts that use what you have available'
    },
    {
      title: 'Progressive Difficulty Scaling',
      description: 'Intelligent advancement as your conditioning improves'
    }
  ],
  'stretch': [
    {
      title: 'Problem-Area Focus',
      description: 'Routines targeting your specific tight or restricted areas'
    },
    {
      title: 'Technique-Specific Programs',
      description: 'Stretching approaches that match your preferences and goals'
    },
    {
      title: 'Injury-Aware Recommendations',
      description: 'Safe stretching plans that work around limitations'
    }
  ],
  'meditation': [
    {
      title: 'Goal-Aligned Sessions',
      description: 'Meditations specifically designed for stress, focus, or sleep'
    },
    {
      title: 'Style-Matching Guidance',
      description: 'Instructions in your preferred meditation tradition'
    },
    {
      title: 'Personalized Length Options',
      description: 'Sessions timed to fit your schedule and experience level'
    }
  ],
  'activeyou': [
    {
      title: 'Holistic Fitness Planning',
      description: 'Integrated approach across all your fitness activities'
    },
    {
      title: 'Custom Activity Recommendations',
      description: 'Discover new exercise types that match your preferences'
    },
    {
      title: 'Comprehensive Progress Tracking',
      description: 'Monitor improvements across all fitness dimensions'
    }
  ]
};

// Map activity types to their icons
const activityIcon: Record<string, React.ReactNode> = {
  'yoga': <Mountain className="h-5 w-5" />,
  'running': <Footprints className="h-5 w-5" />,
  'weightlifting': <Dumbbell className="h-5 w-5" />,
  'hiit': <Zap className="h-5 w-5" />,
  'stretch': <Wind className="h-5 w-5" />,
  'meditation': <Brain className="h-5 w-5" />,
};

// Map activity types to colors
const activityColors: Record<string, string> = {
  'yoga': 'purple',
  'running': 'green',
  'weightlifting': 'pink',
  'hiit': 'orange',
  'stretch': 'blue',
  'meditation': 'indigo'
};

interface ProfilePromptCardProps {
  activityType: ExerciseType;
  onClose?: () => void;
}

const ProfilePromptCard: React.FC<ProfilePromptCardProps> = ({ activityType, onClose }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [skippedProfile, setSkippedProfile] = useState(false);
  const { isProfileComplete } = useActivityProfile();
  
  // Get the appropriate color for this activity
  const color = activityColors[activityType] || 'slate';
  
  // Get the icon for this activity
  const icon = activityIcon[activityType];
  
  // Determine if the profile is complete
  const profileComplete = isProfileComplete(activityType);
  
  // Skip the prompt if already complete or previously skipped
  if (profileComplete || skippedProfile) {
    return null;
  }
  
  // Handle the complete profile button
  const handleCompleteProfile = () => {
    setShowDialog(true);
  };
  
  // Handle the skip for now button
  const handleSkip = () => {
    setSkippedProfile(true);
    if (onClose) {
      onClose();
    }
  };
  
  // Close the dialog
  const handleCloseDialog = () => {
    setShowDialog(false);
  };
  
  // Handle profile completion
  const handleProfileComplete = () => {
    setShowDialog(false);
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <>
      {/* Profile prompt card */}
      <Card className={`shadow-md mb-6 border-${color}-200 bg-gradient-to-r from-${color}-50 to-white`}>
        <CardHeader className={`pb-2 border-b border-${color}-100`}>
          <div className="flex items-center">
            {icon}
            <CardTitle className="ml-2 text-lg">Personalize Your {activityType.charAt(0).toUpperCase() + activityType.slice(1)} Experience</CardTitle>
          </div>
          <CardDescription>
            Take a moment to tell us about your preferences for better recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            {activityBenefits[activityType].map((benefit, index) => (
              <div key={index} className="flex items-start">
                <Sparkles className={`h-5 w-5 mt-0.5 mr-2 text-${color}-500 flex-shrink-0`} />
                <div>
                  <h4 className="font-medium">{benefit.title}</h4>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className={`flex justify-between pt-2 border-t border-${color}-100`}>
          <Button variant="outline" onClick={handleSkip}>
            Skip for now
          </Button>
          <Button className={`bg-${color}-600 hover:bg-${color}-700`} onClick={handleCompleteProfile}>
            Complete Profile <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      {/* Profile form dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {activityType.charAt(0).toUpperCase() + activityType.slice(1)} Profile
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tell us about your preferences to get personalized recommendations
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <ActivityProfileForm 
              activityType={activityType} 
              onComplete={handleProfileComplete} 
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDialog}>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProfilePromptCard;