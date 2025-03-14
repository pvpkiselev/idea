import _ from 'lodash'

export const ideas = _.times(100, (i) => ({
  nick: `cool-idea-nick-${i}`,
  name: `Idea ${i}`,
  description: `Idea ${i} description`,
  text: _.times(100, (j) => `<p>Text paragraph ${j} of idea ${i}</p>`).join(''),
}))
