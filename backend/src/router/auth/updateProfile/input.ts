import { zNickRequired } from '@ideanick/shared/src/zod'
import { z } from 'zod'

export const zUpdateProfileTrpcInput = z.object({
  nick: zNickRequired,
  name: z.string().min(1).max(50).default(''),
})
