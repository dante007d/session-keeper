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

const PremiumAmbientBackground = () => (
  <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
    {/* Cinematic Grain Overlay */}
    <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }} />
    
    {/* Dot matrix grid */}
    <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--primary)/0.2)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_50%,#000_10%,transparent_100%)]" />

    {/* High visibility floating ambient lights */}
    <div className="absolute top-[-5%] -left-[5%] w-[40vw] h-[40vw] bg-primary/20 rounded-full blur-[100px]" />
    <div className="absolute bottom-[-5%] -right-[5%] w-[35vw] h-[35vw] bg-primary/20 rounded-full blur-[100px]" />

    {/* Premium Typography Watermark - Outline Style - Now visible on all screens */}
    <div className="absolute top-[30%] -left-8 text-[15vw] font-black text-transparent tracking-tighter rotate-90 origin-left select-none opacity-50" style={{ WebkitTextStroke: "2px hsl(var(--primary))" }}>
      DEV
    </div>
    <div className="absolute top-[70%] -right-8 text-[15vw] font-black text-transparent tracking-tighter -rotate-90 origin-right select-none opacity-50" style={{ WebkitTextStroke: "2px hsl(var(--primary))" }}>
      CLUB
    </div>
  </div>
);

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
            <PremiumAmbientBackground />
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
