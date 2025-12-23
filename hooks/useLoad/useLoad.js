import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

// Keep the native splash screen visible until we're ready
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function useLoad() {
  const [isLoad, setLoad] = useState(true); 

  useEffect(() => {
    const timer = setTimeout(async () => {
      // Hide the native splash screen first
      await SplashScreen.hideAsync();
      // Then mark loading as complete
      setLoad(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return isLoad;
}