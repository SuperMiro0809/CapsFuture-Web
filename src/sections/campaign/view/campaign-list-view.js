'use client';

import PropTypes from 'prop-types';
import { useEffect, useTransition } from 'react';
// @mui
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams, usePathname } from 'src/routes/hooks';
// api
import { deleteCampaign, deleteCampaigns } from 'src/api/campaign';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useTable } from 'src/components/table';
import TableBuilder from 'src/components/table-builder';
import { useSnackbar } from 'src/components/snackbar';
// i18
import { useTranslation } from 'react-i18next';
// date-fns
import { format, parseISO, isValid } from 'date-fns';
// utils
import { makeQuery } from 'src/utils/url-query';
// data
import CITIES from 'src/data/cities';

export default function CampaignListView({ campaigns = [], campaignsCount = 0 }) {
    const { t } = useTranslation();

    const router = useRouter();

    const pathname = usePathname();

    const searchParams = useSearchParams();

    const nameFilterValue = searchParams.get('name');
    const cityFilterValue = searchParams.get('city') || null;
    const dateFilterValue = !isNaN(parseISO(searchParams.get('date'))) ? parseISO(searchParams.get('date')) : null;

    const tableFilters = [
       { type: 'search', name: 'title', placeholder: 'Търси по Заглавие', value: nameFilterValue },
       { type: 'select', name: 'city', placeholder: 'Град', options: CITIES, value: cityFilterValue },
       { type: 'date', name: 'date', placeholder: 'Дата', value: dateFilterValue }
    ];

    let defaultCurrentPage = 0;
    if (Number(searchParams.get('page'))) {
        defaultCurrentPage = Number(searchParams.get('page')) === 0 ? Number(searchParams.get('page')) : Number(searchParams.get('page')) - 1;
    }

    const defaultRowsPerPage = Number(searchParams.get('limit')) || 5;
    const defaultOrderBy = searchParams.get('orderBy') || 'title';
    const defaultOrder = searchParams.get('direction') || 'asc';

    const table = useTable({
        filters: tableFilters,
        defaultCurrentPage,
        defaultRowsPerPage,
        defaultOrderBy,
        defaultOrder
    });

    const settings = useSettingsContext();

    const { enqueueSnackbar } = useSnackbar();

    const [isPending, startTransition] = useTransition();

    const campaignsList = campaigns.map((campaign) => ({
        id: campaign.id,
        title: campaign.title,
        title_image_path: campaign.title_image_path,
        short_description: campaign.short_description,
        cities: campaign.cities,
        date: format(parseISO(campaign.date), 'dd/MM/yyyy')
    }))

    useEffect(() => {
        const pagination = {
            page: table.page + 1,
            limit: table.rowsPerPage
        }

        const order = {
            orderBy: table.orderBy,
            direction: table.order
        }

        const query = makeQuery(searchParams, pagination, order, table.filters);

        router.push(`${pathname}${query}`);
    }, [pathname, router, searchParams, table.page, table.rowsPerPage, table.orderBy, table.order, table.filters])

    const TABLE_HEAD = [
        { id: 'title', type: 'text-with-image', label: t('title'), imageSelector: 'title_image_path' },
        { id: 'short_description', label: t('short_description'), width: 180 },
        { id: 'cities', type: 'array', selector: 'city', label: t('cities'), width: 400 },
        { id: 'date', label: t('date'), width: 100 }
    ];

    const handleDelete = async (ids) => {
        startTransition(async () => {
            try {
                if (ids.length === 1) {
                    const id = ids[0];

                    await deleteCampaign(id);
                } else {
                    await deleteCampaigns(ids);
                }

                enqueueSnackbar(t('delete-success'));
                router.refresh();
            } catch (error) {
                enqueueSnackbar(error.message, { variant: 'error' });
            }
        });
    }

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading={t('campaigns')}
                links={[
                    { name: t('dashboard'), href: paths.dashboard.root },
                    { name: t('campaigns') }
                ]}
                action={
                    <Button
                        component={RouterLink}
                        href={paths.dashboard.campaign.new}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        color='secondary'
                    >
                        {t('new-campaign')}
                    </Button>
                }
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            />

            <Card>
                <TableBuilder
                    table={table}
                    tableHead={TABLE_HEAD}
                    tableData={campaignsList}
                    tableTotal={campaignsCount}
                    tableFilters={tableFilters}
                    deleteHandler={handleDelete}
                />
            </Card>
        </Container>
    );
}

CampaignListView.propTypes = {
    campaigns: PropTypes.array,
    campaignsCount: PropTypes.number
}