'use client';

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// @mui
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams, usePathname } from 'src/routes/hooks';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// api
import { deleteLocation } from 'src/api/location';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSnackbar } from 'src/components/snackbar';
import { LeafletMap, mapIcons, LocationMarker } from 'src/components/leaflet-map';
import SvgColor from 'src/components/svg-color';
import { ConfirmDialog } from 'src/components/custom-dialog';
// i18
import { useTranslation } from 'react-i18next';
// utils
import { makeQuery } from 'src/utils/url-query';
//
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

export default function StationLocationsListView({ locations }) {
    const { t } = useTranslation();

    const router = useRouter();

    const pathname = usePathname();

    const searchParams = useSearchParams();

    const confirm = useBoolean();

    const settings = useSettingsContext();

    const { enqueueSnackbar } = useSnackbar();

    const [selectedId, setSelectedId] = useState(0);

    useEffect(() => {

    }, [pathname, router, searchParams])

    const handleDelete = async (id) => {
        const { status, error } = await deleteLocation(id);

        if (status === 200) {
            enqueueSnackbar(t('delete-success'));

            router.refresh();
        }

        if (error) {
            enqueueSnackbar(error, { variant: 'error' });
        }
    }

    const position = [42.7249925, 25.4833039];
    const zoom = 8;

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading={t('locations', { ns: 'headers' })}
                links={[
                    { name: t('dashboard', { ns: 'headers' }), href: paths.dashboard.root },
                    { name: t('locations', { ns: 'headers' }) }
                ]}
                action={
                    <Button
                        component={RouterLink}
                        href={paths.dashboard.station.locations.new}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        color='secondary'
                    >
                        {t('new', { ns: 'location' })}
                    </Button>
                }
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <Card>
                <LeafletMap center={position} zoom={zoom} style={{ height: '800px', width: '100%' }}>
                    {locations.map((location, index) => (
                        <LocationMarker
                            id={location.id}
                            latitude={location.latitude}
                            longitude={location.longitude}
                            address={location.address}
                            type={location.location_type_name}
                            type_display_name={location.location_type_display_name}
                            name={location.name}
                            collects_caps={!!location.collects_caps}
                            collects_bottles={!!location.collects_bottles}
                            collects_cans={!!location.collects_cans}
                            working_time={location.working_time}
                            user={location.information.user}
                            first_name={location.first_name}
                            last_name={location.last_name}
                            email={location.email}
                            phone={location.phone}
                            deleteHandler={handleDelete}
                            key={index}
                        />
                    ))}
                </LeafletMap>
            </Card>

            <ConfirmDialog
                open={confirm.value}
                onClose={() => {
                    confirm.onFalse();
                    setSelectedId(0);
                }}
                title={t('delete.word', { ns: 'common' })}
                content={t('delete.single-modal', { ns: 'common' })}
                action={
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDelete(selectedId);

                            confirm.onFalse();
                            setSelectedId(0);
                        }}
                    >
                        {t('delete.action', { ns: 'common' })}
                    </Button>
                }
            />
        </Container>
    );
}

StationLocationsListView.propTypes = {
    locations: PropTypes.array
}
