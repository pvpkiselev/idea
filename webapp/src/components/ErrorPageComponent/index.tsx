import { Alert } from '../Alert'
import { Segment } from '../Segment'

interface ErrorPageComponentProps {
  title?: string
  message?: string
}

export const ErrorPageComponent = (props: ErrorPageComponentProps) => {
  const { title = 'Oops, error', message = 'Something went wrong' } = props

  return (
    <Segment title={title}>
      <Alert color="red">{message}</Alert>
    </Segment>
  )
}
