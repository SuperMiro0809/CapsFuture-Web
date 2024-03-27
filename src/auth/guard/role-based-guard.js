import { m } from 'framer-motion';
import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
// routes
import { RouterLink } from 'src/routes/components';
// locales
import { useTranslate } from 'src/locales';
// assets
import { ForbiddenIllustration } from 'src/assets/illustrations';
// components
import { varBounce, MotionContainer } from 'src/components/animate';
//
import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

export default function RoleBasedGuard({ hasContent, roles, children, sx }) {
  const { t } = useTranslate();

  const { user } = useAuthContext();

  const currentRole = user?.role.name;

  if (typeof roles !== 'undefined' && !roles.includes(currentRole)) {
    return hasContent ? (
      <Container component={MotionContainer} sx={{ textAlign: 'center', ...sx }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            {t('permission-denied', { ns: 'messages' })}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary', mb: 2 }}>
            {t('permission-denied-message', { ns: 'messages' })}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Button
            component={RouterLink}
            href='/'
            variant='outlined'
          >
            {t('home', { ns: 'headers' })}
          </Button>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration
            sx={{
              height: 260,
              my: { xs: 5, sm: 10 },
            }}
          />
        </m.div>
      </Container>
    ) : null;
  }

  return <> {children} </>;
}

RoleBasedGuard.propTypes = {
  children: PropTypes.node,
  hasContent: PropTypes.bool,
  roles: PropTypes.arrayOf(PropTypes.string),
  sx: PropTypes.object,
};
