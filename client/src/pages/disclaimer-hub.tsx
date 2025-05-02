import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StandardDisclaimer } from '@/components/ui/standard-disclaimer';
import { EmergencyResources } from '@/components/ui/emergency-resources';
import { ProfessionalResources } from '@/components/ui/professional-resources';
import { Separator } from '@/components/ui/separator';
import { Link } from 'wouter';

export default function DisclaimerHub() {
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Disclaimer Hub</h1>
        <p className="text-lg text-muted-foreground">
          Fundamenta's comprehensive resource for transparency and responsible use guidelines
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health">Health & Wellness</TabsTrigger>
          <TabsTrigger value="financial">Financial Guidance</TabsTrigger>
          <TabsTrigger value="resources">Emergency Resources</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Fundamenta's Disclaimer System</CardTitle>
              <CardDescription>
                How we approach content responsibility and user safety
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose max-w-none">
                <p>
                  Fundamenta is committed to providing educational content that helps users develop essential life skills while maintaining clear boundaries about the nature of our guidance. Our multi-layered disclaimer system ensures that users understand the educational nature of our content while providing access to professional resources when needed.
                </p>
                
                <h3>Our Layered Approach</h3>
                <p>
                  Our disclaimer system operates on multiple levels:
                </p>
                <ol>
                  <li><strong>Global Acknowledgment</strong> - One-time acceptance of platform-wide terms</li>
                  <li><strong>Section Disclaimers</strong> - Context-specific notices in specialized content areas</li>
                  <li><strong>In-context Micro-disclaimers</strong> - Targeted notices for specific sensitive content</li>
                  <li><strong>AI Response Qualifiers</strong> - Automatic qualification of AI-generated advice</li>
                </ol>
                
                <h3>Why This Matters</h3>
                <p>
                  This approach balances legal protection with a positive user experience. By contextualizing disclaimers at appropriate moments, we maintain transparency without overwhelming users with repetitive warnings.
                </p>
                
                <div className="mt-6">
                  <Link href="/ui/disclaimers" className="text-primary hover:underline">
                    View Interactive Disclaimer Components Demo
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Standardized Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Our disclaimers use consistent, accessible design patterns that ensure important information is never missed while maintaining a positive user experience.
                </p>
                <StandardDisclaimer 
                  category="general" 
                  severity="info" 
                  className="mt-4"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Emergency Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  When sensitive topics are discussed, we provide immediate access to emergency resources that can provide professional support.
                </p>
                <EmergencyResources 
                  category="mental_health" 
                  display="inline" 
                  className="mt-4"
                  limit={1}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Professional Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  We connect users with qualified professionals when topics require specialized expertise beyond educational content.
                </p>
                <ProfessionalResources 
                  category="general" 
                  display="compact" 
                  className="mt-4"
                  limit={2}
                  showTitle={false}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Health & Wellness Tab */}
        <TabsContent value="health" className="space-y-6">
          <StandardDisclaimer 
            category="health" 
            severity="info" 
            display="always" 
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Health & Wellness Content Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none">
                <p>
                  Fundamenta provides educational content related to health and wellness to help users learn about general principles of physical and mental wellbeing. This information is designed for learning purposes only.
                </p>
                
                <h3>Important Limitations</h3>
                <ul>
                  <li>Content is educational in nature, not medical advice</li>
                  <li>Information is general and not personalized to individual health conditions</li>
                  <li>Guidance cannot account for individual medical history or circumstances</li>
                  <li>Content should not be used to diagnose or treat health conditions</li>
                </ul>
                
                <h3>When to Seek Professional Help</h3>
                <p>
                  Always consult qualified healthcare professionals for:
                </p>
                <ul>
                  <li>Specific medical questions or concerns</li>
                  <li>Persistent physical or mental health symptoms</li>
                  <li>Before beginning any new diet, exercise, or wellness program</li>
                  <li>Guidance on managing existing health conditions</li>
                </ul>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Professional Resources</h3>
                <ProfessionalResources 
                  category="health" 
                  display="list" 
                  showTitle={false}
                />
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Emergency Resources</h3>
                <EmergencyResources category="mental_health" display="banner" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Financial Guidance Tab */}
        <TabsContent value="financial" className="space-y-6">
          <StandardDisclaimer 
            category="finance" 
            severity="warning" 
            display="always" 
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Financial Content Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose max-w-none">
                <p>
                  Fundamenta provides educational content related to personal finance to help users learn about general principles of financial literacy. This information is designed for learning purposes only.
                </p>
                
                <h3>Important Limitations</h3>
                <ul>
                  <li>Content is educational in nature, not financial advice</li>
                  <li>Information is general and not personalized to individual financial situations</li>
                  <li>Guidance cannot account for individual financial circumstances, goals, or risk tolerance</li>
                  <li>Content should not be the sole basis for making financial decisions</li>
                </ul>
                
                <h3>When to Seek Professional Help</h3>
                <p>
                  Always consult qualified financial professionals for:
                </p>
                <ul>
                  <li>Specific investment or financial planning advice</li>
                  <li>Tax guidance or planning</li>
                  <li>Retirement or estate planning</li>
                  <li>Guidance on managing debt or major financial decisions</li>
                </ul>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Professional Resources</h3>
                <ProfessionalResources 
                  category="finance" 
                  display="list" 
                  showTitle={false}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Emergency Resources Tab */}
        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Support Resources</CardTitle>
              <CardDescription>
                If you're experiencing an emergency, please contact appropriate services immediately
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Mental Health Resources</h3>
                  <EmergencyResources category="mental_health" display="card" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Domestic Violence Resources</h3>
                  <EmergencyResources category="domestic_violence" display="card" />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Substance Abuse Resources</h3>
                  <EmergencyResources category="substance_abuse" display="card" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}