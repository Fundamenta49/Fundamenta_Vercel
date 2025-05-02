import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { StandardDisclaimer } from "@/components/ui/standard-disclaimer";

export default function FindingFinancialAdvisors() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/disclaimers" className="text-slate-600 hover:text-slate-900 flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Disclaimer Hub
        </Link>
        <h1 className="text-3xl font-bold mb-2">Finding a Financial Advisor</h1>
        <p className="text-lg text-muted-foreground">
          How to find a certified financial planner or advisor for your financial needs
        </p>
      </div>
      
      <StandardDisclaimer 
        category="finance" 
        severity="warning" 
        display="always" 
        className="mb-6" 
      />
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Finding the Right Financial Professional</CardTitle>
          <CardDescription>
            A qualified financial advisor can help you navigate complex financial decisions
          </CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            Finding the right financial advisor is a crucial step in managing your finances effectively. 
            The right professional can help you create a financial plan, manage investments, plan for 
            retirement, and navigate complex financial decisions.
          </p>
          
          <h3>Understanding Different Types of Financial Professionals</h3>
          
          <div className="space-y-4 my-6">
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Certified Financial Planner (CFP®)</h4>
                <p className="text-sm text-gray-600">
                  Professionals who have completed extensive training, passed a comprehensive exam, 
                  and must meet continuing education requirements. CFPs® provide holistic financial 
                  planning across various areas including investments, retirement, tax, estate planning, 
                  and insurance.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Registered Investment Advisor (RIA)</h4>
                <p className="text-sm text-gray-600">
                  Advisors registered with the Securities and Exchange Commission (SEC) or state 
                  securities authorities. RIAs have a fiduciary duty to act in their clients' best 
                  interests and typically focus on investment management.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Chartered Financial Analyst (CFA)</h4>
                <p className="text-sm text-gray-600">
                  Professionals who have completed a rigorous program focused on investment analysis 
                  and portfolio management. CFAs often work in investment management and research roles.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Certified Public Accountant (CPA)</h4>
                <p className="text-sm text-gray-600">
                  Financial professionals who specialize in tax and accounting. Some CPAs also have 
                  additional training in financial planning (often designated as CPA/PFS - Personal 
                  Financial Specialist).
                </p>
              </div>
            </div>
          </div>
          
          <h3>Key Steps to Finding a Financial Advisor</h3>
          
          <div className="space-y-4 my-6">
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Identify Your Financial Needs</h4>
                <p className="text-sm text-gray-600">
                  Before searching for an advisor, clarify what financial services you need. Are you 
                  looking for investment management, retirement planning, tax advice, estate planning, 
                  or comprehensive financial planning? Different advisors have different specialties.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Understand How Advisors Are Compensated</h4>
                <p className="text-sm text-gray-600">
                  Financial advisors can be compensated in different ways:
                </p>
                <ul className="text-sm text-gray-600 ml-5 mt-1 list-disc">
                  <li><strong>Fee-only:</strong> Paid directly by clients through hourly rates, flat fees, or a percentage of assets managed</li>
                  <li><strong>Commission-based:</strong> Earn commissions from financial products they sell</li>
                  <li><strong>Fee-based:</strong> Combination of fees and commissions</li>
                </ul>
                <p className="text-sm text-gray-600 mt-1">
                  Understanding compensation structures helps you identify potential conflicts of interest.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Look for Fiduciary Advisors</h4>
                <p className="text-sm text-gray-600">
                  Fiduciary advisors are legally obligated to act in your best interest. Not all financial 
                  professionals are held to this standard, so it's important to ask whether an advisor is 
                  a fiduciary all of the time or only in certain situations.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Check Credentials and Background</h4>
                <p className="text-sm text-gray-600">
                  Verify an advisor's credentials and check for any disciplinary history:
                </p>
                <ul className="text-sm text-gray-600 ml-5 mt-1 list-disc">
                  <li>For CFPs®: Visit the CFP Board's website</li>
                  <li>For investment advisors: Use the SEC's Investment Adviser Public Disclosure website</li>
                  <li>For brokers: Check FINRA's BrokerCheck</li>
                </ul>
              </div>
            </div>
            
            <div className="flex gap-3">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-base">Interview Multiple Advisors</h4>
                <p className="text-sm text-gray-600">
                  Meet with several advisors to compare their approaches, services, and fees. Ask about 
                  their experience working with clients in similar financial situations to yours.
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
              <li>Are you a fiduciary all of the time?</li>
              <li>What is your experience and what credentials do you have?</li>
              <li>How are you compensated?</li>
              <li>What services do you provide?</li>
              <li>What is your investment philosophy?</li>
              <li>How often will we meet and how will we communicate?</li>
              <li>Have you ever been disciplined by a regulatory body?</li>
              <li>Can you provide references from clients with similar financial situations?</li>
            </ul>
          </div>
          
          <h3>Resources for Finding Financial Advisors</h3>
          <ul>
            <li><strong>National Association of Personal Financial Advisors (NAPFA):</strong> Directory of fee-only advisors</li>
            <li><strong>Certified Financial Planner Board:</strong> Find a CFP® professional</li>
            <li><strong>Garrett Planning Network:</strong> Fee-only advisors who offer services by the hour</li>
            <li><strong>XY Planning Network:</strong> Fee-only advisors who specialize in working with Gen X and Gen Y clients</li>
          </ul>
          
          <p className="mt-6 font-medium">
            Remember that the right financial advisor for you is someone who not only has the right 
            qualifications but also understands your goals, communicates in a way that works for you, 
            and makes you feel comfortable asking questions. It's worth investing time in finding the 
            right match, as this relationship can significantly impact your financial future.
          </p>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mt-8">
        <Link href="/disclaimers" className="text-slate-600 hover:text-slate-900 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Disclaimer Hub
        </Link>
        
        <Link href="/resources/financial-credentials" className="text-primary hover:underline">
          Next: Understanding Financial Credentials →
        </Link>
      </div>
    </div>
  );
}