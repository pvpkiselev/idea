import cn from 'classnames'
import { Link } from 'react-router'
import styles from './index.module.scss'

export interface ButtonProps {
  children: React.ReactNode
  color?: 'green' | 'red'
  type?: 'submit' | 'button'
  isLoading?: boolean
}

export interface LinkButtonProps {
  children: React.ReactNode
  to: string
  color?: 'green' | 'red'
}

export const Button = (props: ButtonProps) => {
  const { children, color = 'green', type, isLoading } = props

  return (
    <button
      className={cn({ [styles.button]: true, [styles[`color-${color}`]]: true, [styles.disabled]: isLoading })}
      type={type}
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
