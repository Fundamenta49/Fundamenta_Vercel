import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  BookOpen, 
  Calculator, 
  CreditCard, 
  LineChart, 
  Wallet, 
  DollarSign, 
  PiggyBank, 
  BarChart4, 
  CheckCircle,
  HelpCircle,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface ModuleProps {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

export default function FinancialLiteracyCourse() {
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("learn");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Course modules with content
  const COURSE_MODULES: ModuleProps[] = [
    {
      id: "fundamentals",
      title: "Financial Fundamentals",
      description: "Understanding the basics of personal finance",
      icon: Wallet,
      content: (
        <div className="space-y-4">
          <p>
            Financial literacy is the ability to understand and effectively use various financial skills, including personal financial management, budgeting, and investing. This module will introduce you to the fundamental concepts of personal finance.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Why Financial Literacy Matters</h3>
          <p>
            Being financially literate helps you to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Make informed financial decisions</li>
            <li>Manage debt effectively</li>
            <li>Plan for both short and long-term financial goals</li>
            <li>Prepare for emergencies and unexpected expenses</li>
            <li>Build wealth and secure your financial future</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">Core Financial Concepts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                  Income
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Money received through wages, investments, or other sources.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Calculator className="h-4 w-4 mr-2 text-green-600" />
                  Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Money spent on needs, wants, and financial obligations.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <PiggyBank className="h-4 w-4 mr-2 text-green-600" />
                  Savings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Money set aside for future use or emergencies.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <BarChart4 className="h-4 w-4 mr-2 text-green-600" />
                  Investments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Assets acquired with the goal of generating income or appreciation.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "budgeting",
      title: "Budgeting Basics",
      description: "Learn to create and maintain a personal budget",
      icon: Calculator,
      content: (
        <div className="space-y-4">
          <p>
            A budget is a plan that helps you track your income and expenses over a specific period. 
            Creating and maintaining a budget is one of the most important financial skills you can develop.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">The 50/30/20 Rule</h3>
          <p>
            One popular budgeting framework is the 50/30/20 rule, which suggests allocating your after-tax income as follows:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">50% for Needs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Essentials like housing, utilities, groceries, transportation, and minimum debt payments.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">30% for Wants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Non-essentials like dining out, entertainment, hobbies, and subscriptions.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">20% for Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Savings, investments, and additional debt payments beyond the minimum.</p>
              </CardContent>
            </Card>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Steps to Create a Budget</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong>Track your income:</strong> Calculate your total monthly income after taxes.</li>
            <li><strong>List all expenses:</strong> Record all your spending for at least one month.</li>
            <li><strong>Categorize expenses:</strong> Group expenses into needs, wants, and savings.</li>
            <li><strong>Set goals:</strong> Establish specific financial goals for the short and long term.</li>
            <li><strong>Create the budget:</strong> Allocate your income according to your priorities and goals.</li>
            <li><strong>Adjust as needed:</strong> Review and refine your budget regularly.</li>
          </ol>
        </div>
      ),
    },
    {
      id: "credit",
      title: "Understanding Credit",
      description: "Learn about credit scores, loans, and managing debt",
      icon: CreditCard,
      content: (
        <div className="space-y-4">
          <p>
            Credit plays a significant role in your financial life, affecting everything from loan approval to interest rates. 
            Understanding how credit works is essential for making informed financial decisions.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Credit Scores Explained</h3>
          <p>
            A credit score is a three-digit number that represents your creditworthiness. The most common scoring models range from 300 to 850, with higher scores indicating lower credit risk.
          </p>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Factors Affecting Your Credit Score</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li><strong>Payment history (35%):</strong> Whether you've paid on time</li>
                  <li><strong>Credit utilization (30%):</strong> How much of your available credit you're using</li>
                  <li><strong>Length of credit history (15%):</strong> How long you've had credit</li>
                  <li><strong>Credit mix (10%):</strong> The variety of credit accounts you have</li>
                  <li><strong>New credit (10%):</strong> Recently opened accounts and credit inquiries</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Credit Score Ranges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <Badge className="bg-red-500">300-579</Badge>
                  <span className="ml-2">Poor</span>
                </div>
                <div>
                  <Badge className="bg-orange-500">580-669</Badge>
                  <span className="ml-2">Fair</span>
                </div>
                <div>
                  <Badge className="bg-yellow-500">670-739</Badge>
                  <span className="ml-2">Good</span>
                </div>
                <div>
                  <Badge className="bg-green-500">740-799</Badge>
                  <span className="ml-2">Very Good</span>
                </div>
                <div>
                  <Badge className="bg-emerald-500">800-850</Badge>
                  <span className="ml-2">Excellent</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <h3 className="text-lg font-semibold mt-6">Practical Tips for Building Credit</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Pay bills on time:</strong> Set up automatic payments or reminders to avoid late payments.</li>
            <li><strong>Keep credit card balances low:</strong> Aim to use less than 30% of your available credit.</li>
            <li><strong>Don't close old accounts:</strong> Length of credit history matters.</li>
            <li><strong>Limit new credit applications:</strong> Each application can temporarily lower your score.</li>
            <li><strong>Check your credit reports regularly:</strong> Look for errors and dispute them if necessary.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "investing",
      title: "Investing Basics",
      description: "Introduction to investing concepts and strategies",
      icon: LineChart,
      content: (
        <div className="space-y-4">
          <p>
            Investing is how you make your money work for you, potentially growing your wealth over time. 
            While investing involves risk, understanding the basics can help you make informed decisions.
          </p>
          
          <h3 className="text-lg font-semibold mt-6">Key Investment Principles</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Start early:</strong> Time in the market is one of the most powerful factors due to compound growth.</li>
            <li><strong>Diversify:</strong> Spread your investments across different asset classes to reduce risk.</li>
            <li><strong>Understand risk vs. return:</strong> Higher potential returns typically come with higher risk.</li>
            <li><strong>Invest regularly:</strong> Consistent investing over time can help smooth out market fluctuations.</li>
            <li><strong>Keep costs low:</strong> Investment fees can significantly impact your returns over time.</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-6">Common Investment Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Stocks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Ownership shares in individual companies. Higher potential return but also higher risk and volatility.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Bonds</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Loans to companies or governments. Generally lower risk and return than stocks, providing regular income.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Mutual Funds</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Professionally managed pools of stocks, bonds, or other securities. Provides diversification and professional management.</p>
              </CardContent>
            </Card>
            
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">ETFs (Exchange-Traded Funds)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Similar to mutual funds but traded like stocks. Often have lower fees and more tax efficiency.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
  ];

  // Render the selected module content
  // Scroll handling functions
  useEffect(() => {
    const handleScroll = () => {
      // Show/hide scroll top button
      setShowScrollTop(window.scrollY > 300);
      
      // Update active section based on scroll position
      const scrollPosition = window.scrollY + 120; // Adding offset for header
      
      // Find which section is currently in view
      let currentSection = null;
      Object.entries(sectionRefs.current).forEach(([id, ref]) => {
        if (ref && ref.offsetTop <= scrollPosition && 
            ref.offsetTop + ref.offsetHeight > scrollPosition) {
          currentSection = id;
        }
      });
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection]);
  
  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = sectionId === 'credit' ? 120 : 80; // Additional offset for credit section due to sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const renderModuleContent = (moduleId: string) => {
    const module = COURSE_MODULES.find((m) => m.id === moduleId);
    if (!module) return null;
    
    const Icon = module.icon;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center mb-4">
          <Icon className="h-6 w-6 mr-2 text-green-600" />
          <h2 className="text-xl font-semibold">{module.title}</h2>
        </div>
        {module.content}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-6xl relative">
      {/* Floating scroll to top button */}
      {showScrollTop && (
        <Button
          variant="secondary"
          size="sm"
          className="fixed bottom-6 right-6 h-10 w-10 rounded-full shadow-md bg-emerald-600 hover:bg-emerald-700 text-white p-0 z-50 flex items-center justify-center"
          onClick={scrollToTop}
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
      <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/learning')}
          className="p-2 h-auto sm:p-3"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span className="text-sm">Back</span>
        </Button>
        
        <h1 className="text-xl sm:text-2xl font-bold flex items-center">
          <BookOpen className="h-5 w-5 mr-2 text-green-500" />
          Financial Literacy
        </h1>
      </div>

      <Tabs defaultValue="learn" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-10 sm:h-12 bg-gray-100 p-1 sm:p-1.5 rounded-full w-full grid grid-cols-2 max-w-full sm:max-w-md mx-auto">
          <TabsTrigger 
            value="learn" 
            className="rounded-full text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-800 data-[state=active]:shadow-sm"
          >
            <BookOpen className="h-3 w-3 mr-1 sm:h-4 sm:w-4 inline-block" />
            Learn
          </TabsTrigger>
          <TabsTrigger 
            value="practice" 
            className="rounded-full text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-800 data-[state=active]:shadow-sm"
          >
            <CheckCircle className="h-3 w-3 mr-1 sm:h-4 sm:w-4 inline-block" />
            Practice
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="learn" className="mt-6">
          <Card className="mb-6 border-0 shadow-sm rounded-2xl overflow-hidden">
            {/* iOS-style gradient header bar with finance theme colors */}
            <div className="h-1.5 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>
            
            <CardHeader className="p-3 sm:p-6 border-b border-gray-100 bg-white">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-emerald-600 flex-shrink-0" />
                <span>Introduction to Financial Literacy</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Master essential financial concepts to build a secure future
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-3 sm:p-6 bg-gray-50">
              <p className="mb-3 sm:mb-4 text-sm sm:text-base">
                Financial literacy provides the knowledge and skills necessary to make informed and effective decisions 
                about money management. Whether you're just starting your financial journey or looking to strengthen 
                your financial foundation, this course will help you develop the skills to navigate today's complex 
                financial landscape.
              </p>
              <p className="mb-0 sm:mb-4 text-sm sm:text-base">
                From creating a budget to understanding credit to planning for the future, you'll learn practical 
                strategies you can implement immediately to improve your financial well-being.
              </p>
            </CardContent>
          </Card>
          
          {/* Course modules as cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {COURSE_MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <Card key={module.id} className="cursor-pointer border-0 shadow-sm rounded-2xl overflow-hidden hover:shadow-md transition-all" onClick={() => scrollToSection(module.id)}>
                  {/* Thin gradient accent line - slightly different for each module to create visual variety */}
                  <div className={`h-1 ${
                    module.id === 'fundamentals' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                    module.id === 'budgeting' ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
                    module.id === 'credit' ? 'bg-gradient-to-r from-teal-400 to-green-500' :
                    'bg-gradient-to-r from-green-500 to-teal-400'
                  }`}></div>
                  
                  <CardHeader className="p-3 sm:p-4 pb-1 sm:pb-2 border-b border-gray-100 bg-white">
                    <CardTitle className="text-sm sm:text-base flex items-center">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{module.title}</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">{module.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-3 sm:p-4 pb-1 sm:pb-2 bg-gray-50">
                    <p className="text-xs sm:text-sm line-clamp-2">
                      {typeof module.content === 'string' 
                        ? module.content 
                        : 'Explore key concepts and practical applications.'}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="p-3 sm:p-4 pt-1 sm:pt-2 pb-3 sm:pb-4 bg-gray-50">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full h-8 text-xs sm:text-sm rounded-full hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the card click
                        scrollToSection(module.id);
                      }}
                    >
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          
          {/* Module content sections with ref capture */}
          {COURSE_MODULES.map((module) => (
            <div 
              key={module.id} 
              id={module.id} 
              className="mt-10 pt-6 border-t"
              ref={el => sectionRefs.current[module.id] = el}
            >
              {/* Display sticky header for active module */}
              {module.id === 'credit' && (
                <div className={`sticky top-0 z-50 transition-all duration-300 bg-white shadow-sm 
                  ${activeSection === 'credit' ? 'opacity-100 -mx-4 px-4 py-3 border-b mb-4' : 'opacity-0 py-0 h-0 overflow-hidden'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-emerald-600" />
                      <h3 className="text-lg font-medium">Credit</h3>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2 hover:bg-emerald-50 hover:text-emerald-700"
                      onClick={() => scrollToTop()}
                    >
                      <ChevronUp className="h-4 w-4 mr-1" />
                      <span className="text-xs">Top</span>
                    </Button>
                  </div>
                </div>
              )}
              <div className={activeSection === 'credit' && module.id === 'credit' ? 'pt-2' : ''}>
                {renderModuleContent(module.id)}
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="practice" className="mt-6">
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
            {/* iOS-style gradient header bar with finance theme colors */}
            <div className="h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-green-400"></div>
            
            <CardHeader className="p-3 sm:p-6 border-b border-gray-100 bg-white">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-emerald-600 flex-shrink-0" />
                <span>Financial Literacy Quiz</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Test your knowledge of key financial concepts
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-3 sm:p-6 bg-gray-50">
              <p className="mb-4 sm:mb-6 text-sm sm:text-base">
                Take this quiz to assess your understanding of financial literacy concepts. 
                Each question has one correct answer. Choose the best option for each question.
              </p>
              
              {/* Show Learning Coach button on all screens but style for mobile */}
              <div className="mt-4 sm:mt-8">
                <Button className="w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm rounded-full px-4 sm:px-6 bg-emerald-600 hover:bg-emerald-700">
                  <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                  Ask Learning Coach
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}