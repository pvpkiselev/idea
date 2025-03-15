import { zSignUpTrpcInput } from '@ideanick/backend/src/router/signUp/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { z } from 'zod'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { getAllIdeasRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const SignUpPage = () => {
  const navigate = useNavigate()

  const trpcUtils = trpc.useUtils()

  const [submittingError, setSubmittingError] = useState<string | null>(null)

  const signUp = trpc.signUp.useMutation()

  const formik = useFormik({
    initialValues: {
      nick: '',
      password: '',
      passwordAgain: '',
    },
    validate: withZodSchema(
      zSignUpTrpcInput
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
        })
    ),
    onSubmit: async (values) => {
      const visibleTime = 3000

      try {
        const { token } = await signUp.mutateAsync(values)
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
    <Segment title="Sign Up">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input name="nick" label="Nick" formik={formik} />
          <Input name="password" label="Password" formik={formik} type="password" />
          <Input name="passwordAgain" label="Password Again" formik={formik} type="password" />

          {!formik.isValid && !!formik.submitCount && <div style={{ color: 'red' }}>Form is invalid</div>}

          {!!submittingError && <Alert color="red"> {submittingError}</Alert>}

          <Button type="submit" isLoading={formik.isSubmitting}>
            Sign Up
          </Button>
        </FormItems>
      </form>
    </Segment>
  )
}
