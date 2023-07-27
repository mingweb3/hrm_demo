import { useMemo } from 'react'
import { IconButton, Tooltip, styled } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { RemoveIcon } from '@/app/components/Svg/RemoveIcon'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { removeCanDocumentbyId } from '@/apis/candidate.api'
import { ICandidate } from '@/types/ICandidate'
import { IErrorForm } from '@/types/IErrorForm'
import { IFile } from '@/types/IFile'
import { messages } from '../../messages'

const StyledFileList = styled('div')(
  ({ theme }) => `
    border-top: 1px solid ${theme.palette.gray8};
    .atc {
      svg {
        width: 16px;
      }
    }
    .file-name {
      a { 
        color: ${theme.palette.blue2};
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .item-rw {
      border-bottom: 1px dashed ${theme.palette.gray8};
    }
  `
)

/* FILTE item comp */
const FileItem = (props: { data: IFile; index: number; onRemoveIFile: (id: string) => void }) => {
  const { data, index, onRemoveIFile } = props
  const { id, fileName, originUrl } = data

  const onRemoveItem = (id: string) => {
    onRemoveIFile(id)
  }

  return (
    <div className="item-rw flex flex-row items-center">
      <div className="w-[40px]">#{index + 1}</div>
      <div className="flex-1 file-name">
        <a href={originUrl} target="_blank" rel="noreferrer">
          {fileName}
        </a>
      </div>
      <div className="atc">
        <Tooltip title={`${t(messages.RemoveThisItem())}`}>
          <IconButton onClick={() => onRemoveItem(id.toString())} aria-hidden="true">
            <RemoveIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}

interface FileListProps {
  data: ICandidate
}

const FileList: React.FC<FileListProps> = ({ data }) => {
  const { attributes } = data
  const queryClient = useQueryClient()
  const queryStr = '?include=documents'

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API Create Candidate: Mutation
  const {
    mutate: removeFile,
    isLoading,
    error
  } = useMutation((id: string) => removeCanDocumentbyId(id), {
    onSuccess: () => {
      enqueueSnackbar(t(messages.RemovedSuccess()), { variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['candidate', attributes.UUID + queryStr], exact: true })
    }
  })

  const removeFileItem = (id: string) => {
    removeFile(id)
  }
  // Error handle
  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(error)) {
      return error.response?.data
    }
    return undefined
  }, [error])

  return (
    <StyledFileList className={`p-4 ${isLoading ? 'section-loading' : ''}`}>
      {errorForm && <ErrorForm error={errorForm?.error} />}
      {attributes && attributes.documents && (
        <div className="flex flex-col">
          {attributes.documents.length > 0 && (
            <>
              <div className="f16Bold mb-4">The List of Files</div>
              {attributes.documents.map((iFile: IFile, i) => {
                const { id } = iFile
                return <FileItem key={id} data={iFile} index={i} onRemoveIFile={removeFileItem} />
              })}
            </>
          )}
        </div>
      )}
      {(!attributes || !attributes.documents || attributes.documents.length <= 0) && (
        <div className="flex items-center justify-center">There is no file.</div>
      )}
    </StyledFileList>
  )
}

export default FileList
