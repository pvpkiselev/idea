import * as dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const zNonemptyTrimmed = z.string().trim().min(1)
const zNonemptyTrimmedRequiredOnNotLocal = zNonemptyTrimmed
  .optional()
  // eslint-disable-next-line node/no-process-env
  .refine((value) => process.env.HOST_ENV === 'local' || !!value, 'Required on local host')

const zEnv = z.object({
  PORT: zNonemptyTrimmed,
  HOST_ENV: z.enum(['local', 'production']),
  DATABASE_URL: zNonemptyTrimmed,
  JWT_SECRET: zNonemptyTrimmed,
  PASSWORD_SALT: zNonemptyTrimmed,
  INITIAL_ADMIN_PASSWORD: zNonemptyTrimmed,
  WEBAPP_URL: zNonemptyTrimmed,
  EMAIL_SERVICE_API_KEY: zNonemptyTrimmedRequiredOnNotLocal,
  FROM_EMAIL_NAME: zNonemptyTrimmed,
  FROM_EMAIL_ADDRESS: zNonemptyTrimmed,
})

// eslint-disable-next-line node/no-process-env
export const env = zEnv.parse(process.env)
