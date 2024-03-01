/* eslint-disable react/no-children-prop */
'use client';

import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
// @mui
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// locales
import { useTranslate } from 'src/locales';
// utils
import { fShortenNumber } from 'src/utils/format-number';
//
import { useGetPost } from 'src/api/blog';
import { POST_PUBLISH_OPTIONS } from 'src/_mock';
// components
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import EmptyContent from 'src/components/empty-content';
//
import PostDetailsHero from '../post-details-hero';
import PostCommentList from '../post-comment-list';
import PostCommentForm from '../post-comment-form';
import PostDetailsToolbar from '../post-details-toolbar';
import { ASSETS } from 'src/config-global';

// ----------------------------------------------------------------------

export default function PostDetailsView({ post, error }) {
  const { t } = useTranslate();

  const [publish, setPublish] = useState('');

  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  useEffect(() => {
    if (post) {
      setPublish(post?.publish);
    }
  }, [post]);

  const renderError = (
    <EmptyContent
      filled
      title={error}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.post.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          {t('back')}
        </Button>
      }
      sx={{
        py: 20,
      }}
    />
  );

  const renderPost = post && (
    <>
      <PostDetailsToolbar
        backLink={paths.dashboard.post.root}
        editLink={paths.dashboard.post.edit(`${post?.slug}`)}
        liveLink={paths.post.details(`${post?.slug}`)}
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={POST_PUBLISH_OPTIONS}
      />

      <PostDetailsHero title={post.title} coverUrl={`${ASSETS}/${post.title_image_path}`} />

      <Stack
        sx={{
          maxWidth: 1400,
          mx: 'auto',
          mt: { xs: 5, md: 10 },
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 5 }}>
          {post.short_description}
        </Typography>

        <Markdown children={post.description} />

        <Stack direction="row" sx={{ mb: 3, mt: 5 }}>
          <Typography variant="h4">{t('comments')}</Typography>

          <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
            ({post.comments.length})
          </Typography>
        </Stack>

        <PostCommentForm />

        <Divider sx={{ mt: 5, mb: 2 }} />

        <PostCommentList comments={post.comments} />
      </Stack>
    </>
  );

  return (
    <Container maxWidth={false}>
      {error && renderError}

      {post && renderPost}
    </Container>
  );
}

PostDetailsView.propTypes = {
  title: PropTypes.object,
  error: PropTypes.string
};
