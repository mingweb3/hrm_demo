import * as React from 'react'
// COMPs
import { Autocomplete, FormControl, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { t } from 'i18next'
import { Button } from '@/app/components/Button'
import { assignedRecruiters } from '@/fake-data/candidates'
import { messages } from '../../messages'

const StyledFilterForm = styled('div')(
  ({ theme }) => `
      border-top: 1px solid ${theme.palette.bg};
      .btn-group {
        button {
          ${theme.breakpoints.up('md')} {
            padding: 10px 24px;
          }
          padding: 0;
        }
      }
  `
)
interface FilterFormProps {
  onClose: () => void
}

export const FilterForm: React.FC<FilterFormProps> = props => {
  const { onClose } = props
  // const [value, setValue] = React.useState<Dayjs | null>(null)

  // const handleChange = (newValue: Dayjs | null) => {
  //   setValue(newValue)
  // }

  return (
    <StyledFilterForm className="filter-form-wrap">
      <div className="p-4">
        <h5 className="f12Regular uppercase letter tracking-[.2em] text-gray5 mb-4">{`${t(messages.filterData())}`}</h5>

        <div className="flex flex-col gap-6">
          <div className="flex flex-row gap-4">
            <FormControl className="flex-1 int-group">
              <TextField size="small" label={t(messages.jobTitle())} variant="outlined" />
            </FormControl>
            <FormControl className="flex-1 int-group">
              <TextField size="small" label={t(messages.organization())} variant="outlined" />
            </FormControl>
          </div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="flex flex-row gap-4">
              <FormControl className="flex-1 int-group">
                <DesktopDatePicker
                  label={`${t(messages.AssignedDateFrom())}`}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      size: 'small'
                    }
                  }}
                />
              </FormControl>
              <FormControl className="flex-1 int-group">
                <DesktopDatePicker
                  label={`${t(messages.AssignedDateTo())}`}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      size: 'small'
                    }
                  }}
                />
              </FormControl>
            </div>
          </LocalizationProvider>
          <div className="flex flex-row gap-4">
            {/* <FormControl className="flex-1 int-group">
              <SelectList dataList={selectPlacementStatuses} label={t(messages.status())} />
            </FormControl> */}
            <FormControl className="flex-1 int-group">
              <Autocomplete
                disablePortal
                id="countries-select-box"
                options={assignedRecruiters}
                renderInput={params => (
                  <TextField {...params} size="small" label={`${t(messages.assignedRecruiter())}`} />
                )}
              />
            </FormControl>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-1 gap-4 int-group btn-group">
              <Button size="lg" variant="primary" className="w-[140px] p-0">
                <span className="uppercase">{`${t(messages.filter())}`}</span>
              </Button>
              <Button size="lg" variant="outline-gray" className="w-[140px] p-0">
                <span className="uppercase">{`${t(messages.clear())}`}</span>
              </Button>
              <Button size="lg" variant="outline-gray" className="w-[140px] p-0" onClick={onClose}>
                <span className="uppercase">{`${t(messages.close())}`}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </StyledFilterForm>
  )
}
