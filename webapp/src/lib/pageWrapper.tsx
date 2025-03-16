import { type UseTRPCQueryResult } from '@trpc/react-query/shared'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { ErrorPageComponent } from '../components/ErrorPageComponent'
import { useAppReactContext, type TAppReactContext } from './ctx'
import { getAllIdeasRoute } from './routes'

class CheckExistsError extends Error {}
const checkExistsFn = <T,>(value: T, message?: string): NonNullable<T> => {
  if (!value) {
    throw new CheckExistsError(message)
  }
  return value
}

class CheckAccessError extends Error {}
const checkAccessFn = <T,>(value: T, message?: string): void => {
  if (!value) {
    throw new CheckAccessError(message)
  }
}

type Props = Record<string, any>
type QueryResult = UseTRPCQueryResult<any, any>
type QuerySuccessResult<TQueryResult extends QueryResult> = UseTRPCQueryResult<NonNullable<TQueryResult['data']>, null>
type HelperProps<TQueryResult extends QueryResult | undefined> = {
  ctx: TAppReactContext
  queryResult: TQueryResult extends QueryResult ? QuerySuccessResult<TQueryResult> : undefined
}
type SetPropsProps<TQueryResult extends QueryResult | undefined> = HelperProps<TQueryResult> & {
  checkExists: typeof checkExistsFn
  checkAccess: typeof checkAccessFn
}
type PageWrapperProps<TProps extends Props, TQueryResult extends QueryResult | undefined> = {
  redirectAuthorized?: boolean

  authorizedOnly?: boolean
  authorizedOnlyTitle?: string
  authorizedOnlyMessage?: string

  checkAccess?: (helperProps: HelperProps<TQueryResult>) => boolean
  checkAccessTitle?: string
  checkAccessMessage?: string

  checkExists?: (HelperProps: HelperProps<TQueryResult>) => boolean
  checkExistsTitle?: string
  checkExistsMessage?: string

  useQuery?: () => TQueryResult
  setProps?: (setPropsProps: SetPropsProps<TQueryResult>) => TProps
  Page: React.FC<TProps>
}

const PageWrapper = <TProps extends Props = {}, TQueryResult extends QueryResult | undefined = undefined>({
  authorizedOnly,
  authorizedOnlyTitle = 'Please, Authorize',
  authorizedOnlyMessage = 'This page is available only for authorized users',
  redirectAuthorized,
  checkAccess,
  checkAccessTitle = 'Access Denied',
  checkAccessMessage = 'You do not have access to this page',
  checkExists,
  checkExistsTitle = 'Page Not Found',
  checkExistsMessage = 'The page you are looking for does not exist',
  useQuery,
  setProps,
  Page,
}: PageWrapperProps<TProps, TQueryResult>) => {
  const navigate = useNavigate()
  const ctx = useAppReactContext()
  const queryResult = useQuery?.()

  const redirectNeeded = redirectAuthorized && ctx.me

  useEffect(() => {
    if (redirectNeeded) {
      void navigate(getAllIdeasRoute(), { replace: true })
    }
  }, [redirectNeeded, navigate])

  if (queryResult?.isLoading || queryResult?.isFetching || redirectNeeded) {
    return <div>Loading…</div>
  }

  if (queryResult?.isError) {
    return <ErrorPageComponent message={queryResult.error.message} />
  }

  if (authorizedOnly && !ctx.me) {
    return <ErrorPageComponent title={authorizedOnlyTitle} message={authorizedOnlyMessage} />
  }

  const helperProps = { ctx, queryResult: queryResult as never }

  if (checkAccess) {
    const accessDenied = !checkAccess(helperProps)
    if (accessDenied) {
      return <ErrorPageComponent title={checkAccessTitle} message={checkAccessMessage} />
    }
  }

  if (checkExists) {
    const accessDenied = !checkExists(helperProps)
    if (accessDenied) {
      return <ErrorPageComponent title={checkExistsTitle} message={checkExistsMessage} />
    }
  }

  try {
    const props = setProps?.({ ...helperProps, checkExists: checkExistsFn, checkAccess: checkAccessFn }) as TProps

    return <Page {...props} />
  } catch (error) {
    if (error instanceof CheckExistsError) {
      return <ErrorPageComponent title={checkExistsTitle} message={error.message || checkExistsMessage} />
    }

    if (error instanceof CheckAccessError) {
      return <ErrorPageComponent title={checkAccessTitle} message={error.message || checkAccessMessage} />
    }

    throw error
  }
}

export const withPageWrapper = <TProps extends Props = {}, TQueryResult extends QueryResult | undefined = undefined>(
  pageWrapperProps: Omit<PageWrapperProps<TProps, TQueryResult>, 'Page'>
) => {
  return (Page: PageWrapperProps<TProps, TQueryResult>['Page']) => {
    return () => <PageWrapper {...pageWrapperProps} Page={Page} />
  }
}
