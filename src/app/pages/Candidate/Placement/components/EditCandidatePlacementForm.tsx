// COMPs
import React, { useState } from 'react'
import { Autocomplete, FormControl, FormControlLabel, Switch, TextField } from '@mui/material'
import { styled } from '@mui/system'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { t } from 'i18next'
import WCollapseBox from '@/app/components/WCard/WCollapseBox'
import { messages } from '../../messages'

const StyledForm = styled('form')(
  ({ theme }) => `
    padding: 32px 0;
    .col-12 {
      ${theme.breakpoints.up('md')} {
        width: calc(50% - 10px);
      }
      width: 100%
    }
  `
)

export const EditCandidatePlacementForm: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false)
  const handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked)
  }

  return (
    <StyledForm>
      <div className="bg-bg py-[10px] px-4 flex flex-col md:flex-row">
        <div className="w-[354px]">
          <p className="f16Bold">Senior frontend developer</p>
          <p className="f16Regular">Full-time / Remote</p>
        </div>
        <div>
          <p className="f16Regular">Rakuten Japan</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row pt-4 gap-4">
        <div className="flex flex-col flex-1 gap-4">
          {/* <FormControl className="int-group">
            <SelectList dataList={selectPlacementStatuses} label={t(messages.status())} />
          </FormControl>
          <FormControl className="int-group">
            <SelectList dataList={selectPlacementStatuses} label={t(messages.CandidateGrade())} />
          </FormControl> */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormControl className="flex-1 int-group">
              <DesktopDatePicker
                label={t(messages.InterviewDate())}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    size: 'small'
                  }
                }}
              />
            </FormControl>
          </LocalizationProvider>
        </div>
        <div className="flex flex-col flex-1 gap-4 justify-center">
          <FormControl className="int-group">
            <TextField size="small" label={t(messages.Name())} variant="outlined" />
          </FormControl>
        </div>
      </div>
      <div>
        <FormControl className="int-group mt-4 w-full">
          <textarea
            name="text"
            cols={30}
            rows={6}
            placeholder={`${t(messages.PanelOfInterviewers())}`}
            className="p-2 border border-gray3 border-solid rounded-[4px]"
          />
        </FormControl>
      </div>
      <div className="col-12 mt-4">
        <FormControl className="w-full int-group">
          <TextField size="small" label={t(messages.MeetingRoomUrl())} variant="outlined" />
        </FormControl>
      </div>

      <WCollapseBox title={t(messages.Offer())} isOpenCollapse className="mt-4">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="col-12 flex flex-col gap-4 mt-4">
            {/* <FormControl className="int-group">
              <SelectList dataList={selectPlacementStatuses} label={t(messages.ProbationaryPeriod())} />
            </FormControl> */}
            <FormControl className="flex-1 int-group">
              <DesktopDatePicker
                label={t(messages.CommencementDate())}
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
                label={t(messages.ConfirmationDate())}
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
                label={t(messages.LastDay())}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    size: 'small'
                  }
                }}
              />
            </FormControl>
          </div>
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <FormControl className="flex-1 int-group">
              <DesktopDatePicker
                label={t(messages.OfferMade())}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    size: 'small'
                  }
                }}
              />
            </FormControl>
            <FormControlLabel
              className="flex-1"
              control={<Switch checked={isChecked} onChange={handleCheckedChange} />}
              label={`${t(messages.OfferAccepted())}`}
            />
          </div>
          <div className="col-12 mt-4">
            <FormControl className="w-full int-group">
              <DesktopDatePicker
                label={t(messages.LOASigned())}
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
        <div className="flex gap-4 mt-4">
          <FormControl className="flex-1 int-group">
            <TextField size="small" label={t(messages.BasicOffered())} variant="outlined" />
          </FormControl>
          <FormControl className="flex-1 int-group">
            <Autocomplete
              disablePortal
              options={['option 1', 'option 2', 'option 3']}
              renderInput={params => <TextField {...params} size="small" label={`${t(messages.Currency())}`} />}
            />
          </FormControl>
        </div>
        <div className="flex gap-4 mt-4">
          <FormControl className="flex-1 int-group">
            <TextField size="small" label={t(messages.TransportAllowance())} variant="outlined" />
          </FormControl>
          <FormControl className="flex-1 int-group">
            <Autocomplete
              disablePortal
              options={['option 1', 'option 2', 'option 3']}
              renderInput={params => <TextField {...params} size="small" label={`${t(messages.OtherAllowance())}`} />}
            />
          </FormControl>
        </div>
      </WCollapseBox>
      {/* END OFFER  */}

      <WCollapseBox title={t(messages.Interview())} isOpenCollapse className="mt-4">
        <div>
          <FormControl className="w-full int-group mt-4">
            <TextField size="small" label={t(messages.VideoInterviewLink())} variant="outlined" />
          </FormControl>
        </div>
        <div>
          <FormControl className="int-group mt-4 w-full">
            <textarea
              name="text"
              cols={30}
              rows={6}
              placeholder={`${t(messages.ReasonForRejection())}`}
              className="p-2 border border-gray3 border-solid rounded-[4px]"
            />
          </FormControl>
        </div>
        <div>
          <FormControl className="int-group mt-4 w-full">
            <textarea
              name="text"
              cols={30}
              rows={6}
              placeholder={`${t(messages.Notes())}`}
              className="p-2 border border-gray3 border-solid rounded-[4px]"
            />
          </FormControl>
        </div>
        <div>
          <FormControl className="int-group mt-4 w-full">
            <textarea
              name="text"
              cols={30}
              rows={6}
              placeholder={`${t(messages.Remark())}`}
              className="p-2 border border-gray3 border-solid rounded-[4px]"
            />
          </FormControl>
        </div>
        <div className="col-12 mt-4">
          <FormControl className="w-full int-group">
            <TextField size="small" label={t(messages.YearOfRelevantExperience())} variant="outlined" />
          </FormControl>
        </div>
      </WCollapseBox>
      {/* END INTERVIEW  */}
    </StyledForm>
  )
}
