import { useEffect, useState, useCallback } from "react";

export type Role = "student" | "teacher" | null;

interface User {
  name: string;
  role: Role;
}

const ROLE_KEY = "bec_role";
const USER_KEY = "bec_user";

export function useAuth() {
  const [role, setRole] = useState<Role>(() => (sessionStorage.getItem(ROLE_KEY) as Role) || null);
  const [user, setUser] = useState<User | null>(() => {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    const sync = () => {
      setRole((sessionStorage.getItem(ROLE_KEY) as Role) || null);
      const raw = sessionStorage.getItem(USER_KEY);
      setUser(raw ? JSON.parse(raw) : null);
    };
    // Note: sessionStorage does not trigger 'storage' events across tabs
    // We only use internal events for same-tab updates if needed
    window.addEventListener("bec:auth-updated", sync);
    return () => {
      window.removeEventListener("bec:auth-updated", sync);
    };
  }, []);

  const loginAsTeacher = useCallback((passcode: string) => {
    if (passcode === "BEC2025") {
      const u: User = { name: "Teacher", role: "teacher" };
      sessionStorage.setItem(ROLE_KEY, "teacher");
      sessionStorage.setItem(USER_KEY, JSON.stringify(u));
      setRole("teacher");
      setUser(u);
      window.dispatchEvent(new CustomEvent("bec:auth-updated"));
      return true;
    }
    return false;
  }, []);

  const loginAsStudent = useCallback((name: string) => {
    const u: User = { name, role: "student" };
    sessionStorage.setItem(ROLE_KEY, "student");
    sessionStorage.setItem(USER_KEY, JSON.stringify(u));
    setRole("student");
    setUser(u);
    window.dispatchEvent(new CustomEvent("bec:auth-updated"));
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ROLE_KEY);
    sessionStorage.removeItem(USER_KEY);
    setRole(null);
    setUser(null);
    window.dispatchEvent(new CustomEvent("bec:auth-updated"));
  }, []);

  return { role, user, loginAsTeacher, loginAsStudent, logout };
}
