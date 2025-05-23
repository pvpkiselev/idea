import { useStore } from '@nanostores/react'
import { type UseTRPCQueryResult } from '@trpc/react-query/shared'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router'
import { ErrorPageComponent } from '../components/ErrorPageComponent'
import { Loader } from '../components/Loader'
import { lastVisitedNotAuthRouteStore } from '../components/NotAuthRouteTracker'
import { NotFoundPage } from '../pages/other/NotFoundPage'
import { type AppReactContext, useAppReactContext } from './ctx'

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

class GetAuthorizedMeError extends Error {}

type Props = Record<string, any>
type QueryResult = UseTRPCQueryResult<any, any>
type QuerySuccessResult<TQueryResult extends QueryResult> = UseTRPCQueryResult<NonNullable<TQueryResult['data']>, null>
type HelperProps<TQueryResult extends QueryResult | undefined> = {
  ctx: AppReactContext
  queryResult: TQueryResult extends QueryResult ? QuerySuccessResult<TQueryResult> : undefined
}
type SetPropsProps<TQueryResult extends QueryResult | undefined> = HelperProps<TQueryResult> & {
  checkExists: typeof checkExistsFn
  checkAccess: typeof checkAccessFn
  getAuthorizedMe: (message?: string) => NonNullable<AppReactContext['me']>
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

  showLoaderOnFetching?: boolean

  title: string | ((titleProps: HelperProps<TQueryResult> & TProps) => string)
  isTitleExact?: boolean

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
  checkExistsTitle,
  checkExistsMessage,
  showLoaderOnFetching = true,
  title,
  isTitleExact = false,
  useQuery,
  setProps,
  Page,
}: PageWrapperProps<TProps, TQueryResult>) => {
  const lastVisitedNotAuthRoute = useStore(lastVisitedNotAuthRouteStore)

  const navigate = useNavigate()
  const ctx = useAppReactContext()
  const queryResult = useQuery?.()

  const redirectNeeded = redirectAuthorized && ctx.me

  useEffect(() => {
    if (redirectNeeded) {
      void navigate(lastVisitedNotAuthRoute, { replace: true })
    }
  }, [redirectNeeded, navigate, lastVisitedNotAuthRoute])

  if (queryResult?.isLoading || (showLoaderOnFetching && queryResult?.isFetching) || redirectNeeded) {
    return <Loader type="page" />
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
      return <NotFoundPage title={checkAccessTitle} message={checkAccessMessage} />
    }
  }

  if (checkExists) {
    const accessDenied = !checkExists(helperProps)
    if (accessDenied) {
      return <NotFoundPage title={checkExistsTitle} message={checkExistsMessage} />
    }
  }

  const getAuthorizedMe = (message?: string) => {
    if (!ctx.me) {
      throw new GetAuthorizedMeError(message)
    }
    return ctx.me
  }

  try {
    const props = setProps?.({
      ...helperProps,
      checkExists: checkExistsFn,
      checkAccess: checkAccessFn,
      getAuthorizedMe,
    }) as TProps

    const calculatedTitle = typeof title === 'function' ? title({ ...helperProps, ...props }) : title
    const exactTitle = isTitleExact ? calculatedTitle : `${calculatedTitle} — IdeaNick`

    return (
      <>
        <Helmet defer={false}>
          <title>{exactTitle}</title>
        </Helmet>
        <Page {...props} />
      </>
    )
  } catch (error) {
    if (error instanceof CheckExistsError) {
      return <ErrorPageComponent title={checkExistsTitle} message={error.message || checkExistsMessage} />
    }

    if (error instanceof CheckAccessError) {
      return <ErrorPageComponent title={checkAccessTitle} message={error.message || checkAccessMessage} />
    }

    if (error instanceof GetAuthorizedMeError) {
      return <ErrorPageComponent title={authorizedOnlyTitle} message={error.message || authorizedOnlyMessage} />
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
