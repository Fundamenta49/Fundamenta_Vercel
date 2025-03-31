import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Clock, Users, ThumbsUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Recipe } from '@/services/spoonacular-service';
import { Badge } from '@/components/ui/badge';

interface RecipeDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe;
}

export function RecipeDetailDialog({
  open,
  onOpenChange,
  recipe
}: RecipeDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0">
        <DialogHeader className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl pr-8">{recipe.title}</DialogTitle>
            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)} 
              className="h-8 w-8 p-0 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            {recipe.readyInMinutes && (
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {recipe.readyInMinutes} min
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {recipe.servings} servings
              </div>
            )}
            {recipe.aggregateLikes !== undefined && (
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1" />
                {recipe.aggregateLikes} likes
              </div>
            )}
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              {recipe.image && (
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full rounded-md mb-4" 
                />
              )}
              <div className="mb-4">
                <h3 className="font-medium text-lg mb-2">Description</h3>
                <div 
                  className="text-sm text-gray-700"
                  dangerouslySetInnerHTML={{ __html: recipe.summary }}
                />
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {recipe.diets?.map(diet => (
                  <Badge key={diet} className="bg-green-100 text-green-800 hover:bg-green-200">
                    {diet}
                  </Badge>
                ))}
                {recipe.dishTypes?.map(type => (
                  <Badge key={type} variant="outline">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-4">
                <h3 className="font-medium text-lg mb-2">Ingredients</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {recipe.extendedIngredients?.map((ingredient, index) => (
                    <li key={index}>{ingredient.original}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-2">Instructions</h3>
                <div 
                  className="text-sm text-gray-700"
                  dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                />
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="p-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}