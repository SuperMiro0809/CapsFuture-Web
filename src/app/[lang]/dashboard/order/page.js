import { getOrders } from 'src/api/order';
import { OrderListView } from 'src/sections/order/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Order List',
};

async function getData(lang) {
  const { data, error } = await getOrders(lang);

  return { orders: data, error }
}

export default async function OrderListPage({ params }) {
  const { lang } = params;

  const { orders, error } = await getData(lang);

  if (error) {
    return <div>{JSON.stringify(error)}</div>
  }

  return <OrderListView orders={orders} />;
}
