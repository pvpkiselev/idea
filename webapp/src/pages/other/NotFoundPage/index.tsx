import image404 from '../../../assets/images/404.png'
import { ErrorPageComponent } from '../../../components/ErrorPageComponent'
import styles from './index.module.scss'

interface NotFoundPageProps {
  title?: string
  message?: string
}

export const NotFoundPage = (props: NotFoundPageProps) => {
  const { title = 'Page Not Found', message = 'The page you are looking for does not exist' } = props

  return (
    <ErrorPageComponent title={title} message={message}>
      <img src={image404} alt="404" className={styles.image} width={800} height={600} />
    </ErrorPageComponent>
  )
}
