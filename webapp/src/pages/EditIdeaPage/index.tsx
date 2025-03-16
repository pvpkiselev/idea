import type { TrpcRouterOutput } from '@ideanick/backend/src/router'
import { zUpdateIdeaTrpcInput } from '@ideanick/backend/src/router/updateIdea/input'
import { pick } from 'lodash'
import { useNavigate, useParams } from 'react-router'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { Textarea } from '../../components/Textarea'
import { useMe } from '../../lib/ctx'
import { useForm } from '../../lib/form'
import { getViewIdeaRoute, type TEditIdeaRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

const EditIdeaComponent = ({ idea }: { idea: NonNullable<TrpcRouterOutput['getIdea']['idea']> }) => {
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
}

export const EditIdeaPage = () => {
  const { ideaNick } = useParams() as TEditIdeaRouteParams

  const getIdeaResult = trpc.getIdea.useQuery({ ideaNick })

  const me = useMe()

  if (getIdeaResult.isLoading || getIdeaResult.isFetching) {
    return <div>Loading...</div>
  }

  if (getIdeaResult.isError) {
    return <div>Error: {getIdeaResult.error.message}</div>
  }

  if (!getIdeaResult.data.idea) {
    return <div>Idea Not found</div>
  }

  const idea = getIdeaResult.data.idea

  if (!me) {
    return <div>Only for authorized</div>
  }

  if (me.id !== idea.authorId) {
    return <div>An idea can only be edited by its author</div>
  }

  return <EditIdeaComponent idea={idea} />
}
