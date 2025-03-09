import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Category = "emergency" | "finance" | "career" | "wellness" | "learning" | "fitness" | "cooking";

interface ChatInterfaceProps {
  category: Category;
  context?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface({ category, context }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    setIsLoading(true);
    const newMessage: Message = { role: "user", content: currentMessage };
    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentMessage,
          category,
          context,
          previousMessages: messages
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble responding right now. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] p-4">
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex gap-2 mt-4">
        <Input
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button onClick={sendMessage} disabled={isLoading}>
          Send
        </Button>
      </div>
    </div>
  );
}