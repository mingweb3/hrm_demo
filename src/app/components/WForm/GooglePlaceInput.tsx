import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import { usePlacesWidget } from 'react-google-autocomplete'

const StyledGooglePlaceInput = styled('div')(
  ({ theme }) => `
		color: ${theme.palette.red};
	
	`
)

// interface ErrorFormProps {
//   error: IErrorForm
// }

const GooglePlaceInput = () => {
  const { ref } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE,
    onPlaceSelected: place => {
      // eslint-disable-next-line no-console
      console.log(place.formatted_address)
    }
  })
  return (
    <StyledGooglePlaceInput>
      <TextField
        fullWidth
        style={{ width: '250px', marginRight: '20px' }}
        color="secondary"
        variant="outlined"
        inputRef={ref}
        id="country"
        name="country"
        placeholder="Country"
      />
    </StyledGooglePlaceInput>
  )
}

export default GooglePlaceInput
