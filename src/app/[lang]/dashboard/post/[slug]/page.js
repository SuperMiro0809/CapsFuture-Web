import { PostDetailsView } from 'src/sections/blog/view';
import { getPostBySlug } from 'src/api/blog';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Post Details',
};

async function getData(lang, slug) {
  const { data, error } = await getPostBySlug(slug, lang);

  return { post: data, error }
}

export default async function PostDetailsPage({ params }) {
  const { lang, slug } = params;

  const { post, error } = await getData(lang, slug);

  return <PostDetailsView post={post} error={error} />;
}

