import { useSyncExternalStore } from 'react'
import { getPwaState, getServerPwaState, subscribePwa } from '@/lib/pwa'

export function usePwa() {
  const state = useSyncExternalStore(subscribePwa, getPwaState, getServerPwaState)
  const installable = !state.standalone && (state.canPrompt || state.ios)
  return { ...state, installable }
}
