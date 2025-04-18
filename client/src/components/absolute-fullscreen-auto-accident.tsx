import { useState } from "react";
import { Car, AlertCircle, X, CheckCircle2, FileText, PhoneCall, Camera, MessageSquare, ScanText, FileWarning, UserCog, Receipt } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

interface AbsoluteFullscreenAutoAccidentProps {
  onClose: () => void;
}

export default function AbsoluteFullscreenAutoAccident({ onClose }: AbsoluteFullscreenAutoAccidentProps) {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("immediate");
  
  return (
    <div className="fixed inset-0 z-[9999] bg-white w-screen h-screen flex flex-col overflow-hidden">
      {/* Top header bar with close button */}
      <div className="flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-bold">Auto Accident Response Guide</h2>
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
            In case of a serious accident with injuries, immediately call 911 (or your local emergency number).
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="immediate" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4 w-full max-w-3xl mx-auto">
            <TabsTrigger value="immediate">Immediate Steps</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="after">After the Accident</TabsTrigger>
          </TabsList>
          
          <TabsContent value="immediate" className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
              Immediate Steps to Take
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StepCard 
                step="1" 
                title="Check for Injuries" 
                icon={AlertCircle}
                iconColor="text-red-500"
                description="Check yourself and others for injuries. If anyone is injured, call 911 immediately."
              >
                <div className="text-sm space-y-1">
                  <p>Assess for:</p>
                  <ul className="list-disc pl-5 space-y-0.5">
                    <li>Consciousness</li>
                    <li>Bleeding</li>
                    <li>Difficulty breathing</li>
                    <li>Inability to move</li>
                  </ul>
                  <p className="mt-2 text-red-700 font-medium">Do not move seriously injured people unless they are in immediate danger.</p>
                </div>
              </StepCard>
              
              <StepCard 
                step="2" 
                title="Move to Safety" 
                icon={Car}
                iconColor="text-amber-500"
                description="If possible, move vehicles out of traffic to a safe location to prevent further accidents."
              >
                <div className="text-sm space-y-1">
                  <p>If it's safe and your car is drivable:</p>
                  <ul className="list-disc pl-5 space-y-0.5">
                    <li>Turn on hazard lights</li>
                    <li>Move to the shoulder or nearby parking lot</li>
                    <li>Set up warning triangles or flares if available</li>
                  </ul>
                  <p className="mt-2">If you can't move the vehicle, turn on hazard lights and move yourself to a safe location.</p>
                </div>
              </StepCard>
              
              <StepCard 
                step="3" 
                title="Call for Help" 
                icon={PhoneCall}
                iconColor="text-blue-500"
                description="Call 911 if there are injuries, blocked traffic, or significant damage."
              >
                <div className="text-sm space-y-1">
                  <p>When calling 911, provide:</p>
                  <ul className="list-disc pl-5 space-y-0.5">
                    <li>Exact location (street, mile marker, landmarks)</li>
                    <li>Number of people involved</li>
                    <li>Description of injuries</li>
                    <li>Whether there's fire, fuel spill, or other hazards</li>
                  </ul>
                  <p className="mt-2">Stay on the line until the dispatcher tells you to hang up.</p>
                </div>
              </StepCard>
              
              <StepCard 
                step="4" 
                title="Exchange Information" 
                icon={MessageSquare}
                iconColor="text-green-500"
                description="Exchange information with all parties involved in the accident."
              >
                <div className="text-sm space-y-1">
                  <p>Collect the following information:</p>
                  <ul className="list-disc pl-5 space-y-0.5">
                    <li>Names, addresses, phone numbers</li>
                    <li>Driver's license numbers</li>
                    <li>License plate numbers</li>
                    <li>Insurance company names and policy numbers</li>
                    <li>Vehicle makes, models, years, and colors</li>
                  </ul>
                  <p className="mt-2 font-medium">Be polite, but don't discuss fault or admit liability.</p>
                </div>
              </StepCard>
            </div>
          </TabsContent>
          
          <TabsContent value="documentation" className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              Document the Accident
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-blue-100">
                <CardHeader className="pb-2 bg-blue-50">
                  <CardTitle className="text-base flex items-center">
                    <Camera className="h-4 w-4 mr-2 text-blue-500" />
                    Take Photos
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <p className="text-sm mb-2">Take clear photos of:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>All vehicles involved (all sides, even undamaged areas)</li>
                    <li>License plates of all vehicles</li>
                    <li>Vehicle damage close-up</li>
                    <li>The accident scene from different angles</li>
                    <li>Road conditions and relevant traffic signs/signals</li>
                    <li>Skid marks, debris, or other accident evidence</li>
                    <li>Injuries (if appropriate)</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-blue-100">
                <CardHeader className="pb-2 bg-blue-50">
                  <CardTitle className="text-base flex items-center">
                    <FileWarning className="h-4 w-4 mr-2 text-blue-500" />
                    Accident Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <p className="text-sm mb-2">Report the accident:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Call the police to file a report, especially if:</li>
                    <ul className="list-disc pl-5 space-y-0.5">
                      <li>There are injuries</li>
                      <li>Significant property damage (typically over $1,000-2,000)</li>
                      <li>One party leaves the scene or lacks insurance</li>
                    </ul>
                    <li className="mt-1">Get the police report number</li>
                    <li>If police don't come to the scene, file a report at the police station</li>
                    <li>In some states, you must file a report with the DMV</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-blue-100">
                <CardHeader className="pb-2 bg-blue-50">
                  <CardTitle className="text-base flex items-center">
                    <UserCog className="h-4 w-4 mr-2 text-blue-500" />
                    Witness Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <p className="text-sm mb-2">If there are witnesses:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Ask for their names and contact information</li>
                    <li>Note where they were positioned during the accident</li>
                    <li>Ask if they'd be willing to provide a brief statement</li>
                    <li>If possible, record their statement (with permission)</li>
                  </ul>
                  <p className="text-sm mt-2 text-blue-700">Witnesses can be crucial in determining fault.</p>
                </CardContent>
              </Card>
              
              <Card className="border-blue-100">
                <CardHeader className="pb-2 bg-blue-50">
                  <CardTitle className="text-base flex items-center">
                    <ScanText className="h-4 w-4 mr-2 text-blue-500" />
                    Record Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <p className="text-sm mb-2">Document these additional details:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Date, time, and exact location of accident</li>
                    <li>Weather, road, and traffic conditions</li>
                    <li>Direction each vehicle was traveling</li>
                    <li>What happened in your own words</li>
                    <li>Names and badge numbers of police officers</li>
                    <li>Names of paramedics and ambulance service</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="after" className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Receipt className="h-5 w-5 mr-2 text-purple-500" />
              After the Accident
            </h3>
            
            <div className="space-y-4">
              <Card className="border-purple-100">
                <CardHeader className="pb-2 bg-purple-50">
                  <CardTitle className="flex items-center text-purple-800">
                    Contact Your Insurance Company
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-3">
                  <p className="text-sm">Notify your insurance company as soon as possible, regardless of fault.</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Have your policy number ready</li>
                    <li>Provide basic accident details</li>
                    <li>Share contact information for other parties involved</li>
                    <li>Ask about your coverage and deductibles</li>
                    <li>Find out what documentation they need</li>
                  </ul>
                  <p className="text-sm font-medium mt-1 text-purple-700">Many insurers have mobile apps for filing claims with photos.</p>
                </CardContent>
              </Card>
              
              <Card className="border-purple-100">
                <CardHeader className="pb-2 bg-purple-50">
                  <CardTitle className="flex items-center text-purple-800">
                    Seek Medical Attention
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-3">
                  <p className="text-sm">Even if you feel fine, some injuries may not be immediately apparent.</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>See a doctor as soon as possible after the accident</li>
                    <li>Document all medical visits and treatments</li>
                    <li>Keep copies of all medical records and bills</li>
                    <li>Follow all prescribed treatments and attend follow-up appointments</li>
                  </ul>
                  <p className="text-sm font-medium mt-1 text-purple-700">Some injuries, like whiplash or concussions, can take days to manifest symptoms.</p>
                </CardContent>
              </Card>
              
              <Card className="border-purple-100">
                <CardHeader className="pb-2 bg-purple-50">
                  <CardTitle className="flex items-center text-purple-800">
                    Vehicle Repairs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-3">
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Get repair estimates from reputable shops</li>
                    <li>Understand your rights regarding repairs:</li>
                    <ul className="list-disc pl-5 space-y-0.5">
                      <li>You typically have the right to choose your repair shop</li>
                      <li>You can request original manufacturer parts</li>
                    </ul>
                    <li className="mt-1">If your car is declared a total loss:</li>
                    <ul className="list-disc pl-5 space-y-0.5">
                      <li>Research fair market value for your vehicle</li>
                      <li>Negotiate with insurance if their offer seems low</li>
                    </ul>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="border-purple-100">
                <CardHeader className="pb-2 bg-purple-50">
                  <CardTitle className="flex items-center text-purple-800">
                    Consider Legal Consultation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-3">
                  <p className="text-sm">Consider consulting with an attorney if:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>You sustained serious injuries</li>
                    <li>There's a dispute about who was at fault</li>
                    <li>The accident involved a commercial vehicle</li>
                    <li>Your insurance claim is denied</li>
                    <li>The settlement offer seems insufficient</li>
                  </ul>
                  <p className="text-sm mt-1">Many personal injury attorneys offer free initial consultations and work on contingency (only get paid if you win).</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StepCard({ 
  step, 
  title, 
  icon: Icon, 
  iconColor,
  description, 
  children 
}: { 
  step: string; 
  title: string; 
  icon: React.ElementType;
  iconColor: string;
  description: string; 
  children: React.ReactNode;
}) {
  return (
    <Card className="border-gray-200 overflow-hidden">
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-center">
          <div className="flex items-center justify-center bg-gray-100 rounded-full h-6 w-6 mr-2">
            <span className="text-xs font-semibold">{step}</span>
          </div>
          <CardTitle className="text-base flex items-center">
            <Icon className={`h-4 w-4 mr-2 ${iconColor}`} />
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-2 pb-4">
        <p className="text-sm text-gray-700 mb-3">{description}</p>
        {children}
      </CardContent>
    </Card>
  );
}