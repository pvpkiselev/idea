import { canBlockIdeas, canEditIdea } from '@ideanick/backend/src/utils/can'
import { format } from 'date-fns'
import { Alert } from '../../../components/Alert'
import { Button, LinkButton } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Icon } from '../../../components/Icon'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getEditIdeaRoute, getViewIdeaRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import { type TrpcRouterOutputMaybeIdea } from '../../../models/types'
import styles from './index.module.scss'

interface LikeButtonProps {
  idea: TrpcRouterOutputMaybeIdea
}

interface BlockIdeaProps {
  idea: TrpcRouterOutputMaybeIdea
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
      <Icon size={32} className={styles.likeIcon} name={idea.isLikedByMe ? 'likeFilled' : 'likeEmpty'} />
    </button>
  )
}

const BlockIdea = (props: BlockIdeaProps) => {
  const { idea } = props

  const blockIdea = trpc.blockIdea.useMutation()

  const trpcUtils = trpc.useUtils()

  const { formik, alertProps, buttonProps } = useForm({
    onFormSubmit: async () => {
      await blockIdea.mutateAsync({ ideaId: idea.id })
      await trpcUtils.getIdea.refetch({ ideaNick: idea.nick })
    },
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Alert {...alertProps} />
        <Button color="red" {...buttonProps}>
          Block Idea
        </Button>
      </FormItems>
    </form>
  )
}

export const ViewIdeaPage = withPageWrapper({
  authorizedOnly: true,
  useQuery: () => {
    const { ideaNick } = getViewIdeaRoute.useParams()
    return trpc.getIdea.useQuery({ ideaNick })
  },
  setProps: ({ queryResult, ctx, checkExists }) => {
    const idea = checkExists(queryResult.data?.idea, 'Idea not found')

    return { idea, me: ctx.me }
  },
  showLoaderOnFetching: false,
  title: ({ idea }) => idea.name,
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

      {canEditIdea(me, idea) && (
        <div className={styles.editButton}>
          <LinkButton to={getEditIdeaRoute({ ideaNick: idea.nick })}>Edit Idea</LinkButton>
        </div>
      )}

      {canBlockIdeas(me) && (
        <div className={styles.blockIdea}>
          <BlockIdea idea={idea} />
        </div>
      )}
    </Segment>
  )
})
