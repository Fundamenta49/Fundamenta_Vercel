import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Minimize2, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function FloatingChat() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [location] = useLocation();
  const chatRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Chat mutation for sending messages
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: location,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      }]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user' as const,
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    chatMutation.mutate(input);
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const chatContent = chatRef.current;
    if (chatContent) {
      chatContent.scrollTop = chatContent.scrollHeight;
    }
  }, [messages]);

  return (
    <div 
      className={cn(
        "fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out",
        isMinimized ? "w-12 h-12" : "w-80"
      )}
    >
      {isMinimized ? (
        <Button
          variant="default"
          size="icon"
          className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
          onClick={() => setIsMinimized(false)}
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      ) : (
        <Card className="h-[500px] flex flex-col shadow-lg border border-blue-100">
          <div className="p-2 border-b flex items-center justify-between bg-gradient-to-r from-white to-blue-50">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <span className="font-medium text-sm text-blue-500">AI Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-blue-50"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3" ref={chatRef}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 max-w-[85%] text-sm shadow-sm",
                      msg.role === 'user'
                        ? "bg-blue-500 text-white"
                        : "bg-gray-50"
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex items-center gap-1 p-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 text-sm border-blue-100 focus-visible:ring-blue-400"
              />
              <Button
                type="submit"
                disabled={chatMutation.isPending}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Send
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}