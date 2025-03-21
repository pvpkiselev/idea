import { CronJob } from 'cron'
import { notifyAboutMostLikedIdeas } from '../scripts/notifyAboutMostLikedIdeas'
import { type AppContext } from './ctx'

export const applyCron = (ctx: AppContext) => {
  // for testing
  // notifyAboutMostLikedIdeas({ ctx }).catch((error) => {
  //   console.error('cron', error)
  // })
  new CronJob(
    '0 10 1 * *', // At 10:00 on day-of-month 1
    () => {
      notifyAboutMostLikedIdeas({ ctx }).catch((error) => {
        console.error('cron', error)
      })
    },
    null, // onComplete
    true // start right now
  )
}
