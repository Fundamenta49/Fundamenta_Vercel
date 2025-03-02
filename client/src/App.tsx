import React from 'react';
import { Route, Switch, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Career Development Platform</h1>
        <p className="mt-4 text-muted-foreground">Welcome to your professional growth journey.</p>
      </main>
    </div>
  );
};

export default App;