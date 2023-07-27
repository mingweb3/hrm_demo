import React from 'react'
import { alpha, styled } from '@mui/material/styles'

interface SocialBoxProps {
  iconComp: React.ReactNode
  text: string
}

const StyledSocialBox = styled('button')(
  ({ theme }) => `
    .icon-box {
      border: 1px solid ${alpha(theme.palette.common.black, 0.2)};
      transition: all 0.2s ease-out;
    }
    > span {
      color: ${theme.palette.black444};
    }

    &:hover {
      .icon-box {
        border: 1px solid ${theme.palette.primary.main};
        svg {
          path {
            fill: ${theme.palette.primary.main};
          }
        }
      }
      > span {
        color: ${theme.palette.primary.main};
      }
    }
  `
)

export const SocialBox: React.FC<SocialBoxProps> = props => {
  const { iconComp, text } = props
  return (
    <StyledSocialBox className="flex flex-col items-center gap-1 cursor-pointer">
      <div className="icon-box flex items-center justify-center rounded-[2px] w-14 h-14">{iconComp}</div>
      <span className="f12Regular sm:f14Regular">{text}</span>
    </StyledSocialBox>
  )
}
