import React from 'react'
import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Finance from "@/pages/finance";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto px-4 py-8">
          <Switch>
            <Route path="/" component={Finance} />
            <Route path="/finance" component={Finance} />
          </Switch>
        </main>
        <Toaster />
      </div>
    </QueryClientProvider>
  )
}