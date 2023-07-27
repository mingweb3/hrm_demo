import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { styled } from '@mui/material/styles'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const StyledModalHeader = styled('div')(`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`)

interface AlertModalProps {
  title?: string
  content: React.ReactNode
  getResult: (res: boolean) => void
  btnConfirmText?: string
  titleClassName?: string
  hideActions?: boolean
  showCloseIcon?: boolean
}

const AlertModal: React.FC<AlertModalProps> = ({
  title,
  content,
  getResult,
  btnConfirmText = 'Ok, remove',
  hideActions,
  showCloseIcon,
  titleClassName = ''
}) => {
  return (
    <>
      {title && (
        <StyledModalHeader>
          <DialogTitle className={titleClassName}>{title}</DialogTitle>
          {showCloseIcon && (
            <Button onClick={() => getResult(false)}>
              <FontAwesomeIcon size="lg" icon={faClose} />
            </Button>
          )}
        </StyledModalHeader>
      )}
      <DialogContent>{content}</DialogContent>
      {!hideActions && (
        <DialogActions sx={{ padding: ' 0 24px 20px' }} className="flex flex-row justify-between items-center">
          <Button onClick={() => getResult(false)}>Disagree</Button>
          <Button onClick={() => getResult(true)} autoFocus variant="outlined" color="error">
            {btnConfirmText}
          </Button>
        </DialogActions>
      )}
    </>
  )
}

export default AlertModal
