/* eslint-disable react/no-children-prop */
"use client";

import PropTypes from "prop-types";
import { useTransition } from 'react';
// @mui
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
// date-fns
import { format, parseISO } from 'date-fns';
// routes
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";
// hooks
import { useBoolean } from "src/hooks/use-boolean";
// auth
import { useAuthContext } from 'src/auth/hooks';
// locales
import { useTranslate } from 'src/locales';
// components
import Iconify from "src/components/iconify";
import Markdown from "src/components/markdown";
import EmptyContent from "src/components/empty-content";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { CampaignParticipateModal, CampaignUnsubscribeModal } from "src/components/campaigns";
//
import CampaignDetailsHero from "../campaign-details-hero";
import { ASSETS } from "src/config-global";

// ----------------------------------------------------------------------

export default function CampaignDetailsHomeView({ campaign, error }) {
  const { t } = useTranslate();

  const router = useRouter();

  const { user } = useAuthContext();

  const participateModal = useBoolean();

  const unsubscribeModal = useBoolean();

  const onParticipate = () => {
    if (user) {
      participateModal.onTrue();
    } else {
      router.push(paths.campaign.participate(campaign.id));
    }
  }

  const onUnsubscribe = () => unsubscribeModal.onTrue();

  const isSubscribed = !!campaign.attendances.find((u) => u.user_id === user?.id);

  // const renderSkeleton = <PostDetailsSkeleton />;

  const renderError = (
    <Container sx={{ my: 10 }}>
      <EmptyContent
        filled
        title={`${error}`}
        action={
          <Button
            component={RouterLink}
            href={paths.campaign.root}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
            sx={{ mt: 3 }}
          >
            {t('back', { ns: 'common' })}
          </Button>
        }
        sx={{ py: 10 }}
      />
    </Container>
  );

  const renderCampaign = campaign && (
    <>
      <CampaignDetailsHero
        title={campaign.title}
        cities={campaign.cities}
        date={format(parseISO(campaign.date), 'dd.MM.yyyy')}
        coverUrl={`${ASSETS}/${campaign.title_image_path}`}
        onParticipate={onParticipate}
        onUnsubscribe={onUnsubscribe}
        isSubscribed={isSubscribed}
      />

      <Container
        sx={{
          maxWidth: '1400px !important',
          py: 3,
          mb: 3,
          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        <CustomBreadcrumbs
          links={[
            {
              name: t('home', { ns: 'headers' }),
              href: '/',
            },
            {
              name: t('campaigns', { ns: 'headers' }),
              href: paths.campaign.root,
            },
            {
              name: campaign?.title,
            },
          ]}
        />
      </Container>

      <Container
        sx={{
          maxWidth: '1400px !important',
          py: 3,
          mb: 5
        }}
      >
        <Stack>
          <Typography variant="subtitle1" sx={{ mb: 5 }}>
            {campaign.short_description}
          </Typography>

          <Markdown children={campaign.description} />
        </Stack>
      </Container>

      <CampaignParticipateModal
        open={participateModal.value}
        onClose={participateModal.onFalse}
        campaignId={campaign.id}
      />

      <CampaignUnsubscribeModal
        open={unsubscribeModal.value}
        onClose={unsubscribeModal.onFalse}
        campaignId={campaign.id}
      />
    </>
  );

  return (
    <>
      {/* {postLoading && renderSkeleton} */}

      {error && renderError}

      {campaign && renderCampaign}

      {/* <Container sx={{ pb: 15 }}>
        {!!latestPosts.length && renderLatestPosts}
      </Container> */}
    </>
  );
}

CampaignDetailsHomeView.propTypes = {
  title: PropTypes.string,
};
