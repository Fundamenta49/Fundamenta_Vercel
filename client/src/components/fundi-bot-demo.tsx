import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FundiBot } from './FundiBot';

export default function FundiBotDemo() {
  return (
    <Card className="w-[350px] mb-6 overflow-hidden">
      <CardHeader>
        <CardTitle>Fundi AI Assistant</CardTitle>
        <CardDescription>
          Sleek, modern design with animations
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center bg-gradient-to-b from-slate-50 to-slate-100 py-8">
        <FundiBot />
      </CardContent>
      <CardFooter className="border-t flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Modern AI Design</span>
        <span className="text-xs text-muted-foreground">(Hover for animations)</span>
      </CardFooter>
    </Card>
  );
}