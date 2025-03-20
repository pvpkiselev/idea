import { createRef } from 'react'
import { Link, Outlet } from 'react-router'
import Logo from '../../assets/images/logo.svg?react'
import { useMe } from '../../lib/ctx'
import {
  getAllIdeasRoute,
  getEditProfileRoute,
  getNewIdeaRoute,
  getSignInRoute,
  getSignOutRoute,
  getSignUpRoute,
} from '../../lib/routes'
import styles from './index.module.scss'

export const layoutContentElRef = createRef<HTMLDivElement>()

export const Layout = () => {
  const me = useMe()

  return (
    <div className={styles.layout}>
      <div className={styles.navigation}>
        <Logo className={styles.logo} />

        <ul className={styles.menu}>
          <li className={styles.item}>
            <Link className={styles.link} to={getAllIdeasRoute()}>
              All Ideas
            </Link>
          </li>

          {me ? (
            <>
              <li className={styles.item}>
                <Link className={styles.link} to={getNewIdeaRoute()}>
                  Add Idea
                </Link>
              </li>

              <li className={styles.item}>
                <Link className={styles.link} to={getEditProfileRoute()}>
                  Edit Profile
                </Link>
              </li>

              <li className={styles.item}>
                <Link className={styles.link} to={getSignOutRoute()}>
                  Log Out ({me.nick})
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className={styles.item}>
                <Link className={styles.link} to={getSignUpRoute()}>
                  Sign Up
                </Link>
              </li>

              <li className={styles.item}>
                <Link className={styles.link} to={getSignInRoute()}>
                  Sign In
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className={styles.content} ref={layoutContentElRef}>
        <Outlet />
      </div>
    </div>
  )
}
