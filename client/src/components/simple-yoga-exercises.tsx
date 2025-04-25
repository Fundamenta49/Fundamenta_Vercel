import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Info, ChevronDown, ChevronUp, X } from "lucide-react";
import { EmbeddedYouTubePlayer } from '@/components/embedded-youtube-player';
import { searchSectionSpecificExerciseVideos, YouTubeVideo } from '@/lib/youtube-service';

// Define Exercise interface
interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: string;
  instructions: string[];
  imageUrl?: string;
  videoUrl?: string;
}

// Sample exercise data
const YOGA_EXERCISES = {
  beginner: [
    {
      id: "yoga1",
      name: "Downward Dog",
      description: "A fundamental yoga pose that stretches and strengthens the entire body.",
      muscleGroups: ["shoulders", "hamstrings", "calves", "back"],
      equipment: ["yoga mat"],
      difficulty: "beginner",
      instructions: [
        "Start on hands and knees",
        "Lift knees off the floor and push hips up",
        "Straighten legs as much as comfortable",
        "Create an inverted V-shape with your body"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2022/01/Downward-Facing-Dog_Andrew-Clark.jpg"
    },
    {
      id: "yoga2",
      name: "Child's Pose",
      description: "A restful pose that gently stretches the back, hips, and thighs.",
      muscleGroups: ["back", "hips", "thighs"],
      equipment: ["yoga mat"],
      difficulty: "beginner",
      instructions: [
        "Kneel on the floor with big toes touching",
        "Sit back on your heels",
        "Fold forward, extending arms in front",
        "Rest forehead on the mat"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2021/12/childs-pose.jpg"
    }
  ],
  intermediate: [
    {
      id: "yoga3",
      name: "Warrior II",
      description: "A powerful standing pose that builds strength and stability.",
      muscleGroups: ["legs", "hips", "shoulders"],
      equipment: ["yoga mat"],
      difficulty: "intermediate",
      instructions: [
        "Step feet 3-4 feet apart",
        "Turn right foot out 90 degrees",
        "Extend arms parallel to floor",
        "Bend right knee over right ankle"
      ],
      imageUrl: "https://www.yogajournal.com/wp-content/uploads/2021/12/warrior-1_Andrew-Clark.jpg"
    }
  ]
};

// Exercise card component
function ExerciseCard({ exercise, category }: { exercise: Exercise, category: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [exerciseVideo, setExerciseVideo] = useState<YouTubeVideo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadVideo = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const videos = await searchSectionSpecificExerciseVideos(
        'yoga',
        exercise.name,
        exercise.equipment.join(','),
        exercise.muscleGroups.join(','),
        Math.random().toString(),
        category
      );
      
      if (videos && videos.length > 0) {
        setExerciseVideo(videos[0]);
      }
    } catch (error) {
      console.error('Error loading video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && !exerciseVideo) {
      loadVideo();
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("Close button clicked");
    setIsOpen(false);
  };

  return (
    <Card className="overflow-hidden mb-4">
      <CardContent className="p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={handleToggle}
        >
          <div className="flex-1">
            <h3 className="font-semibold">{exercise.name}</h3>
            <p className="text-sm text-gray-600">{exercise.description}</p>
          </div>
          <Button variant="ghost" size="sm">
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>

        {isOpen && (
          <div className="mt-4 pt-3 border-t relative">
            <Button 
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 z-50"
              onClick={handleClose}
            >
              <X size={16} />
              <span className="sr-only">Close</span>
            </Button>

            {exercise.imageUrl && !exerciseVideo && (
              <div className="mb-4">
                <img 
                  src={exercise.imageUrl} 
                  alt={exercise.name} 
                  className="w-full h-40 object-cover rounded" 
                />
              </div>
            )}

            {exerciseVideo && (
              <div className="mb-4">
                <EmbeddedYouTubePlayer
                  videoId={exerciseVideo.id}
                  title={exerciseVideo.title}
                  height="225"
                  width="100%"
                />
              </div>
            )}

            <div className="mb-3">
              <h4 className="font-medium mb-2">Instructions:</h4>
              <ol className="list-decimal pl-5 space-y-1">
                {exercise.instructions.map((instruction, i) => (
                  <li key={i} className="text-sm">{instruction}</li>
                ))}
              </ol>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <Info size={16} />
                <span>Details</span>
              </Button>
              
              {!exerciseVideo && !isLoading && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    loadVideo();
                  }}
                >
                  <AlertCircle size={16} />
                  <span>Load Video</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Main component
interface YogaSpecificExercisesProps {
  category: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  description?: string;
  backgroundColor?: string;
}

export default function YogaSpecificExercises({
  category,
  title,
  description,
  backgroundColor = "bg-blue-50"
}: YogaSpecificExercisesProps) {
  
  // Map categories
  const exerciseCategory = category === 'beginner' || category === 'intermediate' 
    ? category 
    : 'beginner'; // Default to beginner for other categories
  
  const exercises = YOGA_EXERCISES[exerciseCategory] || [];

  return (
    <div className={`p-6 rounded-lg ${backgroundColor}`}>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      {description && <p className="mb-4 text-gray-600">{description}</p>}
      
      <div className="space-y-4">
        {exercises.map((exercise) => (
          <ExerciseCard 
            key={exercise.id} 
            exercise={exercise} 
            category={category}
          />
        ))}
      </div>
    </div>
  );
}