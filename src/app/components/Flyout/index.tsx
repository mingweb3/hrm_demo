import { FC } from 'react'
import { alpha, styled } from '@mui/material/styles'
import { createPortal } from 'react-dom'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import getPortalRoot from '@/utils/getPortalRoot'
// COMPs
import { Button } from '../Button'

const FlyoutHeader = styled('div')(`
  display: flex;
  flex-direction: column;
  position: relative;
`)
const FlyoutBody = styled('div')(`
  block-size: 100%;
  overflow-y: hidden;
`)
const StyledFlyout = styled('div', {
  shouldForwardProp: prop => prop !== 'lowerCase' && prop !== 'myProp'
})<{ width?: string; height?: string }>(
  ({ height, width, theme }) => `
    background-color: ${theme.palette.common.white};
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    transition: opacity 0.4s ease-in-out;
    box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.1);
    padding: 20px 20px 32px 20px;
    display: flex;
    flex-direction: column;
    z-index: 9;
    visibility: hidden;
    opacity: 0;
    &.opened {
      visibility: visible;
      opacity: 1;
    }

    .flyout-content {
      block-size: 100%;
      overflow: hidden auto;
    }
    width: 100%;
    ${theme.breakpoints.up('lg')} {
      height: ${height};
      width: ${width};
      top: unset;
    }
`
)

const Overlay = styled('div')(
  ({ theme }) => `
    position: fixed;
    z-index: 9;
    inset: 0;
    background-color: ${alpha(theme.palette.common.black, 0.3)};
    opacity: 0;
    visibility: hidden;
    &.opened {
      opacity: 1;
      visibility: visible;
    }
  `
)

interface FlyoutProps {
  onClose: () => void
  height?: string
  width?: string
  content?: React.ReactNode
  title?: React.ReactNode
}

const Flyout: FC<FlyoutProps> = ({ onClose, height, width, content, title }) => {
  const portal = getPortalRoot()
  if (portal)
    return createPortal(
      <>
        <>
          <Overlay id="flyout-overlay" />
          <StyledFlyout id="flyout" height={height || '600px'} width={width || '1024px'}>
            <FlyoutHeader className="pt-2 pb-4 flex flex-row items-center">
              {title}
              <Button onClick={onClose}>
                <FontAwesomeIcon size="lg" icon={faClose} />
              </Button>
            </FlyoutHeader>
            <FlyoutBody>
              <div className="flyout-content">{content}</div>
            </FlyoutBody>
          </StyledFlyout>
        </>
      </>,
      portal
    )
  return null
}

export default Flyout
