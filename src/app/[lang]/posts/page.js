import { PostListHomeView } from 'src/sections/blog/view';
import { getPosts } from 'src/api/blog';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Капачки за бъдеще: Новини',
};

async function getData(lang, pagination, order, filters) {
    const { data: postsRes, error } = await getPosts(pagination, order, filters, lang);

    return { posts: postsRes.data, postsCount: postsRes.total, error };
}

export default async function PostsPage({ params, searchParams }) {
  const { lang } = params;

  const { page, search, sort } = searchParams;

  const pagination = { page, limit: 8 };

  const order = { orderBy: 'created_at', direction: sort };
  if (sort !== 'asc' && sort !== 'desc') {
    order.direction = 'asc';
  }

  const filters = [{ id: 'search', value: search }];

  const { posts, postsCount, error } = await getData(lang, pagination, order, filters);

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <PostListHomeView posts={posts} postsCount={postsCount} />;
}
