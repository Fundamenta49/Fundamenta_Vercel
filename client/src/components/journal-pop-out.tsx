import { useState } from "react";
import {
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogTrigger,
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
  FullScreenDialogFooter,
} from "@/components/ui/full-screen-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Image as ImageIcon,
  Calendar,
  Smile,
  Clock,
  Camera,
  Mail,
  Sparkles,
  Heart,
  Brain,
  Book,
  Plus,
  ArrowLeft,
  Save,
  Edit,
  Trash,
  PanelLeftOpen,
  PanelRightOpen,
} from "lucide-react";
import { format } from "date-fns";
import { analyzeJournalEntry, analyzeMoodTrends, type JournalAnalysis } from "@/lib/journal-analysis";
import WordCloud from "./word-cloud";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  imageUrl?: string;
  timestamp: string;
  futureEmail?: {
    date: string;
    email: string;
  };
  prompt?: string;
  category?: string;
}

const moods = [
  { emoji: "😊", label: "Happy" },
  { emoji: "😌", label: "Calm" },
  { emoji: "😔", label: "Sad" },
  { emoji: "😤", label: "Frustrated" },
  { emoji: "😴", label: "Tired" },
  { emoji: "🤔", label: "Thoughtful" },
  { emoji: "😰", label: "Anxious" },
  { emoji: "🌟", label: "Inspired" },
];

const journalPrompts = {
  daily: [
    "What's one thing you're grateful for today?",
    "What made you smile today?",
    "What's one small win you had today?",
    "What's something you're looking forward to?",
    "Who made a positive impact on your day?",
  ],
  cbt: [
    "Describe a situation that challenged you today. What thoughts and feelings came up?",
    "What evidence supports and challenges your thoughts about this situation?",
    "How else could you look at this situation?",
    "What would you tell a friend in this situation?",
    "What's a more balanced way to think about this?",
  ],
  healing: [
    "What makes you feel safe and supported?",
    "Write about a moment when you felt strong",
    "What would you tell your younger self?",
    "What boundaries do you want to set or maintain?",
    "What positive changes have you noticed in yourself?",
  ],
  confidence: [
    "List three things you're good at",
    "Describe a challenge you overcame",
    "What qualities do others appreciate in you?",
    "Write about a time you were proud of yourself",
    "What unique perspectives do you bring?",
  ],
  future: [
    "Where do you see yourself in one year?",
    "What dreams would you pursue if you knew you couldn't fail?",
    "What habits would you like to develop?",
    "What would make you feel fulfilled?",
    "What legacy do you want to leave?",
  ],
};

const promptCategories = [
  { value: "daily", label: "Daily Reflection", icon: Sparkles },
  { value: "cbt", label: "Therapeutic Reflection", icon: Brain },
  { value: "healing", label: "Healing & Growth", icon: Heart },
  { value: "confidence", label: "Building Confidence", icon: Smile },
  { value: "future", label: "Future Self", icon: Calendar },
];

interface InsightCardProps {
  title: string;
  description: string;
  score?: number;
  icon: React.ComponentType<{ className?: string }>;
}

function InsightCard({ title, description, score, icon: Icon }: InsightCardProps) {
  return (
    <div className="p-4 border rounded-lg space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-purple-500" />
        <h3 className="font-medium">{title}</h3>
      </div>
      {score !== undefined && (
        <Progress value={score} className="h-2" />
      )}
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default function JournalPopOut() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("daily");
  const [currentPrompt, setCurrentPrompt] = useState<string>(journalPrompts.daily[0]);
  const [futureEmail, setFutureEmail] = useState({
    email: "",
    date: "",
  });
  const [currentEntry, setCurrentEntry] = useState({
    title: "",
    content: "",
    mood: "",
  });
  const [showInsights, setShowInsights] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<JournalAnalysis | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("write");

  const selectedEntry = entries.find(entry => entry.id === selectedEntryId) || null;

  const { data: moodTrends } = useQuery({
    queryKey: ['moodTrends'],
    queryFn: () => analyzeMoodTrends(entries),
    enabled: entries.length > 0
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getRandomPrompt = (category: string) => {
    const prompts = journalPrompts[category as keyof typeof journalPrompts];
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPrompt(getRandomPrompt(category));
  };

  const handleEntrySubmit = async () => {
    if (!currentEntry.title || !currentEntry.content) return;

    try {
      const analysis = await analyzeJournalEntry(currentEntry.content);
      setCurrentAnalysis(analysis);

      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        title: currentEntry.title,
        content: currentEntry.content,
        mood: currentEntry.mood,
        imageUrl: previewUrl || undefined,
        timestamp: new Date().toISOString(),
        prompt: currentPrompt,
        category: selectedCategory,
        ...(selectedCategory === "future" && futureEmail.email && futureEmail.date
          ? { futureEmail }
          : {}),
      };

      setEntries([newEntry, ...entries]);
      setCurrentEntry({ title: "", content: "", mood: "" });
      setSelectedImage(null);
      setPreviewUrl(null);
      setFutureEmail({ email: "", date: "" });
      setShowInsights(true);
      setActiveTab("insights");
    } catch (error) {
      console.error('Error analyzing entry:', error);
    }
  };

  const openEntryView = (id: string) => {
    setSelectedEntryId(id);
    setIsViewDialogOpen(true);
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    if (selectedEntryId === id) {
      setSelectedEntryId(null);
      setIsViewDialogOpen(false);
    }
  };

  const openNewEntry = () => {
    setCurrentEntry({ title: "", content: "", mood: "" });
    setSelectedImage(null);
    setPreviewUrl(null);
    setFutureEmail({ email: "", date: "" });
    setShowInsights(false);
    setCurrentAnalysis(null);
    setActiveTab("write");
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Journal Browse Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5 text-purple-500" />
              <CardTitle>Wellness Journal</CardTitle>
            </div>
            <Button onClick={openNewEntry} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>
          </div>
          <CardDescription>
            Track your thoughts, feelings, and personal growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.length > 0 ? (
              entries.slice(0, 6).map((entry) => (
                <Card key={entry.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openEntryView(entry.id)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base truncate">{entry.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {format(new Date(entry.timestamp), "PP")}
                      {entry.mood && <span className="ml-2">• Feeling {entry.mood}</span>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm line-clamp-2 text-muted-foreground">
                      {entry.content}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center py-8 text-center text-muted-foreground">
                <Book className="h-12 w-12 mb-4 opacity-20" />
                <p>Your journal is empty. Start writing to track your wellness journey.</p>
                <Button variant="outline" size="sm" onClick={openNewEntry} className="mt-4">
                  Create Your First Entry
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* New Entry Dialog */}
      <FullScreenDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <FullScreenDialogContent themeColor="#a855f7">
          <FullScreenDialogHeader>
            <FullScreenDialogTitle className="flex items-center gap-2">
              <Book className="h-6 w-6 text-purple-500" />
              Create New Journal Entry
            </FullScreenDialogTitle>
            <FullScreenDialogDescription>
              Write freely and reflect on your thoughts and feelings
            </FullScreenDialogDescription>
          </FullScreenDialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 border-b">
              <TabsList className="h-14 w-full justify-start gap-4">
                <TabsTrigger value="write" className="data-[state=active]:text-purple-700 data-[state=active]:border-purple-700 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-2 rounded-none h-14">
                  Write
                </TabsTrigger>
                {showInsights && (
                  <TabsTrigger value="insights" className="data-[state=active]:text-purple-700 data-[state=active]:border-purple-700 data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-2 rounded-none h-14">
                    AI Insights
                  </TabsTrigger>
                )}
              </TabsList>
            </div>
            
            <TabsContent value="write" className="mt-0 pt-6">
              <FullScreenDialogBody className="space-y-6">
                <div className="space-y-4">
                  <Select
                    value={selectedCategory}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a journaling focus" />
                    </SelectTrigger>
                    <SelectContent>
                      {promptCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <category.icon className="h-4 w-4" />
                            {category.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg">
                    <p className="text-sm font-medium mb-2 text-purple-800">Today's Prompt:</p>
                    <p className="text-purple-700">{currentPrompt}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 border-purple-200 text-purple-700 hover:bg-purple-100"
                      onClick={() => setCurrentPrompt(getRandomPrompt(selectedCategory))}
                    >
                      Try Another Prompt
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Input
                    placeholder="Entry Title"
                    value={currentEntry.title}
                    onChange={(e) =>
                      setCurrentEntry((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="text-lg font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {moods.map((mood) => (
                      <Button
                        key={mood.label}
                        variant={currentEntry.mood === mood.label ? "default" : "outline"}
                        size="sm"
                        onClick={() =>
                          setCurrentEntry((prev) => ({ ...prev, mood: mood.label }))
                        }
                        className={currentEntry.mood === mood.label ? "bg-purple-600 hover:bg-purple-700" : ""}
                      >
                        <span className="mr-1">{mood.emoji}</span>
                        {mood.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Textarea
                  placeholder="Write your thoughts here..."
                  className="min-h-[300px] text-base resize-none"
                  value={currentEntry.content}
                  onChange={(e) =>
                    setCurrentEntry((prev) => ({ ...prev, content: e.target.value }))
                  }
                />

                {selectedCategory === "future" && (
                  <div className="space-y-2 bg-purple-50 border border-purple-100 p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2 flex items-center gap-2 text-purple-800">
                      <Mail className="h-4 w-4 text-purple-600" />
                      Send to Future Self
                    </h3>
                    <p className="text-sm text-purple-700 mb-4">Schedule this entry to be emailed to you in the future as a reminder of your thoughts today.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        type="email"
                        placeholder="Your email"
                        value={futureEmail.email}
                        onChange={(e) =>
                          setFutureEmail((prev) => ({ ...prev, email: e.target.value }))
                        }
                      />
                      <Input
                        type="date"
                        value={futureEmail.date}
                        min={format(new Date(), "yyyy-MM-dd")}
                        onChange={(e) =>
                          setFutureEmail((prev) => ({ ...prev, date: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <label className="cursor-pointer">
                      <Button variant="outline" className="relative">
                        <Camera className="h-4 w-4 mr-2" />
                        Add Photo
                        <input
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </Button>
                    </label>
                  </div>
                  <Button onClick={handleEntrySubmit} className="bg-purple-600 hover:bg-purple-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Entry
                  </Button>
                </div>

                {previewUrl && (
                  <div className="mt-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full h-auto rounded-lg border"
                    />
                  </div>
                )}
              </FullScreenDialogBody>
            </TabsContent>
            
            <TabsContent value="insights" className="mt-0 pt-6">
              {currentAnalysis && (
                <FullScreenDialogBody className="space-y-6">
                  <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <h3 className="font-medium text-purple-800">AI Journal Analysis</h3>
                    </div>
                    <p className="text-sm text-purple-700">
                      Our AI has analyzed your journal entry to provide insights and recommendations to support your wellness journey.
                    </p>
                  </div>
                
                  <div className="grid md:grid-cols-2 gap-4">
                    <InsightCard
                      title="Emotional Score"
                      description={`Your entry shows ${currentAnalysis.sentiment} sentiment`}
                      score={currentAnalysis.emotionalScore}
                      icon={Heart}
                    />
                    <InsightCard
                      title="Mood Trend"
                      description={currentAnalysis.moodTrend}
                      icon={Sparkles}
                    />
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-500" />
                      Word Cloud
                    </h3>
                    <div className="h-[250px] w-full">
                      <WordCloud
                        words={Object.entries(currentAnalysis.wordFrequency).map(([text, size]) => ({
                          text,
                          size: Math.min(size * 2, 10)
                        }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      AI Suggestions
                    </h3>
                    <div className="space-y-2">
                      {currentAnalysis.suggestions.map((suggestion, index) => (
                        <Alert key={index} className="border-purple-200 bg-purple-50">
                          <AlertCircle className="h-4 w-4 text-purple-500" />
                          <AlertDescription className="text-purple-800">{suggestion}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>

                  {moodTrends && moodTrends.trends && moodTrends.trends.length > 0 && (
                    <div className="space-y-2 border rounded-lg p-4">
                      <h3 className="font-medium flex items-center gap-2">
                        <Heart className="h-5 w-5 text-purple-500" />
                        Mood Patterns
                      </h3>
                      <div className="space-y-2">
                        {moodTrends.trends.map((trend, index) => (
                          <p key={index} className="text-sm">
                            {trend}
                          </p>
                        ))}
                      </div>
                      {moodTrends.recommendations && moodTrends.recommendations.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-2">Recommendations</h4>
                          {moodTrends.recommendations.map((rec, index) => (
                            <Alert key={index} className="mb-2 border-purple-200 bg-purple-50">
                              <AlertCircle className="h-4 w-4 text-purple-500" />
                              <AlertDescription className="text-purple-800">{rec}</AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </FullScreenDialogBody>
              )}
            </TabsContent>
          </Tabs>
          
          <FullScreenDialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Journal
            </Button>
          </FullScreenDialogFooter>
        </FullScreenDialogContent>
      </FullScreenDialog>

      {/* View Entry Dialog */}
      <FullScreenDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        {selectedEntry && (
          <FullScreenDialogContent themeColor="#a855f7">
            <FullScreenDialogHeader>
              <div className="flex items-center justify-between">
                <FullScreenDialogTitle className="flex items-center gap-2">
                  <Book className="h-6 w-6 text-purple-500" />
                  {selectedEntry.title}
                </FullScreenDialogTitle>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  {showSidebar ? (
                    <PanelRightOpen className="h-5 w-5" />
                  ) : (
                    <PanelLeftOpen className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(selectedEntry.timestamp), "PPpp")}
                {selectedEntry.mood && (
                  <span className="ml-4 flex items-center">
                    <Smile className="h-4 w-4 mr-1" />
                    Feeling {selectedEntry.mood}
                  </span>
                )}
              </div>
            </FullScreenDialogHeader>
            
            <div className="flex flex-1">
              <div className={`flex-1 ${showSidebar ? 'md:mr-[300px]' : ''}`}>
                <FullScreenDialogBody className="py-8">
                  {selectedEntry.prompt && (
                    <div className="bg-purple-50 text-purple-800 p-4 rounded-lg mb-6 border border-purple-100">
                      <p className="text-sm font-medium mb-1">Prompt:</p>
                      <p className="text-base">{selectedEntry.prompt}</p>
                    </div>
                  )}
                  
                  <div className="prose prose-purple max-w-none">
                    {selectedEntry.content.split("\n").map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                  
                  {selectedEntry.imageUrl && (
                    <div className="mt-6">
                      <img
                        src={selectedEntry.imageUrl}
                        alt="Journal entry"
                        className="max-w-full h-auto rounded-lg border"
                      />
                    </div>
                  )}
                  
                  {selectedEntry.futureEmail && (
                    <div className="mt-6 bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-2 text-purple-800">
                        <Mail className="h-4 w-4 text-purple-600" />
                        Time Capsule
                      </h3>
                      <p className="text-sm text-purple-700">
                        This entry will be sent to {selectedEntry.futureEmail.email} on{" "}
                        {format(new Date(selectedEntry.futureEmail.date), "PP")}.
                      </p>
                    </div>
                  )}
                </FullScreenDialogBody>
              </div>
              
              {showSidebar && (
                <div className="hidden md:block fixed right-0 top-[73px] bottom-0 w-[300px] border-l bg-gray-50 overflow-auto">
                  <div className="p-6 space-y-6">
                    <div>
                      <h3 className="font-medium mb-4">Journal Actions</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Entry
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
                          onClick={() => deleteEntry(selectedEntry.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete Entry
                        </Button>
                      </div>
                    </div>
                    
                    {selectedEntry.category && (
                      <div>
                        <h3 className="font-medium mb-2">Category</h3>
                        <div className="bg-white p-2 rounded border">
                          {promptCategories.find(c => c.value === selectedEntry.category)?.label || selectedEntry.category}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="font-medium mb-2">Related Prompts</h3>
                      <div className="space-y-2">
                        {selectedEntry.category && journalPrompts[selectedEntry.category as keyof typeof journalPrompts]
                          ?.slice(0, 3)
                          .map((prompt, idx) => (
                            <div key={idx} className="bg-white p-3 rounded border text-sm">
                              {prompt}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <FullScreenDialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsViewDialogOpen(false)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Journal
              </Button>
            </FullScreenDialogFooter>
          </FullScreenDialogContent>
        )}
      </FullScreenDialog>
    </div>
  );
}