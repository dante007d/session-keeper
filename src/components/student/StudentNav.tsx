import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/authStore";

const STUDENT_TABS = [
  { id: "home", icon: "⊞", label: "Home", path: "/student/home" },
  { id: "attendance", icon: "✓", label: "Attendance", path: "/student/attendance" },
  { id: "sessions", icon: "📋", label: "Sessions", path: "/student/sessions" },
  { id: "tools", icon: "🛠", label: "Tools", path: "/student/tools" },
  { id: "profile", icon: "👤", label: "Profile", path: "/student/profile" },
];

export function StudentNav() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden md:flex fixed top-4 z-50 items-center gap-1 px-2 py-2
                     glass rounded-[2rem] shadow-elevated
                     whitespace-nowrap"
           style={{ left: "50%", transform: "translateX(-50%)" }}>
        
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-xl mr-2">
          <div className="w-5 h-5 rounded-full bg-primary flex items-center
                         justify-center text-primary-foreground text-[9px] font-bold">
            {user?.name?.[0]}
          </div>
          <span className="text-xs font-bold text-primary">
            {user?.name?.split(" ")[0]}
          </span>
        </div>

        {STUDENT_TABS.map(tab => (
          <Link key={tab.id} to={tab.path}>
            <div className={`px-4 py-2 rounded-xl font-bold
                           text-[10px] tracking-widest uppercase transition-all duration-200
                           ${location.pathname === tab.path
                             ? "bg-foreground text-background"
                             : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                           }`}>
              {tab.label}
            </div>
          </Link>
        ))}
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50
                     bg-background/90 backdrop-blur-xl
                     border-t border-border/40
                     flex items-center justify-around px-2 py-2 pb-6">
        {STUDENT_TABS.map(tab => (
          <Link key={tab.id} to={tab.path} className="flex flex-col items-center gap-0.5">
            <div className={`w-10 h-8 flex items-center justify-center rounded-xl
                           text-lg transition-all duration-200
                           ${location.pathname === tab.path
                             ? "bg-primary/10 text-primary scale-110 shadow-inner"
                             : "text-muted-foreground"
                           }`}>
              {tab.icon}
            </div>
            <span className={`text-[8px] font-bold uppercase tracking-widest
                            ${location.pathname === tab.path
                              ? "text-primary" : "text-muted-foreground"}`}>
              {tab.label}
            </span>
          </Link>
        ))}
      </nav>
    </>
  );
}
