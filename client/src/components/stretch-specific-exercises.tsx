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
const STRETCH_EXERCISES = {
  dynamic: [
    {
      id: "stretch1",
      name: "Shoulder Rolls",
      description: "A gentle dynamic stretch that releases tension in the shoulders and upper back.",
      muscleGroups: ["shoulders", "upper back", "neck"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Sit or stand with good posture",
        "Lift your shoulders toward your ears",
        "Roll shoulders backward and down",
        "Repeat 8-10 times backward, then forward"
      ],
      imageUrl: "https://thumbs.dreamstime.com/b/shoulder-rolls-exercise-woman-doing-shoulders-roll-workout-fitness-sport-training-concept-vector-illustration-isolated-white-219962161.jpg"
    },
    {
      id: "stretch2",
      name: "Neck Stretch",
      description: "A gentle stretch to relieve tension in the neck and upper trap muscles.",
      muscleGroups: ["neck", "trapezius"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Sit or stand with good posture",
        "Tilt right ear toward right shoulder",
        "Hold for 20-30 seconds",
        "Return to center and repeat on opposite side"
      ],
      imageUrl: "https://www.spotebi.com/wp-content/uploads/2014/10/neck-stretch-exercise-illustration.jpg"
    }
  ],
  static: [
    {
      id: "stretch3",
      name: "Standing Hamstring Stretch",
      description: "A fundamental stretch that targets the back of the thighs.",
      muscleGroups: ["hamstrings", "lower back"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Stand tall with feet hip-width apart",
        "Extend right leg forward, heel on ground",
        "Hinge at hips and fold forward",
        "Hold for 20-30 seconds, then switch sides"
      ],
      imageUrl: "https://www.spotebi.com/wp-content/uploads/2014/10/standing-hamstring-stretch-exercise-illustration.jpg"
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
        'stretch',
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
interface StretchSpecificExercisesProps {
  category: 'dynamic' | 'static' | 'recovery';
  title: string;
  description?: string;
  backgroundColor?: string;
  maxExercises?: number;
}

export default function StretchSpecificExercises({
  category,
  title,
  description,
  backgroundColor = "bg-green-50",
  maxExercises = 4
}: StretchSpecificExercisesProps) {
  
  // Map categories
  const exerciseCategory = category === 'dynamic' || category === 'static' 
    ? category 
    : 'dynamic'; // Default to dynamic for other categories
  
  const exercises = STRETCH_EXERCISES[exerciseCategory] || [];

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