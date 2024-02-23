"use client";

import PropTypes from "prop-types";
// @mui
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import AvatarGroup from "@mui/material/AvatarGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
// routes
import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";
// locales
import { useTranslate } from 'src/locales';
// date-fns
import { format, parseISO } from 'date-fns';
// components
import Iconify from "src/components/iconify";
import Markdown from "src/components/markdown";
import EmptyContent from "src/components/empty-content";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
//
import CampaignDetailsHero from "../campaign-details-hero";
import { ASSETS } from "src/config-global";

// ----------------------------------------------------------------------

export default function CampaignDetailsHomeView({ campaign, error }) {
  const { t } = useTranslate();

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
            {t('back')}
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
              name: t('home'),
              href: '/',
            },
            {
              name: t('campaigns'),
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

          {/* <Stack
            spacing={3}
            sx={{
              py: 3,
              borderTop: (theme) => `dashed 1px ${theme.palette.divider}`,
              borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
            }}
          >
            <Stack direction="row" flexWrap="wrap" spacing={1}>
              {post.tags.map((tag) => (
                <Chip key={tag} label={tag} variant="soft" />
              ))}
            </Stack>

            <Stack direction="row" alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked
                    size="small"
                    color="error"
                    icon={<Iconify icon="solar:heart-bold" />}
                    checkedIcon={<Iconify icon="solar:heart-bold" />}
                  />
                }
                label={fShortenNumber(post.totalFavorites)}
                sx={{ mr: 1 }}
              />

              <AvatarGroup>
                {post.favoritePerson.map((person) => (
                  <Avatar
                    key={person.name}
                    alt={person.name}
                    src={person.avatarUrl}
                  />
                ))}
              </AvatarGroup>
            </Stack>
          </Stack> */}

          {/* <Stack direction="row" sx={{ mb: 3, mt: 5 }}>
            <Typography variant="h4">Comments</Typography>

            <Typography variant="subtitle2" sx={{ color: "text.disabled" }}>
              ({post.comments.length})
            </Typography>
          </Stack> */}

          {/* <PostCommentForm /> */}

          {/* <Divider sx={{ mt: 5, mb: 2 }} /> */}

          {/* <PostCommentList comments={post.comments} /> */}
        </Stack>
      </Container>
    </>
  );

  // const renderLatestPosts = (
  //   <>
  //     <Typography variant="h4" sx={{ mb: 5 }}>
  //       Recent Posts
  //     </Typography>

  //     <PostList
  //       posts={latestPosts.slice(latestPosts.length - 4)}
  //       loading={latestPostsLoading}
  //       disabledIndex
  //     />
  //   </>
  // );

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
