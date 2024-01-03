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
// // api
// import { deleteCampaign } from 'src/api/campaign';
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
import { format, parseISO } from 'date-fns';

export default function CampaignListView({ campaigns = [], campaignsCount = 0 }) {
    const { t } = useTranslation();

    const router = useRouter();

    const pathname = usePathname();

    const searchParams = useSearchParams();

    const nameFilterValue = searchParams.get('name');
    const descriptionFilterValue = searchParams.get('description');

    const tableFilters = [
        { type: 'search', name: 'name', placeholder: 'Търси по Име', value: nameFilterValue },
        { type: 'search', name: 'description', placeholder: 'Търси по Описание', value: descriptionFilterValue }
    ];

    let defaultCurrentPage = 0;
    if (Number(searchParams.get('page'))) {
        defaultCurrentPage = Number(searchParams.get('page')) === 0 ? Number(searchParams.get('page')) : Number(searchParams.get('page')) - 1;
    }

    const defaultRowsPerPage = Number(searchParams.get('limit')) || 5;
    const defaultOrderBy = searchParams.get('orderBy') || 'name';
    const defaultOrder = searchParams.get('direction') || 'asc';

    const table = useTable({
        options: { checkbox: true },
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
        description: campaign.description,
        cities: campaign.cities,
        date: format(parseISO(campaign.date), 'dd/MM/yyyy')
    }))

    useEffect(() => {
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        current.set('page', table.page + 1);

        current.set('limit', table.rowsPerPage);

        current.set('orderBy', table.orderBy);

        current.set('direction', table.order);

        if(table.filters.length) {
            table.filters.forEach(filter => {
                current.set(filter.id, filter.value);
            });
        }

        const search = current.toString();

        const query = search ? `?${search}` : '';

        router.push(`${pathname}${query}`);
    }, [pathname, router, searchParams, table.page, table.rowsPerPage, table.orderBy, table.order, table.filters])

    const TABLE_HEAD = [
        { id: 'title', label: t('title') },
        { id: 'description', label: t('description'), width: 180 },
        { id: 'cities', type: 'array', selector: 'city', label: t('cities'), width: 400 },
        { id: 'date', label: t('date'), width: 100 }
    ];

    const handleDelete = async (ids) => {
        startTransition(async () => {
            const res = await deleteCampaign(ids);

            if (res.status === 200) {
                enqueueSnackbar(t('delete-success'));

                router.refresh();
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