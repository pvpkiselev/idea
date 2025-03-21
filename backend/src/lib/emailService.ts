import axios, { type AxiosResponse } from 'axios'
import _ from 'lodash'
import { env } from './env'

// For Example: Brevo API docs: https://www.brevo.com/en/docs/email-api

const makeRequestToEmailService = async ({
  path,
  data,
}: {
  path: string
  data: Record<string, any>
}): Promise<{
  originalResponse?: AxiosResponse
  loggableResponse: Pick<AxiosResponse, 'status' | 'statusText' | 'data'>
}> => {
  if (!env.EMAIL_SERVICE_API_KEY) {
    return {
      loggableResponse: {
        status: 200,
        statusText: 'OK',
        data: { message: 'EMAIL_SERVICE_API_KEY is not set' },
      },
    }
  }
  const response = await axios({
    method: 'POST',
    url: `https://api.brevo.com/v3/${path}`,
    headers: {
      accept: 'application/json',
      'api-key': env.EMAIL_SERVICE_API_KEY,
      'content-type': 'application/json',
    },
    data,
  })
  return {
    originalResponse: response,
    loggableResponse: _.pick(response, ['status', 'statusText', 'data']),
  }
}

export const sendEmailThroughEmailService = async ({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) => {
  return await makeRequestToEmailService({
    path: 'smtp/email',
    data: {
      subject,
      htmlContent: html,
      sender: { email: env.FROM_EMAIL_ADDRESS, name: env.FROM_EMAIL_NAME },
      to: [{ email: to }],
    },
  })
}
