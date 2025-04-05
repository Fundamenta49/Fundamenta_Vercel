import React from "react";
import { Link } from "wouter";
import { ArrowLeft, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import IdentityDocumentsGuide from "@/components/identity-documents-guide";

export default function IdentityDocumentsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/learning">
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="ml-1">Back</span>
              </Button>
            </Link>
            <div className="h-6 w-px bg-muted"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                <FileText className="h-4 w-4 text-blue-500" />
              </div>
              <h1 className="text-2xl font-bold">Identity Documents</h1>
            </div>
          </div>
          <p className="text-muted-foreground ml-12 md:max-w-[600px]">
            Learn how to obtain and use essential identity documents. Select your state to get personalized information about obtaining social security cards, birth certificates, passports, and more.
          </p>
        </div>
      </div>

      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-100">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">Why This Matters</h2>
              <p className="text-muted-foreground">
                Identity documents like birth certificates, social security cards, and passports are essential for accessing government services, finding employment, opening bank accounts, and much more. Having the right documents ready when you need them can save time and prevent complications when applying for housing, benefits, or other services.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <IdentityDocumentsGuide />
    </div>
  );
}