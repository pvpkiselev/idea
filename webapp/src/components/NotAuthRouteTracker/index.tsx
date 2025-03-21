import { atom } from 'nanostores'
import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { getAllIdeasRoute, getSignInRoute, getSignOutRoute, getSignUpRoute } from '../../lib/routes'

export const lastVisitedNotAuthRouteStore = atom<string>(getAllIdeasRoute())

export const NotAuthRouteTracker = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    const authRoutes = [getSignInRoute(), getSignUpRoute(), getSignOutRoute()]

    const isAuthRoute = authRoutes.includes(pathname)

    if (!isAuthRoute) {
      lastVisitedNotAuthRouteStore.set(pathname)
    }
  }, [pathname])

  return null
}
