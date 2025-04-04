import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Save, Lightbulb, Sparkles, Heart, GraduationCap, PlusCircle, RefreshCw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

import FundiAvatar from '@/components/fundi-avatar';
import FundiAvatarNew from '@/components/fundi-avatar-new';
import RobotFundi from '@/components/robot-fundi';
import RobotFundiEnhanced from '@/components/robot-fundi-enhanced';
import SimpleButtonFundi from '@/components/simple-button-fundi';
import FundiAvatarEnhanced from '@/components/fundi-avatar-enhanced';
import FundiInteractiveAssistant from '@/components/fundi-interactive-assistant';

// Demo page for showcasing all versions of Fundi avatars
export default function FundiShowcase() {
  // State for controls
  const [activeTab, setActiveTab] = useState('showcase');
  const [speaking, setSpeaking] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [emotion, setEmotion] = useState<'neutral' | 'happy' | 'curious' | 'surprised' | 'concerned'>('neutral');
  const [category, setCategory] = useState('general');
  const [size, setSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  const [interactive, setInteractive] = useState(true);
  const [pulseEffect, setPulseEffect] = useState(true);
  const [glowEffect, setGlowEffect] = useState(false);
  const [wink, setWink] = useState(false);
  const [rotate, setRotate] = useState(false);
  const [shadow, setShadow] = useState(true);
  const [bounce, setBounce] = useState(false);
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  // Trigger wink
  const triggerWink = () => {
    setWink(true);
    setTimeout(() => setWink(false), 1000);
  };

  // Switch category rotation (for demo purposes)
  const cycleCategory = () => {
    const categories = ['general', 'finance', 'career', 'wellness', 'learning', 'emergency', 'cooking', 'fitness'];
    const currentIndex = categories.indexOf(category);
    const nextIndex = (currentIndex + 1) % categories.length;
    setCategory(categories[nextIndex]);
  };

  // Trigger a random emotion (for demo purposes)
  const randomEmotion = () => {
    const emotions: Array<'neutral' | 'happy' | 'curious' | 'surprised' | 'concerned'> = 
      ['neutral', 'happy', 'curious', 'surprised', 'concerned'];
    const randomIndex = Math.floor(Math.random() * emotions.length);
    setEmotion(emotions[randomIndex]);
  };

  return (
    <div className="container py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Fundi Avatar Showcase</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore all versions of the Fundi avatar and customize the enhanced version with various options.
        </p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
          <TabsTrigger value="showcase">All Versions</TabsTrigger>
          <TabsTrigger value="enhanced">Enhanced Controls</TabsTrigger>
          <TabsTrigger value="robot">Robot Fundi</TabsTrigger>
          <TabsTrigger value="interactive">Interactive Assistant</TabsTrigger>
        </TabsList>

        {/* Showcase Tab - All Versions */}
        <TabsContent value="showcase" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Legacy Versions */}
            <Card>
              <CardHeader>
                <CardTitle>Legacy Versions</CardTitle>
                <CardDescription>Original Fundi avatar implementations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Original Fundi Avatar</h3>
                  <div className="flex justify-center">
                    <FundiAvatar speaking={speaking} category={category} size={size === 'xl' ? 'lg' : size} />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Fundi Avatar (New)</h3>
                  <div className="flex justify-center">
                    <FundiAvatarNew speaking={speaking} category={category} size={size === 'xl' ? 'lg' : size} />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Robot Fundi</h3>
                  <div className="flex justify-center">
                    <RobotFundi speaking={speaking} size={size === 'xs' ? 'sm' : size === 'xl' ? 'lg' : size} />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Simple Button Fundi</h3>
                  <div className="flex justify-center">
                    <SimpleButtonFundi speaking={speaking} category={category} size={size === 'xs' ? 'sm' : size === 'xl' ? 'lg' : size} />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Enhanced Robot Fundi</h3>
                  <div className="flex justify-center">
                    <RobotFundiEnhanced 
                      speaking={speaking}
                      thinking={thinking}
                      size={size}
                      pulsing={pulseEffect}
                      category={category}
                      interactive={interactive}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Enhanced Version */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Enhanced Fundi</CardTitle>
                <CardDescription>Latest version with improved animations and interactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Basic Enhanced Avatar</h3>
                    <div className="flex justify-center">
                      <FundiAvatarEnhanced
                        speaking={speaking}
                        thinking={thinking}
                        emotion={emotion}
                        category={category}
                        size={size}
                        interactive={interactive}
                        pulseEffect={pulseEffect}
                        glowEffect={glowEffect}
                        wink={wink}
                        rotate={rotate}
                        withShadow={shadow}
                        withBounce={bounce}
                        animationSpeed={speed}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Context-Sensitive Examples</h3>
                    <ScrollArea className="h-[300px] p-4 border rounded-lg">
                      <div className="space-y-8">
                        <div>
                          <h4 className="text-xs font-medium mb-2">Finance Mode</h4>
                          <div className="flex justify-center">
                            <FundiAvatarEnhanced
                              speaking={false}
                              category="finance"
                              size="sm"
                              pulseEffect={true}
                              glowEffect={true}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-medium mb-2">Career Coach</h4>
                          <div className="flex justify-center">
                            <FundiAvatarEnhanced
                              speaking={false}
                              emotion="happy"
                              category="career"
                              size="sm"
                              withBounce={true}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-medium mb-2">Emergency Mode</h4>
                          <div className="flex justify-center">
                            <FundiAvatarEnhanced
                              speaking={false}
                              emotion="concerned"
                              category="emergency"
                              size="sm"
                              pulseEffect={true}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-medium mb-2">Learning Assistant</h4>
                          <div className="flex justify-center">
                            <FundiAvatarEnhanced
                              speaking={false}
                              emotion="curious"
                              category="learning"
                              size="sm"
                              glowEffect={true}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-medium mb-2">Wellness Guide</h4>
                          <div className="flex justify-center">
                            <FundiAvatarEnhanced
                              speaking={false}
                              emotion="neutral"
                              category="wellness"
                              size="sm"
                              pulseEffect={true}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-medium mb-2">Cooking Coach</h4>
                          <div className="flex justify-center">
                            <FundiAvatarEnhanced
                              speaking={false}
                              emotion="happy"
                              category="cooking"
                              size="sm"
                              withBounce={true}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-xs font-medium mb-2">Fitness Trainer</h4>
                          <div className="flex justify-center">
                            <FundiAvatarEnhanced
                              speaking={false}
                              emotion="happy"
                              category="fitness"
                              size="sm"
                              withBounce={true}
                            />
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </div>
                </div>
                
                {/* Quick Controls */}
                <div className="space-y-4 mt-4">
                  <h3 className="text-sm font-semibold">Quick Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSpeaking(!speaking)}
                    >
                      {speaking ? "Stop Speaking" : "Start Speaking"}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setThinking(!thinking)}
                    >
                      {thinking ? "Stop Thinking" : "Start Thinking"}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={triggerWink}
                    >
                      Trigger Wink
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={cycleCategory}
                    >
                      Change Category
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={randomEmotion}
                    >
                      Random Emotion
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Robot Fundi Tab */}
        <TabsContent value="robot" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Main Robot Display */}
            <Card className="flex flex-col items-center justify-center">
              <CardHeader className="text-center">
                <CardTitle>Enhanced Robot Fundi</CardTitle>
                <CardDescription>With dynamic radiating glow based on context</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="mb-8">
                  <RobotFundiEnhanced 
                    speaking={speaking}
                    thinking={thinking}
                    size="xl"
                    pulsing={pulseEffect}
                    category={category}
                    interactive={interactive}
                    glowIntensity="high"
                  />
                </div>
                
                <div className="space-y-4 w-full max-w-sm">
                  <h3 className="text-sm font-semibold text-center">Quick Controls</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSpeaking(!speaking)}
                    >
                      {speaking ? "Stop Speaking" : "Start Speaking"}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setThinking(!thinking)}
                    >
                      {thinking ? "Stop Thinking" : "Start Thinking"}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={cycleCategory}
                    >
                      Change Category
                    </Button>
                    
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="career">Career</SelectItem>
                        <SelectItem value="wellness">Wellness</SelectItem>
                        <SelectItem value="learning">Learning</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="cooking">Cooking</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Context Colors Showcase */}
            <Card>
              <CardHeader>
                <CardTitle>Context-Sensitive Colors</CardTitle>
                <CardDescription>Different glowing colors based on app section</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div className="flex flex-col items-center">
                    <div className="mb-2">
                      <RobotFundiEnhanced 
                        size="sm" 
                        category="finance" 
                        glowIntensity="medium" 
                        pulsing={true} 
                      />
                    </div>
                    <span className="text-xs font-medium text-center">Finance</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="mb-2">
                      <RobotFundiEnhanced 
                        size="sm" 
                        category="career" 
                        glowIntensity="medium" 
                        pulsing={true} 
                      />
                    </div>
                    <span className="text-xs font-medium text-center">Career</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="mb-2">
                      <RobotFundiEnhanced 
                        size="sm" 
                        category="wellness" 
                        glowIntensity="medium" 
                        pulsing={true} 
                      />
                    </div>
                    <span className="text-xs font-medium text-center">Wellness</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="mb-2">
                      <RobotFundiEnhanced 
                        size="sm" 
                        category="learning" 
                        glowIntensity="medium" 
                        pulsing={true} 
                      />
                    </div>
                    <span className="text-xs font-medium text-center">Learning</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="mb-2">
                      <RobotFundiEnhanced 
                        size="sm" 
                        category="emergency" 
                        glowIntensity="medium" 
                        pulsing={true} 
                      />
                    </div>
                    <span className="text-xs font-medium text-center">Emergency</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="mb-2">
                      <RobotFundiEnhanced 
                        size="sm" 
                        category="cooking" 
                        glowIntensity="medium" 
                        pulsing={true} 
                      />
                    </div>
                    <span className="text-xs font-medium text-center">Cooking</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="mb-2">
                      <RobotFundiEnhanced 
                        size="sm" 
                        category="fitness" 
                        glowIntensity="medium" 
                        pulsing={true} 
                      />
                    </div>
                    <span className="text-xs font-medium text-center">Fitness</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="mb-2">
                      <RobotFundiEnhanced 
                        size="sm" 
                        category="general" 
                        glowIntensity="medium" 
                        pulsing={true} 
                      />
                    </div>
                    <span className="text-xs font-medium text-center">General</span>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Glow Intensity</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                      <div className="mb-2">
                        <RobotFundiEnhanced 
                          size="sm" 
                          category={category} 
                          glowIntensity="low" 
                          pulsing={true}
                        />
                      </div>
                      <span className="text-xs font-medium text-center">Low</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="mb-2">
                        <RobotFundiEnhanced 
                          size="sm" 
                          category={category} 
                          glowIntensity="medium" 
                          pulsing={true}
                        />
                      </div>
                      <span className="text-xs font-medium text-center">Medium</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="mb-2">
                        <RobotFundiEnhanced 
                          size="sm" 
                          category={category} 
                          glowIntensity="high" 
                          pulsing={true}
                        />
                      </div>
                      <span className="text-xs font-medium text-center">High</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">States</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                      <div className="mb-2">
                        <RobotFundiEnhanced 
                          size="sm" 
                          category={category}
                          speaking={true}
                          thinking={false}
                        />
                      </div>
                      <span className="text-xs font-medium text-center">Speaking</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="mb-2">
                        <RobotFundiEnhanced 
                          size="sm" 
                          category={category}
                          speaking={false}
                          thinking={true}
                        />
                      </div>
                      <span className="text-xs font-medium text-center">Thinking</span>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="mb-2">
                        <RobotFundiEnhanced 
                          size="sm" 
                          category={category}
                          speaking={false}
                          thinking={false}
                          pulsing={false}
                        />
                      </div>
                      <span className="text-xs font-medium text-center">Idle</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Enhanced Controls Tab */}
        <TabsContent value="enhanced" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Controls Panel */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Customization Controls</CardTitle>
                <CardDescription>Adjust parameters to see the avatar change in real-time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {/* State Controls */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">State Controls</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="speaking-switch">Speaking</Label>
                        <Switch 
                          id="speaking-switch" 
                          checked={speaking} 
                          onCheckedChange={setSpeaking} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="thinking-switch">Thinking</Label>
                        <Switch 
                          id="thinking-switch" 
                          checked={thinking} 
                          onCheckedChange={setThinking} 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Emotion</Label>
                      <Select value={emotion} onValueChange={(value) => setEmotion(value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select emotion" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="happy">Happy</SelectItem>
                          <SelectItem value="curious">Curious</SelectItem>
                          <SelectItem value="surprised">Surprised</SelectItem>
                          <SelectItem value="concerned">Concerned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="career">Career</SelectItem>
                          <SelectItem value="wellness">Wellness</SelectItem>
                          <SelectItem value="learning">Learning</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="cooking">Cooking</SelectItem>
                          <SelectItem value="fitness">Fitness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Appearance Controls */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Appearance Controls</h3>
                    
                    <div className="space-y-2">
                      <Label>Size</Label>
                      <RadioGroup value={size} onValueChange={(value) => setSize(value as any)} className="flex space-x-2">
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="xs" id="xs" />
                          <Label htmlFor="xs" className="cursor-pointer">XS</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="sm" id="sm" />
                          <Label htmlFor="sm" className="cursor-pointer">SM</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="md" id="md" />
                          <Label htmlFor="md" className="cursor-pointer">MD</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="lg" id="lg" />
                          <Label htmlFor="lg" className="cursor-pointer">LG</Label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <RadioGroupItem value="xl" id="xl" />
                          <Label htmlFor="xl" className="cursor-pointer">XL</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Animation Speed</Label>
                      <Select value={speed} onValueChange={(value) => setSpeed(value as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select speed" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slow">Slow</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="fast">Fast</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {/* Effect Controls */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Effect Controls</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="interactive-switch">Interactive</Label>
                        <Switch 
                          id="interactive-switch" 
                          checked={interactive} 
                          onCheckedChange={setInteractive} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pulse-switch">Pulse Effect</Label>
                        <Switch 
                          id="pulse-switch" 
                          checked={pulseEffect} 
                          onCheckedChange={setPulseEffect} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="glow-switch">Glow Effect</Label>
                        <Switch 
                          id="glow-switch" 
                          checked={glowEffect} 
                          onCheckedChange={setGlowEffect} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="shadow-switch">Shadow</Label>
                        <Switch 
                          id="shadow-switch" 
                          checked={shadow} 
                          onCheckedChange={setShadow} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Animation Controls */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold">Animation Controls</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="wink-switch">Wink</Label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={triggerWink}
                        >
                          Trigger
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="rotate-switch">Rotate</Label>
                        <Switch 
                          id="rotate-switch" 
                          checked={rotate} 
                          onCheckedChange={setRotate} 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="bounce-switch">Bounce</Label>
                        <Switch 
                          id="bounce-switch" 
                          checked={bounce} 
                          onCheckedChange={setBounce} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Preset Buttons */}
                <div className="space-y-4 mt-4">
                  <h3 className="text-sm font-semibold">Quick Presets</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setEmotion('happy');
                        setSpeaking(true);
                        setGlowEffect(true);
                        setPulseEffect(true);
                        setBounce(true);
                      }}
                      className="flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      Energetic
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setEmotion('neutral');
                        setSpeaking(false);
                        setThinking(true);
                        setGlowEffect(false);
                        setPulseEffect(false);
                        setBounce(false);
                        setCategory('finance');
                      }}
                      className="flex items-center gap-1"
                    >
                      <Lightbulb className="h-3 w-3" />
                      Thoughtful
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setEmotion('concerned');
                        setSpeaking(false);
                        setThinking(false);
                        setGlowEffect(false);
                        setPulseEffect(true);
                        setBounce(false);
                        setCategory('emergency');
                      }}
                      className="flex items-center gap-1"
                    >
                      <PlusCircle className="h-3 w-3" />
                      Emergency
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setEmotion('curious');
                        setSpeaking(false);
                        setThinking(false);
                        setGlowEffect(true);
                        setPulseEffect(false);
                        setBounce(false);
                        setCategory('learning');
                      }}
                      className="flex items-center gap-1"
                    >
                      <GraduationCap className="h-3 w-3" />
                      Learning
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setEmotion('neutral');
                        setSpeaking(false);
                        setThinking(false);
                        setGlowEffect(false);
                        setPulseEffect(false);
                        setBounce(false);
                        setRotate(false);
                        setCategory('general');
                        setSize('md');
                        setSpeed('normal');
                        setInteractive(true);
                        setShadow(true);
                      }}
                      className="flex items-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Reset All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Preview Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Visualize your customizations in real-time</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-8 pt-4">
                <div className="w-full text-center py-8 bg-muted/30 rounded-lg flex flex-col items-center justify-center gap-6">
                  <FundiAvatarEnhanced
                    speaking={speaking}
                    thinking={thinking}
                    emotion={emotion}
                    category={category}
                    size={size}
                    interactive={interactive}
                    pulseEffect={pulseEffect}
                    glowEffect={glowEffect}
                    wink={wink}
                    rotate={rotate}
                    withShadow={shadow}
                    withBounce={bounce}
                    animationSpeed={speed}
                  />
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="font-semibold">{category.charAt(0).toUpperCase() + category.slice(1)} Mode</p>
                    <p>{emotion.charAt(0).toUpperCase() + emotion.slice(1)} Expression</p>
                  </div>
                </div>
                
                <div className="w-full space-y-2">
                  <h3 className="text-sm font-semibold">Current Configuration</h3>
                  <pre className="p-3 bg-muted/30 rounded-lg text-xs overflow-auto whitespace-pre-wrap">
                    {JSON.stringify({
                      speaking,
                      thinking,
                      emotion,
                      category,
                      size,
                      interactive,
                      effects: {
                        pulse: pulseEffect,
                        glow: glowEffect,
                        shadow,
                        bounce,
                        rotate,
                      },
                      animationSpeed: speed,
                    }, null, 2)}
                  </pre>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-muted-foreground">Save this configuration as a preset</p>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Save className="h-3 w-3" /> Save Preset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Interactive Tab */}
        <TabsContent value="interactive" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-3">
              <Card className="overflow-hidden">
                <CardHeader className="pb-0">
                  <CardTitle>Interactive Fundi Assistant</CardTitle>
                  <CardDescription className="mb-4">
                    Complete floating assistant implementation with chat capabilities. This version combines 
                    the enhanced avatar with a full-featured chat interface.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-[500px] w-full bg-muted/20 rounded-lg flex items-center justify-center p-4">
                    <div className="absolute inset-0 m-4 flex items-center justify-center">
                      <p className="text-lg text-center text-muted-foreground font-semibold max-w-md">
                        The Interactive Fundi Assistant is shown in the bottom right corner of this frame.
                        <span className="block text-sm mt-2">Click on the avatar to interact with it!</span>
                      </p>
                    </div>
                    
                    {/* Place the interactive assistant inside the demo area */}
                    <div className="absolute inset-0">
                      <FundiInteractiveAssistant 
                        initialCategory={category}
                        initiallyOpen={false}
                        position="bottom-right"
                        onRequestHelp={(category, query) => {
                          console.log(`Help requested in category ${category}`, query);
                        }}
                        onOpenFullModule={(module) => {
                          console.log(`Request to open module: ${module}`);
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <h3 className="text-sm font-semibold">About the Interactive Assistant</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <p className="text-sm">Persistent floating avatar that's accessible from anywhere in the app</p>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <p className="text-sm">Category-specific assistance and guidance</p>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <p className="text-sm">Contextual suggestions based on current activity</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <p className="text-sm">Full chat interface with conversation history</p>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <p className="text-sm">Direct access to app modules and features</p>
                        </div>
                        
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <p className="text-sm">Expressive and responsive animations that convey state</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}