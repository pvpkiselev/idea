import { ErrorPageComponent } from '../../../components/ErrorPageComponent'

interface NotFoundPageProps {
  title?: string
  message?: string
}

export const NotFoundPage = (props: NotFoundPageProps) => {
  const { title = 'Page Not Found', message = 'The page you are looking for does not exist' } = props

  return <ErrorPageComponent title={title} message={message} />
}
