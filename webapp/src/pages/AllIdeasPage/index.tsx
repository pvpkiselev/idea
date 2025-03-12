import { Link } from 'react-router'
import { getViewIdeaRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const AllIdeasPage = () => {
  const { data, error, isLoading, isFetching, isError } = trpc.getIdeas.useQuery()

  if (isLoading || isFetching) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div>
      <h1>All Ideas</h1>
      {data.ideas.map((idea) => (
        <div key={idea.nick}>
          <h2>
            <Link to={getViewIdeaRoute({ ideaNick: idea.nick })}> {idea.name} </Link>
          </h2>
          <p>{idea.description}</p>
        </div>
      ))}
    </div>
  )
}
