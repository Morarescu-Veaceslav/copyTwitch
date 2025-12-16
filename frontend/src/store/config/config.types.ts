import type { TypeBaseColors } from "@/libs/constants/colors.constants";


export interface ConfigStore {
    theme: TypeBaseColors,
    setTheme: (theme: TypeBaseColors) => void
}