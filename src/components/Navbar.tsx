import { memo } from "react";
import { useEffect, useRef } from "react";
import anime from "@/lib/anime";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import PastSessionsDrawer from "./PastSessionsDrawer";
import ThemeToggle from "./ThemeToggle";
import { Logo3D } from "./Logo3D";
import { useAuth } from "@/lib/authStore";
import { LogOut } from "lucide-react";

const links = [
  { to: "/teacher/dashboard", label: "Dashboard" },
  { to: "/teacher/new", label: "Create" },
  { to: "/teacher/attendance", label: "Attendance" },
  { to: "/teacher/roster", label: "Roster" },
  { to: "/teacher/analytics", label: "Analytics" },
  { to: "/teacher/announcements", label: "Broadcast" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isDetail = location.pathname.startsWith("/teacher/session/");
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    anime({
      targets: headerRef.current,
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 500,
      easing: 'cubicBezier(0.32, 0.72, 0, 1)'
    });
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 inset-x-0 z-50"
      style={{ opacity: 0, transform: 'translateY(-20px)', willChange: "transform, opacity" }}
    >
      <div className="glass border-b border-border/40">
        <nav className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between gap-4">
          {/* Left — Logo */}
          <NavLink to="/teacher/dashboard" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <Logo3D />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary border-[2px] border-background animate-pulse-dot" />
            </div>
            <div className="leading-none hidden sm:flex items-center gap-2">
              <div className="hidden lg:block">
                <p className="text-[15px] font-bold tracking-tight">DEV CLUB</p>
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-semibold mt-[2px]">Teacher Portal</p>
              </div>
              <div className="px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-[9px] font-bold text-primary uppercase tracking-widest ml-1">
                Teacher
              </div>
            </div>
          </NavLink>

          {/* Center — Nav links */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-secondary/40 border border-border">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/teacher/dashboard"}
                className={({ isActive }) =>
                  cn(
                    "relative px-4 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider transition-smooth",
                    isActive || (isDetail && l.to === "/teacher/dashboard")
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
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/50 border border-border/60 text-muted-foreground hover:border-primary/50 hover:text-primary cursor-pointer transition-all duration-200 mr-2" onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', {'key': 'k', 'ctrlKey': true}))}>
               <span className="text-[10px] font-bold uppercase tracking-widest">Search</span>
               <kbd className="font-mono text-[9px] bg-background px-1.5 py-0.5 rounded border border-border shadow-sm">⌘K</kbd>
            </div>
            <ThemeToggle />
            <button 
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 ml-2"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-6 inset-x-6 z-50">
        <div className="glass rounded-full border border-border/40 p-1.5 flex items-center justify-between shadow-elevated overflow-x-auto no-scrollbar">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/teacher/dashboard"}
              className={({ isActive }) =>
                cn(
                  "relative flex-1 flex justify-center py-2.5 px-3 rounded-full text-[9px] font-mono uppercase tracking-wider transition-smooth",
                  isActive || (isDetail && l.to === "/teacher/dashboard")
                    ? "text-foreground bg-background/50 shadow-sm font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};

export default memo(Navbar);
