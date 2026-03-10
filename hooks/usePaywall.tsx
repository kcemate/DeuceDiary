import { useState, useCallback } from "react";
import { useSegments } from "expo-router";

/**
 * Route segments where the paywall modal should never be shown.
 * Prevents showing upgrade prompts on screens where they'd be redundant
 * (already on premium page) or disruptive (onboarding, legal screens).
 */
const SUPPRESSED_SEGMENTS: string[] = ["premium", "onboarding", "terms", "privacy"];

interface UsePaywallReturn {
  isVisible: boolean;
  featureName: string | null;
  show: (feature: string) => void;
  dismiss: () => void;
}

export function usePaywall(): UsePaywallReturn {
  const [isVisible, setIsVisible] = useState(false);
  const [featureName, setFeatureName] = useState<string | null>(null);
  const segments = useSegments();

  const show = useCallback(
    (feature: string) => {
      // Don't show the paywall if the current route is suppressed
      const isSuppressed = segments.some((seg) =>
        SUPPRESSED_SEGMENTS.includes(seg)
      );
      if (isSuppressed) return;

      setFeatureName(feature);
      setIsVisible(true);
    },
    [segments]
  );

  const dismiss = useCallback(() => {
    setIsVisible(false);
    setFeatureName(null);
  }, []);

  return { isVisible, featureName, show, dismiss };
}
