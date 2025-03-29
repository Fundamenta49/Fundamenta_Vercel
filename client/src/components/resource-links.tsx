import { ExternalLink, BookOpen, Video, FileText, Lightbulb, Award, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "article" | "video" | "tool" | "book" | "course" | "practice";
  level: "beginner" | "intermediate" | "advanced";
  duration?: string;
  free?: boolean;
  tags?: string[];
}

interface ResourceLinksProps {
  subject: string;
  resources?: Resource[];
  initialActiveTab?: string;
  maxHeight?: string;
  className?: string;
  onResourceClick?: (resource: Resource) => void;
}

export default function ResourceLinks({
  subject,
  resources = [],
  initialActiveTab = "all",
  maxHeight = "500px",
  className = "",
  onResourceClick
}: ResourceLinksProps) {
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredResources(resources);
    } else {
      setFilteredResources(resources.filter(resource => resource.type === activeTab));
    }
  }, [activeTab, resources]);
  
  const handleResourceClick = (resource: Resource) => {
    if (onResourceClick) {
      onResourceClick(resource);
    } else {
      window.open(resource.url, "_blank");
    }
  };
  
  const resourceTypes = [
    { id: "all", label: "All", icon: Lightbulb },
    { id: "article", label: "Articles", icon: FileText },
    { id: "video", label: "Videos", icon: Video },
    { id: "book", label: "Books", icon: BookOpen },
    { id: "course", label: "Courses", icon: Award },
    { id: "practice", label: "Practice", icon: Activity },
    { id: "tool", label: "Tools", icon: ExternalLink }
  ];
  
  // Count resources by type
  const resourceCounts = resourceTypes.reduce((acc, type) => {
    if (type.id === "all") {
      acc[type.id] = resources.length;
    } else {
      acc[type.id] = resources.filter(r => r.type === type.id).length;
    }
    return acc;
  }, {} as Record<string, number>);
  
  // Only show tabs with resources
  const availableTabs = resourceTypes.filter(type => 
    type.id === "all" || resourceCounts[type.id] > 0
  );
  
  const ResourceIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "video":
        return <Video className="h-4 w-4 text-red-500" />;
      case "book":
        return <BookOpen className="h-4 w-4 text-purple-500" />;
      case "course":
        return <Award className="h-4 w-4 text-orange-500" />;
      case "tool":
        return <ExternalLink className="h-4 w-4 text-green-500" />;
      case "practice":
        return <Activity className="h-4 w-4 text-yellow-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-slate-500" />;
    }
  };
  
  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="text-lg">{subject} Resources</CardTitle>
        <CardDescription>Curated resources to help master these skills</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start px-6 pt-2 overflow-x-auto flex-wrap">
            {availableTabs.map(type => (
              <TabsTrigger key={type.id} value={type.id} className="flex items-center gap-1">
                <type.icon className="h-4 w-4" />
                <span>{type.label}</span>
                <span className="ml-1 text-xs bg-slate-100 px-1.5 py-0.5 rounded-full">
                  {resourceCounts[type.id]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {availableTabs.map(type => (
            <TabsContent key={type.id} value={type.id} className="m-0">
              <ScrollArea className={`max-h-[${maxHeight}]`}>
                <div className="px-6 py-4 space-y-3">
                  {filteredResources.length > 0 ? (
                    filteredResources.map(resource => (
                      <div 
                        key={resource.id}
                        className="overflow-hidden rounded-lg border hover:shadow-md transition-all duration-200"
                      >
                        <div className="p-4 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-md ${
                              resource.type === "article" ? "bg-blue-100 text-blue-700" :
                              resource.type === "video" ? "bg-red-100 text-red-700" :
                              resource.type === "book" ? "bg-purple-100 text-purple-700" :
                              resource.type === "course" ? "bg-orange-100 text-orange-700" :
                              resource.type === "tool" ? "bg-green-100 text-green-700" :
                              resource.type === "practice" ? "bg-yellow-100 text-yellow-700" :
                              "bg-slate-100 text-slate-700"
                            }`}>
                              <ResourceIcon type={resource.type} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-md">{resource.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex gap-1.5">
                              {resource.free !== undefined && (
                                <span className={`text-xs ${resource.free ? "bg-green-50 text-green-700" : "bg-slate-50 text-slate-700"} px-2 py-0.5 rounded-full`}>
                                  {resource.free ? "Free" : "Paid"}
                                </span>
                              )}
                              <span className={`text-xs ${
                                resource.level === "beginner" ? "bg-green-50 text-green-700" :
                                resource.level === "intermediate" ? "bg-yellow-50 text-yellow-700" :
                                "bg-red-50 text-red-700"
                              } px-2 py-0.5 rounded-full`}>
                                {resource.level.charAt(0).toUpperCase() + resource.level.slice(1)}
                              </span>
                              {resource.duration && (
                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                  {resource.duration}
                                </span>
                              )}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-xs"
                              onClick={() => handleResourceClick(resource)}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Open
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <p>No {type.id !== "all" ? type.label.toLowerCase() : "resources"} available for this subject yet.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter className="px-6 py-3 text-xs text-slate-500">
        Resources are curated based on your learning progress and interests
      </CardFooter>
    </Card>
  );
}