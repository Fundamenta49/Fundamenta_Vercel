import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "@/components/navigation";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import WhyFundamenta from "@/pages/why-fundamenta";
import Partner from "@/pages/partner";
import Privacy from "@/pages/privacy";
import Invite from "@/pages/invite";
import Emergency from "@/pages/emergency";
import Finance from "@/pages/finance";
import Career from "@/pages/career";
import Wellness from "@/pages/wellness";
import Active from "@/pages/active";
import Learning from "@/pages/learning";
import WelcomeTour from "@/components/welcome-tour";
import { createContext, useState } from "react";

export const SidebarContext = createContext<{
  isMinimized: boolean;
  setIsMinimized: (value: boolean) => void;
}>({
  isMinimized: false,
  setIsMinimized: () => {},
});

function Router() {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <SidebarContext.Provider value={{ isMinimized, setIsMinimized }}>
      <div className="min-h-screen flex bg-background">
        <Navigation />
        <main style={{ marginLeft: isMinimized ? '80px' : '256px' }} className="flex-1 relative overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="mx-auto max-w-5xl space-y-6">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/why-fundamenta" component={WhyFundamenta} />
                <Route path="/partner" component={Partner} />
                <Route path="/privacy" component={Privacy} />
                <Route path="/invite" component={Invite} />
                <Route path="/emergency" component={Emergency} />
                <Route path="/finance" component={Finance} />
                <Route path="/career" component={Career} />
                <Route path="/wellness" component={Wellness} />
                <Route path="/active" component={Active} />
                <Route path="/learning" component={Learning} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
        </main>
        <WelcomeTour />
        <Toaster />
      </div>
    </SidebarContext.Provider>
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