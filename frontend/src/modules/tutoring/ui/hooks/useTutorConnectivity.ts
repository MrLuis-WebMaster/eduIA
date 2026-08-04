import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

import { getAppConfig, probeApiHealth } from '@/shared';

/** Connectivity for tutor send UX — NetInfo + soft API health probe. */
export function useTutorConnectivity() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline =
        state.isConnected === false || state.isInternetReachable === false;
      setIsOffline(offline);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (getAppConfig().useFakeTutor) return;

    let cancelled = false;
    const probe = async () => {
      try {
        await probeApiHealth(getAppConfig().apiUrl, { timeoutMs: 4_000 });
        if (!cancelled) setIsOffline(false);
      } catch {
        // Keep NetInfo-driven offline flag.
      }
    };

    void probe();
    return () => {
      cancelled = true;
    };
  }, []);

  return { isOffline };
}
