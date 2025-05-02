import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { professionalResources, type ProfessionalResourceCategory } from "@shared/professional-resources";
import { ExternalLink } from "lucide-react";
import { Link } from "wouter";

interface ProfessionalResourcesProps {
  category?: ProfessionalResourceCategory;
  limit?: number;
  display?: "grid" | "list" | "compact";
  className?: string;
  showTitle?: boolean;
  title?: string;
}

export function ProfessionalResources({
  category = "general",
  limit,
  display = "grid",
  className = "",
  showTitle = true,
  title = "Professional Resources"
}: ProfessionalResourcesProps) {
  const resources = professionalResources[category] || professionalResources.general;
  const displayResources = limit ? resources.slice(0, limit) : resources;

  return (
    <div className={`professional-resources ${className}`}>
      {showTitle && (
        <h3 className="text-lg font-medium mb-4">{title}</h3>
      )}
      
      {display === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayResources.map(resource => (
            <ResourceCard key={resource.title} resource={resource} />
          ))}
        </div>
      )}
      
      {display === "list" && (
        <div className="space-y-3">
          {displayResources.map(resource => (
            <ResourceListItem key={resource.title} resource={resource} />
          ))}
        </div>
      )}
      
      {display === "compact" && (
        <div className="space-y-2">
          {displayResources.map(resource => (
            <ResourceCompactItem key={resource.title} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceCard({ resource }: { resource: { title: string; description: string; link?: string; externalLink?: string; } }) {
  return (
    <Card className="professional-resource-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{resource.title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600">{resource.description}</p>
      </CardContent>
      <CardFooter>
        {resource.link ? (
          <Link 
            href={resource.link} 
            className="text-primary text-sm font-medium hover:underline flex items-center"
          >
            Learn more
          </Link>
        ) : resource.externalLink ? (
          <a 
            href={resource.externalLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary text-sm font-medium hover:underline flex items-center"
          >
            Visit website <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        ) : null}
      </CardFooter>
    </Card>
  );
}

function ResourceListItem({ resource }: { resource: { title: string; description: string; link?: string; externalLink?: string; } }) {
  return (
    <div className="resource-list-item border-b border-gray-100 pb-3">
      <h4 className="font-medium">{resource.title}</h4>
      <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
      <div className="mt-2">
        {resource.link ? (
          <Link 
            href={resource.link} 
            className="text-primary text-sm font-medium hover:underline flex items-center"
          >
            Learn more
          </Link>
        ) : resource.externalLink ? (
          <a 
            href={resource.externalLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary text-sm font-medium hover:underline flex items-center"
          >
            Visit website <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        ) : null}
      </div>
    </div>
  );
}

function ResourceCompactItem({ resource }: { resource: { title: string; description: string; link?: string; externalLink?: string; } }) {
  return (
    <div className="resource-compact-item">
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-sm">{resource.title}</h4>
        <div className="flex-shrink-0 ml-2">
          {resource.link ? (
            <Link 
              href={resource.link} 
              className="text-primary text-xs font-medium hover:underline"
            >
              More
            </Link>
          ) : resource.externalLink ? (
            <a 
              href={resource.externalLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary text-xs font-medium hover:underline flex items-center"
            >
              Visit <ExternalLink className="h-2 w-2 ml-1" />
            </a>
          ) : null}
        </div>
      </div>
      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{resource.description}</p>
    </div>
  );
}