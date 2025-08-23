// src/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  userEmail: string | "";
  receivedResetPwdLink: boolean;
  setUserEmail: (email: string) => void;
  setReceivedResetPwdLink: () => void;
}

// Création du store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userEmail: "",
      receivedResetPwdLink: false,
      setReceivedResetPwdLink: () => {
        set({ receivedResetPwdLink: true });
      },
      setUserEmail: (email) => {
        set({ userEmail: email });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
