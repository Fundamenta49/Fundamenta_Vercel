import React from 'react'
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>Hello World</h1>
      </div>
    </QueryClientProvider>
  )
}

export default App