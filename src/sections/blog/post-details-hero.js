import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import SpeedDial from '@mui/material/SpeedDial';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import SpeedDialAction from '@mui/material/SpeedDialAction';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
// utils
import { fDate } from 'src/utils/format-time';
// components
import Iconify from 'src/components/iconify';
//
import { _socials } from 'src/_mock';
import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

export default function PostDetailsHero({ title, coverUrl, createdAt }) {
  const theme = useTheme();

  const smUp = useResponsive('up', 'sm');

  return (
    <Box
      sx={{
        height: 480,
        overflow: 'hidden',
        ...bgGradient({
          imgUrl: coverUrl,
          startColor: `${alpha(theme.palette.grey[900], 0.64)} 0%`,
          endColor: `${alpha(theme.palette.grey[900], 0.64)} 100%`,
        }),
      }}
    >
      <Container
        sx={{
          height: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          gap={{ xs: 3, md: 0 }}
          justifyContent='space-between'
          alignItems={{ xs: 'center', md: 'flex-end' }}
          sx={{ py: 5 }}
        >
          <Stack gap={1}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                zIndex: 9,
                color: 'common.white',
                maxWidth: 480,
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                zIndex: 9,
                color: 'text.disabled',
                maxWidth: 480,
              }}
            >
              {fDate(createdAt, 'dd.MM.yyyy')}
            </Typography>
          </Stack>

          <SpeedDial
            direction={smUp ? 'up' : 'up'}
            ariaLabel="Share post"
            icon={<Iconify icon="solar:share-bold" />}
            FabProps={{ size: 'medium', color: 'secondary' }}
            sx={{ mb: 2 }}
          >
            {_socials.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={<Iconify icon={action.icon} sx={{ color: action.color }} />}
                tooltipTitle={action.name}
                tooltipPlacement="top"
                FabProps={{ color: 'default' }}
              />
            ))}
          </SpeedDial>
        </Stack>

        {/* <Stack
          sx={{
            left: 0,
            width: 1,
            bottom: 0,
            position: 'absolute',
          }}
        >
          {author && createdAt && (
            <Stack
              direction="row"
              alignItems="center"
              sx={{
                px: { xs: 2, md: 3 },
                pb: { xs: 3, md: 8 },
              }}
            >
              <Avatar
                alt={author.name}
                src={author.avatarUrl}
                sx={{ width: 64, height: 64, mr: 2 }}
              />

              <ListItemText
                sx={{ color: 'common.white' }}
                primary={author.name}
                secondary={fDate(createdAt)}
                primaryTypographyProps={{ typography: 'subtitle1', mb: 0.5 }}
                secondaryTypographyProps={{
                  color: 'inherit',
                  sx: { opacity: 0.64 },
                }}
              />
            </Stack>
          )}

          <SpeedDial
            direction={smUp ? 'left' : 'up'}
            ariaLabel="Share post"
            icon={<Iconify icon="solar:share-bold" />}
            FabProps={{ size: 'medium' }}
            sx={{
              position: 'absolute',
              bottom: { xs: 32, md: 64 },
              right: { xs: 16, md: 24 },
            }}
          >
            {_socials.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={<Iconify icon={action.icon} sx={{ color: action.color }} />}
                tooltipTitle={action.name}
                tooltipPlacement="top"
                FabProps={{ color: 'default' }}
              />
            ))}
          </SpeedDial>
        </Stack> */}
      </Container>
    </Box>
  );
}

PostDetailsHero.propTypes = {
  coverUrl: PropTypes.string,
  createdAt: PropTypes.string,
  title: PropTypes.string,
};
