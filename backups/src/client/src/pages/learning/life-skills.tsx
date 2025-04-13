import React, { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LifeSkillsComponent } from "@/components/life-skills";
import IdentityDocumentsGuide from "@/components/identity-documents-guide";

export default function LifeSkillsPage() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  
  // Parse the URL to get the tab parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/learning">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Learning Hub
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Life Skills</h1>
      </div>

      <LifeSkillsComponent initialTab={activeTab} />
    </div>
  );
}