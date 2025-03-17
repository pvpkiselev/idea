import type { TrpcRouterOutput } from '@ideanick/backend/src/router'

export type TrpcRouterOutputMaybeIdea = NonNullable<TrpcRouterOutput['getIdea']['idea']>
export type TrpcRouterOutputMaybeMe = NonNullable<TrpcRouterOutput['getMe']['me']>
