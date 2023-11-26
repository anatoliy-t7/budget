import { z } from 'zod';
// See https://zod.dev/?id=primitives for schema syntax

export const userSchema = z.object({
    id: z.string().optional(),
    username: z.string().nullable(),
    email: z.string(),
    role: z.string().default('client'),
    active: z.boolean().default(true),
    password: z.string(),
    passwordConfirm: z.string(),
    verified: z.boolean().default(false),
    emailVisibility: z.boolean().default(true),
    created: z.string().datetime(),
    updated: z.string().datetime(),
});


export const loginUserSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Email must be a valid email.' }),
    password: z.string({ required_error: 'Password is required' })
});

export const registerUserSchema = z
    .object({
        name: z
            .string({ required_error: 'Name is required' })
            .regex(/^[a-zA-z\s]*$/, { message: 'Name can only contain letters and spaces.' })
            .min(2, { message: 'Name must be at least 2 characters' })
            .max(64, { message: 'Name must be less than 64 characters' })
            .trim(),
        email: z
            .string({ required_error: 'Email is required' })
            .email({ message: 'Email must be a valid email' }),
        password: z
            .string({ required_error: 'Password is required' })
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
                message:
                    'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'
            }),
        passwordConfirm: z
            .string({ required_error: 'Confirm Password is required' })
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
                message:
                    'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'
            })
    })
    .superRefine(({ passwordConfirm, password }, ctx) => {
        if (passwordConfirm !== password) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Password & Confirm password must match',
                path: ['password']
            });
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Password & Confirm password must match',
                path: ['passwordConfirm']
            });
        }
    });

export const updateEmailSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Email must be a valid email' })
});

export const updateUsernameSchema = z.object({
    username: z
        .string({ required_error: 'Username is required' })
        .min(3, { message: 'Username must be at least 3 characters' })
        .max(24, { message: 'Username must be 24 characters or less' })
        .regex(/^[a-zA-Z0-9]*$/, { message: 'Username can only contain letters or numbers.' })
});

export const updatePasswordSchema = z
    .object({
        oldPassword: z.string({ required_error: 'Old password is required' }),
        password: z
            .string({ required_error: 'Password is required' })
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
                message:
                    'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'
            }),
        passwordConfirm: z
            .string({ required_error: 'Confirm Password is required' })
            .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
                message:
                    'Password must be a minimum of 8 characters & contain at least one letter, one number, and one special character.'
            })
    })
    .superRefine(({ passwordConfirm, password }, ctx) => {
        if (passwordConfirm !== password) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Password & Confirm password must match',
                path: ['password']
            });
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Password & Confirm password must match',
                path: ['passwordConfirm']
            });
        }
    });

export const updateProfileSchema = z.object({
    name: z
        .string({ required_error: 'Name is required' })
        .min(1, { message: 'Name is required' })
        .max(64, { message: 'Name must be 64 characters or less' })
        .trim(),
    avatar: z
        .instanceof(Blob)
        .optional()
        .superRefine((val, ctx) => {
            if (val) {
                if (val.size > 5242880) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Avatar must be less than 5MB'
                    });
                }

                if (!imageTypes.includes(val.type)) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Unsupported file type. Supported formats: jpeg, jpg, png, webp, svg, gif'
                    });
                }
            }
        })
});

const imageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/svg+xml',
    'image/gif'
];
