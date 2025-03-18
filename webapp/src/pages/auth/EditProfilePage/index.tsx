import { zUpdatePasswordTrpcInput } from '@ideanick/backend/src/router/auth/updatePassword/input'
import { zUpdateProfileTrpcInput } from '@ideanick/backend/src/router/auth/updateProfile/input'
import { z } from 'zod'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'
import { type TrpcRouterOutputMaybeMe } from '../../../models/types'

interface GeneralProps {
  me: TrpcRouterOutputMaybeMe
}

const General = (props: GeneralProps) => {
  const { me } = props

  const trpcUtils = trpc.useUtils()

  const updateProfile = trpc.updateProfile.useMutation()

  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: me.nick,
      name: me.name,
    },
    validationSchema: zUpdateProfileTrpcInput,
    onFormSubmit: async (values) => {
      const updatedMe = await updateProfile.mutateAsync(values)
      trpcUtils.getMe.setData(undefined, { me: updatedMe })
    },
    successMessage: 'Profile updated',
    resetOnSuccess: false,
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        formik.handleSubmit()
      }}
    >
      <FormItems>
        <Input name="nick" label="Nick" formik={formik} />
        <Input name="name" label="Name" formik={formik} />

        <Alert {...alertProps} />

        <Button {...buttonProps}>Update Profile</Button>
      </FormItems>
    </form>
  )
}

const Password = () => {
  const updatePassword = trpc.updatePassword.useMutation()
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordAgain: '',
    },
    validationSchema: zUpdatePasswordTrpcInput
      .extend({
        newPasswordAgain: z.string().min(1),
      })
      .superRefine((value, ctx) => {
        if (value.newPassword !== value.newPasswordAgain) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Passwords do not match',
            path: ['newPasswordAgain'],
          })
        }
      }),
    onFormSubmit: async ({ newPassword, oldPassword }) => {
      await updatePassword.mutateAsync({ newPassword, oldPassword })
    },
    successMessage: 'Password updated',
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Input label="Old password" name="oldPassword" type="password" formik={formik} />
        <Input label="New password" name="newPassword" type="password" formik={formik} />
        <Input label="New password again" name="newPasswordAgain" type="password" formik={formik} />

        <Alert {...alertProps} />

        <Button {...buttonProps}>Update Password</Button>
      </FormItems>
    </form>
  )
}

export const EditProfilePage = withPageWrapper({
  authorizedOnly: true,
  setProps: ({ getAuthorizedMe }) => {
    const me = getAuthorizedMe()
    return { me }
  },
  title: 'Edit Profile',
})(({ me }) => {
  return (
    <>
      <Segment title="Edit Profile">
        <Segment title="General" size={2}>
          <General me={me} />
        </Segment>

        <Segment title="Password" size={2}>
          <Password />
        </Segment>
      </Segment>
    </>
  )
})
