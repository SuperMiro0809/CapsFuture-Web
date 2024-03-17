'use client';

import { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
// @mui
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fNumber } from 'src/utils/format-number';
// locales
import { useTranslate } from 'src/locales';
//
import { _socials } from 'src/_mock';
import { _addressBooks } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
//
import ProfilePostItem from './profile-post-item';
import { AddressItem, AddressNewForm } from '../address';

// ----------------------------------------------------------------------

export default function ProfileHome({ info, posts }) {
  const { t } = useTranslate();

  const [addressId, setAddressId] = useState('');

  const popover = usePopover();

  const addressForm = useBoolean();

  const handleSelectedId = useCallback(
    (event, id) => {
      popover.onOpen(event);
      setAddressId(id);
    },
    [popover]
  );

  const handleClose = useCallback(() => {
    popover.onClose();
    setAddressId('');
  }, [popover]);


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
              {t('create')}
            </Button>
          }
        />

        <Stack spacing={2.5} sx={{ p: 3 }}>
          {_addressBooks.slice(0, 4).map((address) => (
            <AddressItem
              variant="outlined"
              key={address.id}
              address={address}
              action={
                <IconButton
                  onClick={(event) => {
                    handleSelectedId(event, `${address.id}`);
                  }}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <Iconify icon="eva:more-vertical-fill" />
                </IconButton>
              }
              // action={
              //   <Stack flexDirection="row" flexWrap="wrap" flexShrink={0}>
              //     {!address.primary && (
              //       <Button size="small" color="error" sx={{ mr: 1 }}>
              //         {t('delete.word')}
              //       </Button>
              //     )}
              //   </Stack>
              // }
              sx={{
                p: 2.5,
                borderRadius: 1
              }}
            />
          ))}
        </Stack>
      </Card>

      <CustomPopover open={popover.open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            handleClose();
            console.info('SET AS PRIMARY', addressId);
          }}
        >
          <Iconify icon="eva:star-fill" />
          Set as primary
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            console.info('EDIT', addressId);
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t('edit')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            console.info('DELETE', addressId);
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('delete.word')}
        </MenuItem>
      </CustomPopover>

      <AddressNewForm
        open={addressForm.value}
        onClose={addressForm.onFalse}
        // onCreate={handleAddNewAddress}
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
  posts: PropTypes.array,
};
