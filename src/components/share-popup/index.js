import { useCallback } from 'react';
import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
// react-share
import {
  FacebookShareButton,
  FacebookIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  TwitterShareButton,
  XIcon,
  ViberIcon,
  ViberShareButton,
} from 'react-share';
// locales
import { useTranslate } from 'src/locales';
// components
import { useSnackbar } from 'src/components/snackbar';
import { useCopyToClipboard } from 'src/hooks/use-copy-to-clipboard';
import Iconify from 'src/components/iconify';
//
import CustomPopover from '../custom-popover';
import { ORIGIN } from 'src/config-global';

export default function SharePopup({ open, onClose, url }) {
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();

  const { copy } = useCopyToClipboard();

  const onCopy = useCallback(
    (text) => {
      if (text) {
        enqueueSnackbar('Copied!');
        copy(text);
      }
    },
    [copy, enqueueSnackbar]
  );

  return (
    <CustomPopover
      open={open}
      onClose={onClose}
      arrow="bottom-center"
      sx={{
        p: 2,
        width: '100%',
        maxWidth: 300
      }}
    >
      <Typography variant='body2' color='text.secondary' sx={{ pb: 1, textAlign: 'center' }}>{t('share-by')}:</Typography>
      <Stack direction='row' justifyContent='center' spacing={2}>
        <FacebookShareButton onClick={(event) => event.stopPropagation()} url={url}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>

        <FacebookMessengerShareButton onClick={(event) => event.stopPropagation()} url={url}>
          <FacebookMessengerIcon size={40} round />
        </FacebookMessengerShareButton>

        <TwitterShareButton onClick={(event) => event.stopPropagation()} url={url}>
          <XIcon size={40} round />
        </TwitterShareButton>

        <ViberShareButton onClick={(event) => event.stopPropagation()} url={url}>
          <ViberIcon size={40} round />
        </ViberShareButton>
      </Stack>

      <Typography variant='body2' color='text.secondary' sx={{ pb: 1, textAlign: 'center' }}>- {t('or')} -</Typography>

      <TextField
        fullWidth
        readOnly
        value={url}
        size='small'
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Copy">
                <IconButton onClick={() => onCopy(url)}>
                  <Iconify icon="eva:copy-fill" width={24} />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />

    </CustomPopover>
  );
}

SharePopup.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  url: PropTypes.string
};
