'use client';

import PropTypes from 'prop-types';
//
import PostListHomeHero from '../post-list-home-hero';
import PostListHomeContent from '../post-list-home-content';

// ----------------------------------------------------------------------

export default function PostListHomeView({ posts, postsCount }) {
  return (
    <>
      <PostListHomeHero />

      <PostListHomeContent posts={posts} postsCount={postsCount} />
    </>
  );
}

PostListHomeView.propTypes = {
  posts: PropTypes.array,
  postsCount: PropTypes.number
}
