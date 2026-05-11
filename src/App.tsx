import { lazy, Suspense, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { pageTransitionEffect } from "./animations/pageTransitions";
import { CustomCursor } from "./components/CustomCursor";
import { CommandPalette } from "./components/CommandPalette";
import { ShortcutHelp } from "./components/ShortcutHelp";
import { useState, useRef, useEffect } from "react";
import { useAuth, Role } from "@/lib/authStore";

// Teacher Pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateSession = lazy(() => import("./pages/CreateSession"));
const SessionDetail = lazy(() => import("./pages/SessionDetail"));
const Members = lazy(() => import("./pages/Members"));
const Analytics = lazy(() => import("./pages/Analytics"));
const TeacherAnnouncements = lazy(() => import("./pages/teacher/TeacherAnnouncements"));
const TeacherAttendance = lazy(() => import("./pages/teacher/TeacherAttendance"));
const PhantomRoom = lazy(() => import("./pages/teacher/PhantomRoom"));
const AuditLog = lazy(() => import("./pages/teacher/AuditLog"));

// Student Pages
const StudentHome = lazy(() => import("./pages/student/StudentHome"));
const MyAttendance = lazy(() => import("./pages/student/MyAttendance"));
const BrowseSessions = lazy(() => import("./pages/student/BrowseSessions"));
const StudentTools = lazy(() => import("./pages/student/StudentTools"));
const StudentProfile = lazy(() => import("./pages/student/StudentProfile"));
const StudentCheckIn = lazy(() => import("./pages/student/StudentCheckIn"));

// Common
const Login = lazy(() => import("./pages/Login"));
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

const RouteGuard = ({ children, allowedRole }: { children: ReactNode; allowedRole: Role }) => {
  const { role } = useAuth();
  
  if (!role) return <Navigate to="/login" replace />;
  if (role !== allowedRole) {
    return <Navigate to={role === "teacher" ? "/teacher/dashboard" : "/student/home"} replace />;
  }
  
  return <>{children}</>;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const prevLocation = useRef(location.pathname);
  const [displayLocation, setDisplayLocation] = useState(location);
  const { role } = useAuth();

  useEffect(() => {
    if (location.pathname !== prevLocation.current) {
      pageTransitionEffect(() => {
        setDisplayLocation(location);
        prevLocation.current = location.pathname;
        
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
          {/* Public */}
          <Route path="/login" element={role ? <Navigate to={role === "teacher" ? "/teacher/dashboard" : "/student/home"} replace /> : <Login />} />

          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={<RouteGuard allowedRole="teacher"><Dashboard /></RouteGuard>} />
          <Route path="/teacher/new" element={<RouteGuard allowedRole="teacher"><CreateSession /></RouteGuard>} />
          <Route path="/teacher/session/:id" element={<RouteGuard allowedRole="teacher"><SessionDetail /></RouteGuard>} />
          <Route path="/teacher/roster" element={<RouteGuard allowedRole="teacher"><Members /></RouteGuard>} />
          <Route path="/teacher/analytics" element={<RouteGuard allowedRole="teacher"><Analytics /></RouteGuard>} />
          <Route path="/teacher/announcements" element={<RouteGuard allowedRole="teacher"><TeacherAnnouncements /></RouteGuard>} />
          <Route path="/teacher/attendance" element={<RouteGuard allowedRole="teacher"><TeacherAttendance /></RouteGuard>} />
          <Route path="/teacher/phantom" element={<RouteGuard allowedRole="teacher"><PhantomRoom /></RouteGuard>} />
          <Route path="/teacher/audit" element={<RouteGuard allowedRole="teacher"><AuditLog /></RouteGuard>} />

          {/* Student Routes */}
          <Route path="/student/home" element={<RouteGuard allowedRole="student"><StudentHome /></RouteGuard>} />
          <Route path="/student/attendance" element={<RouteGuard allowedRole="student"><MyAttendance /></RouteGuard>} />
          <Route path="/student/sessions" element={<RouteGuard allowedRole="student"><BrowseSessions /></RouteGuard>} />
          <Route path="/student/tools" element={<RouteGuard allowedRole="student"><StudentTools /></RouteGuard>} />
          <Route path="/student/profile" element={<RouteGuard allowedRole="student"><StudentProfile /></RouteGuard>} />
          <Route path="/student/checkin" element={<RouteGuard allowedRole="student"><StudentCheckIn /></RouteGuard>} />

          {/* Defaults */}
          <Route path="/" element={<Navigate to={role ? (role === "teacher" ? "/teacher/dashboard" : "/student/home") : "/login"} replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
};

import { WelcomeScreen } from "./components/WelcomeScreen";

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
