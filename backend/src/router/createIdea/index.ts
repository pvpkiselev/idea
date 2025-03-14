import { z } from 'zod'
import { ideas } from '../../lib/ideas'
import { trpc } from '../../lib/trpc'

export const createIdeaTrpcRoute = trpc.procedure
  .input(
    z.object({
      name: z.string().min(1),
      nick: z
        .string()
        .min(1)
        .regex(/^[a-z0-9]+$/, 'Nick may contain only lowercase letters, numbers and dashes'),
      description: z.string().min(1),
      text: z
        .string()
        .min(10, 'Text should not be less than 10 characters')
        .max(1000, 'Text should not exceed 1000 characters'),
    })
  )
  .mutation(({ input }) => {
    ideas.unshift(input)
    return true
  })
