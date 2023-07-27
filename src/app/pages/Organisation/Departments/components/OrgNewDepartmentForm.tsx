import { useMemo, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { Button } from '@/app/components/Button'
import ErrorForm from '@/app/components/WForm/ErrorForm'
import { addDepartmentToOrgFn } from '@/apis/organization.api'
import { IErrorForm } from '@/types/IErrorForm'
import { IDepartmentForm, IDivisionForm } from '@/types/IJob'
import { IDepartmentIdForm } from '@/types/IOrganization'
import { messages } from '../../messages'
import OrgDepartmentIpt from './OrgDepartmentIpt'
import OrgDivisionIpt from './OrgDivisionIpt'

const StyledOrgNewDepartmentForm = styled('div')(
  ({ theme }) => `
    border-bottom: 1px solid ${theme.palette.common.white};
`
)

interface OrgNewDepartmentFormProps {
  className?: string
  id: string // ORG UUID
  onClose: () => void
}

const OrgNewDepartmentForm: React.FC<OrgNewDepartmentFormProps> = ({ id, onClose }) => {
  const queryClient = useQueryClient()
  const [division, setDivision] = useState<IDivisionForm | null>()
  const [department, setDepartment] = useState<IDepartmentForm | null>()

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // API Add Department to ORG: Mutation
  const {
    mutate: addDepartmentToOrg,
    isLoading,
    error
  } = useMutation((formData: IDepartmentIdForm) => addDepartmentToOrgFn(id, formData), {
    onSuccess: () => {
      onClose()
      queryClient.invalidateQueries({ queryKey: ['organization', `${id}_departments_divisions`], exact: true })
      enqueueSnackbar(t(messages.AddDepartmentSuccess()), { variant: 'success' })
    }
  })

  // Error handle
  const errorForm = useMemo(() => {
    if (isAxiosError<{ error: IErrorForm }>(error)) {
      return error.response?.data
    }
    return undefined
  }, [error])

  const onSubmit = () => {
    if (isLoading) return
    if (department === null || department === undefined) return
    if (department.id) {
      const _id = department.id || ''
      addDepartmentToOrg({ departmentId: _id.toString() })
    }
  }

  return (
    <StyledOrgNewDepartmentForm>
      <div className="flex flex-col gap-4">
        <OrgDivisionIpt onSelect={data => setDivision(data)} />
        {division && division.id && <OrgDepartmentIpt division={division} onSelect={data => setDepartment(data)} />}
        {errorForm && (
          <div className="mb-4">
            <ErrorForm error={errorForm?.error} />
          </div>
        )}
        {department && department.id && (
          <div>
            <Button onClick={onSubmit} variant="primary">
              <span>Add to organization</span>
            </Button>
          </div>
        )}
      </div>
    </StyledOrgNewDepartmentForm>
  )
}

export default OrgNewDepartmentForm
