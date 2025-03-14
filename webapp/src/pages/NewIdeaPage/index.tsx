import { zCreateIdeaTrpcInput } from '@ideanick/backend/src/router/createIdea/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { useState } from 'react'
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
        <Input name="name" label="Name" formik={formik} />
        <Input name="nick" label="Nick" formik={formik} />
        <Input name="description" label="Description" formik={formik} />
        <Textarea name="text" label="Text" formik={formik} />

        {!formik.isValid && !!formik.submitCount && <div style={{ color: 'red' }}>Form is invalid</div>}

        {!!submittingError && <div style={{ color: 'red' }}>{submittingError}</div>}

        {successMessageVisible && <div style={{ color: 'green' }}>Idea created successfully</div>}

        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Submitting...' : 'Create Idea'}
        </button>
      </form>
    </Segment>
  )
}
