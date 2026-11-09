import { z } from "zod";

export const createServiceSchema = z.object({
    name: z.string().min(2),
    durationMinutes: z.int().min(5).max(480)
});