import React from 'react'
import { styled } from '@mui/system'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface NavHeadProps {
  iconComp: IconProp
  text: string
}

const StyledNavHead = styled('div')(
  () => `
  .grp-head {
    .fr-icon {
      width: 24px;
      height: 24px;
      svg {
        width: 24px;
        height: 24px;
      }
    }
  }
  `
)

const NavHead: React.FC<NavHeadProps> = props => {
  const { iconComp, text } = props

  return (
    <StyledNavHead>
      <div className="grp-head f16Bold px-5 py-4 flex items-center gap-2">
        <figure className="fr-icon flex items-center justify-center text-primary">
          <FontAwesomeIcon icon={iconComp} />
        </figure>
        <h4>{text}</h4>
      </div>
    </StyledNavHead>
  )
}

export default NavHead
