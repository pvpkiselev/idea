import { createContext, useContext } from 'react'
import { Loader } from '../components/Loader'
import { type TrpcRouterOutputMaybeMe } from '../models/types'
import { trpc } from './trpc'

export type AppReactContext = {
  me: TrpcRouterOutputMaybeMe | null
}

export type AppReactContextProviderProps = {
  children: React.ReactNode
}

const AppContext = createContext<AppReactContext>({
  me: null,
})

export const AppReactContextProvider = (props: AppReactContextProviderProps) => {
  const { children } = props

  const { data, error, isLoading, isFetching, isError } = trpc.getMe.useQuery()

  return (
    <AppContext.Provider value={{ me: data?.me || null }}>
      {isLoading || isFetching ? <Loader type="page" /> : isError ? <div>Error: {error.message}</div> : children}
    </AppContext.Provider>
  )
}

export const useAppReactContext = () => {
  return useContext(AppContext)
}

export const useMe = () => {
  const { me } = useAppReactContext()
  return me
}
