import cn from 'classnames'
import styles from './index.module.scss'

interface AlertProps {
  color: 'red' | 'green'
  children: React.ReactNode
}

export const Alert = (props: AlertProps) => {
  const { color, children } = props

  return <div className={cn({ [styles.alert]: true, [styles[color]]: true })}>{children}</div>
}
