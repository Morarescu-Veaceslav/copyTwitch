export const BASE_COLORS = [
    {
        name: "violet",
        color: "261.1 83.3% 57.8%"
    },
    {
        name: "blue",
        color: "217 91% 60%"
    },
    {
        name: "turquoise",
        color: "174 72% 56%"
    },
    {
        name: "yellow",
        color: "47 95% 58%"
    },
    {
        name: "peach",
        color: "22 90% 65%"
    },
    {
        name: "pink",
        color: "330 85% 67%"
    },
    {
        name: "rose",
        color: "351 75% 62%"
    },
    {
        name: "red",
        color: "0 72% 60%"
    }
] as const


export type TypeBaseColors = (typeof BASE_COLORS)[number]['name']
