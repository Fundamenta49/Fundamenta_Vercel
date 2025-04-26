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
      <Card className="max-w-md w-[92vw] md:w-full rounded-xl shadow-lg max-h-[88vh] overflow-auto">
        <CardHeader className="relative py-3 px-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="absolute top-2 right-2 h-7 w-7 rounded-full"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
          <div className="flex items-baseline justify-between">
            <CardTitle className="text-base">
              {poseName} Analysis
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              AI feedback
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 px-4 py-2">
          {/* XP Reward */}
          {rewardEarned && (
            <Alert className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 p-2">
              <div className="flex items-center">
                <Award className="h-3.5 w-3.5 text-purple-500 mr-1.5" />
                <div>
                  <AlertTitle className="text-purple-700 text-xs mb-0">Achievement Unlocked!</AlertTitle>
                  <AlertDescription className="text-purple-600 text-xs">
                    <span className="text-xs">+{rewardEarned.xp} XP</span>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-xs">New level: </span>
                      <MasteryStars level={rewardEarned.newMasteryLevel} />
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          )}
          
          {/* Overall assessment */}
          <div>
            <h3 className="font-medium text-sm mb-2">Overall Assessment</h3>
            <p className="text-xs">{analysis.overallAssessment}</p>
            
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Form Accuracy</span>
                <span>{analysis.score ? `${analysis.score}%` : 'N/A'}</span>
              </div>
              <Progress value={analysis.score || 0} className="h-1.5" />
            </div>
          </div>
          
          <Separator className="my-2" />
          
          {/* What you're doing well */}
          <div>
            <h3 className="font-medium text-sm mb-2 flex items-center">
              <ThumbsUp className="h-3 w-3 mr-2 text-green-500" />
              What You're Doing Well
            </h3>
            <ul className="space-y-1">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="text-xs flex items-start">
                  <CheckCircle2 className="h-3 w-3 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Areas for improvement */}
          <div>
            <h3 className="font-medium text-sm mb-2 flex items-center">
              <MoveRight className="h-3 w-3 mr-2 text-amber-500" />
              Areas for Improvement
            </h3>
            <ul className="space-y-1">
              {analysis.improvements.map((improvement, index) => (
                <li key={index} className="text-xs flex items-start">
                  <ArrowRight className="h-3 w-3 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Safety notes */}
          {analysis.safetyNotes && (
            <div>
              <h3 className="font-medium text-sm mb-2 flex items-center">
                <AlertTriangle className="h-3 w-3 mr-2 text-orange-500" />
                Safety Considerations
              </h3>
              <p className="text-xs">{analysis.safetyNotes}</p>
            </div>
          )}
          
          {/* Alignment tips */}
          <div>
            <h3 className="font-medium text-sm mb-2 flex items-center">
              <Info className="h-3 w-3 mr-2 text-blue-500" />
              Key Alignment Tips
            </h3>
            <p className="text-xs">{analysis.alignmentTips}</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end px-5 py-4 border-t border-gray-50">
          <Button 
            onClick={onClose} 
            size="sm"
            className="rounded-full h-8 text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-sm"
          >
            Dismiss
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}