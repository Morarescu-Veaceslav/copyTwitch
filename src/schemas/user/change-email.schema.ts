import z from "zod";


export const changeEmailSchema = z.object({
    email: z.string().min(1).email()
})

export type TypeChangeEmailSchema = z.infer<typeof changeEmailSchema>