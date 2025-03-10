import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, CreditCard, AlertTriangle, Wallet, LineChart } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CREDIT_TOPICS = [
  {
    id: "basics",
    title: "Credit Basics",
    description: "Understanding the fundamentals of credit",
    items: [
      {
        title: "What is Credit?",
        content: "Credit is your ability to borrow money with the promise to repay it later. Good credit enables you to borrow at better rates and terms."
      },
      {
        title: "Credit Score Factors",
        content: "Your credit score is influenced by payment history (35%), credit utilization (30%), length of credit history (15%), credit mix (10%), and new credit (10%)."
      },
      {
        title: "Credit Reports",
        content: "A credit report is a detailed record of your credit history, including loans, credit cards, and payment history. You're entitled to one free report annually from each bureau."
      }
    ]
  },
  {
    id: "building",
    title: "Building Credit",
    description: "Steps to establish and improve credit",
    items: [
      {
        title: "Secured Credit Cards",
        content: "A secured card requires a deposit and is an excellent way to start building credit with minimal risk."
      },
      {
        title: "Authorized User",
        content: "Being added as an authorized user on someone's credit card can help build your credit history."
      },
      {
        title: "Credit-Builder Loans",
        content: "These loans are specifically designed to help build credit by reporting payments to credit bureaus."
      }
    ]
  },
  {
    id: "maintenance",
    title: "Credit Maintenance",
    description: "Tips for maintaining good credit",
    items: [
      {
        title: "Payment Strategies",
        content: "Always pay at least the minimum payment on time. Set up automatic payments to avoid missing due dates."
      },
      {
        title: "Credit Utilization",
        content: "Keep your credit utilization below 30%. This means using less than 30% of your available credit limit."
      },
      {
        title: "Regular Monitoring",
        content: "Check your credit report regularly for errors and signs of identity theft. Dispute any inaccuracies promptly."
      }
    ]
  },
  {
    id: "repair",
    title: "Credit Repair",
    description: "Fixing and improving bad credit",
    items: [
      {
        title: "Addressing Late Payments",
        content: "Contact creditors to negotiate removal of late payments or set up payment plans for outstanding debts."
      },
      {
        title: "Debt Management",
        content: "Consider debt consolidation or credit counseling services to help manage and reduce debt."
      },
      {
        title: "Recovery Timeline",
        content: "Most negative items stay on your credit report for 7 years. Bankruptcy can remain for up to 10 years."
      }
    ]
  }
];

export default function CreditSkills() {
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <CreditCard className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-800">
          Understanding and managing your credit is crucial for financial health. Here's your guide to mastering credit skills.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {CREDIT_TOPICS.map((topic) => (
          <Card key={topic.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {topic.id === "basics" && <Wallet className="h-5 w-5 text-blue-500" />}
                {topic.id === "building" && <LineChart className="h-5 w-5 text-green-500" />}
                {topic.id === "maintenance" && <DollarSign className="h-5 w-5 text-purple-500" />}
                {topic.id === "repair" && <AlertTriangle className="h-5 w-5 text-orange-500" />}
                {topic.title}
              </CardTitle>
              <CardDescription>{topic.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {topic.items.map((item, index) => (
                  <AccordionItem key={index} value={`${topic.id}-${index}`}>
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{item.content}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
