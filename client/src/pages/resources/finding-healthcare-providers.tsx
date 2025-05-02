import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { StandardDisclaimer } from "@/components/ui/standard-disclaimer";

export default function FindingHealthcareProviders() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/disclaimers" className="text-slate-600 hover:text-slate-900 flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Disclaimer Hub
        </Link>
        <h1 className="text-3xl font-bold mb-2">Finding a Primary Care Physician</h1>
        <p className="text-lg text-muted-foreground">
          A guide to finding a qualified doctor who meets your healthcare needs
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
          <CardTitle>Finding the Right Healthcare Provider</CardTitle>
          <CardDescription>
            Your primary care physician is a key partner in your healthcare journey
          </CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            A good relationship with your primary care physician is essential for maintaining your health and 
            addressing medical concerns. Finding the right doctor requires considering factors like 
            qualifications, compatibility, and practical considerations.
          </p>
          
          <h3>Key Steps to Finding a Primary Care Physician</h3>
          
          <div className="space-y-4 my-6">
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Check Your Insurance Network</h4>
                <p className="text-sm text-gray-600">
                  Start by reviewing which doctors are in-network with your health insurance to maximize 
                  your benefits and minimize out-of-pocket costs. Most insurance providers offer 
                  online directories of in-network physicians.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Consider Doctor Specialties</h4>
                <p className="text-sm text-gray-600">
                  Primary care physicians may be family practitioners, internists, or general practitioners. 
                  Family doctors treat patients of all ages, internists focus on adult medicine, and pediatricians 
                  specialize in children's health.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Check Credentials and Experience</h4>
                <p className="text-sm text-gray-600">
                  Verify that the doctor is board-certified in their specialty, which indicates they have 
                  the necessary training and have passed specialty exams. Online resources like the American 
                  Board of Medical Specialties can help verify credentials.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Research Hospital Affiliations</h4>
                <p className="text-sm text-gray-600">
                  Consider which hospitals the doctor is affiliated with. This matters if you need specialized 
                  care or hospitalization, as you'll likely be referred within their hospital network.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Consider Practical Factors</h4>
                <p className="text-sm text-gray-600">
                  Think about office location, hours, telemedicine options, and how long it typically 
                  takes to get an appointment. These practical considerations can significantly impact 
                  your healthcare experience.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Read Reviews and Ask for Recommendations</h4>
                <p className="text-sm text-gray-600">
                  Ask friends, family, and other healthcare providers for recommendations. Online reviews 
                  can provide insights, but remember they represent individual experiences.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Schedule a Consultation</h4>
                <p className="text-sm text-gray-600">
                  Meet with the doctor to assess your comfort with their communication style, 
                  whether they listen carefully, and if they take time to answer your questions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-md border border-amber-100 my-6">
            <h4 className="flex items-center text-base font-medium text-amber-800 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
              Important Considerations
            </h4>
            <ul className="ml-8 list-disc space-y-2 text-amber-700">
              <li>Consider any specific health needs you have and whether the doctor has experience in those areas</li>
              <li>If you have chronic conditions, you may want a doctor who specializes in those conditions</li>
              <li>For those with mobility issues, check if the office is accessible</li>
              <li>If English is not your first language, consider whether the doctor or staff speaks your preferred language</li>
            </ul>
          </div>
          
          <h3>Questions to Ask a New Doctor</h3>
          <ul>
            <li>How can I reach you or the on-call doctor after hours?</li>
            <li>Which hospitals are you affiliated with?</li>
            <li>How long does it typically take to get an appointment?</li>
            <li>Do you offer telemedicine services?</li>
            <li>What is your approach to preventive care?</li>
            <li>How do you handle referrals to specialists?</li>
            <li>What are your views on [specific health concern you have]?</li>
          </ul>
          
          <p className="mt-6 font-medium">
            Remember that finding the right doctor is an important decision that affects your health care. 
            It's worth taking time to find someone you trust and feel comfortable with.
          </p>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mt-8">
        <Link href="/disclaimers" className="text-slate-600 hover:text-slate-900 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Disclaimer Hub
        </Link>
        
        <Link href="/resources/evaluating-medical-information" className="text-primary hover:underline">
          Next: Evaluating Medical Information →
        </Link>
      </div>
    </div>
  );
}