import { z } from 'zod';
// See https://zod.dev/?id=primitives for schema syntax

export const userSchema = z.object({
    id: z.string().optional(),
    name: z.string().nullable(),
    email: z.string(),
    phone: z.string().nullable(),
    role: z.string().default('client'),
    active: z.boolean(),
    password: z.string().optional(),
    verified: z.boolean(),
    passwordConfirm: z.string()
});
