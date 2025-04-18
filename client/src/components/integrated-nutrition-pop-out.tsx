import IntegratedNutrition from "@/components/integrated-nutrition";

export default function IntegratedNutritionPopOut() {
  return (
    <div className="w-full p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-purple-600 mb-6">Nutrition Guide & Assessment</h1>
      <IntegratedNutrition />
    </div>
  );
}