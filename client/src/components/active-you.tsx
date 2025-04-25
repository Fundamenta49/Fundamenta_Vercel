// Import the enhanced version and the specific exercise components
import { StretchingIcon } from "./active-you-enhanced";
import HIITSpecificExercisesEnhanced from './hiit-specific-exercises-enhanced';
import YogaSpecificExercisesEnhanced from './yoga-specific-exercises-enhanced';
import StretchSpecificExercisesEnhanced from './stretch-specific-exercises-enhanced';
import RunningSpecificExercisesEnhanced from './running-specific-exercises-enhanced';
import WeightliftingSpecificExercisesEnhanced from './weightlifting-specific-exercises-enhanced';
import MeditationSpecificExercisesEnhanced from './meditation-specific-exercises-enhanced';
import { Card } from "@/components/ui/card";
import { ExerciseType } from "../modules/active-you/context/module-context";

// Re-export the StretchingIcon for backward compatibility
export { StretchingIcon };

// Create a dedicated component that renders only the selected exercise content
interface ActiveYouProps {
  defaultTab: ExerciseType;
}

export default function ActiveYou({ defaultTab = 'meditation' }: ActiveYouProps) {
  // Render only the selected exercise component based on the tab
  const renderExerciseContent = () => {
    switch (defaultTab) {
      case 'hiit':
        return (
          <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-md mb-4">
            <h2 className="text-xl font-semibold text-pink-700 mb-1">High-Intensity Interval Training</h2>
            <p className="text-gray-600">
              HIIT alternates short periods of intense exercise with less intense recovery periods.
              These workouts are efficient and effective for burning calories and improving cardiovascular health.
            </p>
            <HIITSpecificExercisesEnhanced />
          </div>
        );
      case 'yoga':
        return (
          <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-md mb-4">
            <h2 className="text-xl font-semibold text-pink-700 mb-1">Yoga Practice</h2>
            <p className="text-gray-600">
              Yoga combines physical postures with breathing techniques and mindfulness.
              Regular practice can improve flexibility, strength, balance, and mental wellbeing.
            </p>
            <YogaSpecificExercisesEnhanced />
          </div>
        );
      case 'running':
        return (
          <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-md mb-4">
            <h2 className="text-xl font-semibold text-pink-700 mb-1">Running Training</h2>
            <p className="text-gray-600">
              Running is a versatile cardio exercise that improves endurance, strengthens your heart, and helps with weight management.
              These exercises will help you build running strength, endurance, and proper form.
            </p>
            <RunningSpecificExercisesEnhanced />
          </div>
        );
      case 'weightlifting':
        return (
          <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-md mb-4">
            <h2 className="text-xl font-semibold text-pink-700 mb-1">Strength Training</h2>
            <p className="text-gray-600">
              Strength training builds muscle, increases bone density, and improves overall body composition.
              These exercises will help you develop functional strength for everyday activities and sports.
            </p>
            <WeightliftingSpecificExercisesEnhanced />
          </div>
        );
      case 'stretch':
        return (
          <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-md mb-4">
            <h2 className="text-xl font-semibold text-pink-700 mb-1">Stretching Exercises</h2>
            <p className="text-gray-600">
              Regular stretching improves flexibility, increases range of motion, and helps prevent injuries.
              Different types of stretching serve different purposes in your fitness routine.
            </p>
            <StretchSpecificExercisesEnhanced />
          </div>
        );
      case 'meditation':
      default:
        return (
          <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-md mb-4">
            <h2 className="text-xl font-semibold text-pink-700 mb-1">Meditation Practices</h2>
            <p className="text-gray-600">
              Meditation reduces stress, improves focus, and enhances overall mental wellbeing.
              These guided sessions will help you develop mindfulness and relaxation techniques.
            </p>
            <MeditationSpecificExercisesEnhanced />
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ActiveYou</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore specific exercises to improve your fitness and wellness with detailed instructions and tutorial videos.
        </p>
      </div>
      
      <Card className="shadow-md border-pink-100 mb-8 p-4">
        {renderExerciseContent()}
      </Card>
      
      <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
        <Card className="flex-1 p-4 border shadow-sm">
          <h3 className="text-lg font-semibold text-pink-700 mb-2">Personalized Recommendations</h3>
          <p className="text-gray-600 text-sm mb-3">
            Our AI assistant Fundi can analyze your exercise preferences and create a custom plan tailored to your goals and constraints.
          </p>
          <div className="bg-pink-50 p-3 rounded-md">
            <p className="text-sm text-pink-700 font-medium">Popular recommendations:</p>
            <ul className="text-sm text-gray-600 mt-1 pl-4 space-y-1 list-disc">
              <li>Morning energy boosters (5-10 min)</li>
              <li>Office desk stretches for posture</li>
              <li>Recovery routines for post-workout</li>
              <li>Stress-reducing mindful movement</li>
            </ul>
          </div>
        </Card>
        
        <Card className="flex-1 p-4 border shadow-sm">
          <h3 className="text-lg font-semibold text-pink-700 mb-2">Exercise Tracking</h3>
          <p className="text-gray-600 text-sm mb-3">
            Monitor your progress and build consistency with our simple tracking tools. See improvements over time and stay motivated.
          </p>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-pink-50 p-2 rounded-md">
              <p className="text-pink-700 font-medium text-xl">12</p>
              <p className="text-xs text-gray-600">Workouts this month</p>
            </div>
            <div className="bg-pink-50 p-2 rounded-md">
              <p className="text-pink-700 font-medium text-xl">83%</p>
              <p className="text-xs text-gray-600">Weekly goal progress</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}