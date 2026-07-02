import { create } from "zustand";

interface LanguageStore {
  isUrdu: boolean;
  toggleLanguage: () => void;
  setLanguage: (isUrdu: boolean) => void;
}

export const useLanguageStore = create<LanguageStore>((set) => ({
  isUrdu: false,
  toggleLanguage: () => set((state) => ({ isUrdu: !state.isUrdu })),
  setLanguage: (isUrdu) => set({ isUrdu }),
}));
