import { Link } from 'react-router'
import { Segment } from '../../components/Segment'
import { getViewIdeaRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import styles from './index.module.scss'

export const AllIdeasPage = () => {
  const { data, error, isLoading, isFetching, isError } = trpc.getIdeas.useQuery()

  if (isLoading || isFetching) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  return (
    <Segment title="All Ideas">
      <div className={styles.ideas}>
        {data.ideas.map((idea) => (
          <div className={styles.idea} key={idea.nick}>
            <Segment
              size={2}
              title={
                <Link className={styles.ideaLink} to={getViewIdeaRoute({ ideaNick: idea.nick })}>
                  {idea.name}
                </Link>
              }
              description={idea.description}
            ></Segment>
          </div>
        ))}
      </div>
    </Segment>
  )
}
