import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import BottomNavigation from "@/components/BottomNavigation";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Nearby from "@/pages/Nearby";
import Messages from "@/pages/Messages";
import Conversation from "@/pages/Conversation";
import Profile from "@/pages/Profile";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import JobDetails from "@/pages/JobDetails";
import PostJob from "@/pages/PostJob";
import PaymentPage from "@/pages/PaymentPage";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }

  return <Component />;
}

function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    setLocation('/');
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login">
        {() => <PublicRoute component={Login} />}
      </Route>
      <Route path="/register">
        {() => <PublicRoute component={Register} />}
      </Route>

      {/* Protected routes */}
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
      <Route path="/conversation/:userId">
        {() => <ProtectedRoute component={Conversation} />}
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
      <Route path="/post-job">
        {() => <ProtectedRoute component={PostJob} />}
      </Route>
      <Route path="/jobs/:id/payment">
        {() => <ProtectedRoute component={PaymentPage} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const hideNavigation = location === '/login' || location === '/register' || location.startsWith('/conversation/') || !isAuthenticated;

  return (
    <div className="relative">
      <Router />
      {!hideNavigation && <BottomNavigation />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
