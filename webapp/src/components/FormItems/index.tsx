import styles from './index.module.scss'

export const FormItems = ({ children }: { children: React.ReactNode }) => {
  return <div className={styles.formItems}>{children}</div>
}
