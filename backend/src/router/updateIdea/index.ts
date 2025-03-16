import { trpc } from '../../lib/trpc'
import { zUpdateIdeaTrpcInput } from './input'

export const updateIdeaTrpcRoute = trpc.procedure.input(zUpdateIdeaTrpcInput).mutation(async ({ ctx, input }) => {
  const { ideaId, ...ideaInput } = input

  if (!ctx.me) {
    throw Error('UNAUTHORIZED')
  }

  const idea = await ctx.prisma.idea.findUnique({
    where: {
      id: ideaId,
    },
  })

  if (!idea) {
    throw Error('NOT_FOUND')
  }

  if (ctx.me.id !== idea.authorId) {
    throw Error('NOT_YOUR_IDEA')
  }

  if (idea.nick !== ideaInput.nick) {
    const exIdea = await ctx.prisma.idea.findUnique({
      where: {
        nick: ideaInput.nick,
      },
    })

    if (exIdea) {
      throw Error('Idea with this nick already exists')
    }
  }

  await ctx.prisma.idea.update({
    where: {
      id: ideaId,
    },
    data: { ...ideaInput },
  })

  return true
})
