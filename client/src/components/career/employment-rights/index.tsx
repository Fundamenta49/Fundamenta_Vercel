import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { 
  Scale, 
  Search, 
  FileText, 
  Clock, 
  DollarSign, 
  Sparkles, 
  ShieldCheck, 
  BriefcaseMedical,
  UserCheck,
  Info
} from 'lucide-react';

// Workplace rights categories
const RIGHTS_CATEGORIES = [
  {
    id: 'compensation',
    title: 'Compensation & Hours',
    icon: <DollarSign className="h-6 w-6" />,
    description: 'Laws and rights related to pay, overtime, and working hours',
    topics: [
      {
        id: 'minimum-wage',
        title: 'Minimum Wage',
        content: `
          <p>Federal law establishes a minimum wage that employers must pay their employees. As of 2023, the federal minimum wage is $7.25 per hour. However, many states and localities have enacted minimum wage rates higher than the federal level.</p>
          
          <p>Key points about minimum wage:</p>
          <ul>
            <li>When federal and state minimum wage laws differ, you're entitled to the higher rate</li>
            <li>Some occupations may be exempt from minimum wage requirements</li>
            <li>Tipped employees may have a different minimum wage, but total compensation (including tips) must meet the standard minimum wage</li>
          </ul>
          
          <p>For specific information about minimum wage in your state, contact your state's labor department or visit the U.S. Department of Labor website.</p>
        `
      },
      {
        id: 'overtime',
        title: 'Overtime Pay',
        content: `
          <p>Under the Fair Labor Standards Act (FLSA), eligible employees must receive overtime pay for hours worked over 40 in a workweek at a rate of at least 1.5 times their regular pay rate.</p>
          
          <p>Important overtime rules include:</p>
          <ul>
            <li>Overtime is calculated based on a workweek (7 consecutive 24-hour periods)</li>
            <li>Certain employees are exempt from overtime requirements, including many salaried managers and professionals who meet specific criteria</li>
            <li>Employers cannot average hours over multiple weeks to avoid paying overtime</li>
            <li>Unauthorized overtime must still be paid, though an employer may discipline an employee for violating company policy</li>
          </ul>
          
          <p>Some states have more favorable overtime laws, such as requiring overtime pay for working more than 8 hours in a single day.</p>
        `
      },
      {
        id: 'wage-theft',
        title: 'Wage Theft Prevention',
        content: `
          <p>Wage theft occurs when employers don't pay employees the full wages they've earned. Common forms of wage theft include:</p>
          
          <ul>
            <li>Paying less than minimum wage</li>
            <li>Not paying overtime</li>
            <li>Requiring employees to work "off the clock"</li>
            <li>Making illegal deductions from wages</li>
            <li>Not paying for all hours worked</li>
            <li>Misclassifying employees as independent contractors</li>
          </ul>
          
          <p>If you believe you're experiencing wage theft:</p>
          <ol>
            <li>Document all hours worked and payments received</li>
            <li>Raise the issue with your employer</li>
            <li>Contact your state's labor department or the U.S. Department of Labor's Wage and Hour Division</li>
            <li>Consider consulting with an employment attorney</li>
          </ol>
          
          <p>Many states have laws that provide additional protections against wage theft.</p>
        `
      }
    ]
  },
  {
    id: 'discrimination',
    title: 'Workplace Discrimination',
    icon: <UserCheck className="h-6 w-6" />,
    description: 'Protections against various forms of discrimination',
    topics: [
      {
        id: 'equal-opportunity',
        title: 'Equal Employment Opportunity',
        content: `
          <p>Federal laws prohibit employment discrimination based on:</p>
          <ul>
            <li>Race, color, and national origin</li>
            <li>Sex (including pregnancy, sexual orientation, and gender identity)</li>
            <li>Religion</li>
            <li>Age (40 or older)</li>
            <li>Disability</li>
            <li>Genetic information</li>
          </ul>
          
          <p>These protections apply to all aspects of employment, including:</p>
          <ul>
            <li>Hiring and firing</li>
            <li>Compensation, assignment, or classification of employees</li>
            <li>Transfer, promotion, layoff, or recall</li>
            <li>Job advertisements and recruitment</li>
            <li>Training and apprenticeship programs</li>
            <li>Benefits</li>
          </ul>
          
          <p>The Equal Employment Opportunity Commission (EEOC) enforces these laws and handles discrimination complaints.</p>
        `
      },
      {
        id: 'harassment',
        title: 'Harassment & Hostile Work Environment',
        content: `
          <p>Workplace harassment is a form of discrimination that violates federal civil rights laws. Harassment becomes illegal when:</p>
          
          <ul>
            <li>Enduring offensive conduct becomes a condition of continued employment, or</li>
            <li>The conduct is severe or pervasive enough to create a work environment that a reasonable person would consider intimidating, hostile, or abusive</li>
          </ul>
          
          <p>Sexual harassment includes unwelcome sexual advances, requests for sexual favors, and other verbal or physical harassment of a sexual nature.</p>
          
          <p>If you're experiencing harassment:</p>
          <ol>
            <li>Check your employer's harassment policies</li>
            <li>Document all incidents (date, time, what happened, who was involved, witnesses)</li>
            <li>Report the harassment to your supervisor, HR department, or designated person</li>
            <li>If the situation isn't resolved, file a charge with the EEOC</li>
          </ol>
          
          <p>Employers have a responsibility to prevent and address harassment in the workplace.</p>
        `
      },
      {
        id: 'reasonable-accommodation',
        title: 'Reasonable Accommodations',
        content: `
          <p>Under the Americans with Disabilities Act (ADA) and Title VII (for religious practices), employers must provide reasonable accommodations to qualified employees, unless doing so would cause undue hardship.</p>
          
          <p>For disabilities, reasonable accommodations might include:</p>
          <ul>
            <li>Making facilities accessible</li>
            <li>Job restructuring or modified work schedules</li>
            <li>Acquiring or modifying equipment</li>
            <li>Providing qualified readers or interpreters</li>
            <li>Modifying training materials or policies</li>
          </ul>
          
          <p>For religious practices, accommodations might include:</p>
          <ul>
            <li>Flexible scheduling</li>
            <li>Voluntary shift substitutions or swaps</li>
            <li>Job reassignments</li>
            <li>Modifications to workplace policies or practices</li>
          </ul>
          
          <p>To request an accommodation, inform your employer of your needs. While no specific language is required, clearly explain the reason for the accommodation and what you need.</p>
        `
      }
    ]
  },
  {
    id: 'leave',
    title: 'Time Off & Leave',
    icon: <BriefcaseMedical className="h-6 w-6" />,
    description: 'Rights to various types of leave and time off',
    topics: [
      {
        id: 'fmla',
        title: 'Family and Medical Leave',
        content: `
          <p>The Family and Medical Leave Act (FMLA) provides eligible employees with up to 12 weeks of unpaid, job-protected leave per year for certain family and medical reasons.</p>
          
          <p>You may be eligible for FMLA leave if:</p>
          <ul>
            <li>You work for a covered employer (private employers with 50+ employees, public agencies, schools)</li>
            <li>You've worked for your employer for at least 12 months</li>
            <li>You've worked at least 1,250 hours during the 12 months before the leave</li>
            <li>You work at a location where the employer has 50+ employees within 75 miles</li>
          </ul>
          
          <p>FMLA leave can be taken for:</p>
          <ul>
            <li>Birth and care of a newborn child</li>
            <li>Placement of a child for adoption or foster care</li>
            <li>Care for an immediate family member with a serious health condition</li>
            <li>Medical leave for your own serious health condition</li>
            <li>Qualifying exigencies related to a family member's military service</li>
          </ul>
          
          <p>Some states have more generous family and medical leave laws that provide additional rights.</p>
        `
      },
      {
        id: 'sick-leave',
        title: 'Sick Leave & Paid Time Off',
        content: `
          <p>While federal law doesn't require employers to provide paid sick leave, many states and localities have enacted laws requiring employers to provide paid sick leave to employees.</p>
          
          <p>Where required, paid sick leave typically can be used for:</p>
          <ul>
            <li>An employee's own illness, injury, or medical care</li>
            <li>Care for a family member who is ill</li>
            <li>Absences related to domestic violence, sexual assault, or stalking</li>
            <li>Public health emergencies</li>
          </ul>
          
          <p>The amount of sick leave varies by location, often accruing at a rate like 1 hour of sick leave for every 30 or 40 hours worked.</p>
          
          <p>Even in areas without required sick leave, employers must follow their established policies and employee contracts regarding paid time off.</p>
        `
      },
      {
        id: 'breaks',
        title: 'Breaks & Rest Periods',
        content: `
          <p>Federal law doesn't require employers to provide meal or rest breaks. However, if employers do offer short breaks (usually 5-20 minutes), federal law considers the breaks as compensable work hours.</p>
          
          <p>Many states have enacted laws requiring meal and rest breaks:</p>
          <ul>
            <li>Meal breaks: Typically 30 minutes or more for employees who work more than a certain number of hours (often 5-6 hours)</li>
            <li>Rest breaks: Often 10-15 minutes for each 4 hours worked</li>
          </ul>
          
          <p>Special break provisions often exist for:</p>
          <ul>
            <li>Nursing mothers: Federal law requires employers to provide reasonable break time and a private space for expressing breast milk</li>
            <li>Minors: Many states have enhanced break requirements for employees under 18</li>
            <li>Certain industries: Some industries have specific break requirements due to safety concerns</li>
          </ul>
          
          <p>Check your state's labor department website for specific break requirements in your location.</p>
        `
      }
    ]
  },
  {
    id: 'safety',
    title: 'Workplace Safety',
    icon: <ShieldCheck className="h-6 w-6" />,
    description: 'Rights to a safe and healthy workplace',
    topics: [
      {
        id: 'osha',
        title: 'Occupational Safety & Health',
        content: `
          <p>The Occupational Safety and Health Act (OSHA) requires employers to provide a workplace free from recognized hazards that are causing or likely to cause death or serious physical harm.</p>
          
          <p>Under OSHA, employees have the right to:</p>
          <ul>
            <li>Receive information and training about hazards, methods to prevent harm, and OSHA standards that apply to their workplace</li>
            <li>Request an OSHA inspection of their workplace if they believe there are violations of standards or serious hazards</li>
            <li>Use their rights without retaliation or discrimination</li>
            <li>Receive copies of tests done to find hazards in the workplace</li>
            <li>Review records of work-related injuries and illnesses</li>
          </ul>
          
          <p>If you have a safety concern:</p>
          <ol>
            <li>Bring the condition to your employer's attention</li>
            <li>If the condition isn't fixed, file a confidential complaint with OSHA</li>
            <li>Participate in the inspection when an OSHA compliance officer comes to the workplace</li>
          </ol>
          
          <p>OSHA protects workers who report safety violations from retaliation.</p>
        `
      },
      {
        id: 'workers-comp',
        title: 'Workers' Compensation',
        content: `
          <p>Workers' compensation provides benefits to employees who suffer work-related injuries or illnesses. Each state has its own workers' compensation system, but generally:</p>
          
          <p>Benefits typically include:</p>
          <ul>
            <li>Medical care for work-related injuries or illnesses</li>
            <li>Temporary disability benefits while unable to work</li>
            <li>Permanent disability benefits for lasting impairments</li>
            <li>Vocational rehabilitation services</li>
            <li>Death benefits for families of workers who die from work-related causes</li>
          </ul>
          
          <p>If you're injured at work:</p>
          <ol>
            <li>Report the injury to your employer immediately</li>
            <li>Seek medical treatment</li>
            <li>File a workers' compensation claim (your employer should provide the forms)</li>
            <li>Follow the doctor's treatment plan</li>
            <li>Keep records of all medical care and communications about your injury</li>
          </ol>
          
          <p>Workers' compensation is a "no-fault" system, meaning you don't need to prove the employer was negligent to receive benefits.</p>
        `
      },
      {
        id: 'right-to-refuse',
        title: 'Right to Refuse Dangerous Work',
        content: `
          <p>Under OSHA, you have the right to refuse to work when:</p>
          <ul>
            <li>You believe that you face an imminent danger of death or serious injury</li>
            <li>You have a reasonable belief that there is a real danger</li>
            <li>There isn't enough time to eliminate the danger through regular enforcement channels</li>
            <li>You have asked the employer to eliminate the danger and they have failed to do so</li>
          </ul>
          
          <p>Steps to take if you need to refuse dangerous work:</p>
          <ol>
            <li>Inform your supervisor about the hazardous condition</li>
            <li>State that you are willing to continue working if the dangerous condition is corrected or you are assigned other work that is safe</li>
            <li>Explain that you're refusing to work because you believe there is a risk of injury or illness</li>
            <li>If possible, stay at the workplace until your employer asks you to leave</li>
          </ol>
          
          <p>Contact OSHA immediately if you believe you've been wrongfully discharged or disciplined for refusing dangerous work.</p>
        `
      }
    ]
  },
  {
    id: 'termination',
    title: 'Termination & Rights',
    icon: <FileText className="h-6 w-6" />,
    description: 'Rights related to job loss and termination',
    topics: [
      {
        id: 'at-will',
        title: 'At-Will Employment',
        content: `
          <p>Most employment in the U.S. is "at-will," meaning either the employer or employee can terminate the relationship at any time, with or without notice, and with or without cause.</p>
          
          <p>However, there are important exceptions to at-will employment:</p>
          <ul>
            <li>Contracts: Employment contracts or collective bargaining agreements may limit an employer's ability to terminate employees</li>
            <li>Discrimination: Employers cannot fire employees based on protected characteristics (race, color, religion, sex, national origin, age, disability, or genetic information)</li>
            <li>Retaliation: Employers cannot fire employees for exercising workplace rights, like filing a discrimination complaint or reporting safety violations</li>
            <li>Public policy: Employers generally cannot fire employees for refusing to break the law or exercising legal rights</li>
          </ul>
          
          <p>Some states have additional protections limiting at-will employment. For example, some states recognize an implied covenant of good faith and fair dealing in employment relationships.</p>
        `
      },
      {
        id: 'unemployment',
        title: 'Unemployment Benefits',
        content: `
          <p>If you lose your job through no fault of your own, you may be eligible for unemployment insurance benefits. Eligibility requirements vary by state but generally include:</p>
          
          <ul>
            <li>You must have earned a minimum amount in wages during a "base period"</li>
            <li>You must be able and available for work</li>
            <li>You must be actively seeking employment</li>
            <li>You must have lost your job through no fault of your own (such as a layoff)</li>
          </ul>
          
          <p>If you're fired for misconduct or quit without good cause, you may be disqualified from receiving benefits, though the definition of misconduct and good cause varies by state.</p>
          
          <p>To claim unemployment benefits:</p>
          <ol>
            <li>File a claim with your state's unemployment agency as soon as possible after becoming unemployed</li>
            <li>Provide required information about your employment history and reason for separation</li>
            <li>Follow your state's procedures for weekly or biweekly certification of continued eligibility</li>
          </ol>
          
          <p>Benefits typically last for 26 weeks, though extensions may be available during periods of high unemployment.</p>
        `
      },
      {
        id: 'severance',
        title: 'Severance & Final Pay',
        content: `
          <p>Severance pay is not required by federal law unless an employer has promised it through a contract, policy, or collective bargaining agreement.</p>
          
          <p>If you're entitled to severance, the amount typically depends on your length of service with the employer. Severance packages may also include:</p>
          <ul>
            <li>Continued health insurance coverage</li>
            <li>Outplacement services</li>
            <li>References</li>
            <li>Other benefits</li>
          </ul>
          
          <p>Regarding final pay, most states have laws specifying when a departing employee must receive their final paycheck. Depending on the state, final pay may be due:</p>
          <ul>
            <li>On the next regular payday</li>
            <li>Immediately upon termination</li>
            <li>Within a specific timeframe (such as 72 hours)</li>
          </ul>
          
          <p>Final pay must include all earned wages, including accrued overtime. Some states also require payment of unused vacation time.</p>
        `
      }
    ]
  }
];

export default function EmploymentRights() {
  const [activeTab, setActiveTab] = useState('learn');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would search through the content
    console.log(`Searching for: ${searchTerm}`);
  };
  
  // Get selected category and topic details
  const categoryDetails = RIGHTS_CATEGORIES.find(c => c.id === (selectedCategory || RIGHTS_CATEGORIES[0].id));
  const topicDetails = categoryDetails?.topics.find(t => t.id === selectedTopic);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">Employment Rights</h2>
          <p className="text-muted-foreground">
            Understanding your rights and protections in the workplace
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="learn">
            <Scale className="h-4 w-4 mr-2" />
            Rights Library
          </TabsTrigger>
          <TabsTrigger value="tools">
            <FileText className="h-4 w-4 mr-2" />
            Resources & Tools
          </TabsTrigger>
          <TabsTrigger value="faq">
            <Info className="h-4 w-4 mr-2" />
            Common Questions
          </TabsTrigger>
        </TabsList>
        
        {/* Rights Library Tab */}
        <TabsContent value="learn" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workplace Rights Library</CardTitle>
              <CardDescription>
                Explore key workplace rights by category or search for specific topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search workplace rights..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Categories */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {RIGHTS_CATEGORIES.map(category => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setSelectedTopic(null);
                        }}
                      >
                        {category.icon}
                        <span className="ml-2">{category.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Topics */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Topics</h3>
                  <div className="space-y-2">
                    {categoryDetails?.topics.map(topic => (
                      <Card 
                        key={topic.id}
                        className={`cursor-pointer transition-all hover:border-primary ${selectedTopic === topic.id ? 'border-primary' : ''}`}
                        onClick={() => setSelectedTopic(topic.id)}
                      >
                        <CardContent className="p-4">
                          <p>{topic.title}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                
                {/* Topic Details */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Details</h3>
                  {topicDetails ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>{topicDetails.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div dangerouslySetInnerHTML={{ __html: topicDetails.content }} />
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <Scale className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Select a topic</h3>
                        <p className="text-muted-foreground">Choose a topic from the list to view detailed information.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Resources & Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employment Rights Resources</CardTitle>
              <CardDescription>
                Tools and resources to help you understand and exercise your workplace rights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Agency Resources</CardTitle>
                    <CardDescription>Federal agencies that enforce workplace rights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <Scale className="h-3 w-3" />
                        </div>
                        <span>U.S. Department of Labor</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCheck className="h-3 w-3" />
                        </div>
                        <span>Equal Employment Opportunity Commission</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <ShieldCheck className="h-3 w-3" />
                        </div>
                        <span>Occupational Safety and Health Administration</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <DollarSign className="h-3 w-3" />
                        </div>
                        <span>National Labor Relations Board</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View All Agencies</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Document Templates</CardTitle>
                    <CardDescription>Sample letters and documents for workplace issues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-3 w-3" />
                        </div>
                        <span>Workplace Accommodation Request</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-3 w-3" />
                        </div>
                        <span>FMLA Request Letter</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-3 w-3" />
                        </div>
                        <span>Complaint of Discrimination</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-3 w-3" />
                        </div>
                        <span>Wage Claim Letter</span>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Browse Templates</Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>State-Specific Rights</CardTitle>
                    <CardDescription>Find information specific to your state</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        States often provide additional employment protections beyond federal law. Select your state to see specific rights and resources.
                      </p>
                      <div className="relative">
                        <select className="w-full h-10 pl-3 pr-10 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                          <option value="">Select your state</option>
                          <option value="AL">Alabama</option>
                          <option value="AK">Alaska</option>
                          <option value="AZ">Arizona</option>
                          <option value="CA">California</option>
                          <option value="CO">Colorado</option>
                          <option value="FL">Florida</option>
                          <option value="NY">New York</option>
                          <option value="TX">Texas</option>
                          {/* Other states would be listed here */}
                        </select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View State Resources</Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Common questions about workplace rights and responsibilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Can my employer pay me less than minimum wage?</AccordionTrigger>
                  <AccordionContent>
                    <p>In most cases, no. The Fair Labor Standards Act (FLSA) requires employers to pay at least the federal minimum wage to covered employees.</p>
                    
                    <p className="mt-2">However, there are some exceptions:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Tipped employees may be paid less than the standard minimum wage as long as tips bring their total hourly earnings up to at least the minimum wage</li>
                      <li>Workers with certain disabilities may be paid less under specific certificates issued by the Department of Labor</li>
                      <li>Full-time students, student learners, and apprentices may be paid less in some circumstances</li>
                    </ul>
                    
                    <p className="mt-2">Many states have minimum wage rates higher than the federal minimum. In those cases, employers must pay the higher state minimum wage.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>What should I do if I'm experiencing workplace discrimination?</AccordionTrigger>
                  <AccordionContent>
                    <p>If you believe you're experiencing workplace discrimination based on a protected characteristic (race, color, religion, sex, national origin, age, disability, or genetic information), consider taking these steps:</p>
                    
                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                      <li>Document the discrimination. Keep detailed notes with dates, times, locations, people involved, witnesses, and what was said or done.</li>
                      <li>Check your company's policies. Review your employee handbook for the procedure to report discrimination.</li>
                      <li>Report internally. File a complaint with your supervisor, HR department, or the designated person according to company policy.</li>
                      <li>File with the EEOC. If the issue isn't resolved internally, you can file a discrimination charge with the Equal Employment Opportunity Commission (EEOC), generally within 180 days of the discriminatory act.</li>
                      <li>Consider legal advice. Consult with an employment attorney who specializes in discrimination cases.</li>
                    </ol>
                    
                    <p className="mt-2">Remember that it's illegal for your employer to retaliate against you for reporting discrimination or participating in an investigation or lawsuit.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Am I entitled to breaks during my workday?</AccordionTrigger>
                  <AccordionContent>
                    <p>Federal law does not require employers to provide meal or rest breaks. However, if your employer does offer short breaks (usually 5-20 minutes), federal law considers the breaks as compensable work hours that would be included in the sum of hours worked and considered for overtime calculations.</p>
                    
                    <p className="mt-2">Many states have enacted laws requiring meal and rest breaks:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Meal breaks are typically 30 minutes or more for employees who work more than a certain number of hours (often 5-6 hours)</li>
                      <li>Rest breaks are often 10-15 minutes for each 4 hours worked</li>
                    </ul>
                    
                    <p className="mt-2">Special provisions exist for nursing mothers. The Fair Labor Standards Act requires employers to provide reasonable break time and a private space (other than a bathroom) for expressing breast milk for one year after a child's birth.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Can my employer fire me without a reason?</AccordionTrigger>
                  <AccordionContent>
                    <p>In most states, employment is "at-will," meaning that an employer can terminate an employee at any time for any legal reason or for no reason at all, with or without notice. Similarly, an employee can quit at any time without notice.</p>
                    
                    <p className="mt-2">However, there are important exceptions to at-will employment:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Discrimination: Employers cannot fire employees based on protected characteristics such as race, color, religion, sex, national origin, age, disability, or genetic information</li>
                      <li>Retaliation: Employers cannot fire employees for exercising workplace rights, like filing a discrimination complaint or reporting safety violations</li>
                      <li>Contracts: If you have an employment contract or are covered by a collective bargaining agreement, the terms of the contract may limit when and how you can be terminated</li>
                      <li>Public policy: In many states, employers cannot fire employees for refusing to break the law or for exercising a legal right</li>
                    </ul>
                    
                    <p className="mt-2">Some states have additional protections limiting at-will employment. Montana, for example, requires employers to have "good cause" to terminate employees after a probationary period.</p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I request FMLA leave?</AccordionTrigger>
                  <AccordionContent>
                    <p>To request Family and Medical Leave Act (FMLA) leave, follow these steps:</p>
                    
                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                      <li>Determine your eligibility. You may be eligible if:
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>You work for a covered employer (private employers with 50+ employees, public agencies, schools)</li>
                          <li>You've worked for your employer for at least 12 months</li>
                          <li>You've worked at least 1,250 hours during the 12 months before the leave</li>
                          <li>You work at a location where the employer has 50+ employees within 75 miles</li>
                        </ul>
                      </li>
                      <li>Provide notice. When possible, give at least 30 days' notice for foreseeable leave (like for birth or planned medical treatment). For unforeseeable leave, notify your employer as soon as practicable.</li>
                      <li>Follow company procedures. Submit any forms required by your employer's FMLA policy.</li>
                      <li>Provide certification if requested. Your employer may request medical certification from a healthcare provider to verify the need for leave.</li>
                      <li>Specify your leave schedule. Clarify whether you need continuous leave or intermittent/reduced schedule leave.</li>
                    </ol>
                    
                    <p className="mt-2">After you request leave, your employer must notify you within 5 business days whether you're eligible for FMLA leave and provide information about your rights and responsibilities.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}