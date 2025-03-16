import { format } from 'date-fns'
import { useParams } from 'react-router'
import { LinkButton } from '../../components/Button'
import { Segment } from '../../components/Segment'
import { getEditIdeaRoute, type TViewIdeaRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import styles from './index.module.scss'

export const ViewIdeaPage = () => {
  const { ideaNick } = useParams() as TViewIdeaRouteParams

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
}
