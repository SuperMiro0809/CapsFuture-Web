import { PostListHomeView } from 'src/sections/blog/view';
import { getPosts } from 'src/api/blog';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Posts',
};

async function getData(lang, order, filters) {
    const { data: postsRes, error } = await getPosts({ page: 1, limit: 8 }, order, filters, lang);

    return { posts: postsRes.data, postsCount: postsRes.total, error };
}

export default async function PostsPage({ params, searchParams }) {
  const { lang } = params;

  const { search, sort } = searchParams;

  const order = { orderBy: 'created_at', direction: sort };

  const filters = [{ id: 'search', value: search }];

  const { posts, postsCount, error } = await getData(lang, order, filters);

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <PostListHomeView posts={posts} postsCount={postsCount} />;
}
