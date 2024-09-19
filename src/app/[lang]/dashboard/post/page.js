import { PostListView } from 'src/sections/blog/view';
// api
import { getAllPosts } from 'src/api/blog';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Post List',
};

async function getData(lang) {
  try {
    const { data: posts, error: postsError } = await getAllPosts(lang);

    if (postsError) throw postsError;
    
    return { posts };
  } catch (error) {
    return { error }
  }
}

export default async function PostListPage({ params }) {
  const { lang } = params;

  const { posts, error } = await getData(lang);

  if(error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <PostListView posts={posts} />;
}
