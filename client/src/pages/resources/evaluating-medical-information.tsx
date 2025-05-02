import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { StandardDisclaimer } from "@/components/ui/standard-disclaimer";

export default function EvaluatingMedicalInformation() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/disclaimers" className="text-slate-600 hover:text-slate-900 flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Disclaimer Hub
        </Link>
        <h1 className="text-3xl font-bold mb-2">Evaluating Medical Information</h1>
        <p className="text-lg text-muted-foreground">
          How to assess the credibility of health information and research
        </p>
      </div>
      
      <StandardDisclaimer 
        category="health" 
        severity="info" 
        display="always" 
        className="mb-6" 
      />
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Evaluating Health Information Critically</CardTitle>
          <CardDescription>
            In the age of information, learning to evaluate medical content is an essential skill
          </CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            With abundant health information available online, in books, and from various sources, 
            it's important to develop skills to evaluate this information critically. Not all health 
            information is created equal, and some sources may be misleading or even harmful.
          </p>
          
          <h3>Key Criteria for Evaluating Health Information</h3>
          
          <div className="space-y-4 my-6">
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Source Credibility</h4>
                <p className="text-sm text-gray-600">
                  Consider who created the information. Government health agencies, medical schools, and 
                  major health organizations typically provide reliable information. Look for websites 
                  ending in .gov, .edu, or from established medical institutions.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Author Credentials</h4>
                <p className="text-sm text-gray-600">
                  Check the credentials of the author or contributors. Information from healthcare 
                  professionals with relevant expertise is generally more reliable than anonymous sources 
                  or those without medical training.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Evidence and Research Citations</h4>
                <p className="text-sm text-gray-600">
                  Look for citations to peer-reviewed research. Credible health information is typically 
                  based on scientific studies rather than anecdotes or opinions. Be wary of claims that 
                  seem to be based on a single study or personal testimonials.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Currency of Information</h4>
                <p className="text-sm text-gray-600">
                  Check when the information was published or last updated. Medical knowledge evolves 
                  rapidly, and older information may be outdated. Look for recent publication dates, 
                  especially for topics where research is advancing quickly.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Purpose and Objectivity</h4>
                <p className="text-sm text-gray-600">
                  Consider why the information was created. Is it meant to educate, sell a product, or 
                  promote a particular viewpoint? Information from sources with commercial interests 
                  may be biased. Look for balanced presentations that discuss both benefits and risks.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Accuracy and Consistency</h4>
                <p className="text-sm text-gray-600">
                  Compare information across multiple reputable sources. If a claim appears on only one 
                  website or contradicts what most experts say, be skeptical. Reliable health information 
                  tends to be consistent across credible sources.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Transparency About Limitations</h4>
                <p className="text-sm text-gray-600">
                  Credible health information acknowledges uncertainty where it exists and is transparent 
                  about the limitations of current knowledge. Be cautious of sources that make absolute claims 
                  or promise miracle cures.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-md border border-red-100 my-6">
            <h4 className="flex items-center text-base font-medium text-red-800 mb-2">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              Red Flags in Health Information
            </h4>
            <ul className="ml-8 list-disc space-y-2 text-red-700">
              <li>Claims that seem too good to be true or promise "miracle" cures</li>
              <li>Information that contradicts well-established medical consensus without substantial evidence</li>
              <li>Content that relies heavily on personal testimonials rather than scientific research</li>
              <li>Sites that primarily sell products related to the health information they provide</li>
              <li>Information that uses sensationalist language or creates unnecessary fear</li>
              <li>Content that dismisses conventional medical treatment or advises replacing it entirely with alternative approaches</li>
            </ul>
          </div>
          
          <h3>Reliable Sources for Health Information</h3>
          <ul>
            <li><strong>Government Health Agencies:</strong> CDC, NIH, FDA, WHO</li>
            <li><strong>Medical Schools and Academic Institutions:</strong> University medical centers, research institutions</li>
            <li><strong>Professional Medical Associations:</strong> American Medical Association, American Academy of Pediatrics</li>
            <li><strong>Major Health Nonprofits:</strong> American Heart Association, American Cancer Society</li>
            <li><strong>Peer-Reviewed Medical Journals:</strong> The Lancet, JAMA, New England Journal of Medicine</li>
          </ul>
          
          <p className="mt-6 font-medium">
            Remember that even the most reliable health information is general in nature and not specific 
            to your individual health situation. Always consult healthcare professionals for personalized 
            medical advice. Being an informed healthcare consumer means using reliable information to have 
            better conversations with your healthcare provider, not replacing their expertise.
          </p>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mt-8">
        <Link href="/resources/finding-healthcare-providers" className="text-slate-600 hover:text-slate-900 flex items-center">
          ← Finding a Primary Care Physician
        </Link>
        
        <Link href="/disclaimers" className="text-primary hover:underline flex items-center">
          Back to Disclaimer Hub <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
        </Link>
      </div>
    </div>
  );
}