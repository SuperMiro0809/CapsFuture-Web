import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// routes
import { RouterLink } from 'src/routes/components';
// utils
import { fNumber, fPercent } from 'src/utils/format-number';
// components
import Chart from 'src/components/chart';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

export default function AppWidgetSummary({ title, percent, buttonHref, total, iconName, chart, sx, ...other }) {
  const theme = useTheme();

  // const {
  //   colors = [theme.palette.primary.light, theme.palette.primary.main],
  //   series,
  //   options,
  // } = chart;

  // const chartOptions = {
  //   colors: colors.map((colr) => colr[1]),
  //   fill: {
  //     type: 'gradient',
  //     gradient: {
  //       colorStops: [
  //         { offset: 0, color: colors[0], opacity: 1 },
  //         { offset: 100, color: colors[1], opacity: 1 },
  //       ],
  //     },
  //   },
  //   chart: {
  //     sparkline: {
  //       enabled: true,
  //     },
  //   },
  //   plotOptions: {
  //     bar: {
  //       columnWidth: '68%',
  //       borderRadius: 2,
  //     },
  //   },
  //   tooltip: {
  //     x: { show: false },
  //     y: {
  //       formatter: (value) => fNumber(value),
  //       title: {
  //         formatter: () => '',
  //       },
  //     },
  //     marker: { show: false },
  //   },
  //   ...options,
  // };

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3, ...sx }} {...other}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2">{title}</Typography>

        {percent !== undefined && (
          <Stack direction="row" alignItems="center" sx={{ mt: 2, mb: 1 }}>
            <Iconify
              width={24}
              icon={
                percent < 0
                  ? 'solar:double-alt-arrow-down-bold-duotone'
                  : 'solar:double-alt-arrow-up-bold-duotone'
              }
              sx={{
                mr: 1,
                color: 'success.main',
                ...(percent < 0 && {
                  color: 'error.main',
                }),
              }}
            />

            <Typography component="div" variant="subtitle2">
              {percent > 0 && '+'}

              {fPercent(percent)}
            </Typography>
          </Stack>
        )}

        <Typography variant="h3">{fNumber(total)}</Typography>

        {buttonHref && (
          <Button
            component={RouterLink}
            href={buttonHref}
            variant='outlined'
            color='primary'
            sx={{ fontSize: 12, mt: 1 }}
          >
            Виж повече
          </Button>
        )}
      </Box>
      
      <Box>
        <SvgColor
          src={`/assets/icons/navbar/${iconName}.svg`}
          sx={{
            width: 60,
            height: 64,
            maskSize: 64,
            backgroundColor: (theme) => theme.palette.secondary.main
          }}
        />
      </Box>

      {/* {chart && (
        <Chart
          dir="ltr"
          type="bar"
          series={[{ data: series }]}
          options={chartOptions}
          width={60}
          height={36}
        />
      )} */}
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  chart: PropTypes.object,
  percent: PropTypes.number,
  buttonHref: PropTypes.string,
  iconName: PropTypes.string,
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
};
