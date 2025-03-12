
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Mic, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ChatOnboarding from "./chat-onboarding";

interface ChatInterfaceProps {
  category: string;
}

export default function ChatInterface({ category }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([
    {
      role: "assistant",
      content: category === "wellness" 
        ? "👋 Hi there! I'm your Wellness AI Coach. How can I support your health and wellbeing today?"
        : `👋 Hi there! I'm your AI assistant. How can I help you with ${category} today?`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Add user message to chat
    setChatHistory(prev => [...prev, { role: "user", content: message }]);

    const userMessage = message;
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skillArea: category,
          userQuery: userMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      setChatHistory(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response",
        variant: "destructive",
      });
      
      setChatHistory(prev => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, but I'm having trouble processing your request right now. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showOnboarding ? (
        <ChatOnboarding category={category} onComplete={() => setShowOnboarding(false)} />
      ) : (
        <Card className="border-0 shadow-none relative">
          <CardContent className="p-0">
            <ScrollArea className="h-[60vh] p-4 rounded-md">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    msg.role === "user" ? "flex justify-end" : "flex justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>

            <form onSubmit={handleSubmit} className="flex gap-3 p-4 border-t">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Ask about ${category}...`}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isLoading || !message.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
