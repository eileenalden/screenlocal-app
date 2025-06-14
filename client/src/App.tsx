// © Eileen Alden, 2025. All rights reserved. This software and its components are the original work of Eileen Alden, developed without compensation. No rights are granted or implied for use or distribution without a signed agreement.

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import ResourceCategory from "@/pages/resource-category";
import ProjectProfile from "@/pages/project-profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/locations" component={ResourceCategory} />
      <Route path="/crew" component={ResourceCategory} />
      <Route path="/cast" component={ResourceCategory} />
      <Route path="/services" component={ResourceCategory} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
