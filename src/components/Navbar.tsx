import { memo } from "react";
import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import PastSessionsDrawer from "./PastSessionsDrawer";
import ThemeToggle from "./ThemeToggle";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/new", label: "Create" },
  { to: "/members", label: "Roster" },
  { to: "/analytics", label: "Analytics" },
];

const Navbar = () => {
  const location = useLocation();
  const isDetail = location.pathname.startsWith("/session/");

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="fixed top-0 inset-x-0 z-50"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="glass border-b border-border/40">
        <nav className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between gap-4">
          {/* Left — Logo */}
          <NavLink to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-glow-amber transition-spring group-hover:scale-105">
                <span className="font-mono font-bold text-xs text-primary-foreground">B</span>
              </div>
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
            </div>
            <div className="leading-none hidden sm:block">
              <p className="text-sm font-semibold tracking-tight">BEC DEV</p>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Attendance</p>
            </div>
          </NavLink>

          {/* Center — Nav links */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-secondary/40 border border-border">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "relative px-4 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider transition-smooth",
                    isActive || (isDetail && l.to === "/")
                      ? "text-foreground bg-background shadow-elevated font-semibold"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-2">
            <PastSessionsDrawer />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </motion.header>
  );
};

export default memo(Navbar);
