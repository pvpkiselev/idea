import { z } from 'zod'

export const zUpdateProfileTrpcInput = z.object({
  nick: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+$/, 'Nick may contain only lowercase letters, numbers and dashes'),
  name: z.string().min(1).max(50).default(''),
})
