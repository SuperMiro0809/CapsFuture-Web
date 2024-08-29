// @mui
import Box from '@mui/material/Box';
import FormHelperText from '@mui/material/FormHelperText';
import { styled } from '@mui/material/styles';

export const DraggableContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
    margin: '25px 0 0px',
    border: '1px dotted lightgrey',
    padding: '35px 20px',
    borderRadius: '6px',
    backgroundColor: theme.palette.background.neutral
}));

export const HelperText = styled(FormHelperText)(({
    marginLeft: '14px'
}))