import { Link, Outlet } from 'react-router'
import { getAllIdeasRoute, getNewIdeaRoute, getSignInRoute, getSignUpRoute } from '../../lib/routes'
import styles from './index.module.scss'

export const Layout = () => {
  return (
    <div className={styles.layout}>
      <div className={styles.navigation}>
        <div className={styles.logo}> IdeaNick</div>

        <ul className={styles.menu}>
          <li className={styles.item}>
            <Link className={styles.link} to={getAllIdeasRoute()}>
              All Ideas
            </Link>
          </li>

          <li className={styles.item}>
            <Link className={styles.link} to={getNewIdeaRoute()}>
              Add Idea
            </Link>
          </li>

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
        </ul>
      </div>

      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
