import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/navigation";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Emergency from "@/pages/emergency";
import Finance from "@/pages/finance";
import Career from "@/pages/career";
import Wellness from "@/pages/wellness";
import Learning from "@/pages/learning";

function Router() {
  return (
    <div className="min-h-screen flex overflow-hidden bg-texture">
      <Navigation />
      <main className="flex-1 relative h-screen overflow-y-auto">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/emergency" component={Emergency} />
            <Route path="/finance" component={Finance} />
            <Route path="/career" component={Career} />
            <Route path="/wellness" component={Wellness} />
            <Route path="/learning" component={Learning} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;