import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
//
import PostCommentItem from './post-comment-item';
import { ASSETS } from 'src/config-global';

// ----------------------------------------------------------------------

export default function PostCommentList({ comments }) {
  return (
    <>
      <>
        {comments.map((comment) => {
          const { id, post_id, user, replies, text, created_at } = comment;

          const hasReply = !!replies.length;

          return (
            <Box key={id}>
              <PostCommentItem
                id={id}
                postId={post_id}
                name={user?.profile.display_name}
                message={text}
                postedAt={created_at}
                avatarUrl={`${ASSETS}/${user?.profile.avatar_photo_path}`}
              />
              {hasReply &&
                replies.map((reply) => {
                  return (
                    <PostCommentItem
                      key={reply.id}
                      name={reply?.user?.profile.display_name || ''}
                      message={reply.text}
                      postedAt={reply.created_at}
                      avatarUrl={`${ASSETS}/${reply?.user?.profile.avatar_photo_path}` || ''}
                      tagUser={reply.tagUser}
                      hasReply
                    />
                  );
                })}
            </Box>
          );
        })}
      </>

      {/* <Pagination count={8} sx={{ my: 5, mx: 'auto' }} /> */}
    </>
  );
}

PostCommentList.propTypes = {
  comments: PropTypes.array,
};
