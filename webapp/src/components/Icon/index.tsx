import { createElement } from 'react'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { type IconBaseProps } from 'react-icons/lib'

const icons = {
  likeEmpty: AiOutlineHeart,
  likeFilled: AiFillHeart,
}

interface IconProps extends IconBaseProps {
  name: keyof typeof icons
}

export const Icon = (props: IconProps) => {
  const { name, ...restProps } = props

  return createElement(icons[name], restProps)
}
