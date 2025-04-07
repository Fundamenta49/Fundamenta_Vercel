import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Bell, 
  Flame, 
  Trophy, 
  Star, 
  Award, 
  TrendingUp,
  Crown,
  DollarSign,
  CircleDollarSign,
  LineChart,
  BookOpen,
  Zap,
  Info,
  Check,
  Mic
} from "lucide-react";

// Section-specific colors from design system
const EMERGENCY_RED = "#b91c1c";
const FINANCIAL_BLUE = "#3b82f6";
const WELLNESS_GREEN = "#10b981";
const CAREER_PURPLE = "#8b5cf6";
const LEARNING_YELLOW = "#f59e0b";

// Element ID counter style
const ElementID = ({ id }: { id: number }) => (
  <Badge variant="outline" className="absolute -top-2 -left-2 z-10 bg-background">
    #{id}
  </Badge>
);

const DesignSystemShowcase = () => {
  const [activeTab, setActiveTab] = useState("cards");

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Design System Showcase</h1>
        <p className="text-muted-foreground">
          Visual comparison between current and design system implementations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-8 bg-transparent border-b border-gray-200">
          <TabsTrigger value="cards" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">Cards</TabsTrigger>
          <TabsTrigger value="buttons" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">Buttons</TabsTrigger>
          <TabsTrigger value="typography" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">Typography</TabsTrigger>
          <TabsTrigger value="forms" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">Form Elements</TabsTrigger>
          <TabsTrigger value="sections" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">Section Headers</TabsTrigger>
        </TabsList>

        {/* CARDS SHOWCASE */}
        <TabsContent value="cards" className="space-y-8">
          <h2 className="text-2xl font-semibold mb-4">Card Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Implementation */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Implementation</h3>
              
              <div className="card relative">
                <ElementID id={1} />
                <h4 className="text-lg font-semibold mb-2">Standard Card</h4>
                <p>Uses custom card class with hardcoded background and text colors</p>
              </div>

              <Card className="border relative" style={{ borderColor: `${WELLNESS_GREEN}40` }}>
                <ElementID id={2} />
                <CardHeader className="py-4 pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Inline Styled Card</CardTitle>
                    <Flame className="h-4 w-4" style={{ color: WELLNESS_GREEN }} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Using inline styles</div>
                </CardContent>
              </Card>

              <div className="p-4 border rounded-lg shadow-sm bg-white relative">
                <ElementID id={3} />
                <h4 className="font-medium mb-2">Custom Card</h4>
                <p className="text-sm text-gray-600">Uses direct classes without design system</p>
              </div>
            </div>

            {/* Design System Implementation */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Design System Implementation</h3>
              
              <Card className="relative">
                <ElementID id={4} />
                <CardHeader>
                  <CardTitle>Standard Card</CardTitle>
                  <CardDescription>
                    Using shadcn Card component consistently
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Content with proper spacing according to design system</p>
                </CardContent>
              </Card>

              <Card className="border-wellness relative">
                <ElementID id={5} />
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Wellness Section Card</CardTitle>
                    <Flame className="h-4 w-4 text-wellness" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Using utility classes</div>
                </CardContent>
              </Card>

              <Card className="bg-card relative">
                <ElementID id={6} />
                <CardHeader className="pb-4">
                  <CardTitle>Consistent Card</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Uses design system tokens for colors</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* BUTTONS SHOWCASE */}
        <TabsContent value="buttons" className="space-y-8">
          <h2 className="text-2xl font-semibold mb-4">Button Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Implementation */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Implementation</h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <ElementID id={7} />
                  <Button 
                    className="w-full" 
                    style={{ backgroundColor: WELLNESS_GREEN, color: "white" }}
                  >
                    Inline Styled Button
                  </Button>
                </div>

                <div className="relative">
                  <ElementID id={8} />
                  <Button 
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 transition-colors"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <div className="relative">
                    <ElementID id={9} />
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md">
                      Custom 1
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <ElementID id={10} />
                    <button className="px-4 py-2 bg-green-500 text-white rounded-md">
                      Custom 2
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Design System Implementation */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Design System Implementation</h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <ElementID id={11} />
                  <Button className="w-full bg-wellness text-primary-foreground hover:bg-wellness/90">
                    Utility Styled Button
                  </Button>
                </div>

                <div className="relative">
                  <ElementID id={12} />
                  <Button variant="outline" size="icon">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <div className="relative">
                    <ElementID id={13} />
                    <Button variant="default">
                      Primary
                    </Button>
                  </div>
                  
                  <div className="relative">
                    <ElementID id={14} />
                    <Button variant="secondary">
                      Secondary
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TYPOGRAPHY SHOWCASE */}
        <TabsContent value="typography" className="space-y-8">
          <h2 className="text-2xl font-semibold mb-4">Typography</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Implementation */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Current Implementation</h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <ElementID id={15} />
                  <h1 className="text-xl font-bold">Heading 1 (text-xl)</h1>
                </div>
                
                <div className="relative">
                  <ElementID id={16} />
                  <h2 className="text-lg font-semibold">Heading 2 (text-lg)</h2>
                </div>
                
                <div className="relative">
                  <ElementID id={17} />
                  <h3 className="text-base font-medium">Heading 3 (text-base)</h3>
                </div>
                
                <div className="relative">
                  <ElementID id={18} />
                  <p className="text-gray-600">Body text with direct gray color</p>
                </div>
                
                <div className="relative">
                  <ElementID id={19} />
                  <p className="text-sm text-gray-500">Small text with direct gray color</p>
                </div>
              </div>
            </div>

            {/* Design System Implementation */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Design System Implementation</h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <ElementID id={20} />
                  <h1 className="font-heading text-2xl font-bold">Heading 1 (2rem)</h1>
                </div>
                
                <div className="relative">
                  <ElementID id={21} />
                  <h2 className="font-heading text-xl font-bold">Heading 2 (1.5rem)</h2>
                </div>
                
                <div className="relative">
                  <ElementID id={22} />
                  <h3 className="font-heading text-lg font-bold">Heading 3 (1.25rem)</h3>
                </div>
                
                <div className="relative">
                  <ElementID id={23} />
                  <p className="text-foreground">Body text with system token</p>
                </div>
                
                <div className="relative">
                  <ElementID id={24} />
                  <p className="text-sm text-muted-foreground">Small text with system token</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* FORM ELEMENTS SHOWCASE */}
        <TabsContent value="forms" className="space-y-8">
          <h2 className="text-2xl font-semibold mb-4">Form Elements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Implementation */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Current Implementation</h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <ElementID id={25} />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Input
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                      placeholder="Inconsistent input styling"
                    />
                  </div>
                </div>

                <div className="relative">
                  <ElementID id={26} />
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 text-blue-600 rounded" 
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Custom checkbox
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <ElementID id={27} />
                  <div className="flex items-center">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input type="checkbox" className="sr-only" />
                      <div className="block h-6 bg-gray-300 rounded-full w-12"></div>
                      <div className="dot absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition"></div>
                    </div>
                    <span className="text-sm text-gray-700">Custom toggle</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Design System Implementation */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Design System Implementation</h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <ElementID id={28} />
                  <div className="space-y-2">
                    <Label htmlFor="design-input">Design System Input</Label>
                    <Input 
                      id="design-input" 
                      placeholder="Consistent input styling" 
                    />
                  </div>
                </div>

                <div className="relative">
                  <ElementID id={29} />
                  <div className="flex items-center space-x-2">
                    <Switch id="design-mode" />
                    <Label htmlFor="design-mode">Design system toggle</Label>
                  </div>
                </div>

                <div className="relative">
                  <ElementID id={30} />
                  <div className="items-top flex space-x-2">
                    <Checkbox id="terms1" />
                    <div className="grid gap-1.5 leading-none">
                      <Label
                        htmlFor="terms1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Design system checkbox
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* SECTION HEADERS SHOWCASE */}
        <TabsContent value="sections" className="space-y-8">
          <h2 className="text-2xl font-semibold mb-4">Section Headers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Implementation */}
            <div className="space-y-8">
              <h3 className="text-lg font-medium">Current Implementation</h3>
              
              <div className="space-y-6">
                {/* Financial Header */}
                <div className="relative">
                  <ElementID id={31} />
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <DollarSign className="h-5 w-5" style={{ color: FINANCIAL_BLUE }} />
                      <span style={{ color: FINANCIAL_BLUE }}>Financial Tools</span>
                    </h3>
                    <p className="text-gray-600">Inline styled section header</p>
                  </div>
                </div>

                {/* Wellness Header */}
                <div className="relative">
                  <ElementID id={32} />
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" style={{ color: WELLNESS_GREEN }} />
                      <span style={{ color: WELLNESS_GREEN }}>Wellness Tracker</span>
                    </h3>
                    <p className="text-gray-600">Inconsistent border usage</p>
                  </div>
                </div>

                {/* Career Header */}
                <div className="relative">
                  <ElementID id={33} />
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-purple-600">
                      Career Development
                    </h3>
                    <p className="text-gray-600">Different header structure</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Design System Implementation */}
            <div className="space-y-8">
              <h3 className="text-lg font-medium">Design System Implementation</h3>
              
              <div className="space-y-6">
                {/* Financial Header */}
                <div className="relative">
                  <ElementID id={34} />
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 pb-2 border-b border-financial">
                      <DollarSign className="h-5 w-5 text-financial" />
                      <span className="text-financial">Financial Tools</span>
                    </h3>
                    <p className="text-muted-foreground">Consistent section header with border</p>
                  </div>
                </div>

                {/* Wellness Header */}
                <div className="relative">
                  <ElementID id={35} />
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 pb-2 border-b border-wellness">
                      <TrendingUp className="h-5 w-5 text-wellness" />
                      <span className="text-wellness">Wellness Tracker</span>
                    </h3>
                    <p className="text-muted-foreground">Follows design system pattern</p>
                  </div>
                </div>

                {/* Career Header */}
                <div className="relative">
                  <ElementID id={36} />
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 pb-2 border-b border-career">
                      <BookOpen className="h-5 w-5 text-career" />
                      <span className="text-career">Career Development</span>
                    </h3>
                    <p className="text-muted-foreground">Consistent with other headers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-muted p-4 rounded-lg mt-8">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <h3 className="font-medium mb-1">Implementation Note</h3>
            <p className="text-sm text-muted-foreground">
              This showcase demonstrates how the application would look with consistent styling according to the design system. 
              The "Current Implementation" examples simulate existing patterns found in the codebase, while the 
              "Design System Implementation" examples show how the same elements would look following the design system guidelines.
              Each element is numbered (#1-36) for easy reference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemShowcase;