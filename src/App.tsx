import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { pageTransitionEffect } from "./animations/pageTransitions";
import { CustomCursor } from "./components/CustomCursor";
import { CommandPalette } from "./components/CommandPalette";
import { ShortcutHelp } from "./components/ShortcutHelp";
import { useState, useRef, useEffect } from "react";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateSession = lazy(() => import("./pages/CreateSession"));
const SessionDetail = lazy(() => import("./pages/SessionDetail"));
const Members = lazy(() => import("./pages/Members"));
const Analytics = lazy(() => import("./pages/Analytics"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-screen pt-32 px-6">
    <div className="mx-auto max-w-6xl space-y-4">
      <div className="h-10 w-48 rounded-xl bg-secondary/60 animate-pulse" />
      <div className="h-64 rounded-3xl bg-secondary/40 animate-pulse" />
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const prevLocation = useRef(location.pathname);
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location.pathname !== prevLocation.current) {
      pageTransitionEffect(() => {
        setDisplayLocation(location);
        prevLocation.current = location.pathname;
        
        // After DOM updates, trigger the enter animation
        setTimeout(() => {
          const content = document.querySelector('.page-content');
          if (content) {
            import("./animations/pageTransitions").then(m => m.pageEnter(content as HTMLElement));
          }
        }, 50);
      });
    }
  }, [location, location.pathname]);

  return (
    <div className="page-content min-h-screen relative z-10">
      <Suspense fallback={<RouteFallback />}>
        <Routes location={displayLocation}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<CreateSession />} />
          <Route path="/session/:id" element={<SessionDetail />} />
          <Route path="/members" element={<Members />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
};

import { WelcomeScreen } from "./components/WelcomeScreen";

import { motion } from "framer-motion";

const App = () => {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        <CustomCursor />

        {showWelcome ? (
          <WelcomeScreen onComplete={handleWelcomeComplete} />
        ) : (
          <BrowserRouter>
            <CommandPalette />
            <ShortcutHelp />
            <AnimatedRoutes />
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
