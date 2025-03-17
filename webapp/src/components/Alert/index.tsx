import cn from 'classnames'
import styles from './index.module.scss'

export interface AlertProps {
  color: 'red' | 'green' | 'brown'
  hidden?: boolean
  children: React.ReactNode
}

export const Alert = (props: AlertProps) => {
  const { color, children, hidden } = props

  return (
    <div hidden={hidden} className={cn({ [styles.alert]: true, [styles[color]]: true })}>
      {children}
    </div>
  )
}
