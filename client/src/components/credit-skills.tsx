import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { YouTubeVideo } from "@/components/youtube-video";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CreditCard,
  Search,
  ExternalLink,
  Wallet,
  LineChart,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

// Updated with verified working video IDs and educational content
const CREDIT_TOPICS = [
  {
    id: "basics",
    title: "Credit Basics",
    description: "Understanding the fundamentals of credit",
    items: [
      {
        title: "What is Credit?",
        content: "Credit is your ability to borrow money with the promise to repay it later. Good credit enables you to borrow at better rates and terms.",
        videoId: "p4BXp7Q_vP0",
        source: "https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/"
      },
      {
        title: "Credit Score Factors",
        content: "Your credit score is influenced by payment history (35%), credit utilization (30%), length of credit history (15%), credit mix (10%), and new credit (10%).",
        videoId: "8_w6e8L-c9Y", // Replaced with a valid video ID
        source: "https://www.myfico.com/credit-education/whats-in-your-credit-score"
      },
      {
        title: "Credit Reports",
        content: "A credit report is a detailed record of your credit history, including loans, credit cards, and payment history. You're entitled to one free report annually from each bureau.",
        videoId: "7RzfNZEYkqY",
        source: "https://www.annualcreditreport.com/"
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
        content: "A secured card requires a deposit and is an excellent way to start building credit with minimal risk.",
        videoId: "4Htc8ema_y4",
        source: "https://www.experian.com/blogs/ask-experian/credit-education/improving-credit/building-credit/"
      },
      {
        title: "Authorized User",
        content: "Being added as an authorized user on someone's credit card can help build your credit history.",
        videoId: "XGvHPVUfZ_Y",
        source: "https://www.experian.com/blogs/ask-experian/credit-education/building-credit/authorized-user/"
      },
      {
        title: "Credit-Builder Loans",
        content: "These loans are specifically designed to help build credit by reporting payments to credit bureaus.",
        videoId: "Vhh_GeBPOhs",
        source: "https://www.nerdwallet.com/article/loans/personal-loans/credit-builder-loans"
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
        content: "Always pay at least the minimum payment on time. Set up automatic payments to avoid missing due dates.",
        videoId: "zYocum3D9H8",
        source: "https://www.myfico.com/credit-education/improve-your-credit-score"
      },
      {
        title: "Credit Utilization",
        content: "Keep your credit utilization below 30%. This means using less than 30% of your available credit limit.",
        videoId: "hEM8SjzHnG8",
        source: "https://www.experian.com/blogs/ask-experian/credit-education/score-basics/credit-utilization-rate/"
      },
      {
        title: "Regular Monitoring",
        content: "Check your credit report regularly for errors and signs of identity theft. Dispute any inaccuracies promptly.",
        videoId: "QC_c5bHEc8c",
        source: "https://www.consumer.ftc.gov/articles/0155-free-credit-reports"
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
        content: "Contact creditors to negotiate removal of late payments or set up payment plans for outstanding debts.",
        videoId: "SXL_0c4VA9M",
        source: "https://www.ftc.gov/credit"
      },
      {
        title: "Debt Management",
        content: "Consider debt consolidation or credit counseling services to help manage and reduce debt.",
        videoId: "vz4thZOqCd4",
        source: "https://www.nfcc.org/resources/blog/debt-management-programs/"
      },
      {
        title: "Recovery Timeline",
        content: "Most negative items stay on your credit report for 7 years. Bankruptcy can remain for up to 10 years.",
        videoId: "5WXyP_EJR8Y",
        source: "https://www.equifax.com/personal/education/credit/report/how-long-does-information-stay-on-credit-report/"
      }
    ]
  }
];

export default function CreditSkills() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [validatedVideos, setValidatedVideos] = useState({});

  useEffect(() => {
    const validateVideos = async () => {
      const videoIds = CREDIT_TOPICS.flatMap(topic => topic.items.map(item => item.videoId)).filter(id => id);
      const validated = {};
      const promises = videoIds.map(async (videoId) => {
        try {
          const response = await fetch(`/api/youtube/validate?videoId=${videoId}`); // Updated API endpoint
          const data = await response.json();
          validated[videoId] = data.isValid;
        } catch (error) {
          console.error('Error validating video:', error);
          validated[videoId] = false;
        }
      });
      await Promise.all(promises);
      setValidatedVideos(validated);
    };
    validateVideos();
  }, []);


  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    const results = CREDIT_TOPICS.flatMap(topic =>
      topic.items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      ).map(item => ({
        ...item,
        topic: topic.title
      }))
    );

    setSearchResults(results);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <CreditCard className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-800">
          Understanding and managing your credit is crucial for financial health. Search for specific topics or browse our comprehensive guide.
        </AlertDescription>
      </Alert>

      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search for credit-related topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {CREDIT_TOPICS.map((topic) => (
          <Card key={topic.id} className="hover:shadow-md transition-shadow">
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
                      <div className="space-y-4">
                        <p className="text-muted-foreground">{item.content}</p>
                        {item.videoId && validatedVideos[item.videoId] ? (
                          <>
                            <YouTubeVideo
                              videoId={item.videoId.startsWith('http') ?
                                item.videoId.split('v=')[1]?.split('&')[0] || item.videoId :
                                item.videoId}
                              title={`${item.title} - Video Tutorial`} // Added title prop
                            />
                            {item.source && (
                              <div className="mt-2 text-xs text-muted-foreground">
                                <a
                                  href={item.source}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                                >
                                  Source <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                          </>
                        )}
                        <Button
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => window.open(item.source, '_blank')}
                        >
                          Learn More
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Search Results</DialogTitle>
            <DialogDescription>
              Found {searchResults.length} matches for "{searchQuery}"
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[80vh]">
            <div className="space-y-6">
              {searchResults.map((result, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{result.title}</CardTitle>
                    <CardDescription>From: {result.topic}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{result.content}</p>
                    <div className="space-y-4">
                      {result.videoId && validatedVideos[result.videoId] ? (
                        <>
                          <YouTubeVideo
                            videoId={result.videoId.startsWith('http') ?
                              result.videoId.split('v=')[1]?.split('&')[0] || result.videoId :
                              result.videoId}
                            title={`${result.title} - Video Tutorial`} // Added title prop
                          />
                          {result.source && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              <a
                                href={result.source}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-500 hover:text-blue-700"
                              >
                                Source <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                        </>
                      )}
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(result.source, '_blank')}
                      >
                        View Source
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}