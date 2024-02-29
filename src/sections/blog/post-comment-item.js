import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// locales
import { useTranslate } from 'src/locales';
// utils
import { fDate } from 'src/utils/format-time';
// components
import Iconify from 'src/components/iconify';
//
import PostCommentReplyForm from './post-comment-reply-form';
import { bg, enUS } from 'date-fns/locale';

// ----------------------------------------------------------------------

export default function PostCommentItem({ id, postId, name, avatarUrl, message, tagUser, postedAt, hasReply }) {
  const { t, i18n } = useTranslate();

  const reply = useBoolean();

  return (
    <ListItem
      sx={{
        p: 0,
        pt: 3,
        alignItems: 'flex-start',
        ...(hasReply && {
          pl: 8,
        }),
      }}
    >
      <Avatar alt={name} src={avatarUrl} sx={{ mr: 2, width: 48, height: 48 }} />

      <Stack
        flexGrow={1}
        sx={{
          pb: 3,
          borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          {name}
        </Typography>

        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {fDate(postedAt, '', { locale: i18n.language === 'bg' ? bg : enUS })}
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          {tagUser && (
            <Box component="strong" sx={{ mr: 0.5 }}>
              @{tagUser}
            </Box>
          )}
          {message}
        </Typography>

        {reply.value && (
          <Box sx={{ mt: 2 }}>
            <PostCommentReplyForm
              postId={postId}
              commentId={id}
              onClose={reply.onFalse}
            />
          </Box>
        )}
      </Stack>

      {!hasReply && (
        <Button
          size="small"
          color={reply.value ? 'primary' : 'inherit'}
          startIcon={<Iconify icon="solar:pen-bold" width={16} />}
          onClick={reply.onToggle}
          sx={{ right: 0, position: 'absolute' }}
        >
          {t('reply')}
        </Button>
      )}
    </ListItem>
  );
}

PostCommentItem.propTypes = {
  id: PropTypes.number,
  postId: PropTypes.number,
  avatarUrl: PropTypes.string,
  hasReply: PropTypes.bool,
  message: PropTypes.string,
  name: PropTypes.string,
  postedAt: PropTypes.string,
  tagUser: PropTypes.string,
};
