import { styled } from '@mui/material/styles'

export const StyledTable = styled('div')(
  ({ theme }) => `
  width: 100%;
  overflow-x: auto;
    table {
        width: 100%;
        min-width: 1024px;
        ${theme.breakpoints.up('lg')} {
            min-width: 640px;
        }
    }
    table th {
        padding: 16px 10px;
        background-color: ${theme.palette.blue3};
        font-size: 16px;
        text-align: left;
    }
    table td {
        padding: 10px 10px;
        vertical-align: top;
    }
    table tr {
        border-bottom: 1px solid ${theme.palette.gray5};
    }
    .pagination {
        button {
            width: 33px;
            &:disabled {
                opacity: 0.3;
            }
        }
    }
    .nm-icon {
        display: inline-block;
        vertical-align: -2px;
        svg {
            width: 18px;
            height: auto;
        }
    }
`
)
