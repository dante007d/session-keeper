import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/new", label: "Create" },
];

const Navbar = () => {
  const location = useLocation();
  const isDetail = location.pathname.startsWith("/session/");

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl"
    >
      <nav className="glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shadow-glow-red transition-spring group-hover:scale-105">
              <span className="font-mono font-bold text-[11px] text-primary-foreground">B</span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
          </div>
          <div className="leading-none">
            <p className="text-[13px] font-semibold tracking-tight">BEC DEV</p>
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Attendance/v2</p>
          </div>
        </NavLink>

        <div className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-secondary/40 border border-border">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-smooth",
                  isActive || (isDetail && l.to === "/")
                    ? "text-foreground bg-background shadow-elevated"
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/60 border border-border">
          <span className="h-1.5 w-1.5 rounded-full bg-present animate-pulse-dot" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Live</span>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
