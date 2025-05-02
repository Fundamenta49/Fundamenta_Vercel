import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { emergencyResources, type EmergencyResourceCategory, type EmergencyResource } from "@shared/emergency-resources";
import { ExternalLink, Phone } from "lucide-react";

type EmergencyResourcesDisplayType = "inline" | "banner" | "card" | "modal";

interface EmergencyResourcesProps {
  category?: EmergencyResourceCategory;
  display?: EmergencyResourcesDisplayType;
  className?: string;
  limit?: number;
}

export function EmergencyResources({
  category = "global",
  display = "card",
  className = "",
  limit
}: EmergencyResourcesProps) {
  const resources = emergencyResources[category] || emergencyResources.global;
  const displayResources = limit ? resources.slice(0, limit) : resources;

  // Different display styles based on the display prop
  switch (display) {
    case "inline":
      return (
        <div className={`emergency-resources-inline text-sm ${className}`}>
          {displayResources.map((resource, index) => (
            <span key={resource.name} className="inline-block mr-6 last:mr-0">
              <strong>{resource.name}:</strong> {resource.contact}
              {index < displayResources.length - 1 && " • "}
            </span>
          ))}
        </div>
      );

    case "banner":
      return (
        <div className={`emergency-resources-banner bg-red-50 border border-red-200 p-3 rounded-md ${className}`}>
          <h3 className="text-red-700 font-medium text-sm flex items-center">
            <Phone className="h-4 w-4 mr-1" /> Emergency Resources
          </h3>
          <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
            {displayResources.map(resource => (
              <div key={resource.name} className="text-xs text-red-900">
                <div className="font-semibold">{resource.name}: {resource.contact}</div>
                {resource.hours && <div className="text-red-700 text-xs">{resource.hours}</div>}
              </div>
            ))}
          </div>
        </div>
      );

    case "modal":
      return (
        <div className={`emergency-resources-modal p-4 ${className}`}>
          <h2 className="text-xl font-bold text-red-700 mb-4">Emergency Resources</h2>
          {displayResources.map(resource => (
            <div key={resource.name} className="mb-4 last:mb-0">
              <h3 className="font-semibold text-lg">{resource.name}</h3>
              <div className="text-lg font-medium">{resource.contact}</div>
              {resource.hours && <div className="text-sm opacity-80">{resource.hours}</div>}
              <p className="mt-1">{resource.description}</p>
              {resource.website && (
                <a 
                  href={resource.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center mt-1 text-sm"
                >
                  Visit website <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
            </div>
          ))}
        </div>
      );

    case "card":
    default:
      return (
        <Card className={`emergency-resources-card ${className}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-red-700 flex items-center">
              <Phone className="h-4 w-4 mr-2" /> Emergency Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {displayResources.map(resource => (
                <ResourceItem key={resource.name} resource={resource} />
              ))}
            </div>
          </CardContent>
        </Card>
      );
  }
}

function ResourceItem({ resource }: { resource: EmergencyResource }) {
  return (
    <div className="resource-item">
      <div className="font-medium">{resource.name}</div>
      <div className="flex items-center text-sm">
        <Phone className="h-3 w-3 mr-1 text-red-600" />
        <span className="font-mono">{resource.contact}</span>
        {resource.hours && <span className="ml-2 text-xs opacity-70">{resource.hours}</span>}
      </div>
      <p className="text-xs mt-1 text-gray-600">{resource.description}</p>
      {resource.website && (
        <a 
          href={resource.website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center mt-1"
        >
          Website <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      )}
    </div>
  );
}