import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function FindingProfessionals() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/disclaimers" className="text-slate-600 hover:text-slate-900 flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Disclaimer Hub
        </Link>
        <h1 className="text-3xl font-bold mb-2">Finding the Right Professional</h1>
        <p className="text-lg text-muted-foreground">
          A guide to researching, evaluating, and selecting qualified professionals
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Why Finding the Right Professional Matters</CardTitle>
          <CardDescription>
            Professional guidance can make a significant difference in many areas of life
          </CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            When you need specialized expertise, finding a qualified professional who fits your 
            specific needs is crucial. The right professional can save you time, money, and stress, while 
            helping you achieve your goals more effectively.
          </p>
          
          <h3>Key Steps to Finding the Right Professional</h3>
          
          <div className="space-y-4 my-6">
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Identify Your Specific Needs</h4>
                <p className="text-sm text-gray-600">
                  Before beginning your search, clarify exactly what services you need. Be specific about your 
                  goals, timeline, budget, and any special requirements.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Research Credentials and Qualifications</h4>
                <p className="text-sm text-gray-600">
                  Different professions have different licensing requirements, certifications, and professional 
                  designations. Research what credentials are important in the field you're exploring.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Seek Referrals and Recommendations</h4>
                <p className="text-sm text-gray-600">
                  Ask friends, family, colleagues, or other professionals for recommendations. Personal 
                  references often lead to good matches.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Verify Experience and Expertise</h4>
                <p className="text-sm text-gray-600">
                  Look for professionals with specific experience in your area of need. Ask about their
                  background, case studies, or examples of similar work.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Check Reviews and References</h4>
                <p className="text-sm text-gray-600">
                  Look for testimonials, online reviews, and ask for references from past clients. Follow up
                  with these references to get insights into the professional's work style.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Interview Multiple Candidates</h4>
                <p className="text-sm text-gray-600">
                  Don't settle on the first professional you find. Interview several candidates to compare 
                  approaches, personalities, and fee structures.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Assess Communication Style</h4>
                <p className="text-sm text-gray-600">
                  Ensure the professional communicates clearly and in a way that makes you comfortable. 
                  Good communication is essential for a successful professional relationship.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Understand Fee Structures</h4>
                <p className="text-sm text-gray-600">
                  Get clear information about how the professional charges for their services. Ask about
                  hourly rates, flat fees, retainers, or any other payment arrangements.
                </p>
              </div>
            </div>
          </div>
          
          <h3>Red Flags to Watch For</h3>
          <ul>
            <li>Unwillingness to provide references or credentials</li>
            <li>Vague or inconsistent information about services or fees</li>
            <li>Pressuring tactics or promises that seem too good to be true</li>
            <li>Poor or unprofessional communication</li>
            <li>Lack of a formal contract or service agreement</li>
            <li>Complaints filed with professional associations or licensing boards</li>
          </ul>
          
          <p className="mt-6 font-medium">
            Remember that finding the right professional often takes time. It's worth investing this time
            upfront to establish a relationship with someone who can truly help you meet your goals.
          </p>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mt-8">
        <Link href="/disclaimers" className="text-slate-600 hover:text-slate-900 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Disclaimer Hub
        </Link>
        
        <Link href="/resources/professional-questions" className="text-primary hover:underline">
          Next: Questions to Ask Before Hiring →
        </Link>
      </div>
    </div>
  );
}