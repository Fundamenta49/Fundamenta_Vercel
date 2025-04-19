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
        content: "Federal law establishes a minimum wage that employers must pay their employees. As of 2023, the federal minimum wage is $7.25 per hour. However, many states and localities have enacted minimum wage rates higher than the federal level. When federal and state minimum wage laws differ, you're entitled to the higher rate. Some occupations may be exempt from minimum wage requirements."
      },
      {
        id: 'overtime',
        title: 'Overtime Pay',
        content: "Under the Fair Labor Standards Act (FLSA), eligible employees must receive overtime pay for hours worked over 40 in a workweek at a rate of at least 1.5 times their regular pay rate. Overtime is calculated based on a workweek (7 consecutive 24-hour periods). Certain employees are exempt from overtime requirements, including many salaried managers and professionals who meet specific criteria."
      },
      {
        id: 'wage-theft',
        title: 'Wage Theft Prevention',
        content: "Wage theft occurs when employers don't pay employees the full wages they've earned. Common forms include paying less than minimum wage, not paying overtime, requiring employees to work 'off the clock', making illegal deductions from wages, not paying for all hours worked, or misclassifying employees as independent contractors."
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
        content: "Federal laws prohibit employment discrimination based on race, color, national origin, sex (including pregnancy, sexual orientation, and gender identity), religion, age (40 or older), disability, and genetic information. These protections apply to all aspects of employment, including hiring and firing, compensation, transfer, promotion, and training."
      },
      {
        id: 'harassment',
        title: 'Harassment & Hostile Work Environment',
        content: "Workplace harassment is a form of discrimination that violates federal civil rights laws. Harassment becomes illegal when enduring offensive conduct becomes a condition of continued employment, or the conduct is severe or pervasive enough to create a work environment that a reasonable person would consider intimidating, hostile, or abusive."
      },
      {
        id: 'reasonable-accommodation',
        title: 'Reasonable Accommodations',
        content: "Under the Americans with Disabilities Act (ADA) and Title VII (for religious practices), employers must provide reasonable accommodations to qualified employees, unless doing so would cause undue hardship. Accommodations might include making facilities accessible, job restructuring, modified work schedules, or providing specialized equipment."
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
        content: "The Family and Medical Leave Act (FMLA) provides eligible employees with up to 12 weeks of unpaid, job-protected leave per year for certain family and medical reasons. You may be eligible if you work for a covered employer, have worked there for at least 12 months, and have worked at least 1,250 hours during the 12 months before the leave."
      },
      {
        id: 'sick-leave',
        title: 'Sick Leave & Paid Time Off',
        content: "While federal law doesn't require employers to provide paid sick leave, many states and localities have enacted laws requiring employers to provide paid sick leave to employees. Where required, paid sick leave typically can be used for an employee's own illness, injury, or medical care, or to care for a family member who is ill."
      },
      {
        id: 'breaks',
        title: 'Breaks & Rest Periods',
        content: "Federal law doesn't require employers to provide meal or rest breaks. However, if employers do offer short breaks (usually 5-20 minutes), federal law considers the breaks as compensable work hours. Many states have enacted laws requiring meal and rest breaks, typically 30 minutes or more for employees who work more than a certain number of hours."
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
        content: "The Occupational Safety and Health Act (OSHA) requires employers to provide a workplace free from recognized hazards that are causing or likely to cause death or serious physical harm. Under OSHA, employees have the right to receive information and training about hazards, request inspections, and use their rights without retaliation."
      },
      {
        id: 'workers-comp',
        title: 'Workers' Compensation',
        content: "Workers' compensation provides benefits to employees who suffer work-related injuries or illnesses. Benefits typically include medical care, temporary disability benefits while unable to work, permanent disability benefits for lasting impairments, vocational rehabilitation services, and death benefits for families of workers who die from work-related causes."
      },
      {
        id: 'right-to-refuse',
        title: 'Right to Refuse Dangerous Work',
        content: "Under OSHA, you have the right to refuse to work when you believe that you face an imminent danger of death or serious injury, you have a reasonable belief that there is a real danger, and there isn't enough time to eliminate the danger through regular enforcement channels."
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
        content: "Most employment in the U.S. is 'at-will,' meaning either the employer or employee can terminate the relationship at any time, with or without notice, and with or without cause. However, exceptions include employment contracts, discrimination laws, retaliation protections, and public policy considerations."
      },
      {
        id: 'unemployment',
        title: 'Unemployment Benefits',
        content: "If you lose your job through no fault of your own, you may be eligible for unemployment insurance benefits. Eligibility requirements vary by state but generally include having earned a minimum amount in wages during a 'base period', being able and available for work, actively seeking employment, and having lost your job through no fault of your own."
      },
      {
        id: 'severance',
        title: 'Severance & Final Pay',
        content: "Severance pay is not required by federal law unless an employer has promised it through a contract, policy, or collective bargaining agreement. Regarding final pay, most states have laws specifying when a departing employee must receive their final paycheck, which may be due on the next regular payday, immediately upon termination, or within a specific timeframe."
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
                        <p className="whitespace-pre-line">{topicDetails.content}</p>
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