import { useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNavigation from "@/components/BottomNavigation";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Nearby from "@/pages/Nearby";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import Onboarding from "@/pages/Onboarding";
import JobDetails from "@/pages/JobDetails";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const [, setLocation] = useLocation();
  const onboardingData = localStorage.getItem('onboardingData');

  useEffect(() => {
    if (!onboardingData) {
      setLocation('/onboarding');
    }
  }, [onboardingData, setLocation]);

  if (!onboardingData) {
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/">
        {() => <ProtectedRoute component={Home} />}
      </Route>
      <Route path="/search">
        {() => <ProtectedRoute component={Search} />}
      </Route>
      <Route path="/nearby">
        {() => <ProtectedRoute component={Nearby} />}
      </Route>
      <Route path="/messages">
        {() => <ProtectedRoute component={Messages} />}
      </Route>
      <Route path="/profile">
        {() => <ProtectedRoute component={Profile} />}
      </Route>
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/jobs/:id">
        {() => <ProtectedRoute component={JobDetails} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const hideNavigation = location === '/onboarding';

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="relative">
          <Router />
          {!hideNavigation && <BottomNavigation />}
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
