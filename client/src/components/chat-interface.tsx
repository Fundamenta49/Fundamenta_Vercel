// Placeholder for "@/components/ui/toast" - Replace with actual implementation
const useToast = () => ({
  toast: (params: any) => {
    console.log("Toast message:", params); // Replace with actual toast functionality
  }
});


import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, User, Bot } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import axios from "axios";
import { useToast } from "@/components/ui/toast";

interface Props {
  skillArea?: "technical" | "soft" | "search" | "life" | "cooking" | "career" | "emergency" | "finance" | "wellness" | "tour" | "learning";
  suggestedQuestions?: string[];
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatInterface = ({ skillArea = "wellness", suggestedQuestions = [] }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string = inputValue) => {
    if (!content.trim()) return;

    // Add user message to the chat
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        skillArea,
        userQuery: content
      });

      if (response.data.success) {
        const assistantMessage: Message = {
          role: "assistant",
          content: response.data.response
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(response.data.error || "Failed to get a response");
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Unable to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)] max-h-[600px] overflow-hidden border">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center space-y-4 my-8">
            <Bot className="h-12 w-12 mx-auto text-primary" />
            <h3 className="text-lg font-medium">
              AI Wellness Coach
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Ask me anything about mental health, wellness, nutrition, or personal wellbeing.
            </p>
            {suggestedQuestions.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-sm"
                    onClick={() => handleSendMessage(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-2 max-w-[80%] ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    message.role === "user" ? "bg-primary" : "bg-muted"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </div>
                <div
                  className={`rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br/>') }} />
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[80%]">
              <div className="h-8 w-8 rounded-full flex items-center justify-center bg-muted">
                <Bot className="h-5 w-5" />
              </div>
              <div className="rounded-lg p-3 bg-muted">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => handleSendMessage()} 
                  disabled={!inputValue.trim() || isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
};

export default ChatInterface;