import { zCreateIdeaTrpcInput } from '@ideanick/backend/src/router/createIdea/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { useState } from 'react'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { Textarea } from '../../components/Textarea'
import { trpc } from '../../lib/trpc'

export const NewIdeaPage = () => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const [submittingError, setSubmittingError] = useState<string | null>(null)

  const createIdea = trpc.createIdea.useMutation()

  const formik = useFormik({
    initialValues: {
      name: '',
      nick: '',
      description: '',
      text: '',
    },
    validate: withZodSchema(zCreateIdeaTrpcInput),
    onSubmit: async (values) => {
      const visibleTime = 3000

      try {
        await createIdea.mutateAsync(values)

        formik.resetForm()
        setSuccessMessageVisible(true)

        setTimeout(() => {
          setSuccessMessageVisible(false)
        }, visibleTime)
      } catch (error: any) {
        setSubmittingError(error.message)

        setTimeout(() => {
          setSubmittingError(null)
        }, visibleTime)
      }
    },
  })

  return (
    <Segment title="New Idea">
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

          {successMessageVisible && <Alert color="green">Idea created successfully</Alert>}

          <Button type="submit" isLoading={formik.isSubmitting}>
            Create Idea
          </Button>
        </FormItems>
      </form>
    </Segment>
  )
}
