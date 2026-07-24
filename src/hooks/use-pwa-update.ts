import { useRegisterSW } from "virtual:pwa-register/react";

export function usePwaUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      registration?.update();
    },
  });

  function close() {
    setNeedRefresh(false);
    setOfflineReady(false);
  }

  return { needRefresh, offlineReady, updateServiceWorker, close };
}
