import { useParams } from 'react-router'
import { Segment } from '../../components/Segment'
import type { TViewIdeaRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import styles from './index.module.scss'

export const ViewIdeaPage = () => {
  const { ideaNick } = useParams() as TViewIdeaRouteParams

  const { data, error, isLoading, isFetching, isError } = trpc.getIdea.useQuery({
    ideaNick,
  })

  if (isLoading || isFetching) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  if (!data.idea) {
    return <div>Idea Not found</div>
  }

  return (
    <Segment title={data.idea.name} description={data.idea.description}>
      <div className={styles.text} dangerouslySetInnerHTML={{ __html: data.idea.text }} />
    </Segment>
  )
}
