import { zUpdateIdeaTrpcInput } from '@ideanick/backend/src/router/ideas/updateIdea/input'
import { canEditIdea } from '@ideanick/backend/src/utils/can'
import { pick } from 'lodash'
import { useNavigate, useParams } from 'react-router'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { Textarea } from '../../../components/Textarea'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getViewIdeaRoute, type EditIdeaRouteParams } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

export const EditIdeaPage = withPageWrapper({
  authorizedOnly: true,
  useQuery: () => {
    const { ideaNick } = useParams() as EditIdeaRouteParams
    return trpc.getIdea.useQuery({ ideaNick })
  },
  setProps: ({ queryResult, ctx, checkExists, checkAccess }) => {
    const idea = checkExists(queryResult.data?.idea, 'Idea not found')
    checkAccess(!canEditIdea(ctx.me, idea), 'An idea can only be edited by the author')

    return { idea }
  },
  title: ({ idea }) => `Edit Idea: "${idea.name}"`,
})(({ idea }) => {
  const navigate = useNavigate()

  const updateIdea = trpc.updateIdea.useMutation()

  const { formik, buttonProps, alertProps } = useForm({
    initialValues: pick(idea, ['name', 'nick', 'description', 'text']),
    validationSchema: zUpdateIdeaTrpcInput.omit({ ideaId: true }),
    onFormSubmit: async (values) => {
      await updateIdea.mutateAsync({ ideaId: idea.id, ...values })
      await navigate(getViewIdeaRoute({ ideaNick: values.nick }))
    },
    resetOnSuccess: false,
    showValidationAlert: true,
  })

  return (
    <Segment title={`Edit Idea: ${idea.nick}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <FormItems>
          <Input name="name" label="Name" formik={formik} />
          <Input name="nick" label="Nick" formik={formik} />
          <Input name="description" label="Description" formik={formik} maxWidth={500} />
          <Textarea name="text" label="Text" formik={formik} />

          <Alert {...alertProps} />

          <Button {...buttonProps}>Update Idea</Button>
        </FormItems>
      </form>
    </Segment>
  )
})
