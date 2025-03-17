import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Minimize2, Maximize2, GripHorizontal } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { motion, useMotionValue, useTransform } from "framer-motion";

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
  
  // Position state for dragging
  const x = useMotionValue(window.innerWidth - 420);
  const y = useMotionValue(window.innerHeight - 600);

  // Constrain motion to viewport
  const constrainPosition = (pos: number, size: number, bound: number) => {
    return Math.min(Math.max(pos, 0), bound - size);
  };

  const handleDrag = (event: any, info: any) => {
    const chatElement = chatRef.current;
    if (!chatElement) return;

    const newX = constrainPosition(x.get() + info.delta.x, chatElement.offsetWidth, window.innerWidth);
    const newY = constrainPosition(y.get() + info.delta.y, chatElement.offsetHeight, window.innerHeight);

    x.set(newX);
    y.set(newY);
  };

  // Chat mutation for sending messages
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: location, // Send current route for context
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
    <motion.div
      drag
      dragMomentum={false}
      onDrag={handleDrag}
      style={{ x, y }}
      className={cn(
        "fixed z-50 transition-all duration-200",
        isMinimized ? "w-12 h-12" : "w-96"
      )}
    >
      {isMinimized ? (
        <Button
          variant="default"
          size="icon"
          className="w-12 h-12 rounded-full"
          onClick={() => setIsMinimized(false)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      ) : (
        <Card className="h-[500px] flex flex-col">
          <div className="p-2 border-b flex items-center justify-between bg-primary/5">
            <div className="flex items-center gap-2">
              <GripHorizontal className="h-4 w-4 cursor-move" />
              <span className="font-medium">AI Assistant</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4" ref={chatRef}>
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
                      "rounded-lg px-3 py-2 max-w-[80%]",
                      msg.role === 'user' 
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="animate-pulse">●</div>
                  <div className="animate-pulse animation-delay-200">●</div>
                  <div className="animate-pulse animation-delay-400">●</div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1"
              />
              <Button type="submit" disabled={chatMutation.isPending}>
                Send
              </Button>
            </div>
          </form>
        </Card>
      )}
    </motion.div>
  );
}
