import { zSignInTrpcInput } from '@ideanick/backend/src/router/signIn/input'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { useForm } from '../../lib/form'
import { getAllIdeasRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const SignInPage = () => {
  const navigate = useNavigate()

  const trpcUtils = trpc.useUtils()

  const signIn = trpc.signIn.useMutation()

  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: '',
      password: '',
    },
    validationSchema: zSignInTrpcInput,
    onFormSubmit: async (values) => {
      const { token } = await signIn.mutateAsync(values)
      Cookies.set('token', token, { expires: 99999 })

      await trpcUtils.invalidate()

      await navigate(getAllIdeasRoute())
    },
    resetOnSuccess: false,
  })

  return (
    <Segment title="Sign In">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input name="nick" label="Nick" formik={formik} />
          <Input name="password" label="Password" formik={formik} type="password" />

          <Alert {...alertProps} />

          <Button {...buttonProps}>Sign In</Button>
        </FormItems>
      </form>
    </Segment>
  )
}
