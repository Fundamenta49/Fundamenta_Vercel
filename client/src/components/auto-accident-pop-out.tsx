import React, { useState } from "react";
import {
  FullScreenDialogHeader,
  FullScreenDialogTitle,
  FullScreenDialogDescription,
  FullScreenDialogBody,
} from "@/components/ui/full-screen-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Car, 
  AlertCircle, 
  Phone, 
  FilePenLine, 
  ShieldCheck, 
  FileText, 
  Camera,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function AutoAccidentPopOut() {
  const [activeTab, setActiveTab] = useState("immediate");

  return (
    <div className="w-full max-w-screen-xl mx-auto">
      <FullScreenDialogHeader>
        <FullScreenDialogTitle className="flex items-center gap-2">
          <Car className="h-6 w-6 text-red-500" />
          Auto Accident Response
        </FullScreenDialogTitle>
        <FullScreenDialogDescription>
          What to do if you're involved in a vehicle accident
        </FullScreenDialogDescription>
      </FullScreenDialogHeader>
      
      <FullScreenDialogBody>
        <Alert className="mb-4 border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-800 text-sm">
            In case of a serious accident with injuries, immediately call your local emergency services (911 in the US).
            Your safety and the safety of others should be your top priority.
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="immediate" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 w-full">
            <TabsTrigger value="immediate">Immediate Steps</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="after">After the Accident</TabsTrigger>
          </TabsList>
          
          {/* Immediate Steps Content */}
          <TabsContent value="immediate" className="space-y-4">
            <Card className="border-red-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="destructive">1</Badge>
                  Safety First
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Check for injuries</strong> to yourself and others. Call 911 immediately if anyone is injured.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Move to safety</strong> if possible. Turn on hazard lights and set up warning triangles/flares if available.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Stay calm</strong> and check for dangers like fire, leaking fuel, or traffic.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-red-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="destructive">2</Badge>
                  Notify Authorities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Call local police for any accident involving injuries, death, or significant property damage.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>In many states, you're legally required to report accidents that exceed a certain damage threshold (usually $500-$2000).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Stay at the scene until authorities arrive. Leaving the scene of an accident can be considered a hit-and-run.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-red-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="destructive">3</Badge>
                  Exchange Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <FilePenLine className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Exchange with other driver(s):</strong> Full name, contact information, insurance company and policy number, driver's license number, license plate number, and vehicle make/model.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FilePenLine className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Get witness information:</strong> Names and contact information of any witnesses.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FilePenLine className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Police information:</strong> Officer's name, badge number, and how to obtain the accident report.</span>
                  </li>
                </ul>
                <Button 
                  variant="outline" 
                  className="mt-2 w-full" 
                  onClick={() => setActiveTab("documentation")}
                >
                  Next: Document Everything <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Documentation Content */}
          <TabsContent value="documentation" className="space-y-4">
            <Card className="border-red-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="destructive">4</Badge>
                  Document the Scene
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Camera className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Take photos</strong> from multiple angles showing:
                      <ul className="list-disc pl-6 mt-1 space-y-1">
                        <li>Damage to all vehicles involved</li>
                        <li>The entire accident scene, including road conditions</li>
                        <li>License plates of all vehicles</li>
                        <li>Skid marks, debris, or other evidence</li>
                        <li>Traffic signs, signals, or road markings</li>
                      </ul>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Take notes</strong> about the accident including:
                      <ul className="list-disc pl-6 mt-1 space-y-1">
                        <li>Time, date, and exact location</li>
                        <li>Weather and road conditions</li>
                        <li>Direction of travel for each vehicle</li>
                        <li>What you remember happening</li>
                        <li>Names and badge numbers of responding officers</li>
                      </ul>
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-red-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="destructive">5</Badge>
                  Accident Diagram
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">Create a simple diagram showing:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Position and direction of all vehicles before, during, and after collision</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Street names, traffic signals, signs, and landmarks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Direction of travel for each vehicle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Point of impact</span>
                  </li>
                </ul>
                <div className="mt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("immediate")}
                  >
                    Back
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("after")}
                  >
                    Next: After the Accident <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* After the Accident Content */}
          <TabsContent value="after" className="space-y-4">
            <Card className="border-red-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="destructive">6</Badge>
                  Contact Your Insurance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Contact your insurance company as soon as possible, regardless of fault.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Provide all documentation and information you've collected.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Stick to the facts. Avoid admitting fault or making statements like "I'm sorry."</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Ask about your coverage, deductibles, and next steps in the claims process.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-red-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="destructive">7</Badge>
                  Seek Medical Attention
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Get checked by a medical professional</strong> even if you don't feel injured. Some injuries may not be immediately apparent.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Keep detailed records of all medical visits, treatments, and expenses.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>Monitor for delayed symptoms like headaches, neck or back pain, and numbness.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-red-100">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="destructive">8</Badge>
                  Follow Up
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="insurance">
                    <AccordionTrigger className="text-sm font-medium">Insurance Claims Process</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        <li>Work with your insurance adjuster to evaluate vehicle damage</li>
                        <li>Get estimates for repairs from approved repair shops</li>
                        <li>Understand your policy's rental car coverage if needed</li>
                        <li>Keep track of all claim numbers and adjuster contact information</li>
                        <li>Follow up regularly on the status of your claim</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="repairs">
                    <AccordionTrigger className="text-sm font-medium">Vehicle Repairs</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        <li>Get written estimates from multiple repair shops</li>
                        <li>Understand which parts will be used (OEM vs. aftermarket)</li>
                        <li>Know your rights regarding choice of repair facility</li>
                        <li>Inspect repairs thoroughly before accepting the vehicle</li>
                        <li>Keep all receipts and documentation of repairs</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="legal">
                    <AccordionTrigger className="text-sm font-medium">Legal Considerations</AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 text-sm">
                        <li>Be aware of your state's statute of limitations for filing claims</li>
                        <li>Consider consulting with an attorney for serious accidents</li>
                        <li>Understand your state's fault determination laws</li>
                        <li>Keep all documentation organized in case legal action is needed</li>
                        <li>Be cautious about signing any releases or settlements without review</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("documentation")}
                  >
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </FullScreenDialogBody>
    </div>
  );
}