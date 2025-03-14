import cn from 'classnames'
import styles from './index.module.scss'

interface ButtonProps {
  children: React.ReactNode
  color?: 'green' | 'red'
  type?: 'submit' | 'button'
  isLoading?: boolean
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
