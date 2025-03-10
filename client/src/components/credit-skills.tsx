import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, CreditCard, AlertTriangle, Wallet, LineChart, Search, ExternalLink } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface YouTubeVideoDetails {
  id: string;
  title: string;
  thumbnail: string;
  error?: boolean;
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
        videoId: "1i8fms6EIxM",
        source: "https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/"
      },
      {
        title: "Credit Score Factors",
        content: "Your credit score is influenced by payment history (35%), credit utilization (30%), length of credit history (15%), credit mix (10%), and new credit (10%).",
        videoId: "HJuSGi8uPbM",
        source: "https://www.myfico.com/credit-education/whats-in-your-credit-score"
      },
      {
        title: "Credit Reports",
        content: "A credit report is a detailed record of your credit history, including loans, credit cards, and payment history. You're entitled to one free report annually from each bureau.",
        videoId: "v_DoK37qHBE",
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
        videoId: "pYYE0N2_LF4",
        source: "https://www.experian.com/blogs/ask-experian/credit-education/improving-credit/building-credit/"
      },
      {
        title: "Authorized User",
        content: "Being added as an authorized user on someone's credit card can help build your credit history.",
        videoId: "s0Zf9ZxBuXg",
        source: "https://www.experian.com/blogs/ask-experian/credit-education/building-credit/authorized-user/"
      },
      {
        title: "Credit-Builder Loans",
        content: "These loans are specifically designed to help build credit by reporting payments to credit bureaus.",
        videoId: "YHEnvKpQBLM",
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
        videoId: "L5TqQVumq8s",
        source: "https://www.myfico.com/credit-education/improve-your-credit-score"
      },
      {
        title: "Credit Utilization",
        content: "Keep your credit utilization below 30%. This means using less than 30% of your available credit limit.",
        videoId: "dQFt3UQ9XHY",
        source: "https://www.experian.com/blogs/ask-experian/credit-education/score-basics/credit-utilization-rate/"
      },
      {
        title: "Regular Monitoring",
        content: "Check your credit report regularly for errors and signs of identity theft. Dispute any inaccuracies promptly.",
        videoId: "j9PG2-qPpig",
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
        videoId: "h6NKmP7fAfQ",
        source: "https://www.ftc.gov/credit"
      },
      {
        title: "Debt Management",
        content: "Consider debt consolidation or credit counseling services to help manage and reduce debt.",
        videoId: "YT9Sw_0oP0w",
        source: "https://www.nfcc.org/resources/blog/debt-management-programs/"
      },
      {
        title: "Recovery Timeline",
        content: "Most negative items stay on your credit report for 7 years. Bankruptcy can remain for up to 10 years.",
        videoId: "gQFHQvO8GGE",
        source: "https://www.equifax.com/personal/education/credit/report/how-long-does-information-stay-on-credit-report/"
      }
    ]
  }
];

const TEST_VIDEO_ID = "jNQXAC9IVRw"; // This is a known working YouTube video ID

export default function CreditSkills() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [videoDetails, setVideoDetails] = useState<Record<string, YouTubeVideoDetails>>({});

  useEffect(() => {
    const allVideoIds = CREDIT_TOPICS.flatMap(topic =>
      topic.items.map(item => item.videoId)
    );

    const uniqueVideoIds = [...new Set(allVideoIds)];
    uniqueVideoIds.forEach(validateVideo);
  }, []);

  useEffect(() => {
    // Test the YouTube API integration
    const testYouTubeAPI = async () => {
      try {
        console.log('Testing YouTube API with video ID:', TEST_VIDEO_ID);
        const response = await fetch(`/api/youtube/validate?videoId=${TEST_VIDEO_ID}`);
        const data = await response.json();
        console.log('YouTube API test response:', data);

        if (data.error) {
          console.error('YouTube API test failed:', data.message);
        } else {
          console.log('YouTube API test successful');
        }
      } catch (error) {
        console.error('YouTube API test error:', error);
      }
    };

    testYouTubeAPI();
  }, []);

  const validateVideo = async (videoId: string) => {
    try {
      console.log(`Validating video ID: ${videoId}`);
      const response = await fetch(`/api/youtube/validate?videoId=${videoId}`);
      const data = await response.json();
      console.log(`Validation response for ${videoId}:`, data);

      if (data.error) {
        console.warn(`Video ${videoId} validation failed:`, data.message);
        throw new Error(data.message);
      }

      setVideoDetails(prev => ({
        ...prev,
        [videoId]: {
          id: videoId,
          title: data.title,
          thumbnail: data.thumbnail,
          error: false
        }
      }));
    } catch (error) {
      console.error(`Error validating video ${videoId}:`, error);
      setVideoDetails(prev => ({
        ...prev,
        [videoId]: {
          id: videoId,
          title: '',
          thumbnail: '',
          error: true
        }
      }));
    }
  };

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


  const renderVideoContent = (videoId: string, title: string) => {
    const videoDetail = videoDetails[videoId];

    if (!videoDetail || videoDetail.error) {
      return (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-800">
            Video tutorial is currently unavailable. Please check the source link below for more information.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="space-y-4">
        <div className="pt-4">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={videoDetail.title || title}
            className="w-full aspect-video rounded-lg"
            allowFullScreen
            onError={() => {
              setVideoDetails(prev => ({
                ...prev,
                [videoId]: { ...prev[videoId], error: true }
              }));
            }}
          />
        </div>
        {videoDetail.title && (
          <p className="text-sm text-muted-foreground">{videoDetail.title}</p>
        )}
      </div>
    );
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
                        {renderVideoContent(item.videoId, item.title)}
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
                      {renderVideoContent(result.videoId, result.title)}
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