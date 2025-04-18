import { useState, useRef, useEffect } from "react";
import { Brain, AlertCircle, X, Send, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface AbsoluteFullscreenEmergencyAIProps {
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function AbsoluteFullscreenEmergencyAI({ onClose }: AbsoluteFullscreenEmergencyAIProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'I am the Fundamenta Emergency AI Assistant. I can provide emergency guidance, but I am not a replacement for calling emergency services. For life-threatening situations, always call 911 (or your local emergency number) immediately.'
    },
    {
      role: 'assistant',
      content: 'I am your Emergency AI Assistant. I can provide guidance for emergency situations, but I am NOT a replacement for emergency services.\n\nFor any life-threatening situation, please call 911 (or your local emergency number) immediately.\n\nHow can I help you with emergency information today?'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user' as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input
    setInput("");
    
    // Set loading state
    setIsLoading(true);
    
    try {
      // Simulate AI response (in a real app, this would call an API)
      setTimeout(() => {
        let response: Message;
        
        // Simple keyword-based responses for demo purposes
        if (input.toLowerCase().includes('heart attack') || input.toLowerCase().includes('chest pain')) {
          response = {
            role: 'assistant',
            content: 'If you suspect someone is having a heart attack:\n\n1. Call 911 immediately\n2. Have the person sit or lie down in a comfortable position\n3. Loosen any tight clothing\n4. If the person is not allergic to aspirin and has no other contraindications, they may chew a baby aspirin (if available)\n5. Stay with them until emergency help arrives\n\nCommon heart attack symptoms include chest pain/pressure, pain radiating to arm/jaw/back, shortness of breath, nausea, cold sweat, and lightheadedness.'
          };
        } else if (input.toLowerCase().includes('cpr') || input.toLowerCase().includes('not breathing')) {
          response = {
            role: 'assistant',
            content: 'For CPR (if someone is unresponsive and not breathing normally):\n\n1. Call 911 immediately\n2. Place the person on their back on a firm surface\n3. Kneel beside them\n4. Place the heel of one hand on the center of their chest, with your other hand on top\n5. Compress the chest at least 2 inches deep at a rate of 100-120 compressions per minute\n6. Allow the chest to fully recoil between compressions\n7. If trained, give 2 rescue breaths after every 30 compressions\n\nIf untrained, perform hands-only CPR (compressions only) until help arrives.'
          };
        } else if (input.toLowerCase().includes('choking')) {
          response = {
            role: 'assistant',
            content: 'For choking (if a person cannot breathe, talk, or cough):\n\n1. Stand behind the person and wrap your arms around their waist\n2. Make a fist with one hand and place it just above their navel (belly button)\n3. Grab your fist with your other hand\n4. Press into their abdomen with quick, upward thrusts\n5. Repeat until the object is expelled or the person becomes unconscious\n\nIf the person becomes unconscious, lower them to the ground and begin CPR if you are trained. Call 911 immediately.'
          };
        } else if (input.toLowerCase().includes('bleeding') || input.toLowerCase().includes('blood')) {
          response = {
            role: 'assistant',
            content: 'For severe bleeding:\n\n1. Call 911 for severe bleeding\n2. Apply direct pressure to the wound using a clean cloth, bandage, or your hand if nothing else is available\n3. If possible, elevate the injured area above the heart\n4. Apply pressure until help arrives\n5. If blood soaks through, add more material without removing the first layer\n6. For wounds on limbs where bleeding can\'t be controlled, a tourniquet might be needed (only if properly trained)\n\nWear gloves if available to protect yourself from bloodborne pathogens.'
          };
        } else if (input.toLowerCase().includes('burn') || input.toLowerCase().includes('fire')) {
          response = {
            role: 'assistant',
            content: 'For burns:\n\n1. Remove the person from the source of the burn\n2. For minor burns (redness, mild swelling): Cool the burn with cool (not cold) running water for 10-15 minutes\n3. Don\'t use ice, as it can cause further damage\n4. Don\'t apply butter, oil, or ointments to the burn\n5. Cover with a sterile, non-stick bandage\n\nFor severe burns (blistering, white or charred appearance, covering large area):\n1. Call 911\n2. Don\'t remove burned clothing stuck to the skin\n3. Cover the area with a clean, dry cloth or sheet\n4. Elevate the burned area above heart level if possible\n5. Monitor for signs of shock'
          };
        } else if (input.toLowerCase().includes('poison') || input.toLowerCase().includes('swallow')) {
          response = {
            role: 'assistant',
            content: 'For poisoning:\n\n1. Call Poison Control immediately: 1-800-222-1222 (US)\n2. If the person is unconscious, having seizures, or not breathing, call 911\n3. Don\'t give anything to drink unless directed by Poison Control\n4. Remove any remaining poison from mouth\n5. If poison got on skin or eyes, flush with running water for 15-20 minutes\n\nHave information ready for Poison Control: person\'s age and weight, the substance, the amount, and when it occurred.'
          };
        } else if (input.toLowerCase().includes('stroke')) {
          response = {
            role: 'assistant',
            content: 'For suspected stroke, remember "FAST":\n\nF - Face: Ask the person to smile. Does one side of the face droop?\nA - Arms: Ask the person to raise both arms. Does one arm drift downward?\nS - Speech: Ask the person to repeat a simple phrase. Is their speech slurred or strange?\nT - Time: If you observe any of these signs, call 911 immediately!\n\nNote the time when symptoms first appeared, as this is crucial information for treatment decisions. Do not give the person medication, food, or drink.'
          };
        } else {
          response = {
            role: 'assistant',
            content: 'I understand you\'re seeking emergency information. To help you more specifically, please provide details about the emergency situation you\'re dealing with.\n\nFor any life-threatening emergency, please call 911 (or your local emergency number) immediately instead of waiting for AI assistance.\n\nI can provide basic guidance on topics like:\n- CPR and choking\n- Heart attack and stroke symptoms\n- Severe bleeding\n- Burns\n- Poisoning\n- Natural disasters\n- And other emergency situations'
          };
        }
        
        setMessages(prev => [...prev, response]);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
      
      // Show error toast
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
      
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again or seek immediate professional help if this is an emergency.'
      }]);
    }
  };
  
  return (
    <div className="fixed inset-0 z-[9999] bg-white w-screen h-screen flex flex-col overflow-hidden">
      {/* Top header bar with close button */}
      <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-bold">Emergency AI Assistant</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      {/* Main content area with chat messages */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Alert variant="destructive" className="mx-4 mt-4 mb-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This AI assistant is not a replacement for emergency services. In any life-threatening situation, call 911 immediately.
          </AlertDescription>
        </Alert>
        
        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4 mb-4">
            {messages.filter(msg => msg.role !== 'system').map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <p className="text-sm">Generating response...</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef}></div>
          </div>
        </ScrollArea>
        
        {/* Input area */}
        <div className="p-4 border-t bg-white">
          <div className="flex space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the emergency situation..."
              className="resize-none flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-red-500 hover:bg-red-600"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send. Use Shift+Enter for a new line.
          </p>
        </div>
      </div>
    </div>
  );
}