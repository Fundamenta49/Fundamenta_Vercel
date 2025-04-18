import { useState } from "react";
import { Flame, AlertCircle, X, ChevronRight, CheckCircle2, AlertTriangle, FireExtinguisher, Bomb, HelpCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

interface AbsoluteFullscreenFireSafetyProps {
  onClose: () => void;
}

export default function AbsoluteFullscreenFireSafety({ onClose }: AbsoluteFullscreenFireSafetyProps) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("prevention");
  
  return (
    <div className="fixed inset-0 z-[9999] bg-white w-screen h-screen flex flex-col overflow-hidden">
      {/* Top header bar with close button */}
      <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-bold">Fire Safety Guide</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      {/* Main content area with padding and scroll */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            In case of fire, evacuate immediately and call emergency services (911 in the US). Your safety is the priority.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="prevention" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4 w-full max-w-3xl mx-auto">
            <TabsTrigger value="prevention">Prevention</TabsTrigger>
            <TabsTrigger value="extinguishing">Extinguishing</TabsTrigger>
            <TabsTrigger value="evacuation">Evacuation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="prevention" className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
              Fire Prevention Tips
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <PreventionCard 
                title="Kitchen Safety" 
                icon="🍳"
                tips={[
                  "Never leave cooking food unattended",
                  "Keep flammable items away from stovetop",
                  "Clean cooking surfaces regularly to prevent grease buildup",
                  "Don't cook when tired or impaired",
                  "Have a lid nearby to smother small grease fires"
                ]}
              />
              
              <PreventionCard 
                title="Electrical Safety" 
                icon="⚡"
                tips={[
                  "Don't overload outlets or extension cords",
                  "Replace damaged electrical cords immediately",
                  "Keep electrical appliances away from water",
                  "Unplug appliances when not in use",
                  "Have electrical systems inspected by professionals"
                ]}
              />
              
              <PreventionCard 
                title="Heating Equipment" 
                icon="🔥"
                tips={[
                  "Keep space heaters at least 3 feet from anything flammable",
                  "Turn off portable heaters when leaving the room",
                  "Clean chimneys and furnaces annually",
                  "Use fireplace screens",
                  "Allow ashes to cool before disposal in metal containers"
                ]}
              />
              
              <PreventionCard 
                title="Smoking Safety" 
                icon="🚭"
                tips={[
                  "Smoke outside when possible",
                  "Use deep, sturdy ashtrays",
                  "Never smoke in bed or when drowsy",
                  "Keep lighters and matches away from children",
                  "Completely extinguish cigarettes before disposal"
                ]}
              />
              
              <PreventionCard 
                title="Candle Safety" 
                icon="🕯️"
                tips={[
                  "Never leave burning candles unattended",
                  "Keep candles at least 12 inches from anything flammable",
                  "Use sturdy candle holders",
                  "Keep candles out of reach of children and pets",
                  "Consider using flameless LED candles instead"
                ]}
              />
              
              <PreventionCard 
                title="Holiday Safety" 
                icon="🎄"
                tips={[
                  "Keep Christmas trees watered and away from heat sources",
                  "Inspect holiday light strings for damage",
                  "Don't overload circuits with decorative lights",
                  "Turn off all decorations before sleeping or leaving home",
                  "Dispose of Christmas trees promptly after the holidays"
                ]}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="extinguishing" className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <FireExtinguisher className="h-5 w-5 mr-2 text-red-500" />
              Fire Extinguishing Guide
            </h3>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-amber-800 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />
                Remember the P.A.S.S. Technique:
              </h4>
              <ul className="list-none space-y-2">
                <li className="flex items-start">
                  <span className="font-bold text-amber-700 mr-2">P:</span>
                  <span><strong>Pull</strong> the pin at the top of the extinguisher</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-amber-700 mr-2">A:</span>
                  <span><strong>Aim</strong> at the base of the fire, not the flames</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-amber-700 mr-2">S:</span>
                  <span><strong>Squeeze</strong> the lever slowly and evenly</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold text-amber-700 mr-2">S:</span>
                  <span><strong>Sweep</strong> the nozzle from side to side</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Types of Fire Extinguishers:</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <ExtinguisherCard 
                  type="Class A" 
                  color="green"
                  materials="Ordinary combustibles like wood, paper, and cloth"
                  examples="Trash, wood, paper"
                  icon="🪵"
                />
                
                <ExtinguisherCard 
                  type="Class B" 
                  color="red"
                  materials="Flammable liquids"
                  examples="Gasoline, oil, grease"
                  icon="⛽"
                />
                
                <ExtinguisherCard 
                  type="Class C" 
                  color="blue"
                  materials="Energized electrical equipment"
                  examples="Appliances, computers, wiring"
                  icon="🔌"
                />
                
                <ExtinguisherCard 
                  type="Class D" 
                  color="yellow"
                  materials="Combustible metals"
                  examples="Magnesium, titanium, sodium"
                  icon="🔧"
                />
                
                <ExtinguisherCard 
                  type="Class K" 
                  color="black"
                  materials="Cooking oils and fats"
                  examples="Vegetable oils, animal fats"
                  icon="🍳"
                />
              </div>
              
              <div className="mt-6 bg-gray-50 border rounded-lg p-4">
                <h4 className="font-medium mb-2">When NOT to Fight a Fire:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>If the fire is spreading rapidly beyond the spot where it started</li>
                  <li>If you don't have adequate or appropriate equipment</li>
                  <li>If you might inhale toxic smoke</li>
                  <li>If your instincts tell you not to do so</li>
                  <li>If the fire threatens your escape route</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="evacuation" className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Bomb className="h-5 w-5 mr-2 text-orange-500" />
              Fire Evacuation Plan
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Before a Fire:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Create and practice a home fire escape plan with all household members</li>
                  <li>Identify two exits from each room</li>
                  <li>Designate a meeting spot outside (e.g., neighbor's house, specific tree)</li>
                  <li>Practice evacuating with your eyes closed or in the dark</li>
                  <li>Install smoke alarms in every bedroom, outside sleeping areas, and on every level</li>
                  <li>Test smoke alarms monthly and replace batteries annually</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">During a Fire:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>If the smoke alarm sounds, get out immediately</strong> and stay out</li>
                  <li>Crawl low under smoke</li>
                  <li>Feel doors before opening - if hot, use alternative exit</li>
                  <li>Close doors behind you to slow the spread of fire</li>
                  <li>If clothes catch fire: Stop, Drop, and Roll</li>
                  <li>Call emergency services (911) from outside</li>
                </ul>
              </div>
            </div>
            
            <Card className="mt-4 border-orange-200 bg-orange-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2 text-orange-600" />
                  What if You're Trapped?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Close doors between you and the fire</li>
                  <li>Put towels or cloth under doors to keep smoke out</li>
                  <li>Call 911 and tell them your exact location</li>
                  <li>Signal for help from a window using a light-colored cloth</li>
                  <li>If possible, open windows at top and bottom for fresh air</li>
                </ul>
              </CardContent>
            </Card>
            
            <div className="mt-4 p-4 border rounded-lg bg-blue-50 border-blue-200">
              <h4 className="font-medium mb-2 text-blue-800">Special Considerations:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium mb-1 text-blue-700">Children:</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Teach them not to hide during fires</li>
                    <li>Practice evacuation drills regularly</li>
                    <li>Teach them how to call 911</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium mb-1 text-blue-700">Elderly or Disabled:</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Consider specialized evacuation devices</li>
                    <li>If possible, sleep on the ground floor</li>
                    <li>Register with local fire department for special assistance</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function PreventionCard({ title, icon, tips }: { title: string, icon: string, tips: string[] }) {
  return (
    <Card className="border-red-100 overflow-hidden">
      <CardHeader className="pb-2 bg-red-50/70">
        <CardTitle className="text-base flex items-center">
          <span className="mr-2 text-lg">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <ul className="text-sm space-y-1">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <ChevronRight className="h-3.5 w-3.5 mt-0.5 mr-1.5 text-red-400 flex-shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function ExtinguisherCard({ type, color, materials, examples, icon }: { 
  type: string, 
  color: string, 
  materials: string, 
  examples: string,
  icon: string
}) {
  const colors = {
    red: "border-red-200 bg-red-50",
    green: "border-green-200 bg-green-50",
    blue: "border-blue-200 bg-blue-50",
    yellow: "border-yellow-200 bg-yellow-50",
    black: "border-gray-200 bg-gray-50"
  };
  
  const textColors = {
    red: "text-red-800",
    green: "text-green-800",
    blue: "text-blue-800",
    yellow: "text-yellow-800",
    black: "text-gray-800"
  };
  
  return (
    <Card className={`${colors[color as keyof typeof colors]} border-2`}>
      <CardHeader className="pb-1 pt-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-base font-bold ${textColors[color as keyof typeof textColors]}`}>
            {type}
          </CardTitle>
          <span className="text-2xl">{icon}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <CardDescription className="font-medium text-gray-700 mb-1">For fires involving:</CardDescription>
        <p className="text-sm font-medium mb-1">{materials}</p>
        <p className="text-xs text-gray-500">Examples: {examples}</p>
      </CardContent>
    </Card>
  );
}