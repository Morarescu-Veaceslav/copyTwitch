import z from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const uploadFileSchema = z.object({
    file: z
        .union([
            z.instanceof(File).refine(f => f.size <= MAX_FILE_SIZE, {
            }),
            z.literal("").transform(() => undefined)
        ])
        .optional()
});

export type TypeUploadFileSchema = z.infer<typeof uploadFileSchema>;
