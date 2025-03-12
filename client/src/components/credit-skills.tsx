import React, { useState, useEffect } from "react";
import { Search, AlertTriangle, CreditCard, Wallet, LineChart, DollarSign, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { YouTubeVideo } from "./youtube-video"; // Assuming this component exists


export default function CreditSkills() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [videoSearchResults, setVideoSearchResults] = useState<{[key: string]: any}>({});
  const [isLoading, setIsLoading] = useState(false);


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

  // Search for videos related to topic if not provided
  useEffect(() => {
    // We're now using hardcoded videoIds for all items, so this effect is no longer needed
    // If we want to add dynamic video search in the future, we can uncomment this
    /*
    const fetchVideos = async () => {
      const topicsWithoutVideos = CREDIT_TOPICS.flatMap(topic => topic.items).filter(item => !item.videoId);
      if (topicsWithoutVideos.length === 0) return;

      setIsLoading(true);
      const results: {[key: string]: any} = {};

      for (const item of topicsWithoutVideos) {
        try {
          const query = `${item.title} finance credit guide`;
          const response = await fetch(`/api/youtube-search?q=${encodeURIComponent(query)}`);
          const data = await response.json();

          if (data.items && data.items.length > 0) {
            results[item.title] = data.items[0].id.videoId;
          }
        } catch (error) {
          console.error(`Error fetching video for ${item.title}:`, error);
        }
      }

      setVideoSearchResults(results);
      setIsLoading(false);
    };

    fetchVideos();
    */
  }, []);

  const renderItems = (items: any[]) => {
    return items.map((item, index) => (
      <AccordionItem key={index} value={`${item.title}`}>
        <AccordionTrigger>{item.title}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">{item.content}</p>
            {item.videoId && (
              <div className="aspect-video w-full mb-4">
                <YouTubeVideo
                  videoId={item.videoId}
                  title={item.title}
                  className="w-full"
                />
              </div>
            )}
            {item.source && (
              <div className="text-sm text-muted-foreground">
                <a 
                  href={item.source} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                >
                  Learn more
                </a>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    ));
  };
                    Video unavailable. <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.title + " credit guide")}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Search for alternatives</a>
                  </p>
                </div>
              </div>
            )}
            {!item.videoId && !videoSearchResults[item.title] && isLoading && (
              <div className="aspect-video w-full flex items-center justify-center bg-gray-100 rounded-md mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-gray-500">Searching for relevant videos...</span>
              </div>
            )}
            {item.source && (
              <div className="text-sm text-muted-foreground">
                <a
                  href={item.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  View Source <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    ));
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
                {renderItems(topic.items)}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {searchResults.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {searchResults.map((result, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{result.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{result.content}</p>
                  {result.videoId ? (
                    <div className="aspect-video w-full">
                      <iframe
                        src={`https://www.youtube.com/embed/${result.videoId}`}
                        title={result.title}
                        className="w-full h-full rounded-md"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogTitle>Search Results for "{searchQuery}"</DialogTitle>
          <div className="space-y-6">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <Card key={index} className="hover:shadow-sm transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{result.title}</CardTitle>
                    <CardDescription>{result.topic}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground">{result.content}</p>
                    {result.videoId && (
                      <div className="aspect-video w-full">
                        <iframe
                          src={`https://www.youtube.com/embed/${result.videoId}`}
                          title={result.title}
                          className="w-full h-full"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center">
                <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

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
        videoId: "8_w6e8L-c9Y",
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
        videoId: "EOHezlcnfF0",
        source: "https://www.experian.com/blogs/ask-experian/credit-education/improving-credit/building-credit/"
      },
      {
        title: "Authorized User",
        content: "Being added as an authorized user on someone's credit card can help build your credit history.",
        videoId: "4Htc8ema_y4",
        source: "https://www.experian.com/blogs/ask-experian/credit-education/building-credit/authorized-user/"
      },
      {
        title: "Credit-Builder Loans",
        content: "These loans are specifically designed to help build credit by reporting payments to credit bureaus.",
        videoId: "rKLnWyEJ8vM",
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