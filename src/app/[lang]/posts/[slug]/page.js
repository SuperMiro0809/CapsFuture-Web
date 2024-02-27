import { PostDetailsHomeView } from 'src/sections/blog/view';
import { getPostBySlug } from 'src/api/blog';

// ----------------------------------------------------------------------

async function getData(slug, lang) {
  const { data: post, error } = await getPostBySlug(slug, lang);

  return { post, error };
}

export async function generateMetadata({ params }, parent) {
  // read route params
  const { lang, slug } = params;

  // fetch data
  const { post } = await getData(slug, lang);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: post.title,
    openGraph: {
      images: [...previousImages],
    },
  }
}

export default async function CampaignsPage({ params }) {
  const { lang, slug } = params;

  const { post, error } = await getData(slug, lang);

  return <PostDetailsHomeView post={post} error={error} />;
}
