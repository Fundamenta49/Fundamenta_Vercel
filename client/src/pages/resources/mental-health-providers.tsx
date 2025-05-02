import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { StandardDisclaimer } from "@/components/ui/standard-disclaimer";

export default function MentalHealthProviders() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/disclaimers" className="text-slate-600 hover:text-slate-900 flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Disclaimer Hub
        </Link>
        <h1 className="text-3xl font-bold mb-2">Types of Mental Health Professionals</h1>
        <p className="text-lg text-muted-foreground">
          Understanding the differences between psychiatrists, psychologists, counselors, and other providers
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
          <CardTitle>Understanding Mental Health Provider Types</CardTitle>
          <CardDescription>
            Different mental health professionals have distinct training, approaches, and services
          </CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            When seeking mental health care, you'll encounter various types of professionals with different 
            qualifications, approaches, and specialties. Understanding these differences can help you find the 
            most appropriate care for your specific needs.
          </p>
          
          <div className="space-y-6 my-6">
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <h3 className="text-blue-800 font-medium mb-2">Psychiatrists (MD or DO)</h3>
              <div className="space-y-2 text-blue-700">
                <p className="text-sm">
                  <strong>Education:</strong> Medical school followed by residency in psychiatry
                </p>
                <p className="text-sm">
                  <strong>Services:</strong> Diagnose mental health conditions, prescribe and manage medications, may 
                  provide therapy (though many focus primarily on medication management)
                </p>
                <p className="text-sm">
                  <strong>Best for:</strong> Conditions that may benefit from medication, complex mental health issues, 
                  conditions with physical symptoms or medical complications
                </p>
                <p className="text-sm">
                  <strong>License:</strong> State medical board
                </p>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
              <h3 className="text-purple-800 font-medium mb-2">Psychologists (PhD, PsyD, or EdD)</h3>
              <div className="space-y-2 text-purple-700">
                <p className="text-sm">
                  <strong>Education:</strong> Doctoral degree in psychology or related field, plus supervised clinical experience
                </p>
                <p className="text-sm">
                  <strong>Services:</strong> Psychological testing and evaluation, therapy, research (cannot prescribe 
                  medication in most states)
                </p>
                <p className="text-sm">
                  <strong>Best for:</strong> In-depth psychological assessment, evidence-based therapies for specific conditions, 
                  situations requiring psychological testing
                </p>
                <p className="text-sm">
                  <strong>License:</strong> State psychology board
                </p>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <h3 className="text-green-800 font-medium mb-2">Licensed Professional Counselors (LPC, LPCC, LCPC)</h3>
              <div className="space-y-2 text-green-700">
                <p className="text-sm">
                  <strong>Education:</strong> Master's degree in counseling or related field, plus supervised clinical experience
                </p>
                <p className="text-sm">
                  <strong>Services:</strong> Individual and group therapy, usually focusing on specific issues and practical strategies
                </p>
                <p className="text-sm">
                  <strong>Best for:</strong> Specific life challenges, personal development, relationship issues, adjustment problems
                </p>
                <p className="text-sm">
                  <strong>License:</strong> State counseling board
                </p>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
              <h3 className="text-amber-800 font-medium mb-2">Licensed Clinical Social Workers (LCSW, LICSW)</h3>
              <div className="space-y-2 text-amber-700">
                <p className="text-sm">
                  <strong>Education:</strong> Master's degree in social work plus supervised clinical experience
                </p>
                <p className="text-sm">
                  <strong>Services:</strong> Therapy with a focus on how social environments affect mental health, 
                  connecting clients with community resources
                </p>
                <p className="text-sm">
                  <strong>Best for:</strong> Issues related to life circumstances, accessing social services, 
                  navigating healthcare and social systems
                </p>
                <p className="text-sm">
                  <strong>License:</strong> State social work board
                </p>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <h3 className="text-red-800 font-medium mb-2">Marriage and Family Therapists (LMFT)</h3>
              <div className="space-y-2 text-red-700">
                <p className="text-sm">
                  <strong>Education:</strong> Master's degree in marriage and family therapy plus supervised clinical experience
                </p>
                <p className="text-sm">
                  <strong>Services:</strong> Therapy focusing on relationships and family systems, both with individuals and groups
                </p>
                <p className="text-sm">
                  <strong>Best for:</strong> Relationship issues, family conflicts, parenting challenges, couples therapy
                </p>
                <p className="text-sm">
                  <strong>License:</strong> State marriage and family therapy board
                </p>
              </div>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-md border border-indigo-200">
              <h3 className="text-indigo-800 font-medium mb-2">Psychiatric Nurse Practitioners (PMHNP)</h3>
              <div className="space-y-2 text-indigo-700">
                <p className="text-sm">
                  <strong>Education:</strong> Master's or doctoral degree in nursing with specialized training in psychiatry
                </p>
                <p className="text-sm">
                  <strong>Services:</strong> Diagnose mental health conditions, prescribe and manage medications, may provide therapy
                </p>
                <p className="text-sm">
                  <strong>Best for:</strong> Conditions that may benefit from medication management combined with a holistic nursing approach
                </p>
                <p className="text-sm">
                  <strong>License:</strong> State nursing board
                </p>
              </div>
            </div>
            
            <div className="bg-teal-50 p-4 rounded-md border border-teal-200">
              <h3 className="text-teal-800 font-medium mb-2">Specialized Therapists</h3>
              <div className="space-y-2 text-teal-700">
                <p className="text-sm">
                  There are also many specialized types of therapists with specific training:
                </p>
                <ul className="ml-5 list-disc text-sm">
                  <li><strong>Art Therapists (ATR):</strong> Use creative processes for therapeutic purposes</li>
                  <li><strong>Music Therapists (MT-BC):</strong> Use music experiences for therapeutic goals</li>
                  <li><strong>Play Therapists (RPT):</strong> Specialize in therapy with children using play</li>
                  <li><strong>Addiction Counselors (CADC, LADC):</strong> Focus on substance use and addiction recovery</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h3>Collaborative Care</h3>
          <p>
            Many people benefit from working with multiple mental health professionals as part of a care team. For example:
          </p>
          <ul>
            <li>Seeing a psychiatrist for medication management and a therapist for talk therapy</li>
            <li>Working with a psychologist for specialized treatment and a social worker for resource connection</li>
            <li>Seeing a family therapist for relationship issues and an individual therapist for personal growth</li>
          </ul>
          
          <h3>Making Your Choice</h3>
          <p>
            When deciding which type of mental health professional to see, consider:
          </p>
          <ol>
            <li><strong>Your specific needs:</strong> The nature of your concerns can guide which professional might be most helpful</li>
            <li><strong>Treatment preferences:</strong> Whether you're interested in medication, therapy, or both</li>
            <li><strong>Insurance coverage:</strong> Which provider types are covered by your insurance</li>
            <li><strong>Accessibility:</strong> Availability of appointments, location, telehealth options</li>
            <li><strong>Personal connection:</strong> Regardless of credentials, the therapeutic relationship is crucial</li>
          </ol>
          
          <p className="mt-6 font-medium">
            Remember that credentials, while important, are just one factor in finding the right provider. 
            The therapeutic relationship and a provider's experience with your specific concerns are equally 
            important factors in successful mental health care.
          </p>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mt-8">
        <Link href="/resources/finding-therapist" className="text-slate-600 hover:text-slate-900 flex items-center">
          ← Finding a Therapist
        </Link>
        
        <Link href="/disclaimers" className="text-primary hover:underline flex items-center">
          Back to Disclaimer Hub <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
        </Link>
      </div>
    </div>
  );
}