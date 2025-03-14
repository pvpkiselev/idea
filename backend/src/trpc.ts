// import _ from 'lodash'
// import { z } from 'zod'
// import { ideas } from './lib/ideas'
// import { trpc } from './lib/trpc'

// export const trpcRouter = trpc.router({
//   getIdeas: trpc.procedure.query(() => {
//     return { ideas: ideas.map((idea) => _.pick(idea, ['nick', 'name', 'description'])) }
//   }),
// })

// export type TrpcRouter = typeof trpcRouter
