import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants";
import { fetchNotifications } from "@/features/notifications/api/notifications.api";
import { getNotificationsFromDb, writeNotifications } from "@/lib/db/hydrate";

export function useNotifications() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS,
    queryFn: async () => {
      const cached = await getNotificationsFromDb();
      if (cached.length > 0) {
        void fetchNotifications()
          .then(async (notifications) => {
            await writeNotifications(notifications);
            queryClient.setQueryData(
              QUERY_KEYS.NOTIFICATIONS,
              await getNotificationsFromDb(),
            );
          })
          .catch(() => undefined);
        return cached;
      }

      const fresh = await fetchNotifications();
      await writeNotifications(fresh);
      return getNotificationsFromDb();
    },
  });
}
