import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StandardDisclaimer } from '@/components/ui/standard-disclaimer';
import { EmergencyResources } from '@/components/ui/emergency-resources';
import { ProfessionalResources } from '@/components/ui/professional-resources';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export default function DisclaimerDemo() {
  const [category, setCategory] = useState<'health' | 'finance' | 'legal' | 'mental_health' | 'general'>('health');
  const [severity, setSeverity] = useState<'info' | 'warning' | 'alert'>('info');
  const [display, setDisplay] = useState<'always' | 'first_visit' | 'periodic'>('always');
  const [emergencyCategory, setEmergencyCategory] = useState<'mental_health' | 'domestic_violence' | 'substance_abuse'>('mental_health');
  const [emergencyDisplay, setEmergencyDisplay] = useState<'card' | 'banner' | 'inline' | 'modal'>('card');
  const [professionalCategory, setProfessionalCategory] = useState<'health' | 'mental_health' | 'finance' | 'legal'>('mental_health');
  const [professionalDisplay, setProfessionalDisplay] = useState<'grid' | 'list' | 'compact'>('grid');

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Disclaimer System Demo</h1>
      
      <Tabs defaultValue="standard">
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="standard">Standard Disclaimers</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Resources</TabsTrigger>
          <TabsTrigger value="professional">Professional Resources</TabsTrigger>
        </TabsList>
        
        {/* Standard Disclaimers */}
        <TabsContent value="standard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Standard Disclaimer Component</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                      <SelectItem value="mental_health">Mental Health</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Severity</label>
                  <Select value={severity} onValueChange={(val: any) => setSeverity(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Display Mode</label>
                  <Select value={display} onValueChange={(val: any) => setDisplay(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select display mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="always">Always</SelectItem>
                      <SelectItem value="first_visit">First Visit</SelectItem>
                      <SelectItem value="periodic">Periodic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="border border-dashed border-gray-200 rounded-md p-4">
                <StandardDisclaimer 
                  category={category} 
                  severity={severity} 
                  display={display} 
                  onAcknowledge={() => alert('Disclaimer acknowledged')}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Example Usage: Health Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-white">
                <StandardDisclaimer category="health" severity="info" display="first_visit" />
                
                <h2 className="text-xl font-semibold mt-4">Comprehensive Wellness Assessment</h2>
                <p className="text-gray-700 my-2">This assessment helps you understand your current wellness status.</p>
                
                <div className="bg-gray-100 p-4 rounded my-4">
                  <p className="text-gray-400 italic">Sample assessment content would appear here...</p>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <div className="text-sm text-gray-500 mb-2">
                    Assessment results are for educational purposes only.
                  </div>
                  
                  <ProfessionalResources category="health" display="compact" limit={2} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Emergency Resources */}
        <TabsContent value="emergency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Resources Component</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <Select value={emergencyCategory} onValueChange={(val: any) => setEmergencyCategory(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mental_health">Mental Health</SelectItem>
                      <SelectItem value="domestic_violence">Domestic Violence</SelectItem>
                      <SelectItem value="substance_abuse">Substance Abuse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Display Mode</label>
                  <Select value={emergencyDisplay} onValueChange={(val: any) => setEmergencyDisplay(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select display mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="inline">Inline</SelectItem>
                      <SelectItem value="modal">Modal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="border border-dashed border-gray-200 rounded-md p-4">
                <EmergencyResources 
                  category={emergencyCategory} 
                  display={emergencyDisplay}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Example Usage: Crisis Support Page</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-white">
                <StandardDisclaimer category="mental_health" severity="alert" display="always" />
                
                <h2 className="text-xl font-semibold mt-4">Mental Health Crisis Support</h2>
                <p className="text-gray-700 my-2">If you're experiencing a mental health crisis, help is available.</p>
                
                <EmergencyResources category="mental_health" display="banner" className="my-4" />
                
                <div className="bg-gray-100 p-4 rounded my-4">
                  <p className="text-gray-400 italic">Crisis support content would appear here...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Professional Resources */}
        <TabsContent value="professional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Professional Resources Component</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <Select value={professionalCategory} onValueChange={(val: any) => setProfessionalCategory(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="mental_health">Mental Health</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Display Mode</label>
                  <Select value={professionalDisplay} onValueChange={(val: any) => setProfessionalDisplay(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select display mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="border border-dashed border-gray-200 rounded-md p-4">
                <ProfessionalResources 
                  category={professionalCategory} 
                  display={professionalDisplay}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Example Usage: Financial Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-white">
                <StandardDisclaimer category="finance" severity="info" display="always" />
                
                <h2 className="text-xl font-semibold mt-4">Retirement Planning Calculator</h2>
                <p className="text-gray-700 my-2">Explore different scenarios for your retirement planning.</p>
                
                <div className="bg-gray-100 p-4 rounded my-4">
                  <p className="text-gray-400 italic">Retirement calculator would appear here...</p>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <h3 className="font-medium mb-2">Need more personalized guidance?</h3>
                  <ProfessionalResources category="finance" display="list" limit={2} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">About the Disclaimer System</h2>
        <p className="text-gray-700">
          This demonstration shows Fundamenta's layered approach to disclaimers, which balances legal protection with user experience.
          The system includes standardized disclaimers, emergency resources, and professional referrals that can be used consistently
          across the application.
        </p>
      </div>
    </div>
  );
}