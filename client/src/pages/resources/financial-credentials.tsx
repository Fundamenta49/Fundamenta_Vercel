import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Award } from "lucide-react";
import { StandardDisclaimer } from "@/components/ui/standard-disclaimer";

export default function FinancialCredentials() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/disclaimers" className="text-slate-600 hover:text-slate-900 flex items-center mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Disclaimer Hub
        </Link>
        <h1 className="text-3xl font-bold mb-2">Understanding Financial Credentials</h1>
        <p className="text-lg text-muted-foreground">
          A guide to different financial certifications and what they mean
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
          <CardTitle>Decoding Financial Professional Credentials</CardTitle>
          <CardDescription>
            Understanding what those letters after a financial professional's name actually mean
          </CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            Financial professionals often have a variety of credentials listed after their names, 
            which can be confusing for consumers. Understanding these designations can help you 
            determine if a professional has the expertise you need for your specific financial situation.
          </p>
          
          <h3>Major Financial Designations and What They Mean</h3>
          
          <div className="space-y-6 my-6">
            <div className="bg-green-50 p-4 rounded-md border border-green-200">
              <h4 className="flex items-center text-base font-medium text-green-800 mb-2">
                <Award className="h-5 w-5 text-green-600 mr-2" />
                CFP® (Certified Financial Planner)
              </h4>
              <div className="space-y-2 text-green-700">
                <p className="text-sm">
                  One of the most recognized and rigorous financial planning designations. CFP® professionals
                  must complete extensive education, pass a comprehensive exam, meet experience requirements,
                  adhere to ethical standards, and complete continuing education.
                </p>
                <p className="text-sm">
                  <strong>Focus:</strong> Comprehensive financial planning, including investments, retirement,
                  tax, estate planning, and insurance.
                </p>
                <p className="text-sm">
                  <strong>Best for:</strong> Holistic financial planning and advice across multiple areas of your finances.
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <h4 className="flex items-center text-base font-medium text-blue-800 mb-2">
                <Award className="h-5 w-5 text-blue-600 mr-2" />
                CFA (Chartered Financial Analyst)
              </h4>
              <div className="space-y-2 text-blue-700">
                <p className="text-sm">
                  A globally recognized designation focused on investment analysis and portfolio management.
                  Candidates must pass three levels of exams covering areas like economics, financial analysis,
                  asset valuation, and portfolio management.
                </p>
                <p className="text-sm">
                  <strong>Focus:</strong> Investment analysis, asset management, and research.
                </p>
                <p className="text-sm">
                  <strong>Best for:</strong> Investment management and sophisticated portfolio analysis.
                </p>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
              <h4 className="flex items-center text-base font-medium text-purple-800 mb-2">
                <Award className="h-5 w-5 text-purple-600 mr-2" />
                CPA (Certified Public Accountant)
              </h4>
              <div className="space-y-2 text-purple-700">
                <p className="text-sm">
                  A professional designation for accountants. CPAs must pass a rigorous exam and meet
                  education and experience requirements. Some CPAs specialize in personal financial planning
                  and may hold an additional PFS (Personal Financial Specialist) credential.
                </p>
                <p className="text-sm">
                  <strong>Focus:</strong> Accounting, tax preparation, and financial record-keeping.
                </p>
                <p className="text-sm">
                  <strong>Best for:</strong> Tax planning and accounting needs; CPA/PFS for tax-focused financial planning.
                </p>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
              <h4 className="flex items-center text-base font-medium text-amber-800 mb-2">
                <Award className="h-5 w-5 text-amber-600 mr-2" />
                ChFC (Chartered Financial Consultant)
              </h4>
              <div className="space-y-2 text-amber-700">
                <p className="text-sm">
                  Similar to the CFP® but with a focus on advanced financial planning. ChFCs complete
                  eight or more college-level courses and examinations on financial planning topics.
                </p>
                <p className="text-sm">
                  <strong>Focus:</strong> Advanced financial planning, including special circumstances like
                  divorce, small business planning, and planning for families with special needs.
                </p>
                <p className="text-sm">
                  <strong>Best for:</strong> Comprehensive financial planning, particularly for complex situations.
                </p>
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-md border border-red-200">
              <h4 className="flex items-center text-base font-medium text-red-800 mb-2">
                <Award className="h-5 w-5 text-red-600 mr-2" />
                CLU (Chartered Life Underwriter)
              </h4>
              <div className="space-y-2 text-red-700">
                <p className="text-sm">
                  A professional designation for insurance specialists who advise individuals and businesses
                  about their life insurance and risk management needs.
                </p>
                <p className="text-sm">
                  <strong>Focus:</strong> Life insurance, business planning, and risk management.
                </p>
                <p className="text-sm">
                  <strong>Best for:</strong> Insurance planning and risk management strategies.
                </p>
              </div>
            </div>
            
            <div className="bg-cyan-50 p-4 rounded-md border border-cyan-200">
              <h4 className="flex items-center text-base font-medium text-cyan-800 mb-2">
                <Award className="h-5 w-5 text-cyan-600 mr-2" />
                CIMA (Certified Investment Management Analyst)
              </h4>
              <div className="space-y-2 text-cyan-700">
                <p className="text-sm">
                  Focuses on asset allocation, investment policy, and risk management for individual and
                  institutional investors. Requires completing an education program at a top business school.
                </p>
                <p className="text-sm">
                  <strong>Focus:</strong> Advanced investment management and strategy.
                </p>
                <p className="text-sm">
                  <strong>Best for:</strong> Sophisticated investment portfolio management.
                </p>
              </div>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-md border border-indigo-200">
              <h4 className="flex items-center text-base font-medium text-indigo-800 mb-2">
                <Award className="h-5 w-5 text-indigo-600 mr-2" />
                EA (Enrolled Agent)
              </h4>
              <div className="space-y-2 text-indigo-700">
                <p className="text-sm">
                  A tax professional who is federally licensed to represent taxpayers before the IRS.
                  EAs must pass a comprehensive IRS test or have experience as an IRS employee.
                </p>
                <p className="text-sm">
                  <strong>Focus:</strong> Tax planning and representing clients before the IRS.
                </p>
                <p className="text-sm">
                  <strong>Best for:</strong> Complex tax situations and tax dispute resolution.
                </p>
              </div>
            </div>
          </div>
          
          <h3>Other Common Financial Designations</h3>
          <ul>
            <li><strong>AIF® (Accredited Investment Fiduciary):</strong> Focus on fiduciary responsibility and investment processes</li>
            <li><strong>CDFA® (Certified Divorce Financial Analyst):</strong> Specializes in financial issues related to divorce</li>
            <li><strong>RICP® (Retirement Income Certified Professional):</strong> Focuses on retirement income planning</li>
            <li><strong>CFT-I™ (Certified Financial Therapist-I):</strong> Combines financial planning with behavioral therapy to address money behaviors</li>
            <li><strong>CRPC® (Chartered Retirement Planning Counselor):</strong> Specializes in retirement planning</li>
          </ul>
          
          <h3>Tips for Evaluating Credentials</h3>
          <ol>
            <li><strong>Check the requirements:</strong> Some credentials require rigorous education and examination, while others might be obtained with minimal effort.</li>
            <li><strong>Verify the credential:</strong> Most certifying organizations allow you to verify if someone actually holds the credential they claim.</li>
            <li><strong>Consider relevance:</strong> Match the credential to your needs. For investment help, a CFA might be appropriate; for tax issues, a CPA or EA.</li>
            <li><strong>Look beyond credentials:</strong> Experience, communication style, and approach are also important factors in choosing a financial professional.</li>
          </ol>
          
          <p className="mt-6 font-medium">
            Remember that credentials are important indicators of expertise but should be just one factor 
            in your decision to work with a financial professional. Always interview potential advisors to 
            ensure their approach and services match your needs.
          </p>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mt-8">
        <Link href="/resources/finding-financial-advisors" className="text-slate-600 hover:text-slate-900 flex items-center">
          ← Finding a Financial Advisor
        </Link>
        
        <Link href="/disclaimers" className="text-primary hover:underline flex items-center">
          Back to Disclaimer Hub <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
        </Link>
      </div>
    </div>
  );
}