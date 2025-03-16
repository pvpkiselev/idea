import { zSignUpTrpcInput } from '@ideanick/backend/src/router/signUp/input'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { useForm } from '../../lib/form'
import { getAllIdeasRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const SignUpPage = () => {
  const navigate = useNavigate()

  const trpcUtils = trpc.useUtils()

  const signUp = trpc.signUp.useMutation()

  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: '',
      password: '',
      passwordAgain: '',
    },
    validationSchema: zSignUpTrpcInput
      .extend({
        passwordAgain: z.string().min(1),
      })
      .superRefine((value, ctx) => {
        if (value.password !== value.passwordAgain) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords do not match',
            path: ['passwordAgain'],
          })
        }
      }),
    onFormSubmit: async (values) => {
      const { token } = await signUp.mutateAsync(values)
      Cookies.set('token', token, { expires: 99999 })

      await trpcUtils.invalidate()

      await navigate(getAllIdeasRoute())
    },
    resetOnSuccess: false,
  })

  return (
    <Segment title="Sign Up">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input name="nick" label="Nick" formik={formik} />
          <Input name="password" label="Password" formik={formik} type="password" />
          <Input name="passwordAgain" label="Password Again" formik={formik} type="password" />

          <Alert {...alertProps} />

          <Button {...buttonProps}> Sign Up</Button>
        </FormItems>
      </form>
    </Segment>
  )
}
