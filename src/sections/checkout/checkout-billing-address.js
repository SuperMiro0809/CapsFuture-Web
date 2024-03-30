import { useEffect, useState, useTransition } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import CircularProgress from '@mui/material/CircularProgress';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// locales
import { useTranslate } from 'src/locales';
// auth
import { useAuthContext } from 'src/auth/hooks';
// api
import { getAddresses } from 'src/api/user';
//
import { _addressBooks } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
//
import { useCheckoutContext } from './context';
import CheckoutSummary from './checkout-summary';
import { AddressItem, AddressNewModal, AddressNewForm } from '../address';
import CheckoutBillingAddressGuest from './checkout-billing-address-guest';

// ----------------------------------------------------------------------

export default function CheckoutBillingAddress() {
  const { t } = useTranslate();

  const { user } = useAuthContext();

  const checkout = useCheckoutContext();

  const addressForm = useBoolean();

  const [addresses, setAddresses] = useState([]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (user?.profile) {
      startTransition(async () => {
        try {
          const { data, error } = await getAddresses(user.profile.id);

          if (error) throw error;

          setAddresses(data);
        } catch (error) {
          console.error(error);
        }
      })
    }
  }, [user])

  return (
    <>
      {!user ? (
        <CheckoutBillingAddressGuest />
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid xs={12} md={8}>

              {isPending && (
                <Box sx={{ position: 'relative', height: 1 }}>
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

              {(!isPending && addresses.length === 0) ? (
                <EmptyContent
                  title={`${t('no-addresses', { ns: 'profile' })}!`}
                  description={`${t('no-addresses-message', { ns: 'profile' })}.`}
                  imgUrl="/assets/icons/empty/ic_folder_empty.svg"
                  sx={{ pt: 5, pb: 10 }}
                />
              ) : (
                <>
                  {addresses.map((address) => (
                    <AddressItem
                      key={address.id}
                      address={address}
                      action={
                        <Stack flexDirection="row" flexWrap="wrap" flexShrink={0}>
                          {!address.primary && (
                            <Button size="small" color="error" sx={{ mr: 1 }}>
                              {t('delete.word', { ns: 'common' })}
                            </Button>
                          )}
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => checkout.onCreateBilling(address)}
                          >
                            Deliver to this Address
                          </Button>
                        </Stack>
                      }
                      sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 2,
                        boxShadow: (theme) => theme.customShadows.card,
                      }}
                    />
                  ))}
                </>
              )}

              <Stack direction="row" justifyContent="space-between">
                <Button
                  size="small"
                  color="inherit"
                  onClick={checkout.onBackStep}
                  startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                >
                  {t('back', { ns: 'common' })}
                </Button>

                <Button
                  size="small"
                  color="primary"
                  onClick={addressForm.onTrue}
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  {t('new-address', { ns: 'profile' })}
                </Button>
              </Stack>
            </Grid>

            <Grid xs={12} md={4}>
              <CheckoutSummary
                total={checkout.total}
                subTotal={checkout.subTotal}
                discount={checkout.discount}
              />
            </Grid>
          </Grid>

          <AddressNewModal
            open={addressForm.value}
            onClose={addressForm.onFalse}
            onCreate={checkout.onCreateBilling}
          />
        </>
      )}
    </>
  );
}
