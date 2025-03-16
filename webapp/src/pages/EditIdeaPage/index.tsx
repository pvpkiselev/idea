import type { TrpcRouterOutput } from '@ideanick/backend/src/router'
import { zUpdateIdeaTrpcInput } from '@ideanick/backend/src/router/updateIdea/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { pick } from 'lodash'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { Textarea } from '../../components/Textarea'
import { getViewIdeaRoute, type TEditIdeaRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

const EditIdeaComponent = ({ idea }: { idea: NonNullable<TrpcRouterOutput['getIdea']['idea']> }) => {
  const navigate = useNavigate()

  const [submittingError, setSubmittingError] = useState<string | null>(null)

  const updateIdea = trpc.updateIdea.useMutation()

  const formik = useFormik({
    initialValues: pick(idea, ['name', 'nick', 'description', 'text']),
    validate: withZodSchema(zUpdateIdeaTrpcInput.omit({ ideaId: true })),
    onSubmit: async (values) => {
      try {
        setSubmittingError(null)

        await updateIdea.mutateAsync({ ideaId: idea.id, ...values })

        await navigate(getViewIdeaRoute({ ideaNick: values.nick }))
      } catch (error: any) {
        setSubmittingError(error.message)
      }
    },
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

          {!formik.isValid && !!formik.submitCount && <div style={{ color: 'red' }}>Form is invalid</div>}

          {!!submittingError && <Alert color="red"> {submittingError}</Alert>}

          <Button type="submit" isLoading={formik.isSubmitting}>
            Update Idea
          </Button>
        </FormItems>
      </form>
    </Segment>
  )
}

export const EditIdeaPage = () => {
  const { ideaNick } = useParams() as TEditIdeaRouteParams

  const getIdeaResult = trpc.getIdea.useQuery({ ideaNick })

  const getMeResult = trpc.getMe.useQuery()

  if (getIdeaResult.isLoading || getIdeaResult.isFetching || getMeResult.isLoading || getMeResult.isFetching) {
    return <div>Loading...</div>
  }

  if (getIdeaResult.isError) {
    return <div>Error: {getIdeaResult.error.message}</div>
  }

  if (getMeResult.isError) {
    return <div>Error: {getMeResult.error.message}</div>
  }

  if (!getIdeaResult.data.idea) {
    return <div>Idea Not found</div>
  }

  const idea = getIdeaResult.data.idea
  const me = getMeResult.data.me

  if (!me) {
    return <div>Only for authorized</div>
  }

  if (me.id !== idea.authorId) {
    return <div>An idea can only be edited by its author</div>
  }

  return <EditIdeaComponent idea={idea} />
}
