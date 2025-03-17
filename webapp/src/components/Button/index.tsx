import cn from 'classnames'
import { Link } from 'react-router'
import styles from './index.module.scss'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  color?: 'green' | 'red'
  loading?: boolean
}

export interface LinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  to: string
  color?: 'green' | 'red'
}

export const Button = (props: ButtonProps) => {
  const { children, color = 'green', loading = false } = props

  return (
    <button
      className={cn({
        [styles.button]: true,
        [styles[`color-${color}`]]: true,
        [styles.disabled]: loading,
        [styles.loading]: loading,
      })}
      disabled={loading}
    >
      <span className={styles.text}>{children}</span>
    </button>
  )
}

export const LinkButton = (props: LinkButtonProps) => {
  const { children, color = 'green', to } = props

  return (
    <Link to={to} className={cn({ [styles.button]: true, [styles[`color-${color}`]]: true })}>
      {children}
    </Link>
  )
}
