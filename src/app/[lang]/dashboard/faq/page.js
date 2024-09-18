import { FaqsDashboardView } from 'src/sections/faqs/view';
// api
import { getAllFaqs } from 'src/api/faq';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: FAQs',
};

export default async function FAQPage({ params }) {
  const { lang } = params;

  const { data: currentFaqs, error: currentFaqsError } = await getAllFaqs(lang);

  if (currentFaqsError) {
    return <div>{JSON.stringify(currentFaqsError)}</div>
  }

  return <FaqsDashboardView currentFaqs={currentFaqs} />
}
