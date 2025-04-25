import React, { useEffect } from 'react';
import { X, Info, MessageSquare, Camera, ExternalLink, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ExerciseDetails {
  name: string;
  category: string;
  description: string;
  instructions: string[];
  benefits: string[];
  tips: string[];
  imageUrl?: string;
  videoUrl?: string;
  animationUrl?: string;
}

interface HIITDetailDialogProps {
  exercise: ExerciseDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeForm?: () => void;
}

export default function HIITDetailDialog({ 
  exercise, 
  isOpen, 
  onClose,
  onAnalyzeForm
}: HIITDetailDialogProps) {
  // Add escape key handler
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [onClose]);

  // Prevent scroll on the body when the dialog is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen || !exercise) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      onClick={onClose}
    >
      <Card 
        className="w-[90vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-xl rounded-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the card
      >
        <div className="sticky top-0 z-40 flex items-center justify-between p-4 bg-white border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{exercise.name}</h2>
            <p className="text-gray-600 mt-1">
              {exercise.category === 'hiit' ? 'HIIT Exercise' : 'Exercise'}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full p-2 opacity-100 
              bg-pink-300 hover:bg-pink-400 text-pink-800 border border-pink-400 
              shadow-md z-50"
            onClick={onClose}
            style={{ 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <CardContent className="p-6">
          <div className="mt-4 space-y-8">
            {exercise.imageUrl && (
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src={exercise.imageUrl} 
                  alt={`${exercise.name} demonstration`} 
                  className="w-full object-cover h-auto max-h-80 mx-auto" 
                />
              </div>
            )}

            <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-800">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{exercise.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3 text-blue-800 flex items-center">
                    <span>How to Perform</span>
                  </h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    {exercise.instructions.map((instruction, index) => (
                      <li key={index} className="text-gray-700">{instruction}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3 text-green-800 flex items-center">
                    <span>Benefits</span>
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {exercise.benefits.map((benefit, index) => (
                      <li key={index} className="text-gray-700">{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-3 text-amber-800 flex items-center">
                    <span>Tips for Best Results</span>
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {exercise.tips.map((tip, index) => (
                      <li key={index} className="text-gray-700">{tip}</li>
                    ))}
                  </ul>
                </div>

                {exercise.videoUrl && (
                  <div className="mt-6 mb-4">
                    <h3 className="text-lg font-medium mb-3 text-gray-800">Video Tutorial</h3>
                    <div 
                      className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md" 
                    >
                      <div className="relative pb-[56.25%] h-0 overflow-hidden">
                        <iframe 
                          className="absolute top-0 left-0 w-full h-full"
                          src={exercise.videoUrl.replace('watch?v=', 'embed/')} 
                          title={`${exercise.name} tutorial video`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                          loading="lazy"
                        ></iframe>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-3">
                      <a 
                        href={exercise.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        Open on YouTube
                      </a>
                    </div>
                  </div>
                )}

                {/* Display animation if available */}
                {exercise.animationUrl && (
                  <div className="mt-6 mb-4">
                    <h3 className="text-lg font-medium mb-3 text-gray-800">Animation Guide</h3>
                    <div className="overflow-hidden rounded-lg border shadow-md">
                      <div className="relative pb-[75%] h-0 overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img 
                          src={exercise.animationUrl}
                          alt={`${exercise.name} animation`}
                          className="absolute top-0 left-0 w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      This animation demonstrates proper form for the {exercise.name.toLowerCase()}.
                    </p>
                  </div>
                )}

                {onAnalyzeForm && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-3 text-blue-800">Form Analysis</h3>
                    <div className="flex items-center justify-center gap-2">
                      <Button 
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 shadow-md"
                        onClick={() => {
                          onClose();
                          setTimeout(() => {
                            onAnalyzeForm && onAnalyzeForm();
                          }, 500);
                        }}
                      >
                        <Camera className="h-4 w-4" />
                        Analyze My Form
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => alert("Please use Fundi for AI assistance")}
              className="gap-2 shadow-sm hover:shadow-md transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              Use Fundi Instead
            </Button>

            <Button
              onClick={onClose}
              variant="secondary"
              className="shadow-sm hover:shadow-md transition-all bg-pink-100 hover:bg-pink-200 text-pink-800"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}