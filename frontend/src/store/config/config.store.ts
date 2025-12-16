import { createJSONStorage, persist } from "zustand/middleware";
import { ConfigStore } from "./config.types";
import { create } from "zustand";
import type { TypeBaseColors } from "@/libs/constants/colors.constants";


export const configStore = create(persist<ConfigStore>(
    set => ({
        theme: 'violet',
        setTheme: (theme: TypeBaseColors) => set({ theme })
    }),
    {
        name: 'config',
        storage: createJSONStorage(() => localStorage)
    }
))