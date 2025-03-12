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
export const getViewIdeaRoute = (params: TViewIdeaRouteParams) => `/idea/${params.ideaNick}`
