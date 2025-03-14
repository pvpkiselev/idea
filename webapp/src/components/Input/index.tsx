import { type FormikProps } from 'formik'

interface InputProps {
  name: string
  label: string
  formik: FormikProps<any>
}

export const Input = (props: InputProps) => {
  const {
    name,
    label,
    formik: { values, errors, setFieldValue, setFieldTouched, touched },
  } = props

  const value = values[name]
  const error = errors[name] as string | undefined
  const isTouched = touched[name]

  return (
    <div style={{ marginBottom: 10 }}>
      <label htmlFor={name}>{label}</label>
      <br />

      <input
        type="text"
        onChange={(e) => {
          void setFieldValue(name, e.target.value)
        }}
        onBlur={() => {
          void setFieldTouched(name, true)
        }}
        value={value}
        name={name}
        id={name}
      />
      {!!isTouched && !!error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  )
}
