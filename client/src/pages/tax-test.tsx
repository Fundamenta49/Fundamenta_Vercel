import FundiInteractiveAssistant from "@/components/fundi-interactive-assistant";
import TaxFeatureTest from "@/components/tax-feature-test";

export default function TaxTestPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tax Feature Integration Test Page</h1>
      
      <div className="mb-8">
        <p className="mb-4">
          This page allows you to test the tax-related features integrated with Fundi. 
          Use the buttons below to trigger events and see how Fundi responds.
        </p>
        
        <TaxFeatureTest />
      </div>
      
      {/* Include the Fundi component to test interactions */}
      <FundiInteractiveAssistant 
        initialCategory="finance"
        initiallyOpen={false}
        position="bottom-right"
      />
    </div>
  );
}