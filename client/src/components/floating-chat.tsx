import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Minimize2, GripHorizontal, Sparkles } from "lucide-react";
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
  const x = useMotionValue(window.innerWidth - 320);
  const y = useMotionValue(window.innerHeight - 400);

  // Create a gentle floating animation
  const floatY = useMotionValue(0);
  const float = useTransform(floatY, [0, 1], [-4, 4]);

  useEffect(() => {
    if (isMinimized) {
      const interval = setInterval(() => {
        floatY.set(Math.sin(Date.now() / 1000));
      }, 16);
      return () => clearInterval(interval);
    }
  }, [isMinimized]);

  // Constrain position to viewport with some padding
  const constrainPosition = (pos: number, size: number, bound: number) => {
    const padding = 20;
    return Math.min(Math.max(pos, padding), bound - size - padding);
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
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      onDrag={handleDrag}
      style={{ x, y }}
      className={cn(
        "fixed z-50 transition-all duration-300 ease-in-out",
        isMinimized ? "w-14 h-14" : "w-80"
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {isMinimized ? (
        <motion.button
          className={cn(
            "w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
            "bg-white relative overflow-hidden group",
            "border border-blue-100 focus:outline-none"
          )}
          onClick={() => setIsMinimized(false)}
          style={{ y: float }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Robot face */}
          <div className="relative z-10 flex items-center justify-center w-full h-full">
            <motion.div 
              className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-500"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.9, 1, 0.9]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          {/* Glowing effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/10 to-purple-500/10 rounded-full blur opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300" />
        </motion.button>
      ) : (
        <Card className="h-[400px] flex flex-col shadow-lg overflow-hidden border border-blue-100">
          <motion.div 
            className="p-2 border-b flex items-center justify-between bg-gradient-to-r from-white to-blue-50"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="flex items-center gap-2 cursor-move">
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
              </div>
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
          </motion.div>

          <ScrollArea className="flex-1 p-3">
            <div className="space-y-3" ref={chatRef}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className={cn(
                    "flex flex-col",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 max-w-[85%] text-sm shadow-sm",
                      msg.role === 'user'
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-gradient-to-r from-gray-50 to-blue-50"
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </motion.div>
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

          <form onSubmit={handleSendMessage} className="p-3 border-t bg-gradient-to-r from-white to-blue-50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 text-sm border-blue-100 focus-visible:ring-blue-400 bg-white"
              />
              <Button
                type="submit"
                disabled={chatMutation.isPending}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                Send
              </Button>
            </div>
          </form>
        </Card>
      )}
    </motion.div>
  );
}