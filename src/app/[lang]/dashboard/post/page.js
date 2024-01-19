import { PostListView } from 'src/sections/blog/view';
// api
import { getPosts } from 'src/api/blog';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Post List',
};

async function getData(pagination, order, filters, lang) {
  try {
    const res = await getPosts(pagination, order, filters, lang);

    const result = res.data;
    
    return { posts: result.data, postsCount: result.total };
  } catch (error) {
    return { error }
  }
}

export default async function PostListPage({ params, searchParams }) {
  const { lang } = params;

  const { page, limit, orderBy, direction } = searchParams;

  const pagination = { page: Number(page) || 1, limit: Number(limit) || 5 };

  const order = { orderBy, direction };

  const filters = [];

  const { posts, postsCount, error } = await getData(pagination, order, filters, lang);

  if(error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <PostListView posts={posts} postsCount={postsCount} />;
}
