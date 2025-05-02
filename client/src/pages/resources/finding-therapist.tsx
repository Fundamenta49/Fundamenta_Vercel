import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { StandardDisclaimer } from "@/components/ui/standard-disclaimer";

export default function FindingTherapist() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/disclaimers" className="text-slate-600 hover:text-slate-900 flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Disclaimer Hub
        </Link>
        <h1 className="text-3xl font-bold mb-2">Finding a Therapist</h1>
        <p className="text-lg text-muted-foreground">
          How to find and select a mental health professional who's right for you
        </p>
      </div>
      
      <StandardDisclaimer 
        category="health" 
        severity="warning" 
        display="always" 
        className="mb-6" 
      />
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Finding the Right Therapist</CardTitle>
          <CardDescription>
            A good therapeutic relationship is essential for effective mental health care
          </CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            Finding the right therapist is an important step in taking care of your mental health. 
            A good therapeutic relationship can make a significant difference in your mental health journey.
          </p>
          
          <h3>Key Steps to Finding a Therapist</h3>
          
          <div className="space-y-4 my-6">
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Identify Your Needs</h4>
                <p className="text-sm text-gray-600">
                  Consider what specific issues you'd like help with and what type of therapy might be most 
                  beneficial. Different therapists specialize in different approaches and issues.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Check Your Insurance Coverage</h4>
                <p className="text-sm text-gray-600">
                  If you have health insurance, check which mental health services are covered and if there's 
                  a list of in-network providers. This can significantly reduce your out-of-pocket costs.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Research Potential Therapists</h4>
                <p className="text-sm text-gray-600">
                  Look for therapists with experience in your specific concerns. Check their credentials, 
                  training, and approach to therapy. Many therapists list this information on their websites 
                  or professional profiles.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Consider Practical Factors</h4>
                <p className="text-sm text-gray-600">
                  Think about location, session availability, fees, and whether the therapist offers 
                  in-person or virtual sessions. These practical considerations can affect your ability 
                  to consistently attend therapy.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Schedule Initial Consultations</h4>
                <p className="text-sm text-gray-600">
                  Many therapists offer brief initial consultations, often for free or at a reduced rate. 
                  This gives you a chance to assess whether you feel comfortable with the therapist and 
                  their approach.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Assess the Fit</h4>
                <p className="text-sm text-gray-600">
                  After your first session or two, reflect on how you feel about the therapist. Do you feel 
                  understood and respected? Is their approach aligning with your needs? Trust is essential 
                  in the therapeutic relationship.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-md border border-amber-100 my-6">
            <h4 className="flex items-center text-base font-medium text-amber-800 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
              Important Questions to Ask
            </h4>
            <ul className="ml-8 list-disc space-y-2 text-amber-700">
              <li>What is your approach to therapy?</li>
              <li>What experience do you have with [your specific concern]?</li>
              <li>How do you typically structure sessions?</li>
              <li>What are your fees and do you accept my insurance?</li>
              <li>How often would we meet and for how long?</li>
              <li>How do you measure progress in therapy?</li>
              <li>What is your cancellation policy?</li>
            </ul>
          </div>
          
          <h3>Resources for Finding Therapists</h3>
          <ul>
            <li><strong>Psychology Today's Therapist Directory:</strong> Searchable database of mental health professionals</li>
            <li><strong>Your health insurance provider:</strong> Often has a directory of in-network mental health providers</li>
            <li><strong>American Psychological Association:</strong> Offers a psychologist locator service</li>
            <li><strong>National Alliance on Mental Illness (NAMI):</strong> Provides resources for finding mental health support</li>
            <li><strong>Community mental health centers:</strong> Often offer services on a sliding fee scale</li>
          </ul>
          
          <p className="mt-6 font-medium">
            Remember that finding the right therapist may take time, and it's okay to try different providers 
            until you find someone you feel comfortable with. Your mental health is important, and having the 
            right professional support can make a significant difference in your well-being.
          </p>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mt-8">
        <Link href="/disclaimers" className="text-slate-600 hover:text-slate-900 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Disclaimer Hub
        </Link>
        
        <Link href="/resources/mental-health-providers" className="text-primary hover:underline">
          Next: Types of Mental Health Professionals →
        </Link>
      </div>
    </div>
  );
}