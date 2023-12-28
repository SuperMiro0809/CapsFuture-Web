import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useEffect, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box'
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// routes
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
    RHFAutocomplete,
    RHFDatePicker,
    RHFLanguageField,
    RHFUpload
} from 'src/components/hook-form';
// i18
import { useTranslation } from 'react-i18next';
// date-fns
import { format, parseISO } from 'date-fns';

// ----------------------------------------------------------------------

const CITIES = ['Благоевград', 'Бургас', 'Варна', 'Велко Търново', 'Видин', 'Враца', 'Габрово', 'Добрич', 'Кърджали', 'Кюстендил', 'Ловеч', 'Монтана', 'Пазарджик', 'Перник', 'Плевен', 'Пловдив', 'Разград', 'Русе', 'Силистра', 'Сливен', 'Смолян', 'София', 'Стара Загора', 'Търговище', 'Хасково', 'Шумен', 'Ямбол'];

// ----------------------------------------------------------------------

export default function CampaignNewEditForm({ currentCampaign }) {
    const router = useRouter();

    const mdUp = useResponsive('up', 'md');

    const { enqueueSnackbar } = useSnackbar();

    const { t } = useTranslation();

    const NewCampaignSchema = Yup.object().shape({
        date: Yup.date().required(t('validation.date.required')),
        cities: Yup.array().min(1, t('validation.cities.required')),
        information: Yup.object().shape({
            bg: Yup.object().shape({
                title: Yup.string().required(t('validation.title.required')),
                short_description: Yup.string().required(t('validation.short_description.required')),
                description: Yup.string().required(t('validation.description.required'))
            }),
            en: Yup.object().shape({
                title: Yup.string().required(t('validation.title.required')),
                short_description: Yup.string().required(t('validation.short_description.required')),
                description: Yup.string().required(t('validation.description.required'))
            })
        })
    });

    const defaultValues = useMemo(
        () => {
            return {
                date: currentCampaign?.date ? parseISO(currentCampaign.date) : null,
                cities: currentCampaign?.cities || [],
                information: {
                    bg: {
                        title: '',
                        short_description: '',
                        description: ''
                    },
                    en: {
                        title: '',
                        short_description: '',
                        description: ''
                    }
                }
            }
        },
        [currentCampaign]
    );

    const methods = useForm({
        resolver: yupResolver(NewCampaignSchema),
        defaultValues,
    });

    const {
        reset,
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    useEffect(() => {
        if (currentCampaign) {
            reset(defaultValues);
        }
    }, [currentCampaign, defaultValues, reset]);

    const onSubmit = handleSubmit(async (data) => {
        console.log(data);
    });

    const handleDropSingleFile = useCallback(
        (acceptedFiles) => {
            const file = acceptedFiles[0];

            const newFile = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

            if (newFile) {
                setValue('singleUpload', newFile, { shouldValidate: true });
            }
        },
        [setValue]
    );

    const renderDetails = (
        <Grid xs={12} md={12}>
            <Card>
                <Stack spacing={3} sx={{ p: 3 }}>
                    <Stack spacing={1.5}>
                        <Typography variant="subtitle2">{t('title-image')}</Typography>
                        <RHFUpload
                            name="singleUpload"
                            maxSize={3145728}
                            onDrop={handleDropSingleFile}
                            onDelete={() => setValue('singleUpload', null, { shouldValidate: true })}
                        />
                    </Stack>

                    <Box
                        columnGap={2}
                        rowGap={3}
                        display="grid"
                        gridTemplateColumns={{
                            xs: 'repeat(1, 1fr)',
                            md: 'repeat(2, 1fr)',
                        }}
                    >
                        <Stack spacing={1.5}>
                            <Typography variant="subtitle2">{t('date')}</Typography>
                            <RHFDatePicker name='date' />
                        </Stack>

                        <Stack spacing={1.5}>
                            <Typography variant="subtitle2">{t('cities')}</Typography>
                            <RHFAutocomplete
                                name='cities'
                                options={CITIES}
                                isOptionEqualToValue={(option, value) => option === value}
                                multiple
                            />
                        </Stack>
                    </Box>

                    <RHFLanguageField
                        name='information'
                        langs={[
                            { label: 'Български', slug: 'bg' },
                            { label: 'English', slug: 'en' },
                        ]}
                        fields={[
                            { type: 'text', name: 'title', label: t('title') },
                            { type: 'text', name: 'short_description', label: t('short_description'), multiline: true, rows: 4 },
                            { type: 'editor', name: 'description', label: t('description') }
                        ]}
                    />
                </Stack>
            </Card>
        </Grid>
    );

    const renderActions = (
        <>
            {mdUp && <Grid md={4} />}
            <Grid xs={12} md={8} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
                <LoadingButton
                    type="submit"
                    variant="contained"
                    size="large"
                    loading={isSubmitting}
                    sx={{ ml: 2 }}
                >
                    {!currentCampaign ? t('create') : t('save')}
                </LoadingButton>
            </Grid>
        </>
    );

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Grid container spacing={3}>
                {renderDetails}

                {renderActions}
            </Grid>
        </FormProvider>
    );
}

CampaignNewEditForm.propTypes = {
    currentCampaign: PropTypes.object,
};
