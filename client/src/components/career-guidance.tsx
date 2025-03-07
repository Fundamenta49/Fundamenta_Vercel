import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Props {
  riasecResults: string[];
  onBack: () => void;
}

export default function CareerGuidance({ riasecResults, onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: `Based on your RIASEC assessment results, I can help guide you through career options and next steps. Your top matches are:
    
${riasecResults.map((result, i) => `${i + 1}. ${result}`).join('\n')}

What would you like to know more about? You can ask about:
- Specific career paths within these areas
- Required education or training
- Job market outlook
- Skills development recommendations
- Work environment preferences`
  }]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/career-guidance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          riasecResults,
          conversationHistory: messages
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Error getting career guidance:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I apologize, but I'm having trouble providing guidance right now. Please try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Career Guide</CardTitle>
        <CardDescription>
          Get personalized guidance based on your RIASEC assessment results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ScrollArea className="h-[400px] pr-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === "assistant"
                    ? "bg-muted"
                    : "bg-primary/10"
                } rounded-lg p-4`}
              >
                {message.content.split('\n').map((line, i) => (
                  <p key={i} className="mb-2">{line}</p>
                ))}
              </div>
            ))}
          </ScrollArea>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about career paths, education, or next steps..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>

          <Button
            variant="outline"
            onClick={onBack}
            className="w-full mt-4"
          >
            Back to Results
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
