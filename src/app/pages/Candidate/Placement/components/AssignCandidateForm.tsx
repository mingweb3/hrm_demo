// COMPs
import React from 'react'
import { FormControl, TextField } from '@mui/material'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { t } from 'i18next'
import { messages } from '../../messages'

export const AssignCandidateForm: React.FC = () => {
  return (
    <form className="py-8">
      <div>
        <p>{t(messages.CurrentCandidate())}: #673252</p>
        <h5 className="f24Bold text-primary">Kevin Markeny Adarna</h5>
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
      <div className="flex mt-4">
        <FormControl className="w-full md:w-1/2 int-group">
          <TextField size="small" label={t(messages.MeetingRoomUrl())} variant="outlined" />
        </FormControl>
      </div>
    </form>
  )
}
