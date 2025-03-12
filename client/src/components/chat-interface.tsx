import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });

      setChatHistory(prev => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`flex ${
              chat.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                chat.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <div className="whitespace-pre-wrap">{chat.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-zinc-400 animate-pulse delay-300"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Ask about ${category}...`}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading || !message.trim()}>
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}