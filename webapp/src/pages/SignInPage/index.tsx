import { zSignInTrpcInput } from '@ideanick/backend/src/router/signIn/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { getAllIdeasRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const SignInPage = () => {
  const navigate = useNavigate()

  const trpcUtils = trpc.useUtils()

  const [submittingError, setSubmittingError] = useState<string | null>(null)

  const signIn = trpc.signIn.useMutation()

  const formik = useFormik({
    initialValues: {
      nick: '',
      password: '',
    },
    validate: withZodSchema(zSignInTrpcInput),
    onSubmit: async (values) => {
      const visibleTime = 3000

      try {
        const { token } = await signIn.mutateAsync(values)
        Cookies.set('token', token, { expires: 99999 })

        await trpcUtils.invalidate()

        await navigate(getAllIdeasRoute())
      } catch (error: any) {
        setSubmittingError(error.message)

        setTimeout(() => {
          setSubmittingError(null)
        }, visibleTime)
      }
    },
  })

  return (
    <Segment title="Sign In">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input name="nick" label="Nick" formik={formik} />
          <Input name="password" label="Password" formik={formik} type="password" />

          {!formik.isValid && !!formik.submitCount && <div style={{ color: 'red' }}>Form is invalid</div>}

          {!!submittingError && <Alert color="red"> {submittingError}</Alert>}

          <Button type="submit" isLoading={formik.isSubmitting}>
            Sign In
          </Button>
        </FormItems>
      </form>
    </Segment>
  )
}
