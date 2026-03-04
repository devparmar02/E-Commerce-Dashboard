import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Clock } from "lucide-react";

const SessionTimer = () => {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!user?.expiry) return;
    const update = () => {
      const remaining = Math.max(0, user.expiry - Date.now());
      setTimeLeft(remaining);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [user?.expiry]);

  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const pct = user?.expiry ? (timeLeft / (5 * 60 * 1000)) * 100 : 0;
  const isWarning = timeLeft < 60000;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
      isWarning
        ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
        : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400"
    }`}>
      <Clock size={12} className={isWarning ? "animate-pulse" : ""} />
      <span>Session: {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}</span>
      <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isWarning ? "bg-red-500" : "bg-green-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default SessionTimer;
