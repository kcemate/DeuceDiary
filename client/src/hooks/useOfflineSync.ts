import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getPendingQueue,
  removeFromQueue,
  updateQueueItem,
} from '@/lib/offlineQueue';
import { apiRequest } from '@/lib/queryClient';

export function useOfflineSync() {
  const queryClient = useQueryClient();
  const isSyncing = useRef(false);

  const syncQueue = useCallback(async () => {
    if (isSyncing.current || !navigator.onLine) return;
    isSyncing.current = true;

    try {
      const all = await getPendingQueue();
      const pending = all.filter((d) => d.status === 'pending' || d.status === 'syncing');
      if (pending.length === 0) return;

      let synced = 0;
      for (const item of pending) {
        await updateQueueItem(item.id, { status: 'syncing' });
        try {
          await apiRequest('/api/deuces', {
            method: 'POST',
            body: JSON.stringify({
              location: item.location,
              thoughts: item.thoughts,
              groupIds: item.groupIds,
              loggedAt: item.loggedAt,
            }),
          });
          await removeFromQueue(item.id);
          synced++;
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Sync failed';
          // If rate limited or auth error, mark failed; network errors stay pending
          const isClientError =
            message.startsWith('400') ||
            message.startsWith('401') ||
            message.startsWith('403') ||
            message.startsWith('429');
          await updateQueueItem(item.id, {
            status: isClientError ? 'failed' : 'pending',
            error: message,
          });
        }
      }

      if (synced > 0) {
        queryClient.invalidateQueries({ queryKey: ['/api/groups'] });
        queryClient.invalidateQueries({ queryKey: ['/api/deuces'] });
        queryClient.invalidateQueries({ queryKey: ['/api/analytics/most-deuces'] });
        queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      }
    } finally {
      isSyncing.current = false;
    }
  }, [queryClient]);

  useEffect(() => {
    // Try to drain the queue when the app comes back online
    window.addEventListener('online', syncQueue);

    // Also attempt on mount in case there are leftover pending items
    if (navigator.onLine) {
      syncQueue();
    }

    return () => {
      window.removeEventListener('online', syncQueue);
    };
  }, [syncQueue]);

  return {
    syncQueue,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  };
}
