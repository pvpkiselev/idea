import { trpc } from '../../../lib/trpc'
import { canBlockIdeas } from '../../../utils/can'
import { zBlockIdeaTrpcInput } from './input'

export const blockIdeaTrpcRoute = trpc.procedure.input(zBlockIdeaTrpcInput).mutation(async ({ ctx, input }) => {
  const { ideaId } = input

  if (!canBlockIdeas(ctx.me)) {
    throw Error('PERMISSION_DENIED')
  }

  const idea = await ctx.prisma.idea.findUnique({
    where: {
      id: ideaId,
    },
  })

  if (!idea) {
    throw Error('NOT_FOUND')
  }

  await ctx.prisma.idea.update({
    where: {
      id: ideaId,
    },
    data: {
      blockedAt: new Date(),
    },
  })

  return true
})
