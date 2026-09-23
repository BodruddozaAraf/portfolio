"use client";

import { create } from "zustand";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";

// Visitor preferences (docs/04-architecture.md, State). Persisted in localStorage, which can be
// missing or throw (private windows, blocked storage), so every access is wrapped.
// plainMode: the whole journal without effects; useMotionLevel turns it into motion level "none".

import { PREFERENCES_KEY } from "./preferences-key";

export { PREFERENCES_KEY };

const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return window.localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value);
    } catch {
      /* storage unavailable: the choice lasts for this page only */
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name);
    } catch {
      /* ignore */
    }
  },
};

type Preferences = {
  plainMode: boolean;
  setPlainMode: (on: boolean) => void;
};

export const usePreferences = create<Preferences>()(
  persist(
    (set) => ({
      plainMode: false,
      setPlainMode: (on) => {
        document.documentElement.dataset.plain = on ? "true" : "false";
        set({ plainMode: on });
      },
    }),
    {
      name: PREFERENCES_KEY,
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ plainMode: s.plainMode }),
    },
  ),
);
