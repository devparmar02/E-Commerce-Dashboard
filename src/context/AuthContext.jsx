import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      if (storedUser.expiry && Date.now() > storedUser.expiry) {
        localStorage.removeItem("user");
        toast.error("Session expired. Please login again.");
      } else {
        setUser(storedUser);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user?.expiry) return;
    const remaining = user.expiry - Date.now();
    if (remaining <= 0) { logout(); return; }
    const timer = setTimeout(() => {
      logout();
      toast.error("Session expired. Please login again.");
    }, remaining);
    return () => clearTimeout(timer);
  }, [user]);

  const register = (name, email, password) => {
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    if (existingUsers.find((u) => u.email === email)) {
      toast.error("Email already registered!");
      return false;
    }
    existingUsers.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(existingUsers));
    toast.success("Account created! Please login.");
    navigate("/login");
    return true;
  };

  const login = (email, password) => {
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const validUser = existingUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (validUser) {
      const sessionUser = { ...validUser, expiry: Date.now() + 5 * 60 * 1000 };
      localStorage.setItem("user", JSON.stringify(sessionUser));
      setUser(sessionUser);
      toast.success(`Welcome back, ${validUser.name}!`);
      navigate("/dashboard");
      return true;
    } else {
      toast.error("Invalid email or password");
      return false;
    }
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updated = existingUsers.map((u) =>
      u.email === user.email ? { ...u, ...updatedData } : u
    );
    localStorage.setItem("users", JSON.stringify(updated));
    setUser(updatedUser);
    toast.success("Profile updated successfully!");
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateProfile, theme, toggleTheme }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
