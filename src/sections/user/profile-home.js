'use client';

import { useState, useCallback, useTransition } from 'react';
import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// locales
import { useTranslate } from 'src/locales';
// api
import { deleteAddress, editAddress } from 'src/api/user';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSnackbar } from 'src/components/snackbar';
//
import { AddressItem, AddressNewForm } from '../address';

// ----------------------------------------------------------------------

export default function ProfileHome({ info, addresses, loading, loadAddresses }) {
  const { t } = useTranslate();

  const [addressId, setAddressId] = useState('');

  const [isPrimary, setIsPrimary] = useState(false);

  const popover = usePopover();

  const addressForm = useBoolean();

  const confirm = useBoolean();

  const [isPending, startTransition] = useTransition();

  const { enqueueSnackbar } = useSnackbar();

  const handleSelectedId = useCallback(
    (event, id, primary) => {
      popover.onOpen(event);
      setAddressId(id);
      setIsPrimary(primary);
    },
    [popover]
  );

  const handleClose = useCallback(() => {
    popover.onClose();
    setAddressId('');
  }, [popover]);

  const handleDeleteAddress = useCallback(() => {
    startTransition(async () => {
      try {
        const { error } = await deleteAddress(info?.profile.id, addressId);

        if (error) throw error;

        enqueueSnackbar(t('delete-success'));
        loadAddresses();
      } catch (error) {
        console.error(error);
      }
    });
  }, []);

  const handleSetAsPrimary = useCallback(() => {
    startTransition(async () => {
      try {
        const { error } = await editAddress(info?.profile.id, addressId, { primary: 1 });

        if (error) throw error;

        enqueueSnackbar(t('edit-success', { ns: 'messages' }));
        loadAddresses();
      } catch (error) {
        console.error(error);
      }
    });
  }, [addressId]);


  const currentAddress = addresses.find(address => address.id === addressId);


  const renderAbout = (
    <Card>
      <CardHeader title={t('about')} />

      <Stack spacing={2} sx={{ p: 3 }}>
        {/* <Box sx={{ typography: 'body2' }}>{info.quote}</Box> */}

        {/* <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:location-fill" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {`Live at `}
       
          </Box>
        </Stack> */}

        <Stack direction="row" sx={{ typography: 'body1' }}>
          <Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
          {info?.email}
        </Stack>
      </Stack>
    </Card>
  );

  const renderAddresses = (
    <>
      <Card>
        <CardHeader
          title={t('addresses')}
          action={
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={addressForm.onTrue}
            >
              {t('create', { ns: 'common' })}
            </Button>
          }
        />

        {(loading && addresses.length === 0) && (
          <Box sx={{ position: 'relative', height: 150 }}>
            <Box
              sx={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                left: '50%',
                top: '50%',
                zIndex: 1,
                textAlign: 'center'
              }}
            >
              <CircularProgress color='primary' />
            </Box>
          </Box>
        )}

        {(!loading && addresses.length) === 0 && (
          <Box sx={{ position: 'relative', height: 150 }}>
            <Box
              sx={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                left: '50%',
                top: '50%',
                zIndex: 1,
                textAlign: 'center'
              }}
            >
              <Typography variant='subtitle1'>{t('profile-no-addresses')}.</Typography>
            </Box>
          </Box>
        )}

        <Stack spacing={2.5} sx={{ p: 3 }}>
          {addresses.map((address) => (
            <AddressItem
              variant="outlined"
              key={address.id}
              address={address}
              action={
                <IconButton
                  onClick={(event) => {
                    handleSelectedId(event, address.id, !!address.primary);
                  }}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              }
              sx={{
                p: 2.5,
                borderRadius: 1
              }}
            />
          ))}
        </Stack>
      </Card>

      <CustomPopover open={popover.open} onClose={handleClose}>
        {!isPrimary && (
          <MenuItem
            onClick={() => {
              handleSetAsPrimary();
              handleClose();
            }}
          >
            <Iconify icon="eva:star-fill" />
            {t('set-as-primary')}
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            // handleClose();
            console.info('EDIT', addressId);
            addressForm.onTrue();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t('edit', { ns: 'common' })}
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('delete.word', { ns: 'common' })}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={() => {
          confirm.onFalse();
        }}
        title={t('delete.word', { ns: 'common' })}
        content={t('delete.single-modal', { ns: 'common' })}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteAddress();

              confirm.onFalse();
              handleClose();
            }}
          >
            {t('delete.action', { ns: 'common' })}
          </Button>
        }
      />

      <AddressNewForm
        open={addressForm.value}
        onClose={addressForm.onFalse}
        loadAddresses={loadAddresses}
        currentAddress={currentAddress}
      />
    </>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12}>
        <Stack spacing={3}>
          {renderAbout}

          {renderAddresses}
        </Stack>
      </Grid>
    </Grid>
  );
}

ProfileHome.propTypes = {
  info: PropTypes.object,
  addresses: PropTypes.array,
  loading: PropTypes.bool,
  loadAddresses: PropTypes.func
};
