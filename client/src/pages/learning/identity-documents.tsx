import React from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import IdentityDocumentsGuide from "@/components/identity-documents-guide";

export default function IdentityDocumentsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/learning">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Learning Hub
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Identity Documents</h1>
      </div>

      <div className="mb-6">
        <p className="text-muted-foreground">
          Learn how to obtain and use essential identity documents. Select your state to get personalized information about obtaining social security cards, birth certificates, passports, and more.
        </p>
      </div>

      <IdentityDocumentsGuide />
    </div>
  );
}