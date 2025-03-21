import { zStringOptional, zStringRequired } from '@ideanick/shared/src/zod'
import { z } from 'zod'

export const zGetIdeaTrpcInput = z.object({
  ideaNick: zStringRequired,
  limit: z.number().min(1).max(100).default(10),
  search: zStringOptional,
})
