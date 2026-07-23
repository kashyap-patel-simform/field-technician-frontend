import { useCallback, useEffect, useRef, useState } from 'react'
import { API_CONSTANTS } from '@/constants'
import { SyncStatus, type SyncState } from '@/features/sync/types/sync.types'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useSyncStatus(initialPendingCount: number) {
  const isOnline = useOnlineStatus()
  const isSyncingRef = useRef(false)

  const [state, setState] = useState<SyncState>({
    status: SyncStatus.PENDING,
    pendingCount: initialPendingCount,
    lastSyncedAt: null,
  })

  const sync = useCallback(async () => {
    if (isSyncingRef.current || !isOnline || state.pendingCount === 0) {
      return
    }

    isSyncingRef.current = true
    setState((prev) => ({ ...prev, status: SyncStatus.SYNCING }))

    try {
      await wait(API_CONSTANTS.SIMULATED_DELAY_MS)
      setState({
        status: SyncStatus.SYNCED,
        pendingCount: 0,
        lastSyncedAt: Date.now(),
      })
    } catch {
      setState((prev) => ({ ...prev, status: SyncStatus.ERROR }))
    } finally {
      isSyncingRef.current = false
    }
  }, [isOnline, state.pendingCount])

  useEffect(() => {
    if (isOnline && state.pendingCount > 0) {
      sync()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline])

  return { ...state, isOnline, sync }
}
