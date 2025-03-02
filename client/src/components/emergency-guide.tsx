import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const emergencyGuides = [
  {
    title: "CPR Guide",
    description: "Step-by-step instructions for performing CPR",
    steps: [
      "Check the scene for safety",
      "Check the person for responsiveness",
      "Call 911 or ask someone else to",
      "Check for breathing",
      "Begin chest compressions",
      "Give rescue breaths",
      "Continue CPR until help arrives"
    ]
  },
  {
    title: "First Aid for Cuts and Burns",
    description: "Basic first aid for common injuries",
    steps: [
      "Clean the wound with soap and water",
      "Apply antibiotic ointment",
      "Cover with sterile bandage",
      "Change dressing daily",
      "Watch for signs of infection"
    ]
  },
  {
    title: "Natural Disaster Preparedness",
    description: "How to prepare for natural disasters",
    steps: [
      "Create an emergency kit",
      "Develop an evacuation plan",
      "Store important documents safely",
      "Keep emergency contacts handy",
      "Know your local emergency procedures"
    ]
  }
];

export default function EmergencyGuide() {
  return (
    <div className="space-y-6">
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Emergency Numbers</CardTitle>
          <CardDescription>Keep these numbers handy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span>Emergency Services</span>
            <Button variant="destructive">911</Button>
          </div>
          <div className="flex justify-between items-center">
            <span>Poison Control</span>
            <Button variant="destructive">1-800-222-1222</Button>
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="space-y-4">
        {emergencyGuides.map((guide, index) => (
          <AccordionItem key={index} value={`guide-${index}`}>
            <AccordionTrigger className="text-lg font-semibold">
              {guide.title}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground mb-4">{guide.description}</p>
              <ol className="list-decimal list-inside space-y-2">
                {guide.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="text-sm">{step}</li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
