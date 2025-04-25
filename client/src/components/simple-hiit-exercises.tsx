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
const HIIT_EXERCISES = {
  tabata: [
    {
      id: "tabata1",
      name: "Jump Squats",
      description: "An explosive lower-body exercise perfect for the Tabata protocol.",
      muscleGroups: ["quads", "glutes", "calves"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Stand with feet shoulder-width apart",
        "Lower into a squat position, keeping chest up",
        "Explosively jump upward",
        "Land softly and repeat"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2019/04/jump-squat.jpg"
    },
    {
      id: "tabata2",
      name: "Mountain Climbers",
      description: "A dynamic full-body exercise that elevates heart rate.",
      muscleGroups: ["core", "shoulders", "hips", "legs"],
      equipment: ["none"],
      difficulty: "beginner",
      instructions: [
        "Start in a high plank position",
        "Rapidly bring right knee toward chest",
        "Switch legs quickly",
        "Maintain a flat back throughout"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2021/01/mountain-climbers.jpg"
    }
  ],
  amrap: [
    {
      id: "amrap1",
      name: "Push-ups",
      description: "A fundamental upper body strength exercise.",
      muscleGroups: ["chest", "shoulders", "triceps", "core"],
      equipment: ["none"],
      difficulty: "intermediate",
      instructions: [
        "Start in a high plank position",
        "Lower body until chest nearly touches the floor",
        "Push back up to starting position",
        "Maintain a tight core throughout"
      ],
      imageUrl: "https://www.nerdfitness.com/wp-content/uploads/2020/01/push-up.jpg"
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
        'hiit',
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
interface HIITSpecificExercisesProps {
  category: 'tabata' | 'amrap' | 'emom' | 'circuit';
  title: string;
  description?: string;
  backgroundColor?: string;
}

export default function HIITSpecificExercises({
  category,
  title,
  description,
  backgroundColor = "bg-red-50"
}: HIITSpecificExercisesProps) {
  
  // Map categories
  const exerciseCategory = category === 'tabata' || category === 'amrap' 
    ? category 
    : 'tabata'; // Default to tabata for other categories
  
  const exercises = HIIT_EXERCISES[exerciseCategory] || [];

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