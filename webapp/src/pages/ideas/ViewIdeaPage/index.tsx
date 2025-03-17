import type { TrpcRouterOutput } from '@ideanick/backend/src/router'
import { format } from 'date-fns'
import { useParams } from 'react-router'
import { LinkButton } from '../../../components/Button'
import { Segment } from '../../../components/Segment'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { type EditIdeaRouteParams, getEditIdeaRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import styles from './index.module.scss'

interface LikeButtonProps {
  idea: NonNullable<TrpcRouterOutput['getIdea']['idea']>
}

const LikeButton = (props: LikeButtonProps) => {
  const { idea } = props

  const trpcUtils = trpc.useUtils()

  const setIdeaLike = trpc.setIdeaLike.useMutation({
    onMutate: ({ isLikedByMe }) => {
      const oldGetIdeaData = trpcUtils.getIdea.getData({ ideaNick: idea.nick })

      if (oldGetIdeaData?.idea) {
        const newGetIdeaData = {
          ...oldGetIdeaData,
          idea: {
            ...oldGetIdeaData.idea,
            isLikedByMe,
            likesCount: Number(oldGetIdeaData.idea?.likesCount) + (isLikedByMe ? 1 : -1),
          },
        }

        trpcUtils.getIdea.setData({ ideaNick: idea.nick }, newGetIdeaData)
      }
    },
    onSuccess: () => {
      void trpcUtils.getIdea.invalidate({ ideaNick: idea.nick })
    },
  })

  return (
    <button
      className={styles.likeButton}
      onClick={() => {
        void setIdeaLike.mutateAsync({ ideaId: idea.id, isLikedByMe: !idea.isLikedByMe })
      }}
    >
      {idea.isLikedByMe ? 'Unlike' : 'Like'}
    </button>
  )
}

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
  showLoaderOnFetching: false,
})(({ idea, me }) => {
  return (
    <Segment title={idea.name} description={idea.description}>
      <div className={styles.createdAt}>Created At: {format(idea.createdAt, 'yyyy-MM-dd')}</div>

      <div className={styles.author}>
        Author: {idea.author.nick} {idea.author.name ? `(${idea.author.name})` : ''}
      </div>

      <div className={styles.text} dangerouslySetInnerHTML={{ __html: idea.text }} />

      <div className={styles.likes}>
        Likes: {idea.likesCount}
        {me && (
          <>
            <br />
            <LikeButton idea={idea} />
          </>
        )}
      </div>

      {me?.id === idea.authorId && (
        <div className={styles.editButton}>
          <LinkButton to={getEditIdeaRoute({ ideaNick: idea.nick })}>Edit Idea</LinkButton>
        </div>
      )}
    </Segment>
  )
})
