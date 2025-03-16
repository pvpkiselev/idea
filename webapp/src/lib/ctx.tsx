import type { TrpcRouterOutput } from '@ideanick/backend/src/router'
import { createContext, useContext } from 'react'
import { trpc } from './trpc'

export type TAppReactContext = {
  me: TrpcRouterOutput['getMe']['me']
}

export type TAppReactContextProviderProps = {
  children: React.ReactNode
}

const AppReactContext = createContext<TAppReactContext>({
  me: null,
})

export const AppReactContextProvider = (props: TAppReactContextProviderProps) => {
  const { children } = props

  const { data, error, isLoading, isFetching, isError } = trpc.getMe.useQuery()

  return (
    <AppReactContext.Provider value={{ me: data?.me || null }}>
      {isLoading || isFetching ? <div>Loading…</div> : isError ? <div>Error: {error.message}</div> : children}
    </AppReactContext.Provider>
  )
}

export const useAppReactContext = () => {
  return useContext(AppReactContext)
}

export const useMe = () => {
  const { me } = useAppReactContext()
  return me
}
