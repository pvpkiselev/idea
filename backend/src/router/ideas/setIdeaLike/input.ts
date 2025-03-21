import { zStringRequired } from '@ideanick/shared/src/zod'
import { z } from 'zod'

export const zSetIdeaLikeTrpcInput = z.object({
  ideaId: zStringRequired,
  isLikedByMe: z.boolean(),
})
