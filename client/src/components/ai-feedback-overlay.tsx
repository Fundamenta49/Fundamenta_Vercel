import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  Info,
  ThumbsUp,
  MoveRight,
  AlertTriangle,
  X,
  Award,
  CheckCircle2
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert";

interface PoseAnalysis {
  overallAssessment: string;
  strengths: string[];
  improvements: string[];
  safetyNotes: string;
  alignmentTips: string;
  difficultyAssessment: string;
  confidenceScore: number;
  score?: number;
}

interface RewardInfo {
  xp: number;
  newMasteryLevel: number;
}

interface AiFeedbackOverlayProps {
  analysis: PoseAnalysis;
  poseName: string;
  onClose: () => void;
  rewardEarned?: RewardInfo | null;
}

// Render mastery stars
const MasteryStars = ({ level }: { level: number }) => {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Award 
          key={i} 
          size={14} 
          className={`${i < level ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
        />
      ))}
    </div>
  );
};

export default function AiFeedbackOverlay({ 
  analysis, 
  poseName, 
  onClose,
  rewardEarned 
}: AiFeedbackOverlayProps) {
  if (!analysis) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-md w-[92vw] md:w-full rounded-xl shadow-lg max-h-[80vh] overflow-auto bg-white">
        {/* Header */}
        <div className="relative py-3 px-4 border-b border-gray-100">
          <button 
            onClick={onClose} 
            className="absolute top-2.5 right-2.5 h-8 w-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-baseline justify-between pr-8">
            <h2 className="text-base font-medium">{poseName} Analysis</h2>
          </div>
        </div>
        
        <div className="px-4 py-3 space-y-4">
          {/* XP Reward - Simplified */}
          {rewardEarned && (
            <div className="flex items-center bg-blue-50 p-3 rounded-lg">
              <Award className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <p className="text-blue-700 text-sm font-medium">+{rewardEarned.xp} XP Earned!</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-blue-600 mr-2">New level:</span>
                  <MasteryStars level={rewardEarned.newMasteryLevel} />
                </div>
              </div>
            </div>
          )}
          
          {/* Score indicator - Simplified */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Form Accuracy</span>
              <span className="font-medium text-sm">{analysis.score ? `${analysis.score}%` : 'N/A'}</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${analysis.score || 0}%` }}
              ></div>
            </div>
          </div>
          
          {/* What you're doing well - More spacious */}
          <div>
            <h3 className="font-medium text-sm mb-2 flex items-center text-green-700">
              <ThumbsUp className="h-4 w-4 mr-1.5" />
              Strengths
            </h3>
            <ul className="space-y-2">
              {analysis.strengths.slice(0, 2).map((strength, index) => (
                <li key={index} className="text-sm flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-1.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{strength.length > 90 ? strength.substring(0, 90) + '...' : strength}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Areas for improvement - More spacious */}
          <div>
            <h3 className="font-medium text-sm mb-2 flex items-center text-amber-700">
              <MoveRight className="h-4 w-4 mr-1.5" />
              Areas to Improve
            </h3>
            <ul className="space-y-2">
              {analysis.improvements.slice(0, 2).map((improvement, index) => (
                <li key={index} className="text-sm flex items-start">
                  <ArrowRight className="h-4 w-4 mr-1.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>{improvement.length > 90 ? improvement.substring(0, 90) + '...' : improvement}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Safety notes - Only if needed */}
          {analysis.safetyNotes && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <h3 className="font-medium text-sm mb-1 flex items-center text-red-700">
                <AlertTriangle className="h-4 w-4 mr-1.5" />
                Safety Notes
              </h3>
              <p className="text-sm text-red-600 ml-6">
                {analysis.safetyNotes.length > 120 ? analysis.safetyNotes.substring(0, 120) + '...' : analysis.safetyNotes}
              </p>
            </div>
          )}
        </div>
        
        {/* Footer - Centered button */}
        <div className="px-4 py-3 border-t border-gray-100 flex justify-center">
          <button 
            onClick={onClose} 
            className="rounded-full h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}