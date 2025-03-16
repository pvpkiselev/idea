import { BrowserRouter, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { AppReactContextProvider } from './lib/ctx'
import * as routes from './lib/routes'
import { TrpcProvider } from './lib/trpc'
import { AllIdeasPage } from './pages/AllIdeasPage'
import { EditIdeaPage } from './pages/EditIdeaPage'
import { NewIdeaPage } from './pages/NewIdeaPage'
import { SignInPage } from './pages/SignInPage'
import { SignOutPage } from './pages/SignOutPage'
import { SignUpPage } from './pages/SignUpPage'
import { ViewIdeaPage } from './pages/ViewIdeaPage'
import './styles/global.scss'

const App = () => {
  return (
    <TrpcProvider>
      <AppReactContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path={routes.getSignOutRoute()} element={<SignOutPage />} />

            <Route element={<Layout />}>
              <Route path={routes.getAllIdeasRoute()} element={<AllIdeasPage />} />

              <Route path={routes.getViewIdeaRoute(routes.viewIdeaRouteParams)} element={<ViewIdeaPage />} />

              <Route path={routes.getNewIdeaRoute()} element={<NewIdeaPage />} />

              <Route path={routes.getEditIdeaRoute(routes.editIdeaRouteParams)} element={<EditIdeaPage />} />

              <Route path={routes.getSignUpRoute()} element={<SignUpPage />} />

              <Route path={routes.getSignInRoute()} element={<SignInPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppReactContextProvider>
    </TrpcProvider>
  )
}

export default App
