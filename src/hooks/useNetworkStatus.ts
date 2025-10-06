// src/hooks/useNetworkStatus.ts
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    let toastId: string | number | undefined;

    const handleOnline = () => {
      if (toastId !== undefined) {
        toast.dismiss(toastId);
        toastId = undefined;
      }

      setIsOnline(true);
      toast.success("Internet connection restored!", {
        id: "online-toast",
        duration: 3000, // Show for 3 seconds
        style: { background: "#22c55e", color: "white" },
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Show a persistent "offline" toast
      toastId = toast.error("You're currently offline.", {
        id: "offline-toast",
        duration: Infinity, // Keep it visible until the user is back online
        description:
          "Please check your connection. Some features may not work.",
        style: { background: "#ef4444", color: "white" },
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check for offline status on mount
    if (!window.navigator.onLine) {
      handleOffline();
    }

    // Cleanup function
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      // Dismiss the toast on unmount if it's still visible
      if (toastId !== undefined) {
        toast.dismiss(toastId);
      }
    };
  }, []);
  return isOnline;
};
