import { zUpdateProfileTrpcInput } from '@ideanick/backend/src/router/auth/updateProfile/input'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

export const EditProfilePage = withPageWrapper({
  authorizedOnly: true,
  setProps: ({ getAuthorizedMe }) => {
    const me = getAuthorizedMe()
    return { me }
  },
})(({ me }) => {
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
    <Segment title="Edit Profile">
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
    </Segment>
  )
})
