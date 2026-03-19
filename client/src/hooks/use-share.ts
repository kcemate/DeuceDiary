import { useToast } from "@/hooks/use-toast";

/**
 * Unified hook for sharing content via the Web Share API with clipboard fallback.
 * Eliminates duplicated try/catch patterns across share-capable components.
 */
export function useShare() {
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied to clipboard!" });
    } catch {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  /**
   * Share via native API if available, falling back to clipboard copy.
   * @param data  ShareData passed to navigator.share
   * @param fallbackText  Text to copy if native share unavailable (defaults to data.text ?? data.url)
   */
  const share = async (data: ShareData, fallbackText?: string) => {
    if (!navigator.share) {
      await copyToClipboard(fallbackText ?? data.text ?? data.url ?? "");
      return;
    }
    try {
      await navigator.share(data);
    } catch {
      // user cancelled — no action needed
    }
  };

  return { copyToClipboard, share };
}
