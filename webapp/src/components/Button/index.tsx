import cn from 'classnames'
import { Link } from 'react-router'
import styles from './index.module.scss'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  color?: 'green' | 'red'
  isLoading?: boolean
}

export interface LinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  to: string
  color?: 'green' | 'red'
}

export const Button = (props: ButtonProps) => {
  const { children, color = 'green', isLoading } = props

  return (
    <button
      className={cn({ [styles.button]: true, [styles[`color-${color}`]]: true, [styles.disabled]: isLoading })}
      disabled={isLoading}
    >
      {isLoading ? 'Submitting...' : children}
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
