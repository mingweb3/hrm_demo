import { useEffect, useState } from 'react'
import { FormControl, IconButton, SelectChangeEvent } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'
import { t } from 'i18next'
import { useSnackbar } from 'notistack'
import { Controller } from 'react-hook-form'
import { Control, RegisterOptions } from 'react-hook-form/dist/types'
import { IOption, SelectList } from '@/app/components/Input/SelectList'
import { CrossIcon } from '@/app/components/Svg/CrossIcon'
import { staleTimeConfig } from '@/app/components/WTable/configTable'
import { getOrganizationByIdFn } from '@/apis/organization.api'
import { IWorkPlaceForm } from '@/types/IOrganization'
import { messages } from '../messages'

interface OrgWorkplacesIptProps {
  control: Control<any>
  fieldName: string
  rules?: Omit<RegisterOptions<any, string>, 'disabled' | 'setValueAs' | 'valueAsNumber' | 'valueAsDate'> | undefined
  orgId?: string
  onChange: (data: IWorkPlaceForm[]) => void
  workplaces?: IWorkPlaceForm[]
}

const StyledOrgWorkplacesIpt = styled('div')(
  ({ theme }) => `
    .workplace-item {
      border-bottom: 1px solid ${theme.palette.gray8};
      padding-bottom: 0.5rem;
      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
    }
`
)

const OrgWorkplacesIpt: React.FC<OrgWorkplacesIptProps> = props => {
  const { fieldName, control, rules, orgId, workplaces, onChange } = props
  const [options, setOptions] = useState<IOption[]>([])
  const [stdWorkPlaces, setStdWorkPlaces] = useState<IWorkPlaceForm[]>([])

  // snackBar
  const { enqueueSnackbar } = useSnackbar()

  // Init default data
  useEffect(() => {
    if (workplaces && workplaces?.length > 0) {
      setStdWorkPlaces(workplaces)
    }
  }, [workplaces])

  // query: Get Candidate Details
  const queryParams = new URLSearchParams({
    include: 'workLocations'
  })
  const { data: workLocationList } = useQuery({
    queryKey: ['organization', `${orgId}_locations`],
    queryFn: () => getOrganizationByIdFn(orgId || '', queryParams),
    onSuccess: data => {
      if (data) {
        setOptions(
          data.attributes.workLocations?.map(item => ({
            label: item.address,
            value: item.id as string
          })) || []
        )
      }
    },
    keepPreviousData: true,
    staleTime: staleTimeConfig,
    retry: 0
  })

  // Action: selected work location
  const handleSelectWorkPlace = (data: SelectChangeEvent<any>) => {
    const findItem = workLocationList?.attributes.workLocations?.filter(o => o.id === Number(data.target.value))
    if (findItem) {
      // check workplaces is exists
      if (stdWorkPlaces.findIndex(o => o.id === Number(data.target.value)) !== -1) {
        enqueueSnackbar(`${t(messages.WorkplaceExists())}`, { variant: 'error' })
        return
      }
      setStdWorkPlaces(prev => [...prev, ...findItem])
    }
  }

  // Action: remove workplace
  const onRemoveItem = (id: number | string) => {
    const tempWorkplaces = [...stdWorkPlaces]
    const idx = tempWorkplaces.findIndex(o => o.id === id)

    if (idx !== -1) {
      tempWorkplaces.splice(idx, 1)

      setStdWorkPlaces(tempWorkplaces)
    }
  }

  useEffect(() => {
    onChange(stdWorkPlaces)
  }, [stdWorkPlaces, onChange])

  return (
    <StyledOrgWorkplacesIpt>
      <Controller
        name={fieldName}
        rules={rules}
        control={control}
        render={({ field: { onChange } }) => (
          <>
            <div className="flex flex-row gap-4 pt-4 mb-4">
              <FormControl className="w-[50%] int-group">
                <SelectList
                  control={control}
                  fieldName={fieldName}
                  defaultValue=""
                  dataList={options}
                  label={`${t(messages.Workplaces())}`}
                  onChange={data => {
                    handleSelectWorkPlace(data)
                    onChange(...data.target.value)
                  }}
                />
              </FormControl>
            </div>
            {stdWorkPlaces && stdWorkPlaces?.length > 0 && (
              <div>
                <div className="section-title f12Regular uppercase letter tracking-[.2em] text-gray3 mb-2">
                  {`${t(messages.Workplaces())}`}
                </div>
                <div className="flex flex-col gap-2">
                  {stdWorkPlaces.map((item: any) => {
                    const { id, address, geoTag } = item
                    return (
                      <div className="workplace-item" key={`wp-${id}`}>
                        <div className="f16Bold flex flex-row justify-between gap-2">
                          {address}
                          <IconButton
                            onClick={() => {
                              onRemoveItem(id)
                              onChange(id)
                            }}
                            sx={{ padding: 0 }}
                            aria-hidden="true"
                          >
                            <CrossIcon />
                          </IconButton>
                        </div>
                        {geoTag && (
                          <a
                            href={geoTag}
                            target="_blank"
                            className="alink f12Regular text-blue underline"
                            rel="noreferrer"
                          >
                            View on map
                          </a>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      />
    </StyledOrgWorkplacesIpt>
  )
}

export default OrgWorkplacesIpt
