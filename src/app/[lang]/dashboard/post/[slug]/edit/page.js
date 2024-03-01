import { PostEditView } from 'src/sections/blog/view';
// api
import { getPostBySlug } from 'src/api/blog';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Post Edit',
};

async function getData(slug, lang) {
  const { data, error } = await getPostBySlug(slug, lang);

  return { post: data, error };
}

export default async function PostEditPage({ params }) {
  const { slug, lang } = params;

  const { post, error } = await getData(slug, lang);

  if(error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <PostEditView post={post} />;
}
