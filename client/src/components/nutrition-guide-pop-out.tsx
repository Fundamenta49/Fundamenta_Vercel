import { useState } from "react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
  FullScreenDialogFooter,
} from "@/components/ui/full-screen-dialog";
import { Button } from "@/components/ui/button";
import { Apple } from "lucide-react";
import NutritionGuide from "./nutrition-guide";

export default function NutritionGuidePopOut() {
  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Apple className="h-6 w-6 text-purple-500" />
          Nutrition Guide
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          Learn about healthy eating and meal planning to support your wellness journey
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <NutritionGuide />
      </FullScreenDialogBody>
    </div>
  );
}