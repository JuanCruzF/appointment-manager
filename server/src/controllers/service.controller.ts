import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { createServiceSchema } from "../schemas/service.schema";

// Creates a new service (admins only)
export const createService = async (req: Request, res: Response) => {
    // 1. Validate the body with createServiceSchema (400 if invalid)
    const result = createServiceSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ errors: z.flattenError(result.error).fieldErrors });
        return;
    }

    // 2. Check if a service with that name already exists → 409 if it does
    const { name } = result.data;
    const existingService = await prisma.service.findUnique({ where: { name } });

    if (existingService) {
        res.status(409).json({ error: "Service already exists" });
        return;
    }

    // 3. Create it → prisma.service.create({ data: result.data })
    const service = await prisma.service.create({ data: result.data });

    // 4. Respond 201 with { service }
    res.status(201).json({ service });
};