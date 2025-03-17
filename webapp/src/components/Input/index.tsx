import cn from 'classnames'
import { type FormikProps } from 'formik'
import styles from './index.module.scss'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  formik: FormikProps<any>
  maxWidth?: number | string
}

export const Input = (props: InputProps) => {
  const {
    name,
    label,
    formik: { values, errors, setFieldValue, setFieldTouched, touched, isSubmitting },
    maxWidth,
  } = props

  const value = values[name]
  const error = errors[name] as string | undefined
  const isTouched = touched[name]
  const isDisabled = isSubmitting
  const isInvalid = !!isTouched && !!error

  return (
    <div className={cn({ [styles.field]: true, [styles.disabled]: isDisabled })}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>

      <input
        className={cn({ [styles.input]: true, [styles.invalid]: isInvalid })}
        style={{ maxWidth }}
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
        disabled={isSubmitting}
      />

      {isInvalid && <div className={styles.error}>{error}</div>}
    </div>
  )
}
