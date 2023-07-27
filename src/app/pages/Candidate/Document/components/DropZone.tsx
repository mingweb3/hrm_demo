import { useCallback, useMemo } from 'react'
import { LinearProgress, styled } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { useDropzone } from 'react-dropzone'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { uploadCanDocument } from '@/apis/candidate.api'
import { IErrorForm } from '@/types/IErrorForm'
import { messages } from '../../messages'

const StyledDropZoneLayout = styled('div')(
  ({ theme }) => `
  .drop-box {
    border: 1px dashed ${theme.palette.blue2};
    border-radius: 8px;
    padding: 10px;
    background-color: #f4faff;
    &.focus {
      background-color: #d7edff;
    }
    &.drag-accept {
      border-color: ${theme.palette.green2};
      background-color: #dffff8;
    }
    &.drag-reject {
      border-color: ${theme.palette.red2};
      background-color: #ffdfdf;
    }
  }
`
)

interface DropZoneProps {
  id: string
  canUUID: string
}

const DropZone: React.FC<DropZoneProps> = ({ canUUID, id }) => {
  const queryClient = useQueryClient()

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API Create Candidate: Mutation
  const {
    mutate: uploadDocument,
    isLoading,
    error
  } = useMutation((formData: FormData) => uploadCanDocument(formData), {
    onSuccess: () => {
      const queryStr = '?include=documents'
      queryClient.invalidateQueries({ queryKey: ['candidate', canUUID + queryStr], exact: true })
      enqueueSnackbar(t(messages.UploadFileSuccess()), { variant: 'success' })
    }
  })

  // Error handle
  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(error)) {
      return error.response?.data
    }
    return undefined
  }, [error])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const body = new FormData()
        body.append('property', 'document')
        body.append('type', 'candidate')
        body.append('typeId', id)

        acceptedFiles.forEach(itmFile => {
          if (itmFile) {
            body.append(`files[]`, itmFile)
          }
        })

        uploadDocument(body)
      }
    },
    [id, uploadDocument]
  )

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    maxFiles: 10,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': [],
      'application/pdf': ['.pdf']
    }
  })

  return (
    <StyledDropZoneLayout>
      <div className="guide-txt f14Regular mb-2 text-primary">
        Upload <b>image, pdf file</b> only. One file per time.
      </div>
      <div
        {...getRootProps()}
        className={`drop-box ${isLoading ? 'section-loading' : ''} ${isFocused ? 'focus' : ''} ${
          isDragAccept ? 'drag-accept' : ''
        } ${isDragReject ? 'drag-reject' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <div className="f14Regular">[ U P L O A D ]</div>
          <div className="f14Regular">Drop or Select file to upload</div>
        </div>
      </div>
      {isLoading && (
        <div className="pt-1">
          <LinearProgress />
        </div>
      )}

      {errorForm && (
        <div className="py-2">
          <ErrorForm error={errorForm?.error} />
        </div>
      )}
    </StyledDropZoneLayout>
  )
}

export default DropZone
