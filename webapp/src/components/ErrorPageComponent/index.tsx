import { Alert } from '../Alert'
import { Segment } from '../Segment'

interface ErrorPageComponentProps {
  title?: string
  message?: string
  children?: React.ReactNode
}

export const ErrorPageComponent = (props: ErrorPageComponentProps) => {
  const { title = 'Oops, error', message = 'Something went wrong', children } = props

  return (
    <Segment title={title}>
      <Alert color="red">{message}</Alert>
      {children}
    </Segment>
  )
}
