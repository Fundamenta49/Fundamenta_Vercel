import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, HelpCircle } from "lucide-react";

export default function ProfessionalQuestions() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/disclaimers" className="text-slate-600 hover:text-slate-900 flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Disclaimer Hub
        </Link>
        <h1 className="text-3xl font-bold mb-2">Questions to Ask Before Hiring</h1>
        <p className="text-lg text-muted-foreground">
          Important questions to ask when vetting any professional service provider
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Essential Questions for Professional Services</CardTitle>
          <CardDescription>
            Asking the right questions helps you make informed decisions about professional services
          </CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            Before hiring any professional, it's important to ask thorough questions to ensure they're qualified
            and a good fit for your needs. These questions can help you evaluate expertise, reliability, and value.
          </p>
          
          <h3>General Questions for Any Professional</h3>
          
          <div className="space-y-6 my-6">
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <h4 className="flex items-center text-base font-medium text-slate-800 mb-2">
                <HelpCircle className="h-5 w-5 text-slate-600 mr-2" />
                Qualifications and Experience
              </h4>
              <ul className="ml-8 list-disc space-y-2 text-slate-700">
                <li>What specific qualifications, certifications, or licenses do you hold?</li>
                <li>How long have you been practicing in this field?</li>
                <li>What is your experience working with situations similar to mine?</li>
                <li>Can you provide examples of similar work you've done?</li>
                <li>Do you specialize in any particular areas within your profession?</li>
              </ul>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <h4 className="flex items-center text-base font-medium text-slate-800 mb-2">
                <HelpCircle className="h-5 w-5 text-slate-600 mr-2" />
                Process and Approach
              </h4>
              <ul className="ml-8 list-disc space-y-2 text-slate-700">
                <li>What is your typical process for working with clients?</li>
                <li>How do you approach [specific challenge or goal]?</li>
                <li>What is your communication style and frequency?</li>
                <li>How do you handle challenges or unexpected issues?</li>
                <li>Do you work alone or with a team?</li>
              </ul>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <h4 className="flex items-center text-base font-medium text-slate-800 mb-2">
                <HelpCircle className="h-5 w-5 text-slate-600 mr-2" />
                Fees and Payment Structure
              </h4>
              <ul className="ml-8 list-disc space-y-2 text-slate-700">
                <li>What is your fee structure? (hourly, flat rate, retainer, etc.)</li>
                <li>Do you require a deposit or retainer upfront?</li>
                <li>What exact services are included in your fees?</li>
                <li>Are there any additional costs I should anticipate?</li>
                <li>What payment methods do you accept and what are your payment terms?</li>
              </ul>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <h4 className="flex items-center text-base font-medium text-slate-800 mb-2">
                <HelpCircle className="h-5 w-5 text-slate-600 mr-2" />
                References and Track Record
              </h4>
              <ul className="ml-8 list-disc space-y-2 text-slate-700">
                <li>Can you provide references from past clients?</li>
                <li>Do you have testimonials or case studies you can share?</li>
                <li>Have you ever had a client complaint or negative outcome? How did you handle it?</li>
                <li>Do you have professional liability insurance?</li>
                <li>Are you a member of any professional associations?</li>
              </ul>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <h4 className="flex items-center text-base font-medium text-slate-800 mb-2">
                <HelpCircle className="h-5 w-5 text-slate-600 mr-2" />
                Working Relationship and Expectations
              </h4>
              <ul className="ml-8 list-disc space-y-2 text-slate-700">
                <li>What do you need from me to work together effectively?</li>
                <li>What is a realistic timeline for achieving my goals?</li>
                <li>How do you measure success or progress?</li>
                <li>What happens if I'm not satisfied with the service?</li>
                <li>How is confidentiality handled?</li>
              </ul>
            </div>
          </div>
          
          <h3>Field-Specific Questions</h3>
          <p>
            In addition to the general questions above, prepare specific questions relevant to the particular
            professional service you're seeking. For example:
          </p>
          
          <ul>
            <li><strong>Healthcare Providers:</strong> Ask about their approach to treatment, hospital affiliations, and how they stay current with medical advances.</li>
            <li><strong>Financial Advisors:</strong> Inquire about their investment philosophy, fiduciary status, and how they're compensated (fee-only, commission, etc.).</li>
            <li><strong>Legal Professionals:</strong> Ask about their approach to your specific legal issue, likely outcomes, and who will be handling your case day-to-day.</li>
            <li><strong>Contractors/Home Services:</strong> Request information about licenses, insurance, warranties, and their approach to unexpected issues.</li>
          </ul>
          
          <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mt-6">
            <h4 className="text-blue-800 font-medium">Trust Your Instincts</h4>
            <p className="text-blue-700 text-sm mt-2">
              Beyond the answers themselves, pay attention to how the professional responds to your questions. 
              Are they patient, thorough, and transparent? Do they explain complex concepts clearly? A professional
              who welcomes your questions demonstrates respect for your decision-making process.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mt-8">
        <Link href="/resources/finding-professionals" className="text-slate-600 hover:text-slate-900 flex items-center">
          ← Finding the Right Professional
        </Link>
        
        <Link href="/disclaimers" className="text-primary hover:underline flex items-center">
          Back to Disclaimer Hub <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
        </Link>
      </div>
    </div>
  );
}