import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const LoadingBox = () => {
  return (
    <Box className="flex items-center justify-center py-4">
      <CircularProgress />
    </Box>
  )
}

export default LoadingBox
