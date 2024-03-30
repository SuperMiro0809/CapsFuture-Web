/* eslint-disable react/no-children-prop */
'use client';

import PropTypes from "prop-types";
// @mui
import Box from '@mui/material/Box';
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
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
// routes
import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";
import { usePathname } from 'src/routes/hooks';
// locales
import { useTranslate } from 'src/locales';
// utils
import { fShortenNumber } from "src/utils/format-number";
// auth
import { useAuthContext } from "src/auth/hooks";
// components
import Iconify from "src/components/iconify";
import Markdown from "src/components/markdown";
import EmptyContent from "src/components/empty-content";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import LoginButton from "src/layouts/common/login-button";
// utils
import { fDate } from "src/utils/format-time";
//
import PostList from "../post-list";
import PostCommentList from "../post-comment-list";
import PostCommentForm from "../post-comment-form";
import PostDetailsHero from "../post-details-hero";
import { PostDetailsSkeleton } from "../post-skeleton";
import { ASSETS } from "src/config-global";
import { bg, enUS } from "date-fns/locale";

// ----------------------------------------------------------------------

export default function PostDetailsHomeView({ post, error }) {
  const { t, i18n } = useTranslate();

  const { user } = useAuthContext();

  const pathname = usePathname();

  const renderError = (
    <Container sx={{ my: 10 }}>
      <EmptyContent
        filled
        title={error}
        action={
          <Button
            component={RouterLink}
            href={paths.post.root}
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

  const renderPost = post && (
    <>
      <PostDetailsHero
        title={post.title}
        coverUrl={`${ASSETS}/${post.title_image_path}`}
        createdAt={fDate(post.created_at, '', { locale: i18n.language === 'bg' ? bg : enUS })}
      />

      <Container
        sx={{
          maxWidth: '1400px !important',
          py: 3,
          mb: 5,
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
              name: t('posts', { ns: 'headers' }),
              href: paths.post.root,
            },
            {
              name: post?.title,
            },
          ]}
        />
      </Container>

      <Container sx={{ maxWidth: '1400px !important' }}>
        <Typography variant="subtitle1" sx={{ mb: 5 }}>
          {post.short_description}
        </Typography>

        <Markdown children={post.description} />

        <Box sx={{ py: 3, borderBottom: (theme) => `dashed 1px ${theme.palette.divider}` }} />

        <Stack direction="row" sx={{ mb: 3, mt: 5 }}>
          <Typography variant="h4">{t('comments', { ns: 'post' })}</Typography>

          <Typography variant="subtitle2" sx={{ color: "text.disabled" }}>
              ({post.comments.length})
            </Typography>
        </Stack>

        {user ?
          <PostCommentForm postId={post.id} /> :
          (
            <Box sx={{ position: 'relative' }}>
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
                <Alert variant="outlined" severity="error">
                  {t('comments-not-logged-in-message', { ns: 'messages' })}
                </Alert>
                <LoginButton
                  sx={{ ml: 0, mt: 2 }}
                  returnTo={pathname}
                />
              </Box>

              <Box
                sx={{
                  backgroundColor: (theme) => theme.palette.background.pink,
                  opacity: 0.3,
                  pointerEvents: 'none',
                  filter: 'blur(1px)'
                }}
              >
                <PostCommentForm postId={post.id} />
              </Box>
            </Box>
          )
        }

        <Divider sx={{ mt: 5, mb: 2 }} />

        <PostCommentList comments={post.comments} />
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
      {error && renderError}

      {post && renderPost}

      {/* <Container sx={{ pb: 15 }}>
        {!!latestPosts.length && renderLatestPosts}
      </Container> */}
    </>
  );
}

PostDetailsHomeView.propTypes = {
  post: PropTypes.object,
  error: PropTypes.string
};
