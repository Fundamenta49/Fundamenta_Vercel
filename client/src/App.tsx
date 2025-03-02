import React from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold">Financial Planning App</h1>
          <p>Welcome to your financial planning journey.</p>
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;