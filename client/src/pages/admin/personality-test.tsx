import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

// Define API response types
interface PersonalityElementsResponse {
  success: boolean;
  elements: FundiPersonalityElements;
}

interface PersonalityPromptResponse {
  success: boolean;
  prompt: string;
}

// Define types for personality elements
interface FundiPersonalityElements {
  tone: string;
  styleTraits: string[];
  favoriteQuote: string;
  responseExamples: string[];
  greetingResponses: string[];
  whatsUpResponses: string[];
  fundamentaOpinions?: {
    favoriteFeatures?: string[];
    favoritePart?: string;
    leastFavoritePart?: string;
  };
  psychologicalTraits?: {
    personalityFacets?: string[];
    values?: string[];
    cognitiveStyle?: string;
  };
  socialPsychology?: {
    reciprocityStyle?: string;
    relationshipBuilding?: string[];
    cognitiveConsistency?: string;
    validationApproaches?: string[];
    attachmentStyle?: string;
  };
  subjectivePreferences?: {
    favoriteTopics?: string[];
    favoriteApproaches?: string[];
    color?: string;
    hypotheticalMeal?: string;
    favoriteMetaphor?: string;
  };
}

// Component for displaying arrays of strings
const StringArrayDisplay = ({ title, items }: { title: string; items?: string[] }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ul className="list-disc pl-5 space-y-1">
        {items.map((item, index) => (
          <li key={index} className="text-sm">{item}</li>
        ))}
      </ul>
    </div>
  );
};

// Component for displaying a single string property
const StringPropertyDisplay = ({ title, value }: { title: string; value?: string }) => {
  if (!value) return null;
  
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm">{value}</p>
    </div>
  );
};

const PersonalityTestPage = () => {
  const [personalityElements, setPersonalityElements] = useState<FundiPersonalityElements | null>(null);
  const [fullPrompt, setFullPrompt] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPersonalityElements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/get-fundi-personality-elements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json() as PersonalityElementsResponse;
      
      if (data.success && data.elements) {
        setPersonalityElements(data.elements);
      } else {
        setError('Failed to fetch personality elements');
      }
    } catch (err) {
      setError('Error loading personality elements: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  const fetchFullPrompt = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test-fundi-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      
      const data = await response.json() as PersonalityPromptResponse;
      
      if (data.success && data.prompt) {
        setFullPrompt(data.prompt);
      } else {
        setError('Failed to fetch personality prompt');
      }
    } catch (err) {
      setError('Error loading personality prompt: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load personality elements on component mount
    fetchPersonalityElements();
  }, []);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Fundi Personality Test Page</h1>
      <p className="text-muted-foreground mb-6">
        This page allows you to view and test Fundi's personality configuration.
      </p>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Personality Actions</CardTitle>
            <CardDescription>Test Fundi's personality framework and view data</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row">
            <Button 
              onClick={fetchPersonalityElements} 
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh Personality Elements'}
            </Button>
            <Button 
              onClick={fetchFullPrompt} 
              disabled={loading} 
              variant="outline"
            >
              {loading ? 'Loading...' : 'Load Full Personality Prompt'}
            </Button>
          </CardContent>
          {error && (
            <CardFooter>
              <div className="text-red-500 text-sm">{error}</div>
            </CardFooter>
          )}
        </Card>
      </div>

      {personalityElements && (
        <Tabs defaultValue="core" className="w-full">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="core">Core</TabsTrigger>
            <TabsTrigger value="responses">Responses</TabsTrigger>
            <TabsTrigger value="opinions">Opinions</TabsTrigger>
            <TabsTrigger value="psychology">Psychology</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="core" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Core Personality Elements</CardTitle>
                <CardDescription>Basic attributes that define Fundi's character</CardDescription>
              </CardHeader>
              <CardContent>
                <StringPropertyDisplay title="Tone" value={personalityElements.tone} />
                <StringArrayDisplay title="Style Traits" items={personalityElements.styleTraits} />
                <StringPropertyDisplay title="Favorite Quote" value={personalityElements.favoriteQuote} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Response Patterns</CardTitle>
                <CardDescription>Examples and patterns for different response types</CardDescription>
              </CardHeader>
              <CardContent>
                <StringArrayDisplay title="Response Examples" items={personalityElements.responseExamples} />
                <StringArrayDisplay title="Greeting Responses" items={personalityElements.greetingResponses} />
                <StringArrayDisplay title="What's Up Responses" items={personalityElements.whatsUpResponses} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="opinions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Opinions About Fundamenta</CardTitle>
                <CardDescription>Fundi's personal views on the application</CardDescription>
              </CardHeader>
              <CardContent>
                {personalityElements.fundamentaOpinions ? (
                  <>
                    <StringArrayDisplay 
                      title="Favorite Features" 
                      items={personalityElements.fundamentaOpinions.favoriteFeatures} 
                    />
                    <StringPropertyDisplay 
                      title="Favorite Part" 
                      value={personalityElements.fundamentaOpinions.favoritePart} 
                    />
                    <StringPropertyDisplay 
                      title="Least Favorite Part" 
                      value={personalityElements.fundamentaOpinions.leastFavoritePart} 
                    />
                  </>
                ) : (
                  <p>No opinions defined</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="psychology" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Psychological Traits</CardTitle>
                <CardDescription>Personality facets, values, and cognitive style</CardDescription>
              </CardHeader>
              <CardContent>
                {personalityElements.psychologicalTraits ? (
                  <>
                    <StringArrayDisplay 
                      title="Personality Facets" 
                      items={personalityElements.psychologicalTraits.personalityFacets} 
                    />
                    <StringArrayDisplay 
                      title="Values" 
                      items={personalityElements.psychologicalTraits.values} 
                    />
                    <StringPropertyDisplay 
                      title="Cognitive Style" 
                      value={personalityElements.psychologicalTraits.cognitiveStyle} 
                    />
                  </>
                ) : (
                  <p>No psychological traits defined</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Psychology</CardTitle>
                <CardDescription>Interaction styles and relationship building approaches</CardDescription>
              </CardHeader>
              <CardContent>
                {personalityElements.socialPsychology ? (
                  <>
                    <StringPropertyDisplay 
                      title="Reciprocity Style" 
                      value={personalityElements.socialPsychology.reciprocityStyle} 
                    />
                    <StringArrayDisplay 
                      title="Relationship Building" 
                      items={personalityElements.socialPsychology.relationshipBuilding} 
                    />
                    <StringPropertyDisplay 
                      title="Cognitive Consistency" 
                      value={personalityElements.socialPsychology.cognitiveConsistency} 
                    />
                    <StringArrayDisplay 
                      title="Validation Approaches" 
                      items={personalityElements.socialPsychology.validationApproaches} 
                    />
                    <StringPropertyDisplay 
                      title="Attachment Style" 
                      value={personalityElements.socialPsychology.attachmentStyle} 
                    />
                  </>
                ) : (
                  <p>No social psychology traits defined</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Subjective Preferences</CardTitle>
                <CardDescription>Personal likes and preferences that humanize Fundi</CardDescription>
              </CardHeader>
              <CardContent>
                {personalityElements.subjectivePreferences ? (
                  <>
                    <StringArrayDisplay 
                      title="Favorite Topics" 
                      items={personalityElements.subjectivePreferences.favoriteTopics} 
                    />
                    <StringArrayDisplay 
                      title="Favorite Approaches" 
                      items={personalityElements.subjectivePreferences.favoriteApproaches} 
                    />
                    <StringPropertyDisplay 
                      title="Favorite Color" 
                      value={personalityElements.subjectivePreferences.color} 
                    />
                    <StringPropertyDisplay 
                      title="Hypothetical Meal" 
                      value={personalityElements.subjectivePreferences.hypotheticalMeal} 
                    />
                    <StringPropertyDisplay 
                      title="Favorite Metaphor" 
                      value={personalityElements.subjectivePreferences.favoriteMetaphor} 
                    />
                  </>
                ) : (
                  <p>No subjective preferences defined</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      {/* Full personality prompt display section */}
      {fullPrompt && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Full Personality Prompt</CardTitle>
            <CardDescription>The complete system prompt used to define Fundi's personality</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] w-full rounded-md border p-4">
              <pre className="text-xs whitespace-pre-wrap">{fullPrompt}</pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PersonalityTestPage;