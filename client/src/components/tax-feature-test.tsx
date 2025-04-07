import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const TaxFeatureTest = () => {
  // Test function to trigger tax badge earned event
  const triggerTaxBadgeEarned = () => {
    console.log("Dispatching taxBadgeEarned event");
    
    // Create and dispatch a custom event for tax badge earned
    const badgeEvent = new CustomEvent("taxBadgeEarned", {
      detail: {
        badgeName: "Tax Bracket Master"
      },
      bubbles: true
    });
    
    window.dispatchEvent(badgeEvent);
  };
  
  // Test function to trigger tax learning progress event
  const triggerTaxLearningProgress = (percent: number) => {
    console.log(`Dispatching taxLearningProgressUpdated event with ${percent}%`);
    
    // Create and dispatch a custom event for tax learning progress
    const progressEvent = new CustomEvent("taxLearningProgressUpdated", {
      detail: {
        progressPercent: percent,
        topic: "Income Tax Basics"
      },
      bubbles: true
    });
    
    window.dispatchEvent(progressEvent);
  };
  
  // Function to test tax-specific question to Fundi
  const sendTaxQuestion = (question: string) => {
    console.log(`Sending tax question to Fundi: ${question}`);
    
    // Force Fundi open with category set to finance
    const fundiEvent = new CustomEvent("forceFundiOpen", {
      bubbles: true
    });
    
    window.dispatchEvent(fundiEvent);
    
    // Note: This will open Fundi, but you'll need to manually type the question
    // since we can't programmatically set the input value and submit
  };
  
  return (
    <Card className="max-w-md mx-auto my-8">
      <CardHeader>
        <CardTitle>Tax Feature Integration Test</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <h3 className="font-semibold mb-2">Test Tax Badge Events</h3>
          <Button onClick={triggerTaxBadgeEarned} className="w-full">
            Trigger Tax Badge Earned Event
          </Button>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Test Tax Learning Progress</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => triggerTaxLearningProgress(25)} variant="outline">
              25% Progress
            </Button>
            <Button onClick={() => triggerTaxLearningProgress(50)} variant="outline">
              50% Progress
            </Button>
            <Button onClick={() => triggerTaxLearningProgress(75)} variant="outline">
              75% Progress
            </Button>
            <Button onClick={() => triggerTaxLearningProgress(100)} variant="outline">
              100% Progress
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">Test Tax Questions</h3>
          <div className="grid grid-cols-1 gap-2">
            <Button 
              onClick={() => sendTaxQuestion("How do tax brackets work?")}
              variant="secondary"
            >
              Open Fundi: Tax Brackets
            </Button>
            <Button 
              onClick={() => sendTaxQuestion("What is FICA tax?")}
              variant="secondary"
            >
              Open Fundi: FICA Tax
            </Button>
            <Button 
              onClick={() => sendTaxQuestion("How can I calculate my income tax?")}
              variant="secondary"
            >
              Open Fundi: Income Tax
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxFeatureTest;