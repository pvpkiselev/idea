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
export type ViewIdeaRouteParams = typeof viewIdeaRouteParams
export const getViewIdeaRoute = (params: ViewIdeaRouteParams) => `/ideas/${params.ideaNick}`

export const editIdeaRouteParams = getRouteParams({
  ideaNick: true,
})
export type EditIdeaRouteParams = typeof editIdeaRouteParams
export const getEditIdeaRoute = (params: EditIdeaRouteParams) => `/ideas/${params.ideaNick}/edit`

export const getNewIdeaRoute = () => '/ideas/new'

export const getSignUpRoute = () => '/sign-up'

export const getSignInRoute = () => '/sign-in'

export const getSignOutRoute = () => '/sign-out'
