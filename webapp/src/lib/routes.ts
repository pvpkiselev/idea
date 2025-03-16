const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce((acc, key) => {
    return {
      ...acc,
      [key]: `:${key}`,
    }
  }, {}) as Record<keyof T, string>
}

export const getAllIdeasRoute = () => '/'

export const viewIdeaRouteParams = getRouteParams({
  ideaNick: true,
})
export type TViewIdeaRouteParams = typeof viewIdeaRouteParams
export const getViewIdeaRoute = (params: TViewIdeaRouteParams) => `/ideas/${params.ideaNick}`

export const editIdeaRouteParams = getRouteParams({
  ideaNick: true,
})
export type TEditIdeaRouteParams = typeof editIdeaRouteParams
export const getEditIdeaRoute = (params: TEditIdeaRouteParams) => `/ideas/${params.ideaNick}/edit`

export const getNewIdeaRoute = () => '/ideas/new'

export const getSignUpRoute = () => '/sign-up'

export const getSignInRoute = () => '/sign-in'

export const getSignOutRoute = () => '/sign-out'
