import { format } from 'date-fns'
import { useParams } from 'react-router'
import { LinkButton } from '../../../components/Button'
import { Segment } from '../../../components/Segment'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { type EditIdeaRouteParams, getEditIdeaRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import styles from './index.module.scss'

export const ViewIdeaPage = withPageWrapper({
  authorizedOnly: true,
  useQuery: () => {
    const { ideaNick } = useParams() as EditIdeaRouteParams
    return trpc.getIdea.useQuery({ ideaNick })
  },
  setProps: ({ queryResult, ctx, checkExists }) => {
    const idea = checkExists(queryResult.data?.idea, 'Idea not found')

    return { idea, me: ctx.me }
  },
})(({ idea, me }) => {
  return (
    <Segment title={idea.name} description={idea.description}>
      <div className={styles.createdAt}>Created At: {format(idea.createdAt, 'yyyy-MM-dd')}</div>
      <div className={styles.author}>Author: {idea.author.nick}</div>
      <div className={styles.text} dangerouslySetInnerHTML={{ __html: idea.text }} />

      {me?.id === idea.authorId && (
        <div className={styles.editButton}>
          <LinkButton to={getEditIdeaRoute({ ideaNick: idea.nick })}>Edit Idea</LinkButton>
        </div>
      )}
    </Segment>
  )
})
