"use client";

import { useCallback, useMemo, useSyncExternalStore, type SetStateAction } from "react";

const listeners = new Set<() => void>();
const memory = new Map<string, string>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => { listeners.delete(listener); window.removeEventListener("storage", listener); };
}
const serverSnapshot = () => null;

/** Browser-local persistence with SSR-safe hydration and an in-memory fallback. */
export function usePersistentState<T>(key: string, initial: T, validate: (value: unknown) => value is T, onError: () => void) {
  const read = useCallback(() => {
    try { return memory.get(key) ?? window.localStorage.getItem(key); }
    catch { return memory.get(key) ?? null; }
  }, [key]);
  const raw = useSyncExternalStore(subscribe, read, serverSnapshot);
  const decode = useCallback((text: string | null): T => {
    try { const value: unknown = text === null ? null : JSON.parse(text); return validate(value) ? value : initial; }
    catch { return initial; }
  }, [initial, validate]);
  const value = useMemo(() => decode(raw), [decode, raw]);
  const setValue = useCallback((action: SetStateAction<T>) => {
    const previous = decode(read());
    const next = typeof action === "function" ? (action as (previous: T) => T)(previous) : action;
    const text = JSON.stringify(next);
    let failed = false;
    try { window.localStorage.setItem(key, text); memory.delete(key); }
    catch { memory.set(key, text); failed = true; }
    listeners.forEach(listener => listener());
    if (failed) onError();
  }, [decode, key, onError, read]);
  return [value, setValue] as const;
}
