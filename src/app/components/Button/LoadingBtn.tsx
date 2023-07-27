import { styled } from '@mui/material/styles'

const StyledLoadingBtn = styled('span')(
  ({ theme }) => `
    width: 4px;
    height: 4px;
    border-radius: 50%;
    display: block;
    margin: 10px auto;
    position: relative;
    left: -100px;
    box-sizing: border-box;
    animation: shadowRolling 2s linear infinite; 
    @keyframes shadowRolling {
      0% {
        box-shadow: 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
      }
      12% {
        box-shadow: 100px 0 ${theme.palette.common.white}, 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
      }
      25% {
        box-shadow: 110px 0 ${theme.palette.common.white}, 100px 0 ${theme.palette.common.white}, 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
      }
      36% {
        box-shadow: 120px 0 ${theme.palette.common.white}, 110px 0 ${theme.palette.common.white}, 100px 0 ${theme.palette.common.white}, 0px 0 rgba(255, 255, 255, 0);
      }
      50% {
        box-shadow: 130px 0 ${theme.palette.common.white}, 120px 0 ${theme.palette.common.white}, 110px 0 ${theme.palette.common.white}, 100px 0 ${theme.palette.common.white};
      }
      62% {
        box-shadow: 200px 0 rgba(255, 255, 255, 0), 130px 0 ${theme.palette.common.white}, 120px 0 ${theme.palette.common.white}, 110px 0 ${theme.palette.common.white};
      }
      75% {
        box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 130px 0 ${theme.palette.common.white}, 120px 0 ${theme.palette.common.white};
      }
      87% {
        box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 130px 0 ${theme.palette.common.white};
      }
      100% {
        box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0);
      }
    }
  `
)

const LoadingBtn = () => {
  return <StyledLoadingBtn />
}

export default LoadingBtn
