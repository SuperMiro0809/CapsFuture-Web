// @mui
import Fab from '@mui/material/Fab';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function AboutContentEditFab({ handleClick }) {
  return (
    <Fab
      onClick={handleClick}
      color='secondary'
      size='small'
      sx={{
        position: 'absolute',
        top: -18,
        right: -18
      }}
    >
      <Iconify icon="solar:pen-bold" />
    </Fab>
  );
}