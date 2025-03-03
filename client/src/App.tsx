import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useTimeGradient } from "@/hooks/use-time-gradient";
import Navigation from "@/components/navigation";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Emergency from "@/pages/emergency";
import Finance from "@/pages/finance";
import Career from "@/pages/career";
import Wellness from "@/pages/wellness";
import LifeSkills from "@/pages/life-skills";

function Router() {
  const { primary, secondary } = useTimeGradient();

  return (
    <div 
      className="min-h-screen bg-background"
      style={{
        background: `linear-gradient(135deg, ${primary}, ${secondary})`,
        transition: 'background 3s ease',
      }}
    >
      <Navigation />
      <main className="container mx-auto px-4 py-8 transition-all duration-300 md:ml-[var(--sidebar-width)]">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/emergency" component={Emergency} />
          <Route path="/finance" component={Finance} />
          <Route path="/career" component={Career} />
          <Route path="/wellness" component={Wellness} />
          <Route path="/life-skills" component={LifeSkills} />
          <Route component={NotFound} />
        </Switch>
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