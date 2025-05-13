/**
 * Zone Page Component
 * 
 * Displays a specific learning zone and its associated modules
 * Implements the following:
 * 1. Dynamic routing with URL parameter extraction
 * 2. Module filtering based on zone category
 * 3. Module fallback handling with placeholder message
 * 4. Theme-aware title and styling
 */

import * as React from "react";
import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getZoneById, LearningZone } from "@/data/zones-config";
import { learningPathways, LearningPathway, PathwayModule } from "@/pages/learning/pathways-data";
import { useTheme } from "@/contexts/LearningThemeContext";
import { ModuleCard } from "@/components/learning/ModuleCard";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";

export default function ZonePage() {
  const [location] = useLocation();
  const { theme } = useTheme();
  
  // State to store the current zone and associated modules
  const [currentZone, setCurrentZone] = useState<LearningZone | null>(null);
  const [zoneModules, setZoneModules] = useState<PathwayModule[]>([]);
  
  useEffect(() => {
    // Extract zoneId from URL parameters
    const params = new URLSearchParams(window.location.search);
    const zoneId = params.get('id');
    
    if (zoneId) {
      // Find the zone by its ID
      const zone = getZoneById(zoneId);
      
      if (zone) {
        setCurrentZone(zone);
        
        // Filter modules based on zone.category === module.category as specified in requirements
        const filteredPathways = learningPathways.filter(
          pathway => pathway.category === zone.category
        );
        
        // Flatten modules from matching pathways
        const modules = filteredPathways.flatMap(pathway => pathway.modules);
        setZoneModules(modules);
      }
    }
  }, [location]);
  
  if (!currentZone) {
    return (
      <Container className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Zone Not Found</h1>
        <p className="mb-6">The requested learning zone could not be found.</p>
        <Button asChild>
          <Link href="/learning-hub">
            Return to Learning Hub
          </Link>
        </Button>
      </Container>
    );
  }
  
  // Set theme-specific styling
  const containerClasses = theme === "jungle" 
    ? "bg-[#1E4A3D] text-white min-h-screen" 
    : "";
  
  // Get theme-appropriate zone title and description
  const zoneTitle = theme === "jungle" 
    ? currentZone.title.jungle 
    : currentZone.title.standard;
  
  const zoneDescription = theme === "jungle"
    ? currentZone.description.jungle
    : currentZone.description.standard;
  
  return (
    <Container className={containerClasses}>
      <div className="py-8 space-y-8">
        <Button 
          variant="outline" 
          className="mb-6"
          asChild
        >
          <Link href="/learning-hub">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Learning Hub
          </Link>
        </Button>
        
        <PageHeader 
          title={zoneTitle} 
          description={zoneDescription}
        />
        
        <div className="space-y-6">
          <h2 className={`text-xl font-semibold ${theme === "jungle" ? "text-amber-300" : "text-slate-800"}`}>
            Available Modules
          </h2>
          
          {zoneModules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {zoneModules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          ) : (
            // Display fallback message as specified in requirements
            <div className={`p-8 text-center rounded-lg border ${
              theme === "jungle" ? "border-amber-700 bg-[#28362E] text-white" : "border-slate-200"
            }`}>
              <p className="text-lg">Modules for this zone are coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}